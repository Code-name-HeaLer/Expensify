// Stage 4, Tier 1: Search input bar with instant clear action and compact layout.

import { Search, X } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";

interface TransactionSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function TransactionSearchBar({
  query,
  onQueryChange,
}: TransactionSearchBarProps) {
  return (
    <View style={styles.container}>
      <Search
        size={18}
        color={COLORS.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        value={query}
        onChangeText={onQueryChange}
        placeholder="Search notes, categories, accounts..."
        placeholderTextColor={COLORS.textMuted}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="never"
        autoCorrect={false}
      />
      {query.length > 0 && (
        <TouchableOpacity
          onPress={() => onQueryChange("")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearButton}
        >
          <X size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
});
