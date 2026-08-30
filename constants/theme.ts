// Stage 1, Tier 1: Central design system theme tokens and color palette definitions.

import type { TextStyle } from "react-native";

export const COLORS = {
  // Base backgrounds (avoiding harsh #000000 OLED halation)
  background: "#0D0F12",
  surface: "#16191E",
  surfaceElevated: "#1E232B",
  surfaceBorder: "#262C36",

  // Accent & Action
  primary: "#38BDF8", // Crisp sky-blue accent for CTAs and interactive states
  primaryMuted: "#0C4A6E",

  // Semantic
  income: "#22C55E", // Under budget / positive cash flow
  expense: "#F87171", // Spend / warm coral
  warning: "#F59E0B", // Approaching budget limit
  neutral: "#64748B",

  // Typography
  textPrimary: "#F5F6F7",
  textSecondary: "#8A8F98",
  textMuted: "#525866",

  // Muted category palette
  categories: {
    food: "#FB923C", // Warm amber-orange
    transport: "#38BDF8", // Light blue
    bills: "#F472B6", // Soft pink
    rent: "#A78BFA", // Violet
    emi: "#F87171", // Coral
    entertainment: "#FBBF24", // Yellow
    health: "#34D399", // Emerald
    shopping: "#818CF8", // Indigo
    subscriptions: "#2DD4BF", // Teal
    misc: "#94A3B8", // Slate
  },
} as const;

export const TYPOGRAPHY = {
  tabularNumbers: {
    fontVariant: ["tabular-nums"] as unknown as TextStyle["fontVariant"],
  },
};
