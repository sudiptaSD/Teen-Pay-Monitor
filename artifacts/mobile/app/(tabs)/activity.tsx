import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryBar } from "@/components/CategoryBar";
import { DonutChart } from "@/components/DonutChart";
import { TransactionItem } from "@/components/TransactionItem";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type Filter = "All" | "Food" | "Transport" | "Entertainment" | "Shopping";
const FILTERS: Filter[] = ["All", "Food", "Transport", "Entertainment", "Shopping"];

export default function ActivityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions, budgetCategories } = useApp();
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [view, setView] = useState<"chart" | "list">("chart");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered =
    activeFilter === "All"
      ? transactions
      : transactions.filter((t) => t.category === activeFilter);

  const totalSpent = budgetCategories.reduce((s, c) => s + c.spent, 0);

  const chartSegments = budgetCategories.map((c) => ({
    label: c.name,
    value: c.spent,
    color: c.color,
    emoji: c.emoji,
  }));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Activity</Text>
        <View style={[styles.viewToggle, { backgroundColor: colors.muted }]}>
          <TouchableOpacity
            style={[styles.toggleBtn, view === "chart" && { backgroundColor: colors.card }]}
            onPress={() => setView("chart")}
          >
            <Feather name="pie-chart" size={16} color={view === "chart" ? colors.primary : colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, view === "list" && { backgroundColor: colors.card }]}
            onPress={() => setView("list")}
          >
            <Feather name="list" size={16} color={view === "list" ? colors.primary : colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {view === "chart" ? (
        <>
          {/* Expense Chart */}
          <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>This Month</Text>
            <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>May 2025</Text>
            <View style={styles.donut}>
              <DonutChart
                segments={chartSegments}
                size={180}
                strokeWidth={26}
                centerValue={`₹${totalSpent.toLocaleString("en-IN")}`}
                centerLabel="spent"
              />
            </View>
          </View>

          {/* Budget Bars */}
          <View style={[styles.budgetCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Budget vs Spent</Text>
            <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>Approved monthly limits</Text>
            <View style={styles.bars}>
              {budgetCategories.map((c) => (
                <CategoryBar key={c.name} category={c} />
              ))}
            </View>
          </View>
        </>
      ) : (
        <>
          {/* Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: activeFilter === f ? colors.primary : colors.muted,
                    marginRight: 8,
                  },
                ]}
                onPress={() => setActiveFilter(f)}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: activeFilter === f ? "#FFFFFF" : colors.mutedForeground },
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Transaction List */}
          <View style={[styles.txCard, { backgroundColor: colors.card }]}>
            {filtered.length === 0 ? (
              <View style={styles.emptyList}>
                <Feather name="inbox" size={32} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No transactions</Text>
              </View>
            ) : (
              filtered.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
            )}
          </View>
        </>
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
  chartCard: { borderRadius: 16, padding: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  cardSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 16 },
  donut: { alignItems: "center", marginVertical: 8 },
  budgetCard: { borderRadius: 16, padding: 18, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  bars: { marginTop: 8 },
  filters: { marginBottom: 4 },
  filterPill: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  filterText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  txCard: { borderRadius: 16, paddingHorizontal: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  emptyList: { alignItems: "center", paddingVertical: 32, gap: 8 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
