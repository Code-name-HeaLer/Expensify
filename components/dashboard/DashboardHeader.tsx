// Stage 3, Tier 1: Hero header displaying Safe-To-Spend metric and month budget progress.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { DashboardSummary } from "../../hooks/useDashboardSummary";
import { formatINR } from "../../lib/currency";

interface DashboardHeaderProps {
  summary: DashboardSummary;
}

export function DashboardHeader({ summary }: DashboardHeaderProps) {
  const hasBudget = summary.totalBudget > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>
        {hasBudget ? "SAFE TO SPEND TODAY" : "THIS MONTH’S SPEND"}
      </Text>

      <Text style={[styles.heroAmount, TYPOGRAPHY.tabularNumbers]}>
        {hasBudget
          ? formatINR(summary.safeToSpendToday)
          : formatINR(summary.totalSpentThisMonth)}
      </Text>

      <Text style={styles.caption}>
        {hasBudget
          ? `${summary.daysRemaining} days remaining in ${new Date().toLocaleString("default", { month: "short" })}`
          : "Set a monthly budget to unlock daily safe-to-spend"}
      </Text>

      {/* Summary Pills */}
      <View style={styles.pillsRow}>
        <View style={styles.pill}>
          <Text style={styles.pillLabel}>Total Spent</Text>
          <Text style={[styles.pillValueExpense, TYPOGRAPHY.tabularNumbers]}>
            {formatINR(summary.totalSpentThisMonth)}
          </Text>
        </View>

        {hasBudget ? (
          <View style={styles.pill}>
            <Text style={styles.pillLabel}>Remaining</Text>
            <Text style={[styles.pillValueIncome, TYPOGRAPHY.tabularNumbers]}>
              {formatINR(summary.remainingBudget)}
            </Text>
          </View>
        ) : (
          <View style={styles.pill}>
            <Text style={styles.pillLabel}>Budget Status</Text>
            <Text style={styles.pillValueMuted}>No Limit Set</Text>
          </View>
        )}
      </View>

      {/* Month Days Progress Track */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${summary.monthProgressPercent}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  heroAmount: {
    fontSize: 38,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  caption: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  pill: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  pillLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  pillValueExpense: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.expense,
  },
  pillValueIncome: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.income,
  },
  pillValueMuted: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.surfaceBorder,
    borderRadius: 2,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});
