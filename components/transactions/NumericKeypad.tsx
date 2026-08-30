// Stage 2, Tier 1: Fast-response numeric keypad component with micro-haptic feedback.

import * as Haptics from "expo-haptics";
import { Delete } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "delete"],
];

export function NumericKeypad({ onKeyPress, onDelete }: NumericKeypadProps) {
  const handlePress = (key: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Gracefully continue if haptics are unsupported on device
    }

    if (key === "delete") {
      onDelete();
    } else {
      onKeyPress(key);
    }
  };

  return (
    <View style={styles.container}>
      {KEYS.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key) => {
            const isDelete = key === "delete";
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.6}
                onPress={() => handlePress(key)}
                style={styles.keyButton}
              >
                {isDelete ? (
                  <Delete color={COLORS.textSecondary} size={24} />
                ) : (
                  <Text style={[styles.keyText, TYPOGRAPHY.tabularNumbers]}>
                    {key}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  keyButton: {
    flex: 1,
    height: 54,
    marginHorizontal: 5,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  keyText: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});
