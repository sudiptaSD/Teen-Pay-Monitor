import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Segment {
  label: string;
  value: number;
  color: string;
  emoji: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({
  segments,
  size = 160,
  strokeWidth = 22,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  let accumulated = 0;
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((seg) => {
      const pct = seg.value / total;
      const dash = pct * circumference;
      const gap = circumference - dash;
      const rotation = (accumulated / total) * 360 - 90;
      accumulated += seg.value;
      return { ...seg, dash, gap, rotation };
    });

  return (
    <View style={styles.wrapper}>
      <View style={[styles.chartContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#F0EFFA"
            strokeWidth={strokeWidth}
          />
          {arcs.map((arc, i) => (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeLinecap="butt"
              origin={`${cx}, ${cy}`}
              rotation={arc.rotation}
            />
          ))}
        </Svg>
        {(centerValue || centerLabel) && (
          <View style={styles.center}>
            {centerValue && <Text style={styles.centerValue}>{centerValue}</Text>}
            {centerLabel && <Text style={styles.centerLabel}>{centerLabel}</Text>}
          </View>
        )}
      </View>
      <View style={styles.legend}>
        {segments.map((seg) => (
          <View key={seg.label} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: seg.color }]} />
            <Text style={styles.legendEmoji}>{seg.emoji}</Text>
            <Text style={styles.legendLabel}>{seg.label}</Text>
            <Text style={styles.legendValue}>₹{seg.value.toLocaleString("en-IN")}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", gap: 16 },
  chartContainer: { position: "relative", alignItems: "center", justifyContent: "center" },
  center: { position: "absolute", alignItems: "center" },
  centerValue: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#1A1A2E" },
  centerLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#8A8A9A" },
  legend: { width: "100%", gap: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendEmoji: { fontSize: 13 },
  legendLabel: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: "#1A1A2E" },
  legendValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#1A1A2E" },
});
