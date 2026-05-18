import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AchievementBadge } from "@/components/AchievementBadge";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { achievements, budgetAdherenceScore, saverStreak, budgetProposal, submitBudgetProposal, budgetCategories } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const bronze = achievements.filter((a) => a.tier === "bronze");
  const silver = achievements.filter((a) => a.tier === "silver");
  const gold = achievements.filter((a) => a.tier === "gold");

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const hasPendingProposal = budgetProposal?.status === "pending";

  const handleSubmitBudget = () => {
    if (!hasPendingProposal) {
      const proposed = budgetCategories.map((c) => ({ ...c, proposed: c.approved + 100 }));
      submitBudgetProposal(proposed);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Card */}
      <LinearGradient colors={["#7B5CF0", "#6C47FF"]} style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <Text style={styles.profileName}>Aarav Sharma</Text>
        <Text style={styles.profileUpi}>aarav.sharma@familypay</Text>
        <View style={styles.profileStats}>
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>{saverStreak}w</Text>
            <Text style={styles.profileStatLabel}>Saver Streak</Text>
          </View>
          <View style={styles.profileStatDivider} />
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>{budgetAdherenceScore}</Text>
            <Text style={styles.profileStatLabel}>Budget Score</Text>
          </View>
          <View style={styles.profileStatDivider} />
          <View style={styles.profileStat}>
            <Text style={styles.profileStatValue}>{unlockedCount}/{achievements.length}</Text>
            <Text style={styles.profileStatLabel}>Badges</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Budget Score Gauge */}
      <View style={[styles.scoreCard, { backgroundColor: colors.card }]}>
        <View style={styles.scoreHeader}>
          <View>
            <Text style={[styles.scoreTitle, { color: colors.foreground }]}>Budget Adherence Score</Text>
            <Text style={[styles.scoreSubtitle, { color: colors.mutedForeground }]}>May 2025</Text>
          </View>
          <View style={[styles.scoreBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.scoreNum, { color: colors.primary }]}>{budgetAdherenceScore}</Text>
          </View>
        </View>
        <View style={[styles.scoreTrack, { backgroundColor: colors.muted }]}>
          <LinearGradient
            colors={["#6C47FF", "#00C48C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.scoreFill, { width: `${budgetAdherenceScore}%` as any }]}
          />
        </View>
        <Text style={[styles.scoreCaption, { color: colors.mutedForeground }]}>
          Great job! You're staying within your approved budgets most of the time.
        </Text>
      </View>

      {/* Budget Proposal */}
      <View style={[styles.proposalCard, { backgroundColor: colors.card, borderColor: hasPendingProposal ? "#FFB020" : colors.border }]}>
        <View style={styles.proposalHeader}>
          <View style={[styles.proposalIcon, { backgroundColor: hasPendingProposal ? "#FFF8EB" : colors.secondary }]}>
            <Feather name="sliders" size={18} color={hasPendingProposal ? "#FFB020" : colors.primary} />
          </View>
          <View style={styles.proposalText}>
            <Text style={[styles.proposalTitle, { color: colors.foreground }]}>Budget Proposal</Text>
            <Text style={[styles.proposalSub, { color: colors.mutedForeground }]}>
              {hasPendingProposal ? "Awaiting parent approval" : "Suggest a new budget to Dad"}
            </Text>
          </View>
          {hasPendingProposal ? (
            <View style={[styles.pendingPill, { backgroundColor: "#FFF8EB" }]}>
              <Text style={styles.pendingText}>Pending</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.proposeBtn, { backgroundColor: colors.primary }]}
              onPress={handleSubmitBudget}
              activeOpacity={0.85}
            >
              <Text style={styles.proposeBtnText}>Propose</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Achievements</Text>

        <Text style={[styles.tierLabel, { color: "#C8751A" }]}>Bronze</Text>
        <View style={styles.badgesGrid}>
          {bronze.map((a) => <AchievementBadge key={a.id} achievement={a} />)}
        </View>

        <Text style={[styles.tierLabel, { color: "#5A5A5A" }]}>Silver</Text>
        <View style={styles.badgesGrid}>
          {silver.map((a) => <AchievementBadge key={a.id} achievement={a} />)}
        </View>

        <Text style={[styles.tierLabel, { color: "#B8860B" }]}>Gold</Text>
        <View style={styles.badgesGrid}>
          {gold.map((a) => <AchievementBadge key={a.id} achievement={a} />)}
        </View>
      </View>

      {/* Switch Role */}
      <TouchableOpacity
        style={[styles.switchBtn, { backgroundColor: colors.muted }]}
        onPress={() => router.replace("/")}
        activeOpacity={0.8}
      >
        <Feather name="repeat" size={16} color={colors.mutedForeground} />
        <Text style={[styles.switchText, { color: colors.mutedForeground }]}>Switch to Parent View</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  profileCard: { borderRadius: 20, padding: 24, alignItems: "center", gap: 6 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  avatarText: { color: "#FFFFFF", fontSize: 28, fontFamily: "Inter_700Bold" },
  profileName: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_700Bold" },
  profileUpi: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "Inter_400Regular" },
  profileStats: { flexDirection: "row", marginTop: 12, gap: 0 },
  profileStat: { flex: 1, alignItems: "center", gap: 3 },
  profileStatValue: { color: "#FFFFFF", fontSize: 18, fontFamily: "Inter_700Bold" },
  profileStatLabel: { color: "rgba(255,255,255,0.7)", fontSize: 10, fontFamily: "Inter_400Regular" },
  profileStatDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)", marginHorizontal: 4 },
  scoreCard: { borderRadius: 16, padding: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 10 },
  scoreHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  scoreTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  scoreSubtitle: { fontSize: 12, fontFamily: "Inter_400Regular" },
  scoreBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  scoreNum: { fontSize: 22, fontFamily: "Inter_700Bold" },
  scoreTrack: { height: 10, borderRadius: 5, overflow: "hidden" },
  scoreFill: { height: "100%", borderRadius: 5 },
  scoreCaption: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  proposalCard: { borderRadius: 14, padding: 14, borderWidth: 1.5, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  proposalHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  proposalIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  proposalText: { flex: 1 },
  proposalTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  proposalSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  pendingPill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  pendingText: { color: "#FFB020", fontSize: 11, fontFamily: "Inter_700Bold" },
  proposeBtn: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  proposeBtnText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  section: { marginTop: 4 },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 12 },
  tierLabel: { fontSize: 12, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8, marginTop: 4 },
  badgesGrid: { flexDirection: "row", flexWrap: "wrap", gap: "6%" as any, marginBottom: 8 },
  switchBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 14, marginTop: 8 },
  switchText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
