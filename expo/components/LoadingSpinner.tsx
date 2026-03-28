import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Loader2 } from "lucide-react-native";
import Colors from "@/constants/colors";

type LoadingSpinnerProps = {
  size?: number;
  color?: string;
};

export function LoadingSpinner({ size = 24, color = Colors.softPurple }: LoadingSpinnerProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Loader2 size={size} color={color} strokeWidth={2.5} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
