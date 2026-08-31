// Stage 5, Tier 1 & 3: Save, update, or remove category budget limits in SQLite.

import * as Haptics from "expo-haptics";
import { db } from "../lib/db";

export function useSaveBudget(onSuccess?: () => void) {
  const saveLimit = (categoryId: string, monthlyLimit: number): boolean => {
    try {
      const budgetId = `bgt_${categoryId}`;

      if (monthlyLimit <= 0) {
        db.runSync("DELETE FROM budgets WHERE category_id = ?;", [categoryId]);
      } else {
        db.runSync(
          `INSERT OR REPLACE INTO budgets (id, category_id, monthly_limit)
           VALUES (?, ?, ?);`,
          [budgetId, categoryId, monthlyLimit],
        );
      }

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Safe fallback
      }

      onSuccess?.();
      return true;
    } catch (error) {
      console.error("Failed to save budget limit:", error);
      return false;
    }
  };

  const removeLimit = (categoryId: string): boolean => {
    return saveLimit(categoryId, 0);
  };

  return { saveLimit, removeLimit };
}
