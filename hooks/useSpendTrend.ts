// Stage 3, Tier 1: Query daily spend aggregates over the last 14 days for trend visualization.

import { useCallback, useEffect, useState } from "react";
import { db } from "../lib/db";

export interface DailySpendPoint {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Mon", "12", etc.
  amount: number;
}

export function useSpendTrend() {
  const [trendData, setTrendData] = useState<DailySpendPoint[]>([]);
  const [maxSpend, setMaxSpend] = useState<number>(0);

  const loadTrend = useCallback(() => {
    try {
      const daysCount = 14;
      const points: DailySpendPoint[] = [];
      const today = new Date();

      // Generate the last 14 days as calendar slots
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
        const dayLabel = d.getDate().toString();

        points.push({
          date: dateStr,
          dayLabel,
          amount: 0,
        });
      }

      const startDate = `${points[0].date}T00:00:00.000Z`;
      const endDate = `${points[points.length - 1].date}T23:59:59.999Z`;

      // Query sum of expenses grouped by date
      const rows = db.getAllSync<{ day: string; daily_total: number }>(
        `SELECT substr(date, 1, 10) as day, SUM(amount) as daily_total
         FROM transactions
         WHERE type = 'expense' AND date >= ? AND date <= ?
         GROUP BY substr(date, 1, 10);`,
        [startDate, endDate],
      );

      const map = new Map<string, number>();
      rows.forEach((r) => map.set(r.day, r.daily_total));

      let peak = 0;
      const resolvedPoints = points.map((p) => {
        const amount = map.get(p.date) || 0;
        if (amount > peak) peak = amount;
        return { ...p, amount };
      });

      setMaxSpend(peak);
      setTrendData(resolvedPoints);
    } catch (error) {
      console.error("Failed to load spend trend:", error);
    }
  }, []);

  useEffect(() => {
    loadTrend();
  }, [loadTrend]);

  return { trendData, maxSpend, refreshTrend: loadTrend };
}
