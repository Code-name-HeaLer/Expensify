// Stage 3, Tier 1: 14-day spending trajectory sparkline component with legible density.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { DailySpendPoint } from "../../hooks/useSpendTrend";
import { formatINR } from "../../lib/currency";

interface SpendTrendSparklineProps {
  data: DailySpendPoint[];
  maxSpend: number;
}

export function SpendTrendSparkline({
  data,
  maxSpend,
}: SpendTrendSparklineProps) {
  const chartHeight = 52;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>14-DAY SPEND TREND</Text>
        <Text style={[styles.peakText, TYPOGRAPHY.tabularNumbers]}>
          Peak: {formatINR(maxSpend)}
        </Text>
      </View>

      {/* Sparkline Bar Track */}
      <View style={[styles.barContainer, { height: chartHeight }]}>
        {data.map((point) => {
          const heightRatio = maxSpend > 0 ? point.amount / maxSpend : 0;
          const barHeight =
            point.amount > 0 ? Math.max(6, heightRatio * chartHeight) : 3;
          const isPeak = point.amount > 0 && point.amount === maxSpend;

          return (
            <View key={point.date} style={styles.column}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: isPeak
                      ? COLORS.primary
                      : point.amount > 0
                        ? COLORS.textSecondary
                        : COLORS.surfaceBorder,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>

      {/* Timeline Footer Labels */}
      <View style={styles.timelineRow}>
        <Text style={styles.timelineLabel}>14 days ago</Text>
        <Text style={styles.timelineLabel}>Today</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  peakText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  column: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    paddingHorizontal: 2,
  },
  bar: {
    width: "100%",
    borderRadius: 3,
    minWidth: 4,
  },
  timelineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timelineLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
