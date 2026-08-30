// Stage 1, Tier 1: Home dashboard root placeholder screen.

import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <Text
          style={{
            fontSize: 13,
            color: COLORS.textSecondary,
            letterSpacing: 0.5,
          }}
        >
          DASHBOARD
        </Text>
        <Text
          style={[
            {
              fontSize: 32,
              fontWeight: "700",
              color: COLORS.textPrimary,
              marginTop: 4,
            },
            TYPOGRAPHY.tabularNumbers,
          ]}
        >
          ₹0.00
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>
          Safe to spend today
        </Text>

        <View
          style={{
            marginTop: 28,
            padding: 16,
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.surfaceBorder,
          }}
        >
          <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
            Foundation loaded. Ready for Stage 2 (Quick Logging Flow).
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
