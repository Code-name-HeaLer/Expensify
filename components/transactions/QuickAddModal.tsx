// Stage 2, Tier 1: Quick expense logging bottom sheet modal with keypad and category row.

import { Check, X } from "lucide-react-native";
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { useQuickAdd } from "../../hooks/useQuickAdd";
import { formatINR } from "../../lib/currency";
import { CategoryChipPicker } from "./CategoryChipPicker";
import { NumericKeypad } from "./NumericKeypad";

interface QuickAddModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function QuickAddModal({
  visible,
  onClose,
  onSaved,
}: QuickAddModalProps) {
  const {
    amountStr,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    handleKeyPress,
    handleDelete,
    handleClear,
    saveExpense,
  } = useQuickAdd(() => {
    onSaved?.();
    onClose();
  });

  const parsedAmount = parseFloat(amountStr) || 0;
  const canSave = parsedAmount > 0 && selectedCategoryId !== null;

  const handleClose = () => {
    handleClear();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.sheetContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Log Expense</Text>
          <TouchableOpacity
            onPress={handleClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Hero Amount Display */}
        <View style={styles.amountContainer}>
          <Text style={[styles.amountText, TYPOGRAPHY.tabularNumbers]}>
            {formatINR(parsedAmount, true)}
          </Text>
        </View>

        {/* Category Picker */}
        <CategoryChipPicker
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        {/* Numeric Keypad */}
        <NumericKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />

        {/* Bottom Confirm Action */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!canSave}
            onPress={saveExpense}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          >
            <Check
              size={20}
              color={canSave ? COLORS.background : COLORS.textMuted}
            />
            <Text
              style={[
                styles.saveButtonText,
                !canSave && styles.saveButtonTextDisabled,
              ]}
            >
              Save Expense
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },
  sheetContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  amountContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  amountText: {
    fontSize: 38,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  actionContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  saveButton: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.background,
  },
  saveButtonTextDisabled: {
    color: COLORS.textMuted,
  },
});
