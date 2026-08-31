// Stage 4, Tier 1: Query transactions joined with categories and group chronologically by date.

import { useCallback, useEffect, useState } from "react";
import { db } from "../lib/db";
import { TransactionType } from "../types/database";

export interface PopulatedTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  account_id: string;
  account_name: string;
  note: string | null;
  date: string;
  is_recurring: number;
  created_at: string;
}

export interface TransactionDayGroup {
  dateKey: string;
  displayDate: string;
  totalDayAmount: number;
  items: PopulatedTransaction[];
}

export function useTransactionsList() {
  const [groupedTransactions, setGroupedTransactions] = useState<
    TransactionDayGroup[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatDayLabel = (dateStr: string): string => {
    const today = new Date();
    const txDate = new Date(dateStr);

    const isToday =
      today.getFullYear() === txDate.getFullYear() &&
      today.getMonth() === txDate.getMonth() &&
      today.getDate() === txDate.getDate();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday =
      yesterday.getFullYear() === txDate.getFullYear() &&
      yesterday.getMonth() === txDate.getMonth() &&
      yesterday.getDate() === txDate.getDate();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return txDate.toLocaleDateString("default", {
      day: "numeric",
      month: "short",
      year:
        today.getFullYear() === txDate.getFullYear() ? undefined : "numeric",
    });
  };

  const loadTransactions = useCallback(() => {
    setIsLoading(true);
    try {
      const rows = db.getAllSync<PopulatedTransaction>(`
        SELECT 
          t.id, t.amount, t.type, t.note, t.date, t.is_recurring, t.created_at,
          c.id as category_id, c.name as category_name, c.icon as category_icon, c.color as category_color,
          a.id as account_id, a.name as account_name
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        JOIN accounts a ON t.account_id = a.id
        ORDER BY t.date DESC;
      `);

      const groupsMap = new Map<string, TransactionDayGroup>();

      rows.forEach((tx) => {
        const dateKey = tx.date.split("T")[0];
        if (!groupsMap.has(dateKey)) {
          groupsMap.set(dateKey, {
            dateKey,
            displayDate: formatDayLabel(tx.date),
            totalDayAmount: 0,
            items: [],
          });
        }

        const group = groupsMap.get(dateKey)!;
        group.items.push(tx);
        if (tx.type === "expense") {
          group.totalDayAmount += tx.amount;
        }
      });

      setGroupedTransactions(Array.from(groupsMap.values()));
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    groupedTransactions,
    isLoading,
    refreshTransactions: loadTransactions,
  };
}
