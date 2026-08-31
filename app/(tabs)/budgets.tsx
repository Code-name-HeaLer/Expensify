// Stage 5, Tier 1 & 3: Budgets tab screen with 2-column envelope grid and modal editing.

import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryBudgetCard } from "../../components/budgets/CategoryBudgetCard";
import { EditBudgetModal } from "../../components/budgets/EditBudgetModal";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import {
  CategoryBudgetItem,
  useCategoryBudgets,
} from "../../hooks/useCategoryBudgets";
import { formatINR } from "../../lib/currency";

export default function BudgetsScreen() {
  const { budgets, totalAllocated, totalSpent, isLoading, refreshBudgets } =
    useCategoryBudgets();
  const [selectedBudget, setSelectedBudget] =
    useState<CategoryBudgetItem | null>(null);

  const handleSelectBudget = (item: CategoryBudgetItem) => {
    setSelectedBudget(item);
  };

  const overallPercentage =
    totalAllocated > 0
      ? Math.min(100, Math.round((totalSpent / totalAllocated) * 100))
      : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>MONTHLY BUDGETS</Text>
      </View>

      {/* Master Overview Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>Total Allocated</Text>
            <Text style={[styles.summaryAmount, TYPOGRAPHY.tabularNumbers]}>
              {formatINR(totalAllocated)}
            </Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text
              style={[
                styles.spentAmount,
                totalAllocated > 0 &&
                  totalSpent > totalAllocated && { color: COLORS.expense },
                TYPOGRAPHY.tabularNumbers,
              ]}
            >
              {formatINR(totalSpent)}
            </Text>
          </View>
        </View>

        {totalAllocated > 0 && (
          <View style={styles.masterProgressTrack}>
            <View
              style={[
                styles.masterProgressFill,
                {
                  width: `${overallPercentage}%`,
                  backgroundColor:
                    totalSpent > totalAllocated
                      ? COLORS.expense
                      : overallPercentage >= 80
                        ? COLORS.warning
                        : COLORS.primary,
                },
              ]}
            />
          </View>
        )}
      </View>

      {/* 2-Column Envelope Grid */}
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.categoryId}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <CategoryBudgetCard item={item} onPress={handleSelectBudget} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshBudgets}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Edit Category Budget Modal */}
      <EditBudgetModal
        item={selectedBudget}
        visible={selectedBudget !== null}
        onClose={() => setSelectedBudget(null)}
        onSaved={refreshBudgets}
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
  summaryCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryRight: {
    alignItems: "flex-end",
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  spentAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
  },
  masterProgressTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 3,
    marginTop: 12,
    overflow: "hidden",
  },
  masterProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  gridRow: {
    paddingHorizontal: 11,
  },
  listContent: {
    paddingBottom: 40,
  },
});
