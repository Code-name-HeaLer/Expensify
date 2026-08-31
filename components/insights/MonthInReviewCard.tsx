// Stage 6, Tier 3: Narrative summary card converting raw metrics into natural language insights.

import { Sparkles } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";
import { MonthInReviewData } from "../../hooks/useMonthInReview";

interface MonthInReviewCardProps {
  review: MonthInReviewData;
}

export function MonthInReviewCard({ review }: MonthInReviewCardProps) {
  const narratives = [
    review.topCategoryNarrative,
    review.comparisonNarrative,
    review.dailyAverageNarrative,
    review.largestExpenseNarrative,
  ].filter(Boolean);

  if (narratives.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconBadge}>
          <Sparkles size={15} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>MONTH IN REVIEW</Text>
      </View>

      <View style={styles.narrativeList}>
        {narratives.map((text, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 0.7,
  },
  narrativeList: {
    gap: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textPrimary,
  },
});
