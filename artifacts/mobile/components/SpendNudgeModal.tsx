import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface SpendNudgeModalProps {
  visible: boolean;
  goalName: string;
  amount: number;
  onProceed: () => void;
  onCancel: () => void;
}

export function SpendNudgeModal({ visible, goalName, amount, onProceed, onCancel }: SpendNudgeModalProps) {
  const colors = useColors();

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={[styles.iconRing, { backgroundColor: "#FFF0EB" }]}>
            <Feather name="alert-circle" size={28} color="#FF6B35" />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Heads up!</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>
            Spending ₹{amount.toLocaleString("en-IN")} might slow down your{" "}
            <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>
              {goalName.length > 25 ? goalName.substring(0, 25) + "..." : goalName}
            </Text>{" "}
            goal. Still want to go ahead?
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: colors.secondary }]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Feather name="save" size={16} color={colors.primary} />
              <Text style={[styles.cancelText, { color: colors.primary }]}>Save Instead</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.proceedBtn, { backgroundColor: colors.accent }]}
              onPress={onProceed}
              activeOpacity={0.8}
            >
              <Text style={styles.proceedText}>Proceed Anyway</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 12,
    paddingBottom: 40,
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  body: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  buttons: { flexDirection: "row", gap: 10, marginTop: 8, width: "100%" },
  cancelBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    paddingVertical: 14,
  },
  cancelText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  proceedBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
  },
  proceedText: { color: "#FFFFFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
