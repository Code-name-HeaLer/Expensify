// Stage 3, Tier 1: Query top 3 spending categories for the current month with spend share percentages.

import { useCallback, useEffect, useState } from "react";
import { getMonthDateRange } from "../lib/date";
import { db } from "../lib/db";

export interface TopCategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalAmount: number;
  percentage: number;
}

export function useTopCategories() {
  const [topCategories, setTopCategories] = useState<TopCategoryItem[]>([]);

  const loadTopCategories = useCallback(() => {
    try {
      const now = new Date();
      const { startOfMonthIso, endOfMonthIso } = getMonthDateRange(now);

      // 1. Get total month spend for percentage calculation
      const totalResult = db.getFirstSync<{ total: number | null }>(
        `SELECT SUM(amount) as total FROM transactions
         WHERE type = 'expense' AND date >= ? AND date <= ?;`,
        [startOfMonthIso, endOfMonthIso],
      );
      const monthTotal = totalResult?.total ?? 0;

      // 2. Query top 3 categories by spend
      const rows = db.getAllSync<{
        id: string;
        name: string;
        icon: string;
        color: string;
        total_amount: number;
      }>(
        `SELECT c.id, c.name, c.icon, c.color, SUM(t.amount) as total_amount
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.type = 'expense' AND t.date >= ? AND t.date <= ?
         GROUP BY c.id, c.name, c.icon, c.color
         ORDER BY total_amount DESC
         LIMIT 3;`,
        [startOfMonthIso, endOfMonthIso],
      );

      const items: TopCategoryItem[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        icon: r.icon,
        color: r.color,
        totalAmount: r.total_amount,
        percentage:
          monthTotal > 0 ? Math.round((r.total_amount / monthTotal) * 100) : 0,
      }));

      setTopCategories(items);
    } catch (error) {
      console.error("Failed to load top categories:", error);
    }
  }, []);

  useEffect(() => {
    loadTopCategories();
  }, [loadTopCategories]);

  return { topCategories, refreshTopCategories: loadTopCategories };
}
