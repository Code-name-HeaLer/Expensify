// Stage 3, Tier 1: Glanceable card showing top 3 spending categories with mini progress bars.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { TopCategoryItem } from "../../hooks/useTopCategories";
import { formatINR } from "../../lib/currency";
import { CategoryIcon } from "../shared/CategoryIcon";

interface TopCategoriesListProps {
  categories: TopCategoryItem[];
}

export function TopCategoriesList({ categories }: TopCategoriesListProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>TOP EXPENSE CATEGORIES</Text>

      <View style={styles.list}>
        {categories.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.itemRow,
              index !== categories.length - 1 && styles.borderBottom,
            ]}
          >
            {/* Category Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${item.color}22` },
              ]}
            >
              <CategoryIcon name={item.icon} size={16} color={item.color} />
            </View>

            {/* Category Name & Share Bar */}
            <View style={styles.metaColumn}>
              <View style={styles.metaHeader}>
                <Text style={styles.categoryName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.amountText, TYPOGRAPHY.tabularNumbers]}>
                  {formatINR(item.totalAmount)}
                </Text>
              </View>

              {/* Progress bar and percentage */}
              <View style={styles.barRow}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[styles.percentageText, TYPOGRAPHY.tabularNumbers]}
                >
                  {item.percentage}%
                </Text>
              </View>
            </View>
          </View>
        ))}
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
  title: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  list: {
    gap: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  borderBottom: {
    paddingBottom: 8,
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
  metaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  amountText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
  },
  percentageText: {
    fontSize: 11,
    color: COLORS.textMuted,
    width: 32,
    textAlign: "right",
  },
});
