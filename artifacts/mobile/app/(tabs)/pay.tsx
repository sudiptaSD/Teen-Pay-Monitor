import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SpendNudgeModal } from "@/components/SpendNudgeModal";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type PayState = "idle" | "nudge" | "success" | "blocked" | "error";

const QUICK_CONTACTS = [
  { name: "Rohan", upiId: "rohan.kumar@upi", initial: "R", color: "#6C47FF" },
  { name: "Zomato", upiId: "zomato@upi", initial: "Z", color: "#FF6B35" },
  { name: "Ola", upiId: "ola@upi", initial: "O", color: "#00C48C" },
  { name: "School", upiId: "canteen@upi", initial: "S", color: "#FFB020" },
];

export default function PayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { makePayment, balance, goals } = useApp();

  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [payState, setPayState] = useState<PayState>("idle");
  const [activeGoalName, setActiveGoalName] = useState("");
  const [pendingPayment, setPendingPayment] = useState<{ amount: number; merchant: string; upiId: string } | null>(null);
  const [blockedReason, setBlockedReason] = useState("");
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleQuickContact = (contact: typeof QUICK_CONTACTS[0]) => {
    setUpiId(contact.upiId);
  };

  const handlePay = () => {
    const amt = parseFloat(amount);
    if (!upiId.trim() || !amount || isNaN(amt) || amt <= 0) return;
    if (amt > balance) {
      setPayState("error");
      return;
    }

    const merchant = upiId.split("@")[0];
    const result = makePayment(amt, merchant, upiId);

    if (result.blocked) {
      setBlockedReason("This merchant is age-restricted and automatically blocked.");
      setPayState("blocked");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (result.nudged && result.goalName) {
      setPendingPayment({ amount: amt, merchant, upiId });
      setActiveGoalName(result.goalName);
      setPayState("nudge");
      return;
    }

    finishPayment();
  };

  const finishPayment = () => {
    setPayState("success");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.15, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      setPayState("idle");
      setUpiId("");
      setAmount("");
      setNote("");
      setPendingPayment(null);
    }, 2500);
  };

  const handleNudgeProceed = () => {
    if (pendingPayment) {
      makePayment(pendingPayment.amount, pendingPayment.merchant, pendingPayment.upiId);
    }
    setPayState("nudge");
    finishPayment();
  };

  const handleNudgeCancel = () => {
    setPayState("idle");
    setPendingPayment(null);
  };

  const isReady = upiId.trim().length > 3 && amount.length > 0 && parseFloat(amount) > 0;

  if (payState === "success") {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <LinearGradient colors={["#E6FBF5", "#FFFFFF"]} style={StyleSheet.absoluteFill} />
        <Animated.View style={[styles.successIcon, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={["#00C48C", "#00A876"]} style={styles.successCircle}>
            <Feather name="check" size={44} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Payment Sent!</Text>
        <Text style={[styles.successAmount, { color: "#00C48C" }]}>₹{parseFloat(amount).toLocaleString("en-IN")}</Text>
        <Text style={[styles.successTo, { color: colors.mutedForeground }]}>to {upiId}</Text>
      </View>
    );
  }

  if (payState === "blocked") {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={[styles.successCircle, { backgroundColor: "#FFE9ED" }]}>
          <Feather name="shield-off" size={44} color="#FF4D6A" />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Transaction Blocked</Text>
        <Text style={[styles.successTo, { color: colors.mutedForeground }]}>{blockedReason}</Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          onPress={() => setPayState("idle")}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (payState === "error") {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={[styles.successCircle, { backgroundColor: "#FFF8EB" }]}>
          <Feather name="alert-triangle" size={44} color="#FFB020" />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Insufficient Balance</Text>
        <Text style={[styles.successTo, { color: colors.mutedForeground }]}>
          Your balance is ₹{balance.toLocaleString("en-IN")}. Ask your parent to top up!
        </Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.primary }]}
          onPress={() => setPayState("idle")}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <SpendNudgeModal
        visible={payState === "nudge"}
        goalName={activeGoalName}
        amount={pendingPayment?.amount ?? 0}
        onProceed={handleNudgeProceed}
        onCancel={handleNudgeCancel}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>Send Money</Text>

        {/* Quick Contacts */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Quick Pay</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contacts}>
            {QUICK_CONTACTS.map((c) => (
              <TouchableOpacity
                key={c.upiId}
                style={styles.contactItem}
                onPress={() => handleQuickContact(c)}
                activeOpacity={0.8}
              >
                <View style={[styles.contactAvatar, { backgroundColor: c.color }]}>
                  <Text style={styles.contactInitial}>{c.initial}</Text>
                </View>
                <Text style={[styles.contactName, { color: colors.mutedForeground }]}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* UPI Input */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>UPI ID or Phone</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: upiId ? colors.primary : colors.border }]}>
            <Feather name="at-sign" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, { color: colors.foreground }]}
              placeholder="name@bank or 9876543210"
              placeholderTextColor={colors.mutedForeground}
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            {upiId.length > 0 && (
              <TouchableOpacity onPress={() => setUpiId("")}>
                <Feather name="x" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Amount</Text>
          <View style={[styles.amountContainer, { backgroundColor: colors.card, borderColor: amount ? colors.primary : colors.border }]}>
            <Text style={[styles.rupee, { color: amount ? colors.foreground : colors.mutedForeground }]}>₹</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.foreground }]}
              placeholder="0"
              placeholderTextColor={colors.mutedForeground}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
          {/* Quick amounts */}
          <View style={styles.quickAmounts}>
            {["50", "100", "200", "500"].map((a) => (
              <TouchableOpacity
                key={a}
                style={[styles.quickAmt, { backgroundColor: amount === a ? colors.primary : colors.secondary }]}
                onPress={() => setAmount(a)}
              >
                <Text style={[styles.quickAmtText, { color: amount === a ? "#FFFFFF" : colors.primary }]}>₹{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Note (optional)</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="edit-2" size={18} color={colors.mutedForeground} style={styles.inputIcon} />
            <TextInput
              style={[styles.textInput, { color: colors.foreground }]}
              placeholder="What's this for?"
              placeholderTextColor={colors.mutedForeground}
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>

        {/* Balance info */}
        <View style={[styles.balanceInfo, { backgroundColor: colors.secondary }]}>
          <Feather name="info" size={14} color={colors.primary} />
          <Text style={[styles.balanceInfoText, { color: colors.primary }]}>
            Available balance: ₹{balance.toLocaleString("en-IN")}
          </Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payBtn, { opacity: isReady ? 1 : 0.45 }]}
          onPress={handlePay}
          disabled={!isReady}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#7B5CF0", "#6C47FF"]}
            style={styles.payBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name="send" size={18} color="#FFFFFF" />
            <Text style={styles.payBtnText}>
              {amount ? `Pay ₹${parseFloat(amount || "0").toLocaleString("en-IN")}` : "Pay"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 4 },
  pageTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 8 },
  section: { marginBottom: 16 },
  sectionLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  contacts: { flexDirection: "row" },
  contactItem: { alignItems: "center", marginRight: 16, gap: 6 },
  contactAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  contactInitial: { color: "#FFFFFF", fontSize: 18, fontFamily: "Inter_700Bold" },
  contactName: { fontSize: 11, fontFamily: "Inter_400Regular" },
  label: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  inputIcon: {},
  textInput: { flex: 1, fontSize: 16, fontFamily: "Inter_400Regular" },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  rupee: { fontSize: 24, fontFamily: "Inter_700Bold" },
  amountInput: { flex: 1, fontSize: 32, fontFamily: "Inter_700Bold" },
  quickAmounts: { flexDirection: "row", gap: 8, marginTop: 10 },
  quickAmt: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  quickAmtText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  balanceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  balanceInfoText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  payBtn: { borderRadius: 16, overflow: "hidden", marginTop: 8 },
  payBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  payBtnText: { color: "#FFFFFF", fontSize: 17, fontFamily: "Inter_700Bold" },
  // Success/Error states
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  successIcon: {},
  successCircle: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginTop: 8 },
  successAmount: { fontSize: 36, fontFamily: "Inter_700Bold" },
  successTo: { fontSize: 15, fontFamily: "Inter_400Regular" },
  retryBtn: { marginTop: 16, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
  retryText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
