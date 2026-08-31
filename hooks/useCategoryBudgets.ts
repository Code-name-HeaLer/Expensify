// Stage 5, Tier 1 & 3: Query category budgets joined with current month spending from SQLite.

import { useCallback, useEffect, useState } from "react";
import { getMonthDateRange } from "../lib/date";
import { db } from "../lib/db";

export type BudgetStatus = "ok" | "warning" | "exceeded" | "unbudgeted";

export interface CategoryBudgetItem {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  monthlyLimit: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  status: BudgetStatus;
}

export function useCategoryBudgets() {
  const [budgets, setBudgets] = useState<CategoryBudgetItem[]>([]);
  const [totalAllocated, setTotalAllocated] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadBudgets = useCallback(() => {
    setIsLoading(true);
    try {
      const now = new Date();
      const { startOfMonthIso, endOfMonthIso } = getMonthDateRange(now);

      const rows = db.getAllSync<{
        category_id: string;
        category_name: string;
        category_icon: string;
        category_color: string;
        monthly_limit: number | null;
        spent_amount: number | null;
      }>(
        `SELECT 
           c.id as category_id,
           c.name as category_name,
           c.icon as category_icon,
           c.color as category_color,
           COALESCE(b.monthly_limit, 0) as monthly_limit,
           COALESCE(SUM(t.amount), 0) as spent_amount
         FROM categories c
         LEFT JOIN budgets b ON c.id = b.category_id
         LEFT JOIN transactions t ON c.id = t.category_id 
           AND t.type = 'expense' 
           AND t.date >= ? 
           AND t.date <= ?
         GROUP BY c.id, c.name, c.icon, c.color, b.monthly_limit
         ORDER BY b.monthly_limit DESC, spent_amount DESC;`,
        [startOfMonthIso, endOfMonthIso],
      );

      let allocatedSum = 0;
      let spentSum = 0;

      const items: CategoryBudgetItem[] = rows.map((r) => {
        const limit = r.monthly_limit || 0;
        const spent = r.spent_amount || 0;
        allocatedSum += limit;
        spentSum += spent;

        let percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
        let status: BudgetStatus = "unbudgeted";

        if (limit > 0) {
          if (spent > limit) {
            status = "exceeded";
          } else if (percentage >= 80) {
            status = "warning";
          } else {
            status = "ok";
          }
        }

        return {
          categoryId: r.category_id,
          categoryName: r.category_name,
          categoryIcon: r.category_icon,
          categoryColor: r.category_color,
          monthlyLimit: limit,
          spentAmount: spent,
          remainingAmount: limit > 0 ? Math.max(0, limit - spent) : 0,
          percentage,
          status,
        };
      });

      setTotalAllocated(allocatedSum);
      setTotalSpent(spentSum);
      setBudgets(items);
    } catch (error) {
      console.error("Failed to load category budgets:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  return {
    budgets,
    totalAllocated,
    totalSpent,
    isLoading,
    refreshBudgets: loadBudgets,
  };
}
