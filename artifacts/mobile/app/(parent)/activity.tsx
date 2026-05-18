import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryBar } from "@/components/CategoryBar";
import { DonutChart } from "@/components/DonutChart";
import { TransactionItem } from "@/components/TransactionItem";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ParentActivity() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions, budgetCategories } = useApp();
  const [view, setView] = useState<"chart" | "list">("chart");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const totalSpent = budgetCategories.reduce((s, c) => s + c.spent, 0);
  const totalBudget = budgetCategories.reduce((s, c) => s + c.approved, 0);

  const chartSegments = budgetCategories.map((c) => ({
    label: c.name,
    value: c.spent,
    color: c.color,
    emoji: c.emoji,
  }));

  const blockedTx = transactions.filter((t) => t.status === "blocked");

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "#F0F4FF" }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: "#1A202C" }]}>Aarav's Activity</Text>
        <View style={[styles.viewToggle, { backgroundColor: "#DBEAFE" }]}>
          <TouchableOpacity
            style={[styles.toggleBtn, view === "chart" && { backgroundColor: "#FFFFFF" }]}
            onPress={() => setView("chart")}
          >
            <Feather name="pie-chart" size={16} color={view === "chart" ? "#2563EB" : "#93C5FD"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, view === "list" && { backgroundColor: "#FFFFFF" }]}
            onPress={() => setView("list")}
          >
            <Feather name="list" size={16} color={view === "list" ? "#2563EB" : "#93C5FD"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: "#FFFFFF" }]}>
          <Text style={[styles.summaryVal, { color: "#1A202C" }]}>₹{totalSpent.toLocaleString("en-IN")}</Text>
          <Text style={[styles.summaryLabel, { color: "#4A5568" }]}>Total Spent</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#FFFFFF" }]}>
          <Text style={[styles.summaryVal, { color: "#2563EB" }]}>₹{totalBudget.toLocaleString("en-IN")}</Text>
          <Text style={[styles.summaryLabel, { color: "#4A5568" }]}>Monthly Budget</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: "#FFFFFF" }]}>
          <Text style={[styles.summaryVal, { color: "#00C48C" }]}>
            {Math.round((totalSpent / totalBudget) * 100)}%
          </Text>
          <Text style={[styles.summaryLabel, { color: "#4A5568" }]}>Used</Text>
        </View>
      </View>

      {view === "chart" ? (
        <>
          {/* Expense Breakdown */}
          <View style={[styles.card, { backgroundColor: "#FFFFFF" }]}>
            <Text style={[styles.cardTitle, { color: "#1A202C" }]}>Spending Breakdown</Text>
            <Text style={[styles.cardSub, { color: "#4A5568" }]}>May 2025 · By Category</Text>
            <View style={styles.donut}>
              <DonutChart
                segments={chartSegments}
                size={180}
                strokeWidth={26}
                centerValue={`₹${totalSpent.toLocaleString("en-IN")}`}
                centerLabel="total spent"
              />
            </View>
          </View>

          {/* Budget vs Spent */}
          <View style={[styles.card, { backgroundColor: "#FFFFFF" }]}>
            <Text style={[styles.cardTitle, { color: "#1A202C" }]}>Budget vs Spent</Text>
            <Text style={[styles.cardSub, { color: "#4A5568" }]}>Per category progress</Text>
            <View style={styles.bars}>
              {budgetCategories.map((c) => (
                <CategoryBar key={c.name} category={c} />
              ))}
            </View>
          </View>

          {/* Blocked Summary */}
          {blockedTx.length > 0 && (
            <View style={[styles.blockedCard, { backgroundColor: "#FFE9ED", borderColor: "#FCA5A5" }]}>
              <View style={styles.blockedHeader}>
                <Feather name="shield-off" size={18} color="#FF4D6A" />
                <Text style={[styles.blockedTitle, { color: "#B91C1C" }]}>
                  {blockedTx.length} blocked transaction{blockedTx.length !== 1 ? "s" : ""}
                </Text>
              </View>
              <Text style={[styles.blockedSub, { color: "#DC2626" }]}>
                Age-restricted merchant payments automatically blocked
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={[styles.txCard, { backgroundColor: "#FFFFFF" }]}>
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  viewToggle: { flexDirection: "row", borderRadius: 10, padding: 3, gap: 2 },
  toggleBtn: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  summaryRow: { flexDirection: "row", gap: 8 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 12, alignItems: "center", gap: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  summaryVal: { fontSize: 15, fontFamily: "Inter_700Bold" },
  summaryLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  card: { borderRadius: 16, padding: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  cardSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 16 },
  donut: { alignItems: "center", marginVertical: 8 },
  bars: { marginTop: 8 },
  blockedCard: { borderRadius: 14, padding: 14, borderWidth: 1.5, gap: 6 },
  blockedHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  blockedTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  blockedSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  txCard: { borderRadius: 16, paddingHorizontal: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
});
