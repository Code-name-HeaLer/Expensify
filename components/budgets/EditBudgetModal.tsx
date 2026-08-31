// Stage 5, Tier 1 & 3: Bottom sheet modal for configuring monthly budget limits.

import { Check, Trash2, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { CategoryBudgetItem } from "../../hooks/useCategoryBudgets";
import { useSaveBudget } from "../../hooks/useSaveBudget";
import { appendKeypadInput, formatINR } from "../../lib/currency";
import { CategoryIcon } from "../shared/CategoryIcon";
import { NumericKeypad } from "../transactions/NumericKeypad";

interface EditBudgetModalProps {
  item: CategoryBudgetItem | null;
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function EditBudgetModal({
  item,
  visible,
  onClose,
  onSaved,
}: EditBudgetModalProps) {
  const [limitStr, setLimitStr] = useState("0");
  const { saveLimit, removeLimit } = useSaveBudget(() => {
    onSaved();
    onClose();
  });

  useEffect(() => {
    if (item) {
      setLimitStr(item.monthlyLimit > 0 ? item.monthlyLimit.toString() : "0");
    }
  }, [item, visible]);

  if (!item) return null;

  const parsedLimit = parseFloat(limitStr) || 0;

  const handleKeyPress = (key: string) => {
    setLimitStr((prev) => appendKeypadInput(prev, key));
  };

  const handleDelete = () => {
    setLimitStr((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  };

  const addPreset = (amount: number) => {
    setLimitStr((prev) => {
      const current = parseFloat(prev) || 0;
      return (current + amount).toString();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.sheetContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: `${item.categoryColor}25` },
              ]}
            >
              <CategoryIcon
                name={item.categoryIcon}
                size={16}
                color={item.categoryColor}
              />
            </View>
            <Text style={styles.title}>{item.categoryName} Budget</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Hero Limit Display */}
        <View style={styles.amountContainer}>
          <Text style={[styles.amountText, TYPOGRAPHY.tabularNumbers]}>
            {formatINR(parsedLimit)}
          </Text>
          <Text style={styles.caption}>Monthly Spending Cap</Text>
        </View>

        {/* Quick Increment Chips */}
        <View style={styles.presetRow}>
          {[500, 1000, 2000, 5000].map((preset) => (
            <TouchableOpacity
              key={preset}
              onPress={() => addPreset(preset)}
              style={styles.presetChip}
            >
              <Text style={styles.presetText}>+{formatINR(preset)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Numeric Keypad */}
        <NumericKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />

        {/* Actions */}
        <View style={styles.actionsRow}>
          {item.monthlyLimit > 0 && (
            <TouchableOpacity
              onPress={() => removeLimit(item.categoryId)}
              style={styles.removeButton}
            >
              <Trash2 size={18} color={COLORS.expense} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => saveLimit(item.categoryId, parsedLimit)}
            style={styles.saveButton}
          >
            <Check size={20} color={COLORS.background} />
            <Text style={styles.saveButtonText}>Set Limit</Text>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  amountContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  amountText: {
    fontSize: 34,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  caption: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  presetRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  presetText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 4,
  },
  removeButton: {
    width: 52,
    height: 52,
    backgroundColor: `${COLORS.expense}15`,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: `${COLORS.expense}35`,
  },
  saveButton: {
    flex: 1,
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.background,
  },
});
