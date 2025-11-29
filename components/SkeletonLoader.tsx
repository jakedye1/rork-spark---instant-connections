import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, ViewStyle } from "react-native";
import Colors from "@/constants/colors";

type SkeletonLoaderProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
};

export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonMatchCard() {
  return (
    <View style={styles.matchCard}>
      <SkeletonLoader width={56} height={56} borderRadius={28} />
      <View style={styles.matchInfo}>
        <SkeletonLoader width="60%" height={16} style={{ marginBottom: 8 }} />
        <SkeletonLoader width="90%" height={14} style={{ marginBottom: 8 }} />
        <View style={styles.interestsRow}>
          <SkeletonLoader width={80} height={24} borderRadius={12} />
          <SkeletonLoader width={70} height={24} borderRadius={12} />
        </View>
      </View>
    </View>
  );
}

export function SkeletonProfileCard() {
  return (
    <View style={styles.profileCard}>
      <SkeletonLoader width={100} height={100} borderRadius={50} style={{ marginBottom: 16 }} />
      <SkeletonLoader width={150} height={24} style={{ marginBottom: 8 }} />
      <SkeletonLoader width={100} height={16} style={{ marginBottom: 16 }} />
      <View style={styles.interestsRow}>
        <SkeletonLoader width={80} height={32} borderRadius={16} />
        <SkeletonLoader width={90} height={32} borderRadius={16} />
        <SkeletonLoader width={70} height={32} borderRadius={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.lightGray,
  },
  matchCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  matchInfo: {
    flex: 1,
  },
  interestsRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 32,
  },
});
