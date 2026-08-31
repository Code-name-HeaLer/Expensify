// Stage 6, Tier 3: Query monthly spend totals over the last 6 months and calculate growth deltas.

import { useCallback, useEffect, useState } from "react";
import { db } from "../lib/db";

export interface MonthlyTrendPoint {
  monthKey: string; // "2026-08"
  label: string; // "Aug"
  amount: number;
  isCurrentMonth: boolean;
}

export interface MonthlyTrendSummary {
  points: MonthlyTrendPoint[];
  peakAmount: number;
  monthOverMonthChange: number | null; // e.g. +14 or -8 (%)
}

export function useMonthlyTrend() {
  const [summary, setSummary] = useState<MonthlyTrendSummary>({
    points: [],
    peakAmount: 0,
    monthOverMonthChange: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadTrend = useCallback(() => {
    setIsLoading(true);
    try {
      const today = new Date();
      const points: MonthlyTrendPoint[] = [];

      // Generate the last 6 calendar months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = d.toISOString().substring(0, 7);
        const label = d.toLocaleString("default", { month: "short" });
        const isCurrentMonth = i === 0;

        points.push({
          monthKey,
          label,
          amount: 0,
          isCurrentMonth,
        });
      }

      const startBound = `${points[0].monthKey}-01T00:00:00.000Z`;
      const endBound = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      ).toISOString();

      const rows = db.getAllSync<{ month_key: string; total: number }>(
        `SELECT substr(date, 1, 7) as month_key, SUM(amount) as total
         FROM transactions
         WHERE type = 'expense' AND date >= ? AND date <= ?
         GROUP BY substr(date, 1, 7);`,
        [startBound, endBound],
      );

      const map = new Map<string, number>();
      rows.forEach((r) => map.set(r.month_key, r.total));

      let peak = 0;
      const resolved = points.map((p) => {
        const amount = map.get(p.monthKey) || 0;
        if (amount > peak) peak = amount;
        return { ...p, amount };
      });

      // Calculate delta between current month and previous month
      const currentMonthAmount = resolved[resolved.length - 1].amount;
      const prevMonthAmount = resolved[resolved.length - 2]?.amount || 0;

      let momChange: number | null = null;
      if (prevMonthAmount > 0) {
        momChange = Math.round(
          ((currentMonthAmount - prevMonthAmount) / prevMonthAmount) * 100,
        );
      }

      setSummary({
        points: resolved,
        peakAmount: peak,
        monthOverMonthChange: momChange,
      });
    } catch (error) {
      console.error("Failed to load monthly trend:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrend();
  }, [loadTrend]);

  return { trendSummary: summary, isLoading, refreshTrend: loadTrend };
}
