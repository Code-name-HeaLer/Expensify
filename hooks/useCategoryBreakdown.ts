// Stage 6, Tier 3: Query monthly category spend distribution and calculate donut chart segments.

import { useCallback, useEffect, useState } from "react";
import { getMonthDateRange, getMonthName } from "../lib/date";
import { db } from "../lib/db";

export interface CategoryBreakdownItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
}

export function useCategoryBreakdown() {
  const [breakdown, setBreakdown] = useState<CategoryBreakdownItem[]>([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [monthLabel, setMonthLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadBreakdown = useCallback(() => {
    setIsLoading(true);
    try {
      const now = new Date();
      const { startOfMonthIso, endOfMonthIso } = getMonthDateRange(now);
      setMonthLabel(`${getMonthName(now)} ${now.getFullYear()}`);

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
         ORDER BY total_amount DESC;`,
        [startOfMonthIso, endOfMonthIso],
      );

      const total = rows.reduce((sum, r) => sum + r.total_amount, 0);
      setTotalSpend(total);

      const items: CategoryBreakdownItem[] = rows.map((r) => ({
        id: r.id,
        name: r.name,
        icon: r.icon,
        color: r.color,
        amount: r.total_amount,
        percentage: total > 0 ? (r.total_amount / total) * 100 : 0,
      }));

      setBreakdown(items);
    } catch (error) {
      console.error("Failed to load category breakdown:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBreakdown();
  }, [loadBreakdown]);

  return {
    breakdown,
    totalSpend,
    monthLabel,
    isLoading,
    refreshBreakdown: loadBreakdown,
  };
}
