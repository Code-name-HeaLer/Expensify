// Stage 4, Tier 1: Day group header with tight padding and clean typography.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { formatINR } from "../../lib/currency";

interface TransactionGroupHeaderProps {
  displayDate: string;
  totalDayAmount: number;
}

export function TransactionGroupHeader({
  displayDate,
  totalDayAmount,
}: TransactionGroupHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.dateLabel}>{displayDate}</Text>
      <Text style={[styles.dayTotal, TYPOGRAPHY.tabularNumbers]}>
        {totalDayAmount > 0 ? formatINR(totalDayAmount) : "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  dayTotal: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
});
