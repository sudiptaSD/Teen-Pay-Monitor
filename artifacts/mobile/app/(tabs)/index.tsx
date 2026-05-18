import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BalanceCard } from "@/components/BalanceCard";
import { GoalCard } from "@/components/GoalCard";
import { TransactionItem } from "@/components/TransactionItem";
import { WeeklyChallengeCard } from "@/components/WeeklyChallengeCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function TeenHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { balance, transactions, goals, saverStreak, budgetAdherenceScore, weeklyChallenge, budgetProposal } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const recent = transactions.filter((t) => t.status !== "blocked").slice(0, 3);
  const activeGoal = goals.find((g) => g.isActive);
  const pendingProposal = budgetProposal?.status === "approved";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good afternoon,</Text>
          <Text style={[styles.name, { color: colors.foreground }]}>Aarav 👋</Text>
        </View>
        <TouchableOpacity
          style={[styles.notifBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Feather name="bell" size={18} color={colors.foreground} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Budget approved banner */}
      {pendingProposal && (
        <TouchableOpacity
          style={[styles.banner, { backgroundColor: "#E6FBF5" }]}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/activity")}
        >
          <Feather name="check-circle" size={16} color="#00C48C" />
          <Text style={styles.bannerText}>Your budget proposal was approved by Dad!</Text>
        </TouchableOpacity>
      )}

      {/* Balance Card */}
      <BalanceCard
        balance={balance}
        onPay={() => router.push("/(tabs)/pay")}
        onAdd={() => {}}
      />

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: "#FFF0EB" }]}>
            <Feather name="zap" size={16} color="#FF6B35" />
          </View>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{saverStreak}w</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Saver Streak</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: "#F0ECFF" }]}>
            <Feather name="trending-up" size={16} color="#6C47FF" />
          </View>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{budgetAdherenceScore}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Budget Score</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <View style={[styles.statIcon, { backgroundColor: "#E6FBF5" }]}>
            <Feather name="credit-card" size={16} color="#00C48C" />
          </View>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            ₹{transactions.filter(t => t.date === "Today" && !t.isCredit).reduce((s, t) => s + t.amount, 0)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Spent Today</Text>
        </View>
      </View>

      {/* Weekly Challenge */}
      {weeklyChallenge && (
        <WeeklyChallengeCard challenge={weeklyChallenge} />
      )}

      {/* Active Goal */}
      {activeGoal && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Goal</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/goals")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <GoalCard goal={activeGoal} onPress={() => router.push("/(tabs)/goals")} />
        </View>
      )}

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/activity")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.transactionsCard, { backgroundColor: colors.card }]}>
          {recent.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { gap: 4 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  name: { fontSize: 22, fontFamily: "Inter_700Bold" },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4D6A",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bannerText: { color: "#00C48C", fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 9, fontFamily: "Inter_400Regular", textAlign: "center" },
  section: { paddingHorizontal: 16, marginTop: 6 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  transactionsCard: {
    borderRadius: 16,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
