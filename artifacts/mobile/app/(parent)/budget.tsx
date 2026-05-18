import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BudgetCategory } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ParentBudget() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { budgetProposal, budgetCategories, approveBudget, rejectBudget } = useApp();
  const [editedCategories, setEditedCategories] = useState<BudgetCategory[]>([]);
  const [parentNote, setParentNote] = useState("");
  const [approved, setApproved] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (budgetProposal) {
      setEditedCategories(budgetProposal.categories.map((c) => ({ ...c })));
    } else {
      setEditedCategories(budgetCategories.map((c) => ({ ...c })));
    }
  }, [budgetProposal, budgetCategories]);

  const updateAmount = (index: number, value: string) => {
    const num = parseFloat(value) || 0;
    setEditedCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, proposed: num } : c))
    );
  };

  const handleApprove = () => {
    approveBudget(editedCategories, parentNote || undefined);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setApproved(true);
  };

  const handleSendBack = () => {
    if (!parentNote.trim()) {
      Alert.alert("Add a note", "Please add a note for Aarav explaining your decision.");
      return;
    }
    rejectBudget(parentNote);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setApproved(false);
  };

  const isPending = budgetProposal?.status === "pending";
  const totalProposed = editedCategories.reduce((s, c) => s + c.proposed, 0);
  const totalCurrent = editedCategories.reduce((s, c) => s + c.approved, 0);

  if (approved || budgetProposal?.status === "approved") {
    return (
      <View style={[styles.container, { backgroundColor: "#F0F4FF", paddingTop: topPad + 32 }]}>
        <View style={styles.approvedState}>
          <View style={[styles.approvedIcon, { backgroundColor: "#E6FBF5" }]}>
            <Feather name="check-circle" size={48} color="#00C48C" />
          </View>
          <Text style={[styles.approvedTitle, { color: "#1A202C" }]}>Budget Approved!</Text>
          <Text style={[styles.approvedSub, { color: "#4A5568" }]}>
            Aarav has been notified. The new budget takes effect immediately.
          </Text>
          <View style={styles.approvedDetails}>
            {editedCategories.map((c) => (
              <View key={c.name} style={[styles.approvedRow, { borderBottomColor: "#E2E8F0" }]}>
                <Text style={styles.approvedEmoji}>{c.emoji}</Text>
                <Text style={[styles.approvedCat, { color: "#1A202C" }]}>{c.name}</Text>
                <Text style={[styles.approvedAmt, { color: "#2563EB" }]}>
                  ₹{c.proposed.toLocaleString("en-IN")}/month
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "#F0F4FF" }]}
      contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: "#1A202C" }]}>Budget Review</Text>
      <Text style={[styles.subtitle, { color: "#4A5568" }]}>
        {isPending ? "Aarav submitted a budget proposal for your review" : "Current approved budget"}
      </Text>

      {/* Proposal Status Banner */}
      {isPending && (
        <View style={[styles.pendingBanner, { backgroundColor: "#FFF8EB", borderColor: "#FCD34D" }]}>
          <Feather name="clock" size={16} color="#FFB020" />
          <Text style={[styles.pendingText, { color: "#92400E" }]}>
            Submitted on {budgetProposal?.createdAt} · Awaiting your response
          </Text>
        </View>
      )}

      {/* Total Summary */}
      <View style={[styles.summaryCard, { backgroundColor: "#FFFFFF" }]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryAmt, { color: "#1A202C" }]}>₹{totalCurrent.toLocaleString("en-IN")}</Text>
            <Text style={[styles.summaryLabel, { color: "#4A5568" }]}>Current Budget</Text>
          </View>
          <Feather name="arrow-right" size={20} color="#93C5FD" />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryAmt, { color: "#2563EB" }]}>₹{totalProposed.toLocaleString("en-IN")}</Text>
            <Text style={[styles.summaryLabel, { color: "#4A5568" }]}>Proposed Total</Text>
          </View>
        </View>
        {totalProposed > totalCurrent && (
          <View style={[styles.diffBadge, { backgroundColor: "#EFF6FF" }]}>
            <Feather name="trending-up" size={13} color="#2563EB" />
            <Text style={[styles.diffText, { color: "#2563EB" }]}>
              +₹{(totalProposed - totalCurrent).toLocaleString("en-IN")}/month increase
            </Text>
          </View>
        )}
      </View>

      {/* Category Cards */}
      <Text style={[styles.sectionTitle, { color: "#1A202C" }]}>Categories</Text>
      {editedCategories.map((cat, idx) => {
        const increase = cat.proposed - cat.approved;
        return (
          <View key={cat.name} style={[styles.catCard, { backgroundColor: "#FFFFFF" }]}>
            <View style={styles.catHeader}>
              <View style={styles.catLeft}>
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <View>
                  <Text style={[styles.catName, { color: "#1A202C" }]}>{cat.name}</Text>
                  <Text style={[styles.catSpent, { color: "#4A5568" }]}>
                    ₹{cat.spent.toLocaleString("en-IN")} spent · ₹{cat.approved.toLocaleString("en-IN")} current
                  </Text>
                </View>
              </View>
              {increase > 0 && (
                <View style={[styles.increasePill, { backgroundColor: "#EFF6FF" }]}>
                  <Text style={[styles.increaseText, { color: "#2563EB" }]}>+₹{increase}</Text>
                </View>
              )}
            </View>
            <View style={styles.editRow}>
              <Text style={[styles.editLabel, { color: "#4A5568" }]}>New monthly limit</Text>
              <View style={[styles.editInput, { backgroundColor: "#F8FAFF", borderColor: "#BFDBFE" }]}>
                <Text style={[styles.editRupee, { color: "#1A202C" }]}>₹</Text>
                <TextInput
                  style={[styles.editTextInput, { color: "#1A202C" }]}
                  value={cat.proposed.toString()}
                  onChangeText={(v) => updateAmount(idx, v)}
                  keyboardType="numeric"
                  editable={isPending}
                />
              </View>
            </View>
            {/* Progress bar: spent vs proposed */}
            <View style={[styles.progressTrack, { backgroundColor: "#EFF6FF" }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min((cat.spent / cat.proposed) * 100, 100)}%` as any,
                    backgroundColor: cat.color,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}

      {/* Parent Note */}
      {isPending && (
        <View style={styles.noteSection}>
          <Text style={[styles.noteLabel, { color: "#1A202C" }]}>Add a note for Aarav (optional)</Text>
          <View style={[styles.noteInput, { backgroundColor: "#FFFFFF", borderColor: "#BFDBFE" }]}>
            <TextInput
              style={[styles.noteTextInput, { color: "#1A202C" }]}
              placeholder="e.g. Approved! Keep it up. / Reduce food to ₹700..."
              placeholderTextColor="#93C5FD"
              value={parentNote}
              onChangeText={setParentNote}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      )}

      {/* Actions */}
      {isPending && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.sendBackBtn, { backgroundColor: "#FFF0EB", borderColor: "#FCA5A5" }]}
            onPress={handleSendBack}
            activeOpacity={0.85}
          >
            <Feather name="edit-2" size={16} color="#FF4D6A" />
            <Text style={[styles.sendBackText, { color: "#FF4D6A" }]}>Send Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.approveBtn, { backgroundColor: "#2563EB" }]}
            onPress={handleApprove}
            activeOpacity={0.85}
          >
            <Feather name="check" size={16} color="#FFFFFF" />
            <Text style={styles.approveText}>Approve Budget</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 12 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  pendingBanner: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, padding: 12, borderWidth: 1.5 },
  pendingText: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  summaryCard: { borderRadius: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 10 },
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
  summaryItem: { alignItems: "center", gap: 4 },
  summaryAmt: { fontSize: 20, fontFamily: "Inter_700Bold" },
  summaryLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  diffBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignSelf: "flex-start" },
  diffText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  catCard: { borderRadius: 14, padding: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1, gap: 10 },
  catHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  catLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  catEmoji: { fontSize: 22 },
  catName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  catSpent: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  increasePill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  increaseText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  editRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  editLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  editInput: { flexDirection: "row", alignItems: "center", borderRadius: 10, borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 8, gap: 2, minWidth: 100 },
  editRupee: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  editTextInput: { fontSize: 16, fontFamily: "Inter_700Bold", minWidth: 60 },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  noteSection: { gap: 8 },
  noteLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  noteInput: { borderRadius: 12, borderWidth: 1.5, padding: 12 },
  noteTextInput: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  actions: { flexDirection: "row", gap: 10 },
  sendBackBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, paddingVertical: 14, borderWidth: 1.5 },
  sendBackText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  approveBtn: { flex: 1.5, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, paddingVertical: 14 },
  approveText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_700Bold" },
  // Approved state
  approvedState: { alignItems: "center", paddingHorizontal: 24, gap: 12 },
  approvedIcon: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  approvedTitle: { fontSize: 24, fontFamily: "Inter_700Bold" },
  approvedSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  approvedDetails: { width: "100%", marginTop: 8 },
  approvedRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, gap: 10 },
  approvedEmoji: { fontSize: 18 },
  approvedCat: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  approvedAmt: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
