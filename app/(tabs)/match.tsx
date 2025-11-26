import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, Flame, X } from "lucide-react-native";
import Colors from "@/constants/colors";
import { GlassCard } from "@/components/GlassCard";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function MatchScreen() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={styles.container}>
      {/* Match Video (Background) */}
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop" }}
        style={styles.matchVideo}
      />
      
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "transparent", "rgba(0,0,0,0.6)"]}
        style={styles.gradientOverlay}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Header: Timer & Status */}
        <View style={styles.header}>
          <GlassCard intensity={20} style={styles.timerPill}>
             <View style={styles.recordingDot} />
             <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          </GlassCard>
        </View>

        {/* My Video (PIP) */}
        <View style={styles.myVideoContainer}>
           <Image 
              source={{ uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" }}
              style={styles.myVideo}
           />
           <View style={styles.myVideoBorder} />
        </View>

        {/* Bottom Controls */}
        <View style={styles.controlsContainer}>
           <View style={styles.matchInfo}>
              <Text style={styles.matchName}>Sarah, 23</Text>
              <Text style={styles.matchLocation}>🇺🇸 New York</Text>
           </View>

           <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.controlButton}>
                 <GlassCard intensity={30} style={styles.controlGlass} variant="dark">
                    <X size={32} color={Colors.error} />
                 </GlassCard>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.controlButton, styles.mainButton]}>
                 <GlassCard intensity={30} style={styles.controlGlassMain} variant="neon">
                    <Heart size={40} color={Colors.white} fill={Colors.white} />
                 </GlassCard>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton}>
                 <GlassCard intensity={30} style={styles.controlGlass} variant="dark">
                    <Flame size={32} color={Colors.pastelYellow} fill={Colors.pastelYellow} />
                 </GlassCard>
              </TouchableOpacity>
           </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  matchVideo: {
    position: "absolute",
    width: width,
    height: height,
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    width: width,
    height: height,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    paddingTop: 10,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  timerText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 14,
    fontVariant: ["tabular-nums"],
  },
  myVideoContainer: {
    position: "absolute",
    right: 20,
    top: 100,
    width: 100,
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  myVideo: {
    width: "100%",
    height: "100%",
  },
  myVideoBorder: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
  },
  controlsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Above tab bar
  },
  matchInfo: {
    marginBottom: 24,
  },
  matchName: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.white,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  matchLocation: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  mainButton: {
    marginTop: -20, // Lift up slightly
  },
  controlGlass: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  controlGlassMain: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.babyBlue,
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
});
