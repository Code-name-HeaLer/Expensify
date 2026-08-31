// Stage 4, Tier 1: Hook for deleting a transaction and restoring account balance in SQLite.

import * as Haptics from "expo-haptics";
import { db } from "../lib/db";
import { PopulatedTransaction } from "./useTransactionsList";

export function useDeleteTransaction(onDeleted?: () => void) {
  const deleteTransaction = (tx: PopulatedTransaction): boolean => {
    try {
      // 1. Delete from transactions
      db.runSync("DELETE FROM transactions WHERE id = ?;", [tx.id]);

      // 2. Restore account balance if it was an expense
      if (tx.type === "expense") {
        db.runSync("UPDATE accounts SET balance = balance + ? WHERE id = ?;", [
          tx.amount,
          tx.account_id,
        ]);
      } else if (tx.type === "income") {
        db.runSync("UPDATE accounts SET balance = balance - ? WHERE id = ?;", [
          tx.amount,
          tx.account_id,
        ]);
      }

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch {
        // Fallback if haptics unsupported
      }

      onDeleted?.();
      return true;
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      return false;
    }
  };

  return { deleteTransaction };
}
