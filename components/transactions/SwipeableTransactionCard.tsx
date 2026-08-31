// Stage 4, Tier 1: Category-accented transaction card with animated swipe-to-reveal delete button.

import { Trash2 } from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { PopulatedTransaction } from "../../hooks/useTransactionsList";
import { formatINR } from "../../lib/currency";
import { CategoryIcon } from "../shared/CategoryIcon";

interface SwipeableTransactionCardProps {
  item: PopulatedTransaction;
  onDelete: (item: PopulatedTransaction) => void;
}

export function SwipeableTransactionCard({
  item,
  onDelete,
}: SwipeableTransactionCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  // Fade and scale in the delete button only when actively swiping left
  const deleteOpacity = translateX.interpolate({
    inputRange: [-70, -15, 0],
    outputRange: [1, 0.1, 0],
    extrapolate: "clamp",
  });

  const deleteScale = translateX.interpolate({
    inputRange: [-70, 0],
    outputRange: [1, 0.85],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -85));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -45) {
          Animated.spring(translateX, {
            toValue: -75,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
        }
      },
    }),
  ).current;

  const handleDelete = () => {
    Animated.timing(translateX, {
      toValue: -350,
      duration: 180,
      useNativeDriver: true,
    }).start(() => onDelete(item));
  };

  return (
    <View style={styles.wrapper}>
      {/* Hidden Animated Delete Pill (Zero opacity until dragged) */}
      <Animated.View
        style={[
          styles.deleteBackground,
          {
            opacity: deleteOpacity,
            transform: [{ scale: deleteScale }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          <Trash2 size={18} color="#FFFFFF" />
          <Text style={styles.deleteLabel}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Swipeable Category-Tinted Card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            transform: [{ translateX }],
            backgroundColor: `${item.category_color}18`, // Rich category accent tint
            borderColor: `${item.category_color}45`, // Category glowing border
          },
        ]}
      >
        {/* Category Accent Icon Badge */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: `${item.category_color}30`,
              borderColor: `${item.category_color}60`,
            },
          ]}
        >
          <CategoryIcon
            name={item.category_icon}
            size={18}
            color={item.category_color}
          />
        </View>

        {/* Category Title & Note/Account */}
        <View style={styles.metaColumn}>
          <Text style={styles.categoryTitle} numberOfLines={1}>
            {item.category_name}
          </Text>
          <Text style={styles.accountSubtitle} numberOfLines={1}>
            {item.note
              ? `${item.note} • ${item.account_name}`
              : item.account_name}
          </Text>
        </View>

        {/* Amount */}
        <Text
          style={[
            styles.amountText,
            item.type === "expense"
              ? styles.expenseAmount
              : styles.incomeAmount,
            TYPOGRAPHY.tabularNumbers,
          ]}
        >
          {item.type === "expense"
            ? `-${formatINR(item.amount)}`
            : `+${formatINR(item.amount)}`}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 4,
    position: "relative",
    borderRadius: 14,
  },
  deleteBackground: {
    position: "absolute",
    right: 4,
    top: 4,
    bottom: 4,
    width: 66,
    backgroundColor: "#DC2626",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  deleteLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    zIndex: 2,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
  },
  metaColumn: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  accountSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  amountText: {
    fontSize: 15,
    fontWeight: "700",
  },
  expenseAmount: {
    color: COLORS.expense,
  },
  incomeAmount: {
    color: COLORS.income,
  },
});
