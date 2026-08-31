// Stage 6, Tier 3: Compute monthly narrative recap, top spending drivers, and daily averages.

import { useCallback, useEffect, useState } from "react";
import { formatINR } from "../lib/currency";
import { getMonthDateRange, getMonthName } from "../lib/date";
import { db } from "../lib/db";

export interface MonthInReviewData {
  topCategoryNarrative: string | null;
  comparisonNarrative: string | null;
  dailyAverageNarrative: string | null;
  largestExpenseNarrative: string | null;
}

export function useMonthInReview() {
  const [review, setReview] = useState<MonthInReviewData>({
    topCategoryNarrative: null,
    comparisonNarrative: null,
    dailyAverageNarrative: null,
    largestExpenseNarrative: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadReview = useCallback(() => {
    setIsLoading(true);
    try {
      const now = new Date();
      const { startOfMonthIso, endOfMonthIso, currentDay } =
        getMonthDateRange(now);

      // 1. Current month total
      const curSpend =
        db.getFirstSync<{ total: number | null }>(
          `SELECT SUM(amount) as total FROM transactions
         WHERE type = 'expense' AND date >= ? AND date <= ?;`,
          [startOfMonthIso, endOfMonthIso],
        )?.total ?? 0;

      if (curSpend <= 0) {
        setReview({
          topCategoryNarrative: null,
          comparisonNarrative: null,
          dailyAverageNarrative: null,
          largestExpenseNarrative: null,
        });
        return;
      }

      // 2. Top category
      const topCat = db.getFirstSync<{ name: string; amount: number }>(
        `SELECT c.name, SUM(t.amount) as amount
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.type = 'expense' AND t.date >= ? AND t.date <= ?
         GROUP BY c.id, c.name
         ORDER BY amount DESC LIMIT 1;`,
        [startOfMonthIso, endOfMonthIso],
      );

      const topCatShare =
        topCat && curSpend > 0
          ? Math.round((topCat.amount / curSpend) * 100)
          : 0;
      const topCategoryNarrative = topCat
        ? `You spent most on ${topCat.name} (${formatINR(topCat.amount)}, ${topCatShare}% of total spend).`
        : null;

      // 3. Previous month comparison
      const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const { startOfMonthIso: prevStart, endOfMonthIso: prevEnd } =
        getMonthDateRange(prevDate);
      const prevSpend =
        db.getFirstSync<{ total: number | null }>(
          `SELECT SUM(amount) as total FROM transactions
         WHERE type = 'expense' AND date >= ? AND date <= ?;`,
          [prevStart, prevEnd],
        )?.total ?? 0;

      let comparisonNarrative: string | null = null;
      if (prevSpend > 0) {
        const delta = Math.round(((curSpend - prevSpend) / prevSpend) * 100);
        comparisonNarrative =
          delta > 0
            ? `Spending is ${delta}% higher than ${getMonthName(prevDate)}.`
            : `Spending is ${Math.abs(delta)}% lower than ${getMonthName(prevDate)}.`;
      }

      // 4. Daily average
      const dailyAvg = Math.round(curSpend / Math.max(1, currentDay));
      const dailyAverageNarrative = `Averaging ${formatINR(dailyAvg)}/day across ${currentDay} active days this month.`;

      // 5. Largest single expense
      const largestTx = db.getFirstSync<{ amount: number; name: string }>(
        `SELECT t.amount, c.name
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.type = 'expense' AND t.date >= ? AND t.date <= ?
         ORDER BY t.amount DESC LIMIT 1;`,
        [startOfMonthIso, endOfMonthIso],
      );

      const largestExpenseNarrative = largestTx
        ? `Single largest purchase: ${formatINR(largestTx.amount)} (${largestTx.name}).`
        : null;

      setReview({
        topCategoryNarrative,
        comparisonNarrative,
        dailyAverageNarrative,
        largestExpenseNarrative,
      });
    } catch (error) {
      console.error("Failed to generate month review:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReview();
  }, [loadReview]);

  return { review, isLoading, refreshReview: loadReview };
}
