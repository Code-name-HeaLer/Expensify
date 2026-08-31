// Stage 7, Tier 4: Restrained milestones component displaying unlocked badges and progress.

import {
    Award,
    CheckCircle2,
    Compass,
    Flame,
    Repeat,
    ShieldCheck,
    Zap,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/theme";
import { AchievementItem } from "../../hooks/useAchievements";

const ICON_MAP: Record<string, any> = {
  Zap,
  Flame,
  Compass,
  ShieldCheck,
  Repeat,
};

interface AchievementsSectionProps {
  achievements: AchievementItem[];
  unlockedCount: number;
}

export function AchievementsSection({
  achievements,
  unlockedCount,
}: AchievementsSectionProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Award size={16} color={COLORS.primary} />
          <Text style={styles.title}>MILESTONES & HABITS</Text>
        </View>
        <Text style={styles.unlockedLabel}>
          {unlockedCount} of {achievements.length} Unlocked
        </Text>
      </View>

      <View style={styles.list}>
        {achievements.map((item, index) => {
          const IconComp = ICON_MAP[item.iconName] || Award;

          return (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                index !== achievements.length - 1 && styles.borderBottom,
                !item.unlocked && styles.itemLocked,
              ]}
            >
              <View
                style={[
                  styles.iconBadge,
                  item.unlocked
                    ? {
                        backgroundColor: `${COLORS.primary}25`,
                        borderColor: `${COLORS.primary}50`,
                      }
                    : {
                        backgroundColor: COLORS.surfaceElevated,
                        borderColor: COLORS.surfaceBorder,
                      },
                ]}
              >
                <IconComp
                  size={16}
                  color={item.unlocked ? COLORS.primary : COLORS.textMuted}
                />
              </View>

              <View style={styles.metaColumn}>
                <Text
                  style={[
                    styles.itemTitle,
                    !item.unlocked && { color: COLORS.textSecondary },
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>

              <View style={styles.statusBadge}>
                {item.unlocked ? (
                  <CheckCircle2 size={16} color={COLORS.income} />
                ) : (
                  <Text style={styles.progressText}>{item.progressText}</Text>
                )}
              </View>
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
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
  },
  unlockedLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  list: {
    gap: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  itemLocked: {
    opacity: 0.75,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
  },
  metaColumn: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  itemDescription: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  statusBadge: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
});
