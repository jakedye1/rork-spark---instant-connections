import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Colors from "@/constants/colors";

export default function Index() {
  const { user, isLoading } = useAuth();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('Index screen - user:', user ? 'logged in' : 'not logged in', 'isLoading:', isLoading);
    
    if (isLoading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [user, isLoading, scaleAnim, glowAnim, fadeAnim]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.background, Colors.backgroundLight, Colors.background]}
          style={styles.gradient}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={[Colors.babyBlue, Colors.aquaGlow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.flameOuter}
              >
                <BlurView intensity={20} style={styles.flameBlur}>
                  <LinearGradient
                    colors={[Colors.babyBlue, Colors.pastelYellow]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.flameInner}
                  >
                    <Text style={styles.flameEmoji}>🔥</Text>
                  </LinearGradient>
                </BlurView>
              </LinearGradient>

              <Animated.View
                style={[
                  styles.glowRing,
                  {
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.8],
                    }),
                    transform: [
                      {
                        scale: glowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.15],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>

            <View style={styles.textContainer}>
              <LinearGradient
                colors={[Colors.white, Colors.textSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.textGradient}
              >
                <Text style={styles.sparkText}>SPARK</Text>
              </LinearGradient>
              
              <View style={styles.loadingBar}>
                <Animated.View
                  style={[
                    styles.loadingBarInner,
                    {
                      opacity: glowAnim,
                    },
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/auth" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 48,
  },
  logoContainer: {
    position: "relative" as const,
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  flameOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    padding: 4,
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  flameBlur: {
    flex: 1,
    borderRadius: 76,
    overflow: "hidden",
  },
  flameInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 76,
  },
  flameEmoji: {
    fontSize: 72,
  },
  glowRing: {
    position: "absolute" as const,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: Colors.aquaGlow,
    shadowColor: Colors.shadowAqua,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
  },
  textContainer: {
    alignItems: "center",
    gap: 20,
  },
  textGradient: {
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sparkText: {
    fontSize: 52,
    fontWeight: "900" as const,
    color: Colors.white,
    letterSpacing: 8,
    textShadowColor: Colors.shadowNeon,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: Colors.glass,
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingBarInner: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.aquaGlow,
    shadowColor: Colors.shadowAqua,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
