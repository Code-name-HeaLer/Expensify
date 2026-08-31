// Stage 7, Tier 4: Insights screen with Month Review, Donut Breakdown, Trend Chart, and Milestones.

import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AchievementsSection } from "../../components/insights/AchievementsSection";
import { CategoryDonutChart } from "../../components/insights/CategoryDonutChart";
import { MonthInReviewCard } from "../../components/insights/MonthInReviewCard";
import { MonthlyTrendChart } from "../../components/insights/MonthlyTrendChart";
import { CategoryIcon } from "../../components/shared/CategoryIcon";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { useAchievements } from "../../hooks/useAchievements";
import { useCategoryBreakdown } from "../../hooks/useCategoryBreakdown";
import { useMonthInReview } from "../../hooks/useMonthInReview";
import { useMonthlyTrend } from "../../hooks/useMonthlyTrend";
import { useStreakTracker } from "../../hooks/useStreakTracker";
import { formatINR } from "../../lib/currency";

export default function InsightsScreen() {
  const {
    breakdown,
    totalSpend,
    monthLabel,
    isLoading: isBreakdownLoading,
    refreshBreakdown,
  } = useCategoryBreakdown();

  const {
    trendSummary,
    isLoading: isTrendLoading,
    refreshTrend,
  } = useMonthlyTrend();

  const {
    review,
    isLoading: isReviewLoading,
    refreshReview,
  } = useMonthInReview();

  const { streakInfo, refreshStreak } = useStreakTracker();
  const { achievements, unlockedCount, refreshAchievements } = useAchievements(
    streakInfo.currentStreak,
  );

  const handleRefreshAll = () => {
    refreshBreakdown();
    refreshTrend();
    refreshReview();
    refreshStreak();
    refreshAchievements();
  };

  const isLoading = isBreakdownLoading || isTrendLoading || isReviewLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>SPENDING INSIGHTS</Text>
        <Text style={styles.subtitle}>{monthLabel}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefreshAll}
            tintColor={COLORS.primary}
          />
        }
      >
        {totalSpend > 0 ? (
          <>
            {/* Month-in-Review Natural Language Recap Card */}
            <MonthInReviewCard review={review} />

            {/* Donut Breakdown */}
            <View style={styles.chartCard}>
              <CategoryDonutChart data={breakdown} totalSpend={totalSpend} />
            </View>

            {/* 6-Month Comparison Trajectory */}
            <MonthlyTrendChart summary={trendSummary} />

            {/* Category Distribution Breakdown List */}
            <View style={styles.listCard}>
              <Text style={styles.listTitle}>CATEGORY DISTRIBUTION</Text>
              {breakdown.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.itemRow,
                    index !== breakdown.length - 1 && styles.borderBottom,
                  ]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${item.color}25` },
                    ]}
                  >
                    <CategoryIcon
                      name={item.icon}
                      size={16}
                      color={item.color}
                    />
                  </View>

                  <View style={styles.metaColumn}>
                    <Text style={styles.categoryName}>{item.name}</Text>
                    <Text style={styles.percentageText}>
                      {Math.round(item.percentage)}% of total
                    </Text>
                  </View>

                  <Text style={[styles.amountText, TYPOGRAPHY.tabularNumbers]}>
                    {formatINR(item.amount)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Milestones & Habits */}
            <AchievementsSection
              achievements={achievements}
              unlockedCount={unlockedCount}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No spending recorded this month.
            </Text>
            <Text style={styles.emptySubtext}>
              Log expenses on Home to see your category insights.
            </Text>
          </View>
        )}
      </ScrollView>
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
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    alignItems: "center",
  },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  listTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  metaColumn: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  percentageText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  amountText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  emptyState: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
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
