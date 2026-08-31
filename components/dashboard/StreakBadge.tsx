// Stage 7, Tier 4: Restrained daily logging streak indicator badge.

import { Flame } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { StreakInfo } from "../../hooks/useStreakTracker";

interface StreakBadgeProps {
  streakInfo: StreakInfo;
}

export function StreakBadge({ streakInfo }: StreakBadgeProps) {
  const { currentStreak, loggedToday } = streakInfo;
  const isActive = currentStreak > 0;

  return (
    <View
      style={[
        styles.container,
        isActive && {
          backgroundColor: `${COLORS.categories.food}18`,
          borderColor: `${COLORS.categories.food}40`,
        },
      ]}
    >
      <Flame
        size={14}
        color={isActive ? COLORS.categories.food : COLORS.textMuted}
        fill={isActive ? COLORS.categories.food : "transparent"}
      />
      <Text
        style={[
          styles.streakCount,
          isActive && { color: COLORS.categories.food },
          TYPOGRAPHY.tabularNumbers,
        ]}
      >
        {currentStreak} {currentStreak === 1 ? "day" : "days"}
      </Text>
      {!loggedToday && isActive && <View style={styles.pendingDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    gap: 5,
  },
  streakCount: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  pendingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.warning,
    marginLeft: 2,
  },
});
