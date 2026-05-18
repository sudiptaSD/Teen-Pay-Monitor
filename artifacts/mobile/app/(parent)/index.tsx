import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TransactionItem } from "@/components/TransactionItem";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ParentDashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { balance, transactions, budgetAdherenceScore, saverStreak, budgetProposal, addFunds } = useApp();
  const [showFund, setShowFund] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const recent = transactions.slice(0, 4);
  const blockedCount = transactions.filter((t) => t.status === "blocked").length;
  const totalSpentThisMonth = transactions
    .filter((t) => !t.isCredit && t.status === "completed")
    .reduce((s, t) => s + t.amount, 0);

  const hasPendingBudget = budgetProposal?.status === "pending";

  const handleFund = () => {
    const amt = parseFloat(fundAmount);
    if (!isNaN(amt) && amt > 0) {
      addFunds(amt);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowFund(false);
      setFundAmount("");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#F0F4FF" }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: "#4A5568" }]}>Monitoring</Text>
            <Text style={[styles.name, { color: "#1A202C" }]}>Aarav's Account</Text>
          </View>
          <View style={[styles.parentBadge, { backgroundColor: "#EFF6FF" }]}>
            <Feather name="shield" size={14} color="#2563EB" />
            <Text style={styles.parentBadgeText}>Parent</Text>
          </View>
        </View>

        {/* Strictness Nudge */}
        <View style={[styles.nudgeCard, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}>
          <View style={styles.nudgeLeft}>
            <View style={[styles.nudgeIcon, { backgroundColor: "#DBEAFE" }]}>
              <Feather name="trending-up" size={18} color="#2563EB" />
            </View>
            <View style={styles.nudgeText}>
              <Text style={[styles.nudgeTitle, { color: "#1E40AF" }]}>
                Aarav has stayed within budget 4 weeks in a row
              </Text>
              <Text style={[styles.nudgeSub, { color: "#3B82F6" }]}>
                He might be ready for a little more independence.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.nudgeBtn, { backgroundColor: "#2563EB" }]}
            onPress={() => router.push("/(parent)/budget")}
            activeOpacity={0.8}
          >
            <Text style={styles.nudgeBtnText}>Review</Text>
          </TouchableOpacity>
        </View>

        {/* Teen Balance Card */}
        <LinearGradient colors={["#2563EB", "#1D4ED8"]} style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Aarav's Balance</Text>
              <Text style={styles.balanceAmount}>₹{balance.toLocaleString("en-IN")}</Text>
            </View>
            <TouchableOpacity
              style={styles.fundBtn}
              onPress={() => setShowFund(true)}
              activeOpacity={0.85}
            >
              <Feather name="plus" size={16} color="#2563EB" />
              <Text style={styles.fundBtnText}>Add Funds</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.balanceStats}>
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatVal}>₹{totalSpentThisMonth.toLocaleString("en-IN")}</Text>
              <Text style={styles.balanceStatLabel}>Spent this month</Text>
            </View>
            <View style={styles.balanceStatDivider} />
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatVal}>{saverStreak} weeks</Text>
              <Text style={styles.balanceStatLabel}>Saver streak</Text>
            </View>
            <View style={styles.balanceStatDivider} />
            <View style={styles.balanceStat}>
              <Text style={styles.balanceStatVal}>{budgetAdherenceScore}/100</Text>
              <Text style={styles.balanceStatLabel}>Budget score</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: "#FFFFFF", borderColor: hasPendingBudget ? "#FCD34D" : colors.border }]}
            onPress={() => router.push("/(parent)/budget")}
            activeOpacity={0.85}
          >
            <View style={[styles.statIcon, { backgroundColor: hasPendingBudget ? "#FFF8EB" : "#EFF6FF" }]}>
              <Feather name="sliders" size={20} color={hasPendingBudget ? "#FFB020" : "#2563EB"} />
            </View>
            <Text style={[styles.statLabel, { color: "#1A202C" }]}>
              {hasPendingBudget ? "Budget Pending" : "Budget"}
            </Text>
            <Text style={[styles.statSub, { color: hasPendingBudget ? "#FFB020" : "#4A5568" }]}>
              {hasPendingBudget ? "Needs your review" : "Approved"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: "#FFFFFF", borderColor: blockedCount > 0 ? "#FCA5A5" : colors.border }]}
            onPress={() => router.push("/(parent)/reports")}
            activeOpacity={0.85}
          >
            <View style={[styles.statIcon, { backgroundColor: blockedCount > 0 ? "#FFE9ED" : "#F5F5F5" }]}>
              <Feather name="shield-off" size={20} color={blockedCount > 0 ? "#FF4D6A" : "#8A8A9A"} />
            </View>
            <Text style={[styles.statLabel, { color: "#1A202C" }]}>Blocked</Text>
            <Text style={[styles.statSub, { color: blockedCount > 0 ? "#FF4D6A" : "#4A5568" }]}>
              {blockedCount} transaction{blockedCount !== 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: "#1A202C" }]}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push("/(parent)/activity")}>
              <Text style={[styles.seeAll, { color: "#2563EB" }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.txCard, { backgroundColor: "#FFFFFF" }]}>
            {recent.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fund Modal */}
      <Modal visible={showFund} transparent animationType="slide" statusBarTranslucent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => { setShowFund(false); setFundAmount(""); }} />
          <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Add Funds to Aarav's Account</Text>
            <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
              Funds will be sent via your UPI to Aarav's FamilyPay wallet instantly.
            </Text>
            <View style={[styles.amountRow, { backgroundColor: colors.muted }]}>
              <Text style={[styles.rupee, { color: colors.foreground }]}>₹</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.foreground }]}
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
                value={fundAmount}
                onChangeText={setFundAmount}
                keyboardType="numeric"
                autoFocus
              />
            </View>
            <View style={styles.quickFunds}>
              {["500", "1000", "1500", "2000"].map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.quickAmt, { backgroundColor: fundAmount === a ? "#2563EB" : "#EFF6FF" }]}
                  onPress={() => setFundAmount(a)}
                >
                  <Text style={[styles.quickAmtText, { color: fundAmount === a ? "#FFFFFF" : "#2563EB" }]}>
                    ₹{a}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: colors.muted }]}
                onPress={() => { setShowFund(false); setFundAmount(""); }}
              >
                <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: "#2563EB", opacity: fundAmount ? 1 : 0.45 }]}
                onPress={handleFund}
                disabled={!fundAmount}
              >
                <Feather name="send" size={16} color="#FFFFFF" />
                <Text style={styles.sendText}>Send Money</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  name: { fontSize: 22, fontFamily: "Inter_700Bold" },
  parentBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  parentBadgeText: { color: "#2563EB", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  nudgeCard: { borderRadius: 14, padding: 14, borderWidth: 1.5, gap: 10 },
  nudgeLeft: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  nudgeIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  nudgeText: { flex: 1 },
  nudgeTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", lineHeight: 18 },
  nudgeSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  nudgeBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignSelf: "flex-start", marginLeft: 46 },
  nudgeBtnText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  balanceCard: { borderRadius: 20, padding: 20 },
  balanceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  balanceLabel: { color: "rgba(255,255,255,0.75)", fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 4 },
  balanceAmount: { color: "#FFFFFF", fontSize: 34, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  fundBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#FFFFFF", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  fundBtnText: { color: "#2563EB", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  balanceStats: { flexDirection: "row" },
  balanceStat: { flex: 1, alignItems: "center" },
  balanceStatVal: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_700Bold" },
  balanceStatLabel: { color: "rgba(255,255,255,0.7)", fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 2 },
  balanceStatDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)" },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, borderRadius: 14, padding: 14, borderWidth: 1, gap: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  statLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  statSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  section: {},
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  txCard: { borderRadius: 16, paddingHorizontal: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalDismiss: { flex: 1 },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, gap: 14 },
  modalHandle: { width: 36, height: 4, backgroundColor: "#E0E0E0", borderRadius: 2, alignSelf: "center" },
  modalTitle: { fontSize: 19, fontFamily: "Inter_700Bold" },
  modalSub: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  amountRow: { flexDirection: "row", alignItems: "center", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, gap: 4 },
  rupee: { fontSize: 24, fontFamily: "Inter_700Bold" },
  amountInput: { flex: 1, fontSize: 32, fontFamily: "Inter_700Bold" },
  quickFunds: { flexDirection: "row", gap: 8 },
  quickAmt: { flex: 1, borderRadius: 10, paddingVertical: 9, alignItems: "center" },
  quickAmtText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  modalActions: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  cancelText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  sendBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, paddingVertical: 14 },
  sendText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_700Bold" },
});
