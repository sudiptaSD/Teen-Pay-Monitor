import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SavingsGoal } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface GoalCardProps {
  goal: SavingsGoal;
  compact?: boolean;
  onPress?: () => void;
}

export function GoalCard({ goal, compact = false, onPress }: GoalCardProps) {
  const colors = useColors();
  const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);
  const pct = Math.round(progress * 100);
  const remaining = goal.targetAmount - goal.currentAmount;

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.emoji}>{goal.emoji}</Text>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactName, { color: colors.foreground }]} numberOfLines={1}>
            {goal.name}
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <View
              style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: colors.primary }]}
            />
          </View>
          <Text style={[styles.compactPct, { color: colors.mutedForeground }]}>{pct}% saved</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={[styles.emojiContainer, { backgroundColor: colors.secondary }]}>
          <Text style={styles.emojiLarge}>{goal.emoji}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
            {goal.name}
          </Text>
          <Text style={[styles.target, { color: colors.mutedForeground }]}>
            ₹{goal.targetAmount.toLocaleString("en-IN")} goal
          </Text>
        </View>
        <View style={[styles.pctBadge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.pctText, { color: colors.primary }]}>{pct}%</Text>
        </View>
      </View>

      <View style={[styles.progressTrackFull, { backgroundColor: colors.muted }]}>
        <View
          style={[
            styles.progressFillFull,
            { width: `${pct}%` as any, backgroundColor: colors.primary },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={[styles.savedAmount, { color: colors.foreground }]}>
            ₹{goal.currentAmount.toLocaleString("en-IN")}
          </Text>
          <Text style={[styles.savedLabel, { color: colors.mutedForeground }]}>saved so far</Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={[styles.remaining, { color: colors.accent }]}>
            ₹{remaining.toLocaleString("en-IN")} to go
          </Text>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiLarge: { fontSize: 24 },
  headerInfo: { flex: 1 },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  target: { fontSize: 12, fontFamily: "Inter_400Regular" },
  pctBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pctText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  progressTrackFull: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFillFull: { height: "100%", borderRadius: 4 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  savedAmount: { fontSize: 17, fontFamily: "Inter_700Bold" },
  savedLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  footerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  remaining: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  // compact
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 8,
  },
  emoji: { fontSize: 20 },
  compactInfo: { flex: 1, gap: 4 },
  compactName: { fontSize: 13, fontFamily: "Inter_500Medium" },
  progressTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  compactPct: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
