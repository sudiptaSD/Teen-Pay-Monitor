import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Achievement } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const TIER_COLORS = {
  bronze: { bg: "#FFF4E6", text: "#C8751A", border: "#FFD599" },
  silver: { bg: "#F3F3F3", text: "#5A5A5A", border: "#C8C8C8" },
  gold: { bg: "#FFFBE6", text: "#B8860B", border: "#FFE066" },
};

interface AchievementBadgeProps {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const colors = useColors();
  const tier = TIER_COLORS[achievement.tier];
  const isLocked = !achievement.isUnlocked;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isLocked ? colors.muted : tier.bg,
          borderColor: isLocked ? colors.border : tier.border,
          opacity: isLocked ? 0.55 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.iconRing,
          { backgroundColor: isLocked ? colors.border : tier.border },
        ]}
      >
        <Feather
          name={achievement.icon as any}
          size={20}
          color={isLocked ? colors.mutedForeground : tier.text}
        />
        {isLocked && (
          <View style={styles.lockOverlay}>
            <Feather name="lock" size={10} color={colors.mutedForeground} />
          </View>
        )}
      </View>
      <Text
        style={[styles.name, { color: isLocked ? colors.mutedForeground : tier.text }]}
        numberOfLines={1}
      >
        {achievement.name}
      </Text>
      <Text
        style={[styles.desc, { color: colors.mutedForeground }]}
        numberOfLines={2}
      >
        {achievement.description}
      </Text>
      {achievement.isUnlocked && achievement.unlockedAt && (
        <View style={[styles.tierPill, { backgroundColor: tier.border }]}>
          <Text style={[styles.tierText, { color: tier.text }]}>
            {achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "47%",
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  iconRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  lockOverlay: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 2,
  },
  name: { fontSize: 12, fontFamily: "Inter_700Bold", textAlign: "center" },
  desc: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 14 },
  tierPill: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tierText: { fontSize: 9, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
});
