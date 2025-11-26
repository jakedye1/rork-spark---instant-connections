import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import Colors from "@/constants/colors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  variant?: "default" | "light" | "dark" | "neon";
}

export function GlassCard({ 
  children, 
  style, 
  intensity = 20,
  variant = "default" 
}: GlassCardProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case "light": return Colors.glassLight;
      case "dark": return Colors.glassDark;
      case "neon": return "rgba(130, 199, 255, 0.05)";
      default: return Colors.glass;
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case "neon": return Colors.babyBlue;
      default: return Colors.glassBorder;
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        borderColor: getBorderColor(),
        backgroundColor: getBackgroundColor(),
        shadowColor: variant === "neon" ? Colors.shadowNeon : Colors.shadow,
      },
      variant === "neon" && styles.neonShadow,
      style
    ]}>
      <BlurView intensity={intensity} tint="dark" style={styles.blur}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  neonShadow: {
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  blur: {
    flex: 1,
    width: "100%",
  },
});
