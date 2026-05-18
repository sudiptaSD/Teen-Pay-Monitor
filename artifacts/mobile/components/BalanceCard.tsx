import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface BalanceCardProps {
  balance: number;
  upiId?: string;
  onPay?: () => void;
  onAdd?: () => void;
}

export function BalanceCard({ balance, upiId = "aarav@familypay", onPay, onAdd }: BalanceCardProps) {
  const colors = useColors();
  return (
    <LinearGradient
      colors={["#7B5CF0", "#6C47FF", "#5A35F0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.top}>
        <View>
          <Text style={styles.label}>Available Balance</Text>
          <Text style={styles.balance}>
            ₹{balance.toLocaleString("en-IN")}
          </Text>
        </View>
        <View style={styles.upiPill}>
          <Feather name="at-sign" size={12} color="rgba(255,255,255,0.8)" />
          <Text style={styles.upiText}>{upiId}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onPay} activeOpacity={0.8}>
          <View style={styles.actionIcon}>
            <Feather name="send" size={18} color="#6C47FF" />
          </View>
          <Text style={styles.actionLabel}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onAdd} activeOpacity={0.8}>
          <View style={styles.actionIcon}>
            <Feather name="plus" size={18} color="#6C47FF" />
          </View>
          <Text style={styles.actionLabel}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
          <View style={styles.actionIcon}>
            <Feather name="download" size={18} color="#6C47FF" />
          </View>
          <Text style={styles.actionLabel}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
          <View style={styles.actionIcon}>
            <Feather name="grid" size={18} color="#6C47FF" />
          </View>
          <Text style={styles.actionLabel}>QR Code</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  label: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
  },
  balance: {
    color: "#FFFFFF",
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  upiPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  upiText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    alignItems: "center",
    gap: 6,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
  },
});
