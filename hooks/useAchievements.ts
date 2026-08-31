// Stage 7, Tier 4: Evaluate restrained financial milestones and habit achievements from SQLite.

import { useCallback, useEffect, useState } from "react";
import { getMonthDateRange } from "../lib/date";
import { db } from "../lib/db";

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  progressText: string;
}

export function useAchievements(currentStreak: number = 0) {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);

  const evaluateAchievements = useCallback(() => {
    try {
      const now = new Date();
      const { startOfMonthIso, endOfMonthIso } = getMonthDateRange(now);

      // 1. Total transaction count
      const txCount =
        db.getFirstSync<{ count: number }>(
          "SELECT COUNT(*) as count FROM transactions;",
        )?.count ?? 0;

      // 2. Distinct categories logged
      const catCount =
        db.getFirstSync<{ count: number }>(
          "SELECT COUNT(DISTINCT category_id) as count FROM transactions;",
        )?.count ?? 0;

      // 3. Active budget check & monthly spend
      const budgetTotal =
        db.getFirstSync<{ total: number | null }>(
          "SELECT SUM(monthly_limit) as total FROM budgets;",
        )?.total ?? 0;

      const monthSpend =
        db.getFirstSync<{ total: number | null }>(
          `SELECT SUM(amount) as total FROM transactions
         WHERE type = 'expense' AND date >= ? AND date <= ?;`,
          [startOfMonthIso, endOfMonthIso],
        )?.total ?? 0;

      // 4. Recurring rules count
      const recurringCount =
        db.getFirstSync<{ count: number }>(
          "SELECT COUNT(*) as count FROM recurring_rules WHERE is_active = 1;",
        )?.count ?? 0;

      const items: AchievementItem[] = [
        {
          id: "first_log",
          title: "First Step",
          description: "Log your first expense transaction",
          iconName: "Zap",
          unlocked: txCount >= 1,
          progressText: txCount >= 1 ? "Completed" : "0 / 1",
        },
        {
          id: "streak_3",
          title: "Consistency Builder",
          description: "Maintain a 3-day daily logging streak",
          iconName: "Flame",
          unlocked: currentStreak >= 3,
          progressText: `${Math.min(3, currentStreak)} / 3 days`,
        },
        {
          id: "category_explorer",
          title: "Category Explorer",
          description: "Log expenses across 3 different categories",
          iconName: "Compass",
          unlocked: catCount >= 3,
          progressText: `${Math.min(3, catCount)} / 3 categories`,
        },
        {
          id: "budget_discipline",
          title: "Budget Discipline",
          description: "Set a budget and keep spending within cap",
          iconName: "ShieldCheck",
          unlocked:
            budgetTotal > 0 && monthSpend <= budgetTotal && txCount >= 2,
          progressText:
            budgetTotal > 0
              ? monthSpend <= budgetTotal
                ? "On Track"
                : "Exceeded"
              : "Set a budget",
        },
        {
          id: "recurring_pro",
          title: "Automator",
          description: "Configure a recurring monthly commitment",
          iconName: "Repeat",
          unlocked: recurringCount >= 1,
          progressText: recurringCount >= 1 ? "Active" : "0 / 1",
        },
      ];

      setAchievements(items);
      setUnlockedCount(items.filter((i) => i.unlocked).length);
    } catch (error) {
      console.error("Failed to evaluate achievements:", error);
    }
  }, [currentStreak]);

  useEffect(() => {
    evaluateAchievements();
  }, [evaluateAchievements]);

  return {
    achievements,
    unlockedCount,
    refreshAchievements: evaluateAchievements,
  };
}
