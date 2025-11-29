import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Sparkles, Video, Users, Heart, Shield, Zap } from "lucide-react-native";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";

type OnboardingStep = "welcome" | "features" | "setup";

export default function OnboardingScreen() {
  const router = useRouter();
  const { markOnboardingComplete } = useAuth();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const sparkleAnim1 = useRef(new Animated.Value(0)).current;
  const sparkleAnim2 = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim1, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim1, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim2, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim2, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [step, fadeAnim, slideAnim, sparkleAnim1, sparkleAnim2]);

  const handleNext = async () => {
    if (step === "welcome") {
      setStep("features");
    } else if (step === "features") {
      setStep("setup");
    } else {
      await markOnboardingComplete();
      router.replace("/profile-setup");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight, Colors.background]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <View style={styles.header}>
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, step === "welcome" && styles.dotActive]} />
              <View style={[styles.dot, step === "features" && styles.dotActive]} />
              <View style={[styles.dot, step === "setup" && styles.dotActive]} />
            </View>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
          >
            <Animated.View 
              style={[
                styles.stepContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {step === "welcome" && (
                <View style={styles.content}>
                  <View style={styles.heroContainer}>
                    <LinearGradient
                      colors={[Colors.babyBlue, Colors.aquaGlow]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.heroGradientOuter}
                    >
                      <BlurView intensity={30} style={styles.heroBlur}>
                        <Sparkles size={80} color={Colors.white} strokeWidth={2} />
                      </BlurView>
                    </LinearGradient>
                    
                    <Animated.View
                      style={[
                        styles.sparkle1,
                        {
                          opacity: sparkleAnim1,
                          transform: [
                            {
                              translateY: sparkleAnim1.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -20],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Sparkles size={24} color={Colors.pastelYellow} />
                    </Animated.View>
                    
                    <Animated.View
                      style={[
                        styles.sparkle2,
                        {
                          opacity: sparkleAnim2,
                          transform: [
                            {
                              translateY: sparkleAnim2.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -30],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <Sparkles size={20} color={Colors.aquaGlow} />
                    </Animated.View>
                  </View>

                  <Text style={styles.title}>Where Real People{"\n"}Connect Fast</Text>
                  <Text style={styles.subtitle}>
                    Swipe. Match. Go Live.{"\n"}Make sparks happen.
                  </Text>
                </View>
              )}

              {step === "features" && (
                <View style={styles.content}>
                  <Text style={styles.title}>What Spark Is</Text>

                  <View style={styles.featuresGrid}>
                    <View style={styles.glassCard}>
                      <BlurView intensity={40} tint="dark" style={styles.glassCardBlur}>
                        <LinearGradient
                          colors={[Colors.glass, Colors.glassDark]}
                          style={styles.glassCardGradient}
                        >
                          <View style={styles.iconCircle}>
                            <LinearGradient
                              colors={[Colors.babyBlue, Colors.primaryDark]}
                              style={styles.iconGradient}
                            >
                              <Video size={32} color={Colors.white} strokeWidth={2.5} />
                            </LinearGradient>
                          </View>
                          <Text style={styles.featureTitle}>Live Video{"\n"}Matching</Text>
                        </LinearGradient>
                      </BlurView>
                    </View>

                    <View style={styles.glassCard}>
                      <BlurView intensity={40} tint="dark" style={styles.glassCardBlur}>
                        <LinearGradient
                          colors={[Colors.glass, Colors.glassDark]}
                          style={styles.glassCardGradient}
                        >
                          <View style={styles.iconCircle}>
                            <LinearGradient
                              colors={[Colors.pastelYellow, Colors.secondaryDark]}
                              style={styles.iconGradient}
                            >
                              <Zap size={32} color={Colors.white} strokeWidth={2.5} />
                            </LinearGradient>
                          </View>
                          <Text style={styles.featureTitle}>Instant{"\n"}Connections</Text>
                        </LinearGradient>
                      </BlurView>
                    </View>

                    <View style={styles.glassCard}>
                      <BlurView intensity={40} tint="dark" style={styles.glassCardBlur}>
                        <LinearGradient
                          colors={[Colors.glass, Colors.glassDark]}
                          style={styles.glassCardGradient}
                        >
                          <View style={styles.iconCircle}>
                            <LinearGradient
                              colors={[Colors.aquaGlow, Colors.accentDark]}
                              style={styles.iconGradient}
                            >
                              <Users size={32} color={Colors.white} strokeWidth={2.5} />
                            </LinearGradient>
                          </View>
                          <Text style={styles.featureTitle}>Group Match{"\n"}Mode</Text>
                        </LinearGradient>
                      </BlurView>
                    </View>
                  </View>

                  <Text style={styles.bottomText}>Meet real humans in real time.</Text>
                </View>
              )}

              {step === "setup" && (
                <View style={styles.content}>
                  <LinearGradient
                    colors={[Colors.babyBlue, Colors.aquaGlow]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.setupIcon}
                  >
                    <BlurView intensity={30} style={styles.setupBlur}>
                      <Shield size={64} color={Colors.white} strokeWidth={2} />
                    </BlurView>
                  </LinearGradient>

                  <Text style={styles.title}>Build Your Vibe</Text>
                  <Text style={styles.subtitle}>
                    Set up your profile and start connecting with amazing people near you.
                  </Text>

                  <View style={styles.setupFeatures}>
                    <View style={styles.setupFeature}>
                      <View style={styles.setupCheck}>
                        <Heart size={16} color={Colors.babyBlue} fill={Colors.babyBlue} />
                      </View>
                      <Text style={styles.setupFeatureText}>Face ID Verified</Text>
                    </View>
                    <View style={styles.setupFeature}>
                      <View style={styles.setupCheck}>
                        <Shield size={16} color={Colors.aquaGlow} />
                      </View>
                      <Text style={styles.setupFeatureText}>100% Safe & Secure</Text>
                    </View>
                    <View style={styles.setupFeature}>
                      <View style={styles.setupCheck}>
                        <Sparkles size={16} color={Colors.pastelYellow} />
                      </View>
                      <Text style={styles.setupFeatureText}>AI Powered</Text>
                    </View>
                  </View>
                </View>
              )}
            </Animated.View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.9}
            >
              <BlurView intensity={60} tint="dark" style={styles.buttonBlur}>
                <LinearGradient
                  colors={[Colors.babyBlue, Colors.aquaGlow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>
                    {step === "setup" ? "Get Started" : "Next"}
                  </Text>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  dotActive: {
    width: 32,
    backgroundColor: Colors.babyBlue,
    borderColor: Colors.babyBlue,
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  stepContainer: {
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    width: "100%",
    gap: 32,
  },
  heroContainer: {
    position: "relative" as const,
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  heroGradientOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    padding: 4,
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  heroBlur: {
    flex: 1,
    borderRadius: 86,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  sparkle1: {
    position: "absolute" as const,
    top: 10,
    right: 20,
  },
  sparkle2: {
    position: "absolute" as const,
    bottom: 20,
    left: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "900" as const,
    color: Colors.white,
    textAlign: "center",
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  glassCard: {
    width: "45%",
    aspectRatio: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
  glassCardBlur: {
    flex: 1,
  },
  glassCardGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
    textAlign: "center",
    lineHeight: 22,
  },
  bottomText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  setupIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 4,
    shadowColor: Colors.shadowAqua,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 15,
  },
  setupBlur: {
    flex: 1,
    borderRadius: 66,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  setupFeatures: {
    width: "100%",
    gap: 16,
    marginTop: 16,
  },
  setupFeature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 20,
    padding: 20,
  },
  setupCheck: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glassLight,
    alignItems: "center",
    justifyContent: "center",
  },
  setupFeatureText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.text,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  nextButton: {
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonBlur: {
    flex: 1,
  },
  nextButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.glassLight,
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});
