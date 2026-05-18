import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TransactionItem } from "@/components/TransactionItem";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ParentReports() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions, budgetCategories, budgetAdherenceScore, saverStreak } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const blocked = transactions.filter((t) => t.status === "blocked");
  const totalSpent = transactions
    .filter((t) => !t.isCredit && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);
  const totalReceived = transactions
    .filter((t) => t.isCredit)
    .reduce((s, t) => s + t.amount, 0);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "#F0F4FF" }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: "#1A202C" }]}>Weekly Report</Text>
        <TouchableOpacity style={[styles.downloadBtn, { backgroundColor: "#EFF6FF" }]}>
          <Feather name="download" size={16} color="#2563EB" />
          <Text style={[styles.downloadText, { color: "#2563EB" }]}>Export PDF</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.period, { color: "#4A5568" }]}>May 11 – May 17, 2025</Text>

      {/* Score Card */}
      <LinearGradient colors={["#2563EB", "#1D4ED8"]} style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreVal}>{budgetAdherenceScore}</Text>
            <Text style={styles.scoreLabel}>Budget Score</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Text style={styles.scoreVal}>{saverStreak}w</Text>
            <Text style={styles.scoreLabel}>Saver Streak</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Text style={styles.scoreVal}>{blocked.length}</Text>
            <Text style={styles.scoreLabel}>Blocks</Text>
          </View>
        </View>
        <View style={[styles.streakBanner, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
          <Feather name="award" size={16} color="#FFFFFF" />
          <Text style={styles.streakBannerText}>
            Aarav has maintained budget discipline for {saverStreak} consecutive weeks!
          </Text>
        </View>
      </LinearGradient>

      {/* Summary Stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: "#FFFFFF" }]}>
          <Feather name="arrow-up-right" size={18} color="#FF4D6A" />
          <Text style={[styles.statVal, { color: "#1A202C" }]}>₹{totalSpent.toLocaleString("en-IN")}</Text>
          <Text style={[styles.statLabel, { color: "#4A5568" }]}>Total Spent</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#FFFFFF" }]}>
          <Feather name="arrow-down-left" size={18} color="#00C48C" />
          <Text style={[styles.statVal, { color: "#1A202C" }]}>₹{totalReceived.toLocaleString("en-IN")}</Text>
          <Text style={[styles.statLabel, { color: "#4A5568" }]}>Funds Sent</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#FFFFFF" }]}>
          <Feather name="shopping-bag" size={18} color="#FFB020" />
          <Text style={[styles.statVal, { color: "#1A202C" }]}>{transactions.filter(t => t.status === "completed").length}</Text>
          <Text style={[styles.statLabel, { color: "#4A5568" }]}>Transactions</Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={[styles.card, { backgroundColor: "#FFFFFF" }]}>
        <Text style={[styles.cardTitle, { color: "#1A202C" }]}>Spending by Category</Text>
        {budgetCategories.map((c) => {
          const pct = Math.round((c.spent / (totalSpent || 1)) * 100);
          return (
            <View key={c.name} style={styles.catRow}>
              <Text style={styles.catEmoji}>{c.emoji}</Text>
              <View style={styles.catInfo}>
                <View style={styles.catTop}>
                  <Text style={[styles.catName, { color: "#1A202C" }]}>{c.name}</Text>
                  <Text style={[styles.catAmt, { color: "#1A202C" }]}>₹{c.spent.toLocaleString("en-IN")}</Text>
                </View>
                <View style={[styles.catTrack, { backgroundColor: "#EFF6FF" }]}>
                  <View style={[styles.catFill, { width: `${pct}%` as any, backgroundColor: c.color }]} />
                </View>
              </View>
              <Text style={[styles.catPct, { color: "#4A5568" }]}>{pct}%</Text>
            </View>
          );
        })}
      </View>

      {/* Blocked Transactions */}
      {blocked.length > 0 && (
        <View style={[styles.card, { backgroundColor: "#FFFFFF" }]}>
          <View style={styles.blockedHeader}>
            <View style={[styles.blockedIcon, { backgroundColor: "#FFE9ED" }]}>
              <Feather name="shield-off" size={18} color="#FF4D6A" />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: "#1A202C" }]}>Blocked Transactions</Text>
              <Text style={[styles.cardSub, { color: "#4A5568" }]}>Age-restricted payments prevented</Text>
            </View>
          </View>
          {blocked.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </View>
      )}

      {/* Parent Insights */}
      <View style={[styles.insightCard, { backgroundColor: "#F0FDF4", borderColor: "#86EFAC" }]}>
        <Feather name="info" size={16} color="#16A34A" />
        <Text style={[styles.insightText, { color: "#15803D" }]}>
          Aarav spent 63% of his food budget and stayed within Entertainment limits.
          His Budget Adherence Score of {budgetAdherenceScore} puts him in the top 20% of teens.
        </Text>
      </View>

      {/* Switch Role */}
      <TouchableOpacity
        style={[styles.switchBtn, { backgroundColor: "#DBEAFE" }]}
        onPress={() => router.replace("/")}
        activeOpacity={0.8}
      >
        <Feather name="repeat" size={16} color="#2563EB" />
        <Text style={[styles.switchText, { color: "#2563EB" }]}>Switch to Teen View</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  downloadBtn: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  downloadText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  period: { fontSize: 13, fontFamily: "Inter_400Regular" },
  scoreCard: { borderRadius: 20, padding: 20, gap: 14 },
  scoreRow: { flexDirection: "row", justifyContent: "space-around" },
  scoreItem: { alignItems: "center", gap: 4 },
  scoreVal: { color: "#FFFFFF", fontSize: 24, fontFamily: "Inter_700Bold" },
  scoreLabel: { color: "rgba(255,255,255,0.75)", fontSize: 11, fontFamily: "Inter_400Regular" },
  scoreDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  streakBanner: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderRadius: 10, padding: 10 },
  streakBannerText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 18 },
  statsGrid: { flexDirection: "row", gap: 8 },
  statCard: { flex: 1, borderRadius: 12, padding: 12, alignItems: "center", gap: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  statVal: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  card: { borderRadius: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 12 },
  cardTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  cardSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  catRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  catEmoji: { fontSize: 18 },
  catInfo: { flex: 1, gap: 4 },
  catTop: { flexDirection: "row", justifyContent: "space-between" },
  catName: { fontSize: 13, fontFamily: "Inter_500Medium" },
  catAmt: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  catTrack: { height: 5, borderRadius: 3, overflow: "hidden" },
  catFill: { height: "100%", borderRadius: 3 },
  catPct: { fontSize: 12, fontFamily: "Inter_400Regular", width: 32, textAlign: "right" },
  blockedHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  blockedIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  insightCard: { borderRadius: 14, borderWidth: 1.5, padding: 14, flexDirection: "row", alignItems: "flex-start", gap: 8 },
  insightText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  switchBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 14 },
  switchText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
