// Stage 2, Tier 1: Dynamic Lucide icon resolver component for category representations.

import {
    Car,
    CreditCard,
    Film,
    HeartPulse,
    Home,
    LucideIcon,
    MoreHorizontal,
    Repeat,
    ShoppingBag,
    Utensils,
    Zap,
} from "lucide-react-native";
import React from "react";

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Car,
  Zap,
  Home,
  CreditCard,
  Film,
  HeartPulse,
  ShoppingBag,
  Repeat,
  MoreHorizontal,
};

interface CategoryIconProps {
  name: string;
  size?: number;
  color: string;
}

export function CategoryIcon({ name, size = 18, color }: CategoryIconProps) {
  const IconComponent = ICON_MAP[name] || MoreHorizontal;
  return <IconComponent size={size} color={color} />;
}
