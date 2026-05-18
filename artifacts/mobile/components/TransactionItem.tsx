import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Transaction } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CATEGORY_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
  Food: { icon: "coffee", bg: "#FFF0EB", color: "#FF6B35" },
  Transport: { icon: "navigation", bg: "#F0ECFF", color: "#6C47FF" },
  Entertainment: { icon: "tv", bg: "#E6FBF5", color: "#00C48C" },
  Shopping: { icon: "shopping-bag", bg: "#FFF8EB", color: "#FFB020" },
  Personal: { icon: "user", bg: "#F5F5F5", color: "#8A8A9A" },
  Received: { icon: "arrow-down-left", bg: "#E6FBF5", color: "#00C48C" },
  "Sin Good": { icon: "shield-off", bg: "#FFE9ED", color: "#FF4D6A" },
};

interface TransactionItemProps {
  transaction: Transaction;
  showDate?: boolean;
}

export function TransactionItem({ transaction: tx, showDate = true }: TransactionItemProps) {
  const colors = useColors();
  const meta = CATEGORY_ICONS[tx.category] || CATEGORY_ICONS["Personal"];
  const isBlocked = tx.status === "blocked";
  const isCredit = tx.isCredit;

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: meta.bg }]}>
        <Feather name={meta.icon as any} size={18} color={isBlocked ? "#FF4D6A" : meta.color} />
        {isBlocked && (
          <View style={styles.blockedBadge}>
            <Feather name="x" size={8} color="#FFFFFF" />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.merchant, { color: isBlocked ? "#FF4D6A" : colors.foreground }]}>
          {tx.merchant}
        </Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>
          {isBlocked ? "Blocked — " + tx.blockedReason : tx.tag ? tx.tag : tx.category}
          {showDate ? ` · ${tx.date}` : ""}
        </Text>
      </View>
      <View style={styles.right}>
        <Text
          style={[
            styles.amount,
            {
              color: isBlocked ? "#FF4D6A" : isCredit ? "#00C48C" : colors.foreground,
            },
          ]}
        >
          {isBlocked ? "—" : isCredit ? `+₹${tx.amount.toLocaleString("en-IN")}` : `-₹${tx.amount.toLocaleString("en-IN")}`}
        </Text>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>{tx.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  blockedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF4D6A",
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  merchant: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  meta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  right: { alignItems: "flex-end" },
  amount: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 2 },
  time: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
