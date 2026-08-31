// Stage 5, Tier 1: State hook for creating, listing, and removing scheduled expense rules.

import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { db } from "../lib/db";
import { processDueRecurringTransactions } from "../lib/recurringScheduler";

export interface PopulatedRecurringRule {
  id: string;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  account_id: string;
  account_name: string;
  amount: number;
  note: string | null;
  day_of_month: number;
  is_active: number;
  last_run: string | null;
}

export function useRecurringRules() {
  const [rules, setRules] = useState<PopulatedRecurringRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadRules = useCallback(() => {
    setIsLoading(true);
    try {
      // Run scheduler sweep whenever rules are loaded
      processDueRecurringTransactions();

      const rows = db.getAllSync<PopulatedRecurringRule>(`
        SELECT 
          r.id, r.amount, r.note, r.day_of_month, r.is_active, r.last_run,
          r.category_id, c.name as category_name, c.icon as category_icon, c.color as category_color,
          r.account_id, a.name as account_name
        FROM recurring_rules r
        JOIN categories c ON r.category_id = c.id
        JOIN accounts a ON r.account_id = a.id
        ORDER BY r.day_of_month ASC;
      `);

      setRules(rows);
    } catch (error) {
      console.error("Failed to load recurring rules:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRule = (params: {
    categoryId: string;
    accountId: string;
    amount: number;
    note: string;
    dayOfMonth: number;
  }): boolean => {
    try {
      const id = `rec_${Date.now()}`;
      db.runSync(
        `INSERT INTO recurring_rules (id, category_id, account_id, amount, note, day_of_month, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1);`,
        [
          id,
          params.categoryId,
          params.accountId,
          params.amount,
          params.note.trim() || null,
          params.dayOfMonth,
        ],
      );

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      loadRules();
      return true;
    } catch (error) {
      console.error("Failed to create recurring rule:", error);
      return false;
    }
  };

  const deleteRule = (ruleId: string): boolean => {
    try {
      db.runSync("DELETE FROM recurring_rules WHERE id = ?;", [ruleId]);
      loadRules();
      return true;
    } catch (error) {
      console.error("Failed to delete recurring rule:", error);
      return false;
    }
  };

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  return { rules, isLoading, addRule, deleteRule, refreshRules: loadRules };
}
