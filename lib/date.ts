// Stage 3, Tier 1: Date utilities for monthly boundaries, day calculations, and timestamps.

export function getMonthDateRange(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startOfMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return {
    startOfMonthIso: startOfMonth.toISOString(),
    endOfMonthIso: endOfMonth.toISOString(),
    totalDaysInMonth: new Date(year, month + 1, 0).getDate(),
    currentDay: date.getDate(),
  };
}

export function getDaysRemainingInMonth(date: Date = new Date()): number {
  const { totalDaysInMonth, currentDay } = getMonthDateRange(date);
  return Math.max(1, totalDaysInMonth - currentDay + 1); // Includes today
}

export function getMonthName(date: Date = new Date()): string {
  return date.toLocaleString("default", { month: "short" });
}
