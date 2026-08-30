// Stage 2, Tier 1: Horizontal scrollable category chip selector with active-state visual styling.

import * as Haptics from "expo-haptics";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/theme";
import { Category } from "../../types/database";
import { CategoryIcon } from "../shared/CategoryIcon";

interface CategoryChipPickerProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryChipPicker({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryChipPickerProps) {
  const handleSelect = (id: string) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // Continue safely if haptics are unsupported
    }
    onSelectCategory(id);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isSelected = cat.id === selectedCategoryId;
        return (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.7}
            onPress={() => handleSelect(cat.id)}
            style={[
              styles.chip,
              isSelected && {
                borderColor: cat.color,
                backgroundColor: `${cat.color}22`, // 13% opacity tint
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isSelected
                    ? cat.color
                    : COLORS.surfaceElevated,
                },
              ]}
            >
              <CategoryIcon
                name={cat.icon}
                size={16}
                color={isSelected ? COLORS.background : cat.color}
              />
            </View>
            <Text
              style={[
                styles.label,
                isSelected && { color: COLORS.textPrimary, fontWeight: "600" },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
