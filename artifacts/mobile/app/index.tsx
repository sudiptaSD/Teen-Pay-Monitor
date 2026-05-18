import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export default function RoleSelector() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <LinearGradient
      colors={["#F8F7FF", "#EDE8FF", "#F8F7FF"]}
      style={[styles.container, { paddingTop: topPad + 16, paddingBottom: bottomPad + 16 }]}
    >
      <View style={styles.hero}>
        <LinearGradient
          colors={["#7B5CF0", "#6C47FF"]}
          style={styles.logoRing}
        >
          <Feather name="trending-up" size={32} color="#FFFFFF" />
        </LinearGradient>
        <Text style={[styles.appName, { color: colors.foreground }]}>FamilyPay</Text>
        <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
          Smart money for teens.{"\n"}Peace of mind for parents.
        </Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.replace("/(tabs)/")}
        >
          <LinearGradient
            colors={["#7B5CF0", "#6C47FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardIconRing}>
              <Feather name="user" size={28} color="#6C47FF" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>I'm a Teen</Text>
              <Text style={styles.cardSubtitle}>Pay, save goals, track spending</Text>
            </View>
            <Feather name="arrow-right" size={20} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.replace("/(parent)/")}
        >
          <LinearGradient
            colors={["#2563EB", "#1D4ED8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardIconRingBlue}>
              <Feather name="shield" size={28} color="#2563EB" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>I'm a Parent</Text>
              <Text style={styles.cardSubtitle}>Monitor, fund, approve budgets</Text>
            </View>
            <Feather name="arrow-right" size={20} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={styles.badge}>
          <Feather name="shield" size={12} color={colors.mutedForeground} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            UPI-first · India · RBI compliant
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 32 },
  logoRing: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  tagline: { fontSize: 16, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 24 },
  cards: { paddingHorizontal: 20, gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 20,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardIconRing: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconRingBlue: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { flex: 1 },
  cardTitle: { color: "#FFFFFF", fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 2 },
  cardSubtitle: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontFamily: "Inter_400Regular" },
  footer: { alignItems: "center", paddingTop: 20 },
  badge: { flexDirection: "row", alignItems: "center", gap: 5 },
  footerText: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
