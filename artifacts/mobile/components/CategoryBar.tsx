import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BudgetCategory } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface CategoryBarProps {
  category: BudgetCategory;
  showProposed?: boolean;
}

export function CategoryBar({ category, showProposed = false }: CategoryBarProps) {
  const colors = useColors();
  const limit = showProposed ? category.proposed : category.approved;
  const pct = Math.min((category.spent / limit) * 100, 100);
  const isOver = category.spent >= limit * 0.9;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <Text style={styles.emoji}>{category.emoji}</Text>
          <Text style={[styles.name, { color: colors.foreground }]}>{category.name}</Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.spent, { color: isOver ? colors.destructive : colors.foreground }]}>
            ₹{category.spent.toLocaleString("en-IN")}
          </Text>
          <Text style={[styles.limit, { color: colors.mutedForeground }]}>
            {" "}/{" "}₹{limit.toLocaleString("en-IN")}
          </Text>
        </View>
      </View>
      <View style={[styles.track, { backgroundColor: colors.muted }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${pct}%` as any,
              backgroundColor: isOver ? colors.destructive : category.color,
            },
          ]}
        />
      </View>
      {isOver && (
        <Text style={[styles.warning, { color: colors.destructive }]}>
          Approaching limit
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 6 },
  emoji: { fontSize: 16 },
  name: { fontSize: 14, fontFamily: "Inter_500Medium" },
  right: { flexDirection: "row", alignItems: "baseline" },
  spent: { fontSize: 14, fontFamily: "Inter_700Bold" },
  limit: { fontSize: 12, fontFamily: "Inter_400Regular" },
  track: { height: 8, borderRadius: 4, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4 },
  warning: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 3 },
});
