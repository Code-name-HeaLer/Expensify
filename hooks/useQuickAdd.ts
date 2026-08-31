// Stage 2, Tier 1: State management and database write operations for quick expense entry.

import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { appendKeypadInput } from "../lib/currency";
import { db } from "../lib/db";
import { Account, Category } from "../types/database";

export function useQuickAdd(onSuccess?: () => void) {
  const [amountStr, setAmountStr] = useState("0");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [defaultAccount, setDefaultAccount] = useState<Account | null>(null);
  const [note, setNote] = useState("");

  const loadData = useCallback(() => {
    try {
      const catRows = db.getAllSync<Category>(
        "SELECT * FROM categories ORDER BY is_default DESC, name ASC;",
      );
      setCategories(catRows);
      if (catRows.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(catRows[0].id);
      }

      const accRow = db.getFirstSync<Account>(
        "SELECT * FROM accounts WHERE is_active = 1 ORDER BY created_at ASC LIMIT 1;",
      );
      if (accRow) {
        setDefaultAccount(accRow);
      }
    } catch (error) {
      console.error("Failed to load quick add data:", error);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleKeyPress = (key: string) => {
    setAmountStr((prev) => appendKeypadInput(prev, key));
  };

  const handleDelete = () => {
    setAmountStr((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  };

  const handleClear = () => {
    setAmountStr("0");
    setNote("");
  };

  const saveExpense = () => {
    const amount = parseFloat(amountStr);
    if (
      isNaN(amount) ||
      amount <= 0 ||
      !selectedCategoryId ||
      !defaultAccount
    ) {
      return false;
    }

    try {
      const id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();

      db.runSync(
        `INSERT INTO transactions (id, amount, type, category_id, account_id, note, date, is_recurring)
         VALUES (?, ?, 'expense', ?, ?, ?, ?, 0);`,
        [
          id,
          amount,
          selectedCategoryId,
          defaultAccount.id,
          note.trim() || null,
          now,
        ],
      );

      db.runSync("UPDATE accounts SET balance = balance - ? WHERE id = ?;", [
        amount,
        defaultAccount.id,
      ]);

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Fallback for devices without haptics
      }

      handleClear();
      onSuccess?.();
      return true;
    } catch (error) {
      console.error("Failed to save transaction:", error);
      return false;
    }
  };

  return {
    amountStr,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    defaultAccount,
    note,
    setNote,
    handleKeyPress,
    handleDelete,
    handleClear,
    saveExpense,
    refreshData: loadData,
  };
}
