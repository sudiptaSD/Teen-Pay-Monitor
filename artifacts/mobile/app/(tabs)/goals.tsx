import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
import { GoalCard } from "@/components/GoalCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const GOAL_EMOJIS = ["🎧", "👟", "💻", "📱", "🎮", "✈️", "🎸", "📚", "⌚", "🎒", "🏋️", "🎨"];

export default function GoalsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { goals, completedGoals, addGoal } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [showCreate, setShowCreate] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🎧");

  const handleCreate = () => {
    const amt = parseFloat(goalAmount);
    if (!goalName.trim() || !goalAmount || isNaN(amt) || amt <= 0) return;
    addGoal(goalName.trim(), amt, selectedEmoji);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowCreate(false);
    setGoalName("");
    setGoalAmount("");
    setSelectedEmoji("🎧");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>Savings Goals</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {goals.length} active · {completedGoals.length} completed
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn]}
            onPress={() => setShowCreate(true)}
            activeOpacity={0.85}
          >
            <LinearGradient colors={["#7B5CF0", "#6C47FF"]} style={styles.addBtnGrad}>
              <Feather name="plus" size={18} color="#FFFFFF" />
              <Text style={styles.addBtnText}>New Goal</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Active Goals */}
        {goals.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.card }]}>
            <Feather name="target" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No active goals yet</Text>
            <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
              Set a savings goal to track your progress and stay motivated.
            </Text>
          </View>
        ) : (
          goals.map((g) => <GoalCard key={g.id} goal={g} />)
        )}

        {/* Goal Gallery */}
        {completedGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Goal Gallery</Text>
            <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>Your achievements</Text>
            {completedGoals.map((g) => (
              <View key={g.id} style={[styles.completedCard, { backgroundColor: colors.card, borderColor: "#00C48C" }]}>
                <View style={[styles.completedEmoji, { backgroundColor: "#E6FBF5" }]}>
                  <Text style={styles.emojiText}>{g.emoji}</Text>
                </View>
                <View style={styles.completedInfo}>
                  <Text style={[styles.completedName, { color: colors.foreground }]}>{g.name}</Text>
                  <Text style={[styles.completedMeta, { color: colors.mutedForeground }]}>
                    ₹{g.targetAmount.toLocaleString("en-IN")} · Completed {g.completedAt}
                  </Text>
                </View>
                <View style={[styles.doneRing, { backgroundColor: "#E6FBF5" }]}>
                  <Feather name="check-circle" size={20} color="#00C48C" />
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Goal Modal */}
      <Modal visible={showCreate} transparent animationType="slide" statusBarTranslucent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={[styles.modalSheet, { backgroundColor: colors.card }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>New Savings Goal</Text>

            {/* Emoji Picker */}
            <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>Choose an emoji</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiPicker}>
              {GOAL_EMOJIS.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[
                    styles.emojiOption,
                    {
                      backgroundColor: selectedEmoji === e ? colors.secondary : colors.muted,
                      borderColor: selectedEmoji === e ? colors.primary : "transparent",
                    },
                  ]}
                  onPress={() => setSelectedEmoji(e)}
                >
                  <Text style={styles.emojiOptionText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Name */}
            <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>What are you saving for?</Text>
            <View style={[styles.modalInput, { backgroundColor: colors.muted, borderColor: goalName ? colors.primary : "transparent" }]}>
              <TextInput
                style={[styles.modalTextInput, { color: colors.foreground }]}
                placeholder="e.g. Sony Earphones, New Sneakers..."
                placeholderTextColor={colors.mutedForeground}
                value={goalName}
                onChangeText={setGoalName}
              />
            </View>

            {/* Amount */}
            <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>Target amount (₹)</Text>
            <View style={[styles.modalInput, { backgroundColor: colors.muted, borderColor: goalAmount ? colors.primary : "transparent" }]}>
              <Text style={[styles.rupeeSmall, { color: goalAmount ? colors.foreground : colors.mutedForeground }]}>₹</Text>
              <TextInput
                style={[styles.modalTextInput, { color: colors.foreground }]}
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
                value={goalAmount}
                onChangeText={setGoalAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancel, { backgroundColor: colors.muted }]}
                onPress={() => setShowCreate(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.mutedForeground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirm, { opacity: goalName && goalAmount ? 1 : 0.45 }]}
                onPress={handleCreate}
                disabled={!goalName || !goalAmount}
              >
                <LinearGradient colors={["#7B5CF0", "#6C47FF"]} style={styles.modalConfirmGrad}>
                  <Text style={styles.modalConfirmText}>Create Goal</Text>
                </LinearGradient>
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
  content: { paddingHorizontal: 16, gap: 4 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  addBtn: { borderRadius: 12, overflow: "hidden" },
  addBtnGrad: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 10 },
  addBtnText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  empty: { borderRadius: 16, padding: 32, alignItems: "center", gap: 10 },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  emptyBody: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 2 },
  sectionSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 12 },
  completedCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    gap: 12,
    marginBottom: 8,
  },
  completedEmoji: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  emojiText: { fontSize: 22 },
  completedInfo: { flex: 1 },
  completedName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  completedMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  doneRing: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, gap: 10 },
  modalHandle: { width: 36, height: 4, backgroundColor: "#E0E0E0", borderRadius: 2, alignSelf: "center", marginBottom: 8 },
  modalTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 4 },
  modalLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  emojiPicker: { flexDirection: "row", marginBottom: 4 },
  emojiOption: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 8, borderWidth: 1.5 },
  emojiOptionText: { fontSize: 22 },
  modalInput: { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, gap: 4 },
  modalTextInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  rupeeSmall: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 8 },
  modalCancel: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  modalCancelText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  modalConfirm: { flex: 1, borderRadius: 12, overflow: "hidden" },
  modalConfirmGrad: { paddingVertical: 14, alignItems: "center" },
  modalConfirmText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_700Bold" },
});
