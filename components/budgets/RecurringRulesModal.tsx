// Stage 5, Tier 1: Modal to view scheduled commitments and configure new recurring expenses.

import { Calendar, Trash2, X } from "lucide-react-native";
import React from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { useRecurringRules } from "../../hooks/useRecurringRules";
import { formatINR } from "../../lib/currency";
import { CategoryIcon } from "../shared/CategoryIcon";

interface RecurringRulesModalProps {
  visible: boolean;
  onClose: () => void;
}

export function RecurringRulesModal({
  visible,
  onClose,
}: RecurringRulesModalProps) {
  const { rules, deleteRule } = useRecurringRules();

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
          <View style={styles.titleRow}>
            <Calendar size={18} color={COLORS.primary} />
            <Text style={styles.title}>Scheduled Commitments</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Rent, EMIs, and Subscriptions auto-populate as drafts on their due
          date.
        </Text>

        {/* List of active rules */}
        <ScrollView style={styles.list}>
          {rules.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No recurring expenses configured.
              </Text>
            </View>
          ) : (
            rules.map((rule) => (
              <View
                key={rule.id}
                style={[
                  styles.ruleCard,
                  {
                    backgroundColor: `${rule.category_color}12`,
                    borderColor: `${rule.category_color}35`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${rule.category_color}25` },
                  ]}
                >
                  <CategoryIcon
                    name={rule.category_icon}
                    size={16}
                    color={rule.category_color}
                  />
                </View>

                <View style={styles.metaColumn}>
                  <Text style={styles.ruleName} numberOfLines={1}>
                    {rule.note || rule.category_name}
                  </Text>
                  <Text style={styles.dueCaption}>
                    Due on {rule.day_of_month}th of every month •{" "}
                    {rule.account_name}
                  </Text>
                </View>

                <Text style={[styles.amountText, TYPOGRAPHY.tabularNumbers]}>
                  {formatINR(rule.amount)}
                </Text>

                <TouchableOpacity
                  onPress={() => deleteRule(rule.id)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  style={styles.deleteButton}
                >
                  <Trash2 size={16} color={COLORS.expense} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
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
    paddingBottom: 28,
    maxHeight: "75%",
    borderTopWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  ruleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  metaColumn: {
    flex: 1,
  },
  ruleName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  dueCaption: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  amountText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginRight: 10,
  },
  deleteButton: {
    padding: 4,
  },
});
