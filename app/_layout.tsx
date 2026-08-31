// Stage 5, Tier 1: Root layout initializing SQLite database, evaluating recurring drafts, and providing dark theme container.

import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { COLORS } from "../constants/theme";
import { initDatabase } from "../lib/db";
import { processDueRecurringTransactions } from "../lib/recurringScheduler";

import "../global.css";

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    try {
      // 1. Initialize SQLite schema & defaults
      initDatabase();
      // 2. Check and auto-generate any recurring transactions due today
      processDueRecurringTransactions();
      setIsDbReady(true);
    } catch (error) {
      console.error(
        "Failed to initialize database or process recurring transactions:",
        error,
      );
    }
  }, []);

  if (!isDbReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
