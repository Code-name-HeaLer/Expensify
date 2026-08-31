// Stage 7, Tier 4: Compact 2-column envelope tile with spring press feedback and clean progress colors.

import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { CategoryBudgetItem } from "../../hooks/useCategoryBudgets";
import { formatINR } from "../../lib/currency";
import { CategoryIcon } from "../shared/CategoryIcon";

interface CategoryBudgetCardProps {
  item: CategoryBudgetItem;
  onPress: (item: CategoryBudgetItem) => void;
}

export function CategoryBudgetCard({ item, onPress }: CategoryBudgetCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const hasBudget = item.monthlyLimit > 0;

  const getProgressColor = () => {
    if (item.status === "exceeded") return COLORS.expense;
    if (item.status === "warning") return COLORS.warning;
    return item.categoryColor;
  };

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  };

  const handlePress = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
    onPress(item);
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale }],
            backgroundColor: `${item.categoryColor}10`,
            borderColor:
              item.status === "exceeded"
                ? `${COLORS.expense}70`
                : `${item.categoryColor}35`,
          },
        ]}
      >
        {/* Top: Icon & Percentage Badge */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: `${item.categoryColor}25`,
                borderColor: `${item.categoryColor}50`,
              },
            ]}
          >
            <CategoryIcon
              name={item.categoryIcon}
              size={15}
              color={item.categoryColor}
            />
          </View>

          {hasBudget ? (
            <View
              style={[
                styles.percentageBadge,
                {
                  backgroundColor:
                    item.status === "exceeded"
                      ? `${COLORS.expense}25`
                      : item.status === "warning"
                        ? `${COLORS.warning}25`
                        : `${item.categoryColor}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.percentageText,
                  { color: getProgressColor() },
                  TYPOGRAPHY.tabularNumbers,
                ]}
              >
                {item.percentage}%
              </Text>
            </View>
          ) : (
            <Text style={styles.setCapText}>+ Set Cap</Text>
          )}
        </View>

        {/* Center: Category Title & Spent Hero */}
        <View style={styles.middleSection}>
          <Text style={styles.categoryName} numberOfLines={1}>
            {item.categoryName}
          </Text>
          <Text style={[styles.spentAmount, TYPOGRAPHY.tabularNumbers]}>
            {formatINR(item.spentAmount)}
          </Text>
        </View>

        {/* Bottom: Progress Bar */}
        {hasBudget ? (
          <View style={styles.bottomSection}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(100, item.percentage)}%`,
                    backgroundColor: getProgressColor(),
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.limitCaption,
                item.status === "exceeded" && { color: COLORS.expense },
                TYPOGRAPHY.tabularNumbers,
              ]}
              numberOfLines={1}
            >
              {item.status === "exceeded"
                ? `Over by ${formatINR(item.spentAmount - item.monthlyLimit)}`
                : `${formatINR(item.remainingAmount)} left`}
            </Text>
          </View>
        ) : (
          <View style={styles.unbudgetedRow}>
            <Text style={styles.unbudgetedCaption}>No limit configured</Text>
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    minHeight: 126,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  percentageBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: "700",
  },
  setCapText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  middleSection: {
    marginVertical: 6,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  spentAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  bottomSection: {
    gap: 4,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.surfaceBorder,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  limitCaption: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textMuted,
  },
  unbudgetedRow: {
    paddingTop: 4,
  },
  unbudgetedCaption: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: "italic",
  },
});
