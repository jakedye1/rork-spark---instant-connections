import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, Dimensions } from "react-native";
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type ToastType = "success" | "error" | "info" | "warning";

type ToastProps = {
  type: ToastType;
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
};

export function Toast({ type, message, visible, onHide, duration = 3000 }: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 8,
        }),
        Animated.delay(duration),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible, duration, onHide, translateY]);

  if (!visible) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      color: Colors.softGreen,
      backgroundColor: "#D1FAE5",
    },
    error: {
      icon: XCircle,
      color: Colors.softPink,
      backgroundColor: "#FEE2E2",
    },
    warning: {
      icon: AlertCircle,
      color: Colors.pastelYellow,
      backgroundColor: "#FEF3C7",
    },
    info: {
      icon: Info,
      color: Colors.softPurple,
      backgroundColor: "#E0E7FF",
    },
  }[type];

  const IconComponent = config.icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + 16,
          backgroundColor: config.backgroundColor,
          transform: [{ translateY }],
        },
      ]}
    >
      <IconComponent size={24} color={config.color} strokeWidth={2.5} />
      <Text style={[styles.message, { color: Colors.charcoal }]} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute" as const,
    left: 16,
    right: 16,
    maxWidth: width - 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  message: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600" as const,
    lineHeight: 20,
  },
});
