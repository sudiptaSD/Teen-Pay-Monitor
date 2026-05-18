import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { WeeklyChallenge } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface WeeklyChallengeCardProps {
  challenge: WeeklyChallenge;
}

export function WeeklyChallengeCard({ challenge }: WeeklyChallengeCardProps) {
  const colors = useColors();
  const pct = Math.min((challenge.currentAmount / challenge.targetAmount) * 100, 100);
  const remaining = challenge.targetAmount - challenge.currentAmount;
  const completed = challenge.currentAmount >= challenge.targetAmount;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: "#FFF0EB" }]}>
          <Feather name="zap" size={16} color="#FF6B35" />
        </View>
        <View style={styles.titleGroup}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Weekly Challenge</Text>
          <Text style={[styles.ends, { color: colors.mutedForeground }]}>Ends {challenge.endsAt}</Text>
        </View>
        {completed && (
          <View style={[styles.donePill, { backgroundColor: "#E6FBF5" }]}>
            <Feather name="check" size={12} color="#00C48C" />
            <Text style={styles.doneText}>Done!</Text>
          </View>
        )}
      </View>
      <Text style={[styles.description, { color: colors.foreground }]}>{challenge.description}</Text>
      <View style={[styles.track, { backgroundColor: colors.muted }]}>
        <View
          style={[
            styles.fill,
            { width: `${pct}%` as any, backgroundColor: completed ? "#00C48C" : "#FF6B35" },
          ]}
        />
      </View>
      <View style={styles.footer}>
        <Text style={[styles.spent, { color: colors.foreground }]}>
          ₹{challenge.currentAmount} spent
        </Text>
        <Text style={[styles.target, { color: colors.mutedForeground }]}>
          ₹{remaining > 0 ? remaining : 0} left under limit
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleGroup: { flex: 1 },
  label: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  ends: { fontSize: 11, fontFamily: "Inter_400Regular" },
  donePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  doneText: { color: "#00C48C", fontSize: 11, fontFamily: "Inter_700Bold" },
  description: { fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 10 },
  track: { height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  fill: { height: "100%", borderRadius: 3 },
  footer: { flexDirection: "row", justifyContent: "space-between" },
  spent: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  target: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
