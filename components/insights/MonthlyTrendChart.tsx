// Stage 6, Tier 3: 6-month historical spending comparison bar chart.

import { TrendingDown, TrendingUp } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { MonthlyTrendSummary } from "../../hooks/useMonthlyTrend";
import { formatINR } from "../../lib/currency";

interface MonthlyTrendChartProps {
  summary: MonthlyTrendSummary;
}

export function MonthlyTrendChart({ summary }: MonthlyTrendChartProps) {
  const chartHeight = 86;
  const { points, peakAmount, monthOverMonthChange } = summary;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>6-MONTH SPEND TRAJECTORY</Text>
        {monthOverMonthChange !== null && (
          <View style={styles.changeBadge}>
            {monthOverMonthChange > 0 ? (
              <TrendingUp size={13} color={COLORS.expense} />
            ) : (
              <TrendingDown size={13} color={COLORS.income} />
            )}
            <Text
              style={[
                styles.changeText,
                {
                  color:
                    monthOverMonthChange > 0 ? COLORS.expense : COLORS.income,
                },
                TYPOGRAPHY.tabularNumbers,
              ]}
            >
              {monthOverMonthChange > 0
                ? `+${monthOverMonthChange}%`
                : `${monthOverMonthChange}%`}
            </Text>
          </View>
        )}
      </View>

      {/* Bar Chart Container */}
      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {points.map((p) => {
          const heightRatio = peakAmount > 0 ? p.amount / peakAmount : 0;
          const barHeight =
            p.amount > 0 ? Math.max(8, heightRatio * (chartHeight - 20)) : 3;

          return (
            <View key={p.monthKey} style={styles.barColumn}>
              {p.amount > 0 && (
                <Text style={[styles.amountLabel, TYPOGRAPHY.tabularNumbers]}>
                  {formatINR(p.amount)}
                </Text>
              )}
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: p.isCurrentMonth
                      ? COLORS.primary
                      : p.amount > 0
                        ? COLORS.surfaceBorder
                        : `${COLORS.surfaceBorder}60`,
                  },
                ]}
              />
              <Text
                style={[
                  styles.monthLabel,
                  p.isCurrentMonth && {
                    color: COLORS.primary,
                    fontWeight: "700",
                  },
                ]}
              >
                {p.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  changeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  amountLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  bar: {
    width: 22,
    borderRadius: 5,
  },
  monthLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
});
