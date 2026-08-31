// Stage 6, Tier 3: SVG Donut chart visualizer with center total spend label.

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { COLORS, TYPOGRAPHY } from "../../constants/theme";
import { CategoryBreakdownItem } from "../../hooks/useCategoryBreakdown";
import { formatINR } from "../../lib/currency";

interface CategoryDonutChartProps {
  data: CategoryBreakdownItem[];
  totalSpend: number;
  size?: number;
}

export function CategoryDonutChart({
  data,
  totalSpend,
  size = 200,
}: CategoryDonutChartProps) {
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercentage = 0;

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size, position: "relative" }}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${center}, ${center}`}>
            {/* Background base track */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={COLORS.surfaceBorder}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Dynamic category segments */}
            {data.map((item) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -(
                (accumulatedPercentage / 100) *
                circumference
              );
              accumulatedPercentage += item.percentage;

              return (
                <Circle
                  key={item.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              );
            })}
          </G>
        </Svg>

        {/* Center Hero Label */}
        <View style={styles.centerLabel}>
          <Text style={styles.centerEyebrow}>TOTAL SPENT</Text>
          <Text style={[styles.centerAmount, TYPOGRAPHY.tabularNumbers]}>
            {formatINR(totalSpend)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  centerLabel: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  centerAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 2,
  },
});
