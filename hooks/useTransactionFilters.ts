// Stage 4, Tier 1: Search and category filtering hook computing grouped transaction results.

import { useMemo, useState } from "react";
import {
    TransactionDayGroup
} from "./useTransactionsList";

export function useTransactionFilters(
  rawGroups: TransactionDayGroup[],
  formatDayLabel: (dateStr: string) => string,
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    string | null
  >(null);

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const groupsMap = new Map<string, TransactionDayGroup>();

    rawGroups.forEach((group) => {
      group.items.forEach((tx) => {
        // 1. Search Query match
        const matchesQuery =
          query === "" ||
          tx.category_name.toLowerCase().includes(query) ||
          tx.account_name.toLowerCase().includes(query) ||
          (tx.note && tx.note.toLowerCase().includes(query));

        // 2. Category match
        const matchesCategory =
          selectedCategoryFilter === null ||
          tx.category_id === selectedCategoryFilter;

        if (matchesQuery && matchesCategory) {
          const dateKey = tx.date.split("T")[0];
          if (!groupsMap.has(dateKey)) {
            groupsMap.set(dateKey, {
              dateKey,
              displayDate: group.displayDate,
              totalDayAmount: 0,
              items: [],
            });
          }

          const targetGroup = groupsMap.get(dateKey)!;
          targetGroup.items.push(tx);
          if (tx.type === "expense") {
            targetGroup.totalDayAmount += tx.amount;
          }
        }
      });
    });

    return Array.from(groupsMap.values());
  }, [rawGroups, searchQuery, selectedCategoryFilter]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    filteredGroups,
  };
}
