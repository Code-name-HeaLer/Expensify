// Stage 2, Tier 1: Indian currency formatting utilities and keypad input parsing.

/**
 * Formats a number into Indian Rupee format (e.g., 123456.78 -> "₹1,23,456.78" or "₹1,23,456")
 */
export function formatINR(
  amount: number,
  showDecimals: boolean = false,
): string {
  if (isNaN(amount)) return "₹0";

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const fixed = showDecimals
    ? absAmount.toFixed(2)
    : Math.round(absAmount).toString();
  const [integerPart, decimalPart] = fixed.split(".");

  // Indian numbering regex format: last 3 digits, then groups of 2 digits
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedInteger =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  const result = decimalPart
    ? `₹${formattedInteger}.${decimalPart}`
    : `₹${formattedInteger}`;
  return isNegative ? `-${result}` : result;
}

/**
 * Handles numeric keypad character input and enforces valid decimal currency rules.
 */
export function appendKeypadInput(currentValue: string, key: string): string {
  if (key === ".") {
    if (currentValue.includes(".")) return currentValue; // Prevent double decimals
    return currentValue === "" ? "0." : `${currentValue}.`;
  }

  // Prevent leading multiple zeroes
  if (currentValue === "0" && key !== ".") {
    return key;
  }

  // Restrict to max 2 decimal places
  const decimalIndex = currentValue.indexOf(".");
  if (decimalIndex !== -1 && currentValue.length - decimalIndex > 2) {
    return currentValue;
  }

  // Prevent overflow (e.g., max 9 digits before decimal)
  if (!currentValue.includes(".") && currentValue.length >= 9) {
    return currentValue;
  }

  return `${currentValue}${key}`;
}
