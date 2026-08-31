// Stage 7, Tier 4: Home dashboard with inline streak badge, summary header, sparkline, and top categories.

import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { SpendTrendSparkline } from "../../components/dashboard/SpendTrendSparkline";
import { TopCategoriesList } from "../../components/dashboard/TopCategoriesList";
import { FloatingAddButton } from "../../components/shared/FloatingAddButton";
import { QuickAddModal } from "../../components/transactions/QuickAddModal";
import { COLORS } from "../../constants/theme";
import { useDashboardSummary } from "../../hooks/useDashboardSummary";
import { useSpendTrend } from "../../hooks/useSpendTrend";
import { useStreakTracker } from "../../hooks/useStreakTracker";
import { useTopCategories } from "../../hooks/useTopCategories";

export default function HomeScreen() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { summary, refreshSummary } = useDashboardSummary();
  const { trendData, maxSpend, refreshTrend } = useSpendTrend();
  const { topCategories, refreshTopCategories } = useTopCategories();
  const { streakInfo, refreshStreak } = useStreakTracker();

  const handleRefreshAll = () => {
    refreshSummary();
    refreshTrend();
    refreshTopCategories();
    refreshStreak();
  };

  useEffect(() => {
    handleRefreshAll();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Safe-To-Spend & Summary Header with Inline Streak Badge */}
          <DashboardHeader summary={summary} streakInfo={streakInfo} />

          {/* 14-Day Spend Trajectory Sparkline */}
          <SpendTrendSparkline data={trendData} maxSpend={maxSpend} />

          {/* Top 3 Expense Categories */}
          <TopCategoriesList categories={topCategories} />
        </ScrollView>

        {/* Floating Quick Add Button */}
        <FloatingAddButton onPress={() => setIsAddModalVisible(true)} />

        {/* Quick Add Bottom Sheet Modal */}
        <QuickAddModal
          visible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onSaved={handleRefreshAll}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 90,
  },
});
