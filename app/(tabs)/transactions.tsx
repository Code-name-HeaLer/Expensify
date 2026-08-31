// Stage 4, Tier 1: Transactions screen with compact search, category filters, and swipeable cards.

import React from "react";
import {
    RefreshControl,
    ScrollView,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeableTransactionCard } from "../../components/transactions/SwipeableTransactionCard";
import { TransactionGroupHeader } from "../../components/transactions/TransactionGroupHeader";
import { TransactionSearchBar } from "../../components/transactions/TransactionSearchBar";
import { COLORS } from "../../constants/theme";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import { useTransactionFilters } from "../../hooks/useTransactionFilters";
import { useTransactionsList } from "../../hooks/useTransactionsList";

export default function TransactionsScreen() {
  const { groupedTransactions, isLoading, refreshTransactions } =
    useTransactionsList();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    filteredGroups,
  } = useTransactionFilters(groupedTransactions, (d) => d);

  const { deleteTransaction } = useDeleteTransaction(refreshTransactions);

  const availableCategories = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; color: string }>();
    groupedTransactions.forEach((g) => {
      g.items.forEach((t) => {
        if (!map.has(t.category_id)) {
          map.set(t.category_id, {
            id: t.category_id,
            name: t.category_name,
            color: t.category_color,
          });
        }
      });
    });
    return Array.from(map.values());
  }, [groupedTransactions]);

  const sections = filteredGroups.map((group) => ({
    displayDate: group.displayDate,
    totalDayAmount: group.totalDayAmount,
    data: group.items,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>TRANSACTIONS</Text>
      </View>

      {/* Compact Search Bar */}
      <TransactionSearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      {/* Constrained Category Filter Strip */}
      {availableCategories.length > 0 && (
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategoryFilter(null)}
              style={[
                styles.filterChip,
                selectedCategoryFilter === null && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategoryFilter === null &&
                    styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {availableCategories.map((cat) => {
              const isSelected = selectedCategoryFilter === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() =>
                    setSelectedCategoryFilter(isSelected ? null : cat.id)
                  }
                  style={[
                    styles.filterChip,
                    isSelected && {
                      backgroundColor: `${cat.color}25`,
                      borderColor: cat.color,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && {
                        color: COLORS.textPrimary,
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Grouped Transaction List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableTransactionCard item={item} onDelete={deleteTransaction} />
        )}
        renderSectionHeader={({ section }) => (
          <TransactionGroupHeader
            displayDate={section.displayDate}
            totalDayAmount={section.totalDayAmount}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshTransactions}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={
          sections.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No matching transactions found.
            </Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search query or filters.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  filterWrapper: {
    height: 36,
    marginBottom: 4,
  },
  filterScroll: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    justifyContent: "center",
  },
  filterChipActive: {
    backgroundColor: `${COLORS.primary}25`,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
});
