// Stage 3, Tier 1: Aggregation hook computing monthly spend, remaining budget, and daily allowance.

import { useCallback, useEffect, useState } from "react";
import { getDaysRemainingInMonth, getMonthDateRange } from "../lib/date";
import { db } from "../lib/db";

export interface DashboardSummary {
  safeToSpendToday: number;
  totalSpentThisMonth: number;
  totalBudget: number;
  remainingBudget: number;
  daysRemaining: number;
  monthProgressPercent: number;
}

export function useDashboardSummary() {
  const [summary, setSummary] = useState<DashboardSummary>({
    safeToSpendToday: 0,
    totalSpentThisMonth: 0,
    totalBudget: 0,
    remainingBudget: 0,
    daysRemaining: 1,
    monthProgressPercent: 0,
  });

  const refreshSummary = useCallback(() => {
    try {
      const now = new Date();
      const { startOfMonthIso, endOfMonthIso, totalDaysInMonth, currentDay } =
        getMonthDateRange(now);
      const daysRemaining = getDaysRemainingInMonth(now);
      const monthProgressPercent = Math.min(
        100,
        Math.round((currentDay / totalDaysInMonth) * 100),
      );

      // 1. Total spent this month
      const spendResult = db.getFirstSync<{ total: number | null }>(
        `SELECT SUM(amount) as total FROM transactions 
         WHERE type = 'expense' AND date >= ? AND date <= ?;`,
        [startOfMonthIso, endOfMonthIso],
      );
      const totalSpentThisMonth = spendResult?.total ?? 0;

      // 2. Total monthly budget
      const budgetResult = db.getFirstSync<{ total: number | null }>(
        `SELECT SUM(monthly_limit) as total FROM budgets;`,
      );
      const totalBudget = budgetResult?.total ?? 0;

      const remainingBudget = Math.max(0, totalBudget - totalSpentThisMonth);

      // Safe to spend = remaining / days remaining (or fallback to daily average if no budget set)
      const safeToSpendToday =
        totalBudget > 0 ? remainingBudget / daysRemaining : 0;

      setSummary({
        safeToSpendToday,
        totalSpentThisMonth,
        totalBudget,
        remainingBudget,
        daysRemaining,
        monthProgressPercent,
      });
    } catch (error) {
      console.error("Failed to compute dashboard summary:", error);
    }
  }, []);

  useEffect(() => {
    refreshSummary();
  }, [refreshSummary]);

  return { summary, refreshSummary };
}
