import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { GlassCard } from "@/components/GlassCard";

const { height } = Dimensions.get('window');

export default function Splash() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: Fade In -> Glow -> Shimmer -> Wait -> Slide Up
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(500),
    ]).start(() => {
      // After animation completes, we are ready to navigate
      // but we wait for auth loading to finish too
      setIsReady(true);
    });
  }, [fadeAnim, glowAnim, shimmerAnim]);

  useEffect(() => {
    if (isReady && !isLoading) {
      // Transition out
      Animated.timing(slideAnim, {
        toValue: -height,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (user) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/onboarding");
        }
      });
    }
  }, [isReady, isLoading, user, slideAnim, router]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <LinearGradient
        colors={[Colors.background, Colors.background]}
        style={styles.gradient}
      >
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          {/* Logo Container */}
          <View style={styles.logoContainer}>
            {/* Outer Aura Glow */}
            <Animated.View
              style={[
                styles.aura,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                  }),
                  transform: [
                    {
                      scale: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            />

            {/* Flame Logo */}
            <GlassCard 
              intensity={40} 
              variant="default"
              style={styles.flameCard}
            >
              <LinearGradient
                colors={Colors.gradientPrimary as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.flameGradient}
              >
                 <Text style={styles.flameIcon}>🔥</Text>
                 
                 {/* Shimmer Effect */}
                 <Animated.View 
                    style={[
                      styles.shimmer,
                      {
                        transform: [
                          {
                            translateX: shimmerAnim.interpolate({
                              inputRange: [-1, 1],
                              outputRange: [-100, 100],
                            })
                          }
                        ]
                      }
                    ]}
                 >
                   <LinearGradient
                      colors={["transparent", "rgba(255,255,255,0.4)", "transparent"]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{ flex: 1 }}
                   />
                 </Animated.View>
              </LinearGradient>
            </GlassCard>
          </View>

          {/* Text in Thin Glass Card */}
          <View style={styles.textWrapper}>
            <GlassCard intensity={20} style={styles.textCard}>
              <Text style={styles.title}>SPARK</Text>
            </GlassCard>
          </View>

          {/* Loading Indicator */}
          <View style={styles.loaderContainer}>
            <Animated.View
              style={[
                styles.loaderBar,
                {
                  opacity: glowAnim,
                  transform: [{ scaleX: glowAnim }],
                },
              ]}
            />
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
  },
  aura: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.accent, // Aqua glow
    opacity: 0.3,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  flameCard: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  flameIcon: {
    fontSize: 64,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 50,
    transform: [{ skewX: "-20deg" }],
  },
  textWrapper: {
    marginTop: 40,
  },
  textCard: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 6, // Tracking increased
  },
  loaderContainer: {
    marginTop: 40,
    height: 2,
    width: 150,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 1,
    overflow: "hidden",
  },
  loaderBar: {
    height: "100%",
    width: "100%",
    backgroundColor: Colors.accent, // Neon line
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
