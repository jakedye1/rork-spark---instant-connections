import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Video, Shield, Zap, Users, MapPin, Heart, Check, Sparkles } from "lucide-react-native";
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
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";

type OnboardingStep = "welcome" | "how-it-works" | "privacy";

export default function OnboardingScreen() {
  const router = useRouter();
  const { markOnboardingComplete } = useAuth();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const scrollViewRef = useRef<ScrollView>(null);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
  }, [step]);

  const handleNext = async () => {
    if (step === "welcome") {
      setStep("how-it-works");
    } else if (step === "how-it-works") {
      setStep("privacy");
    } else {
      if (!acceptedTerms || !acceptedPrivacy) {
        return;
      }
      await markOnboardingComplete();
      router.replace("/profile-setup");
    }
  };

  return (
    <LinearGradient
      colors={Colors.gradientDark as [string, string, ...string[]]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, step === "welcome" && styles.dotActive]} />
            <View style={[styles.dot, step === "how-it-works" && styles.dotActive]} />
            <View style={[styles.dot, step === "privacy" && styles.dotActive]} />
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
                <View style={styles.heroIconContainer}>
                  <LinearGradient
                    colors={Colors.gradientHero as [string, string, ...string[]]}
                    style={styles.heroIconGradient}
                  >
                    <Sparkles size={64} color={Colors.white} strokeWidth={2} />
                  </LinearGradient>
                </View>

                <Text style={styles.title}>Welcome to Spark</Text>
                <Text style={styles.subtitle}>
                  Real connections happen instantly. Skip the endless swiping and jump straight into live conversations.
                </Text>
              </View>
            )}

            {step === "how-it-works" && (
              <View style={styles.content}>
                <Text style={styles.title}>How It Works</Text>
                <Text style={styles.subtitle}>Connect in 3 simple steps</Text>

                <View style={styles.featuresContainer}>
                  <View style={styles.featureCard}>
                    <View style={[styles.featureIconContainer, { backgroundColor: Colors.primary + "20" }]}>
                      <Zap size={28} color={Colors.primary} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.featureTitle}>1. AI Matches You</Text>
                    <Text style={styles.featureDescription}>
                      Our smart AI finds people nearby who share your interests and preferences in seconds.
                    </Text>
                  </View>

                  <View style={styles.featureCard}>
                    <View style={[styles.featureIconContainer, { backgroundColor: Colors.secondary + "20" }]}>
                      <Video size={28} color={Colors.secondary} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.featureTitle}>2. Live Video Chat</Text>
                    <Text style={styles.featureDescription}>
                      Jump into The Flare for instant 1-on-1 video calls. 5 seconds to decide, up to 1 minute to connect.
                    </Text>
                  </View>

                  <View style={styles.featureCard}>
                    <View style={[styles.featureIconContainer, { backgroundColor: Colors.accent + "20" }]}>
                      <Heart size={28} color={Colors.accent} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.featureTitle}>3. Make Real Plans</Text>
                    <Text style={styles.featureDescription}>
                      Both say yes? Share contacts and plan your first date or hangout instantly.
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {step === "privacy" && (
              <View style={styles.content}>
                <Text style={styles.title}>Your Safety First</Text>
                <Text style={styles.subtitle}>We take your privacy seriously</Text>

                <View style={styles.featuresContainer}>
                  <View style={styles.featureCard}>
                    <View style={[styles.featureIconContainer, { backgroundColor: Colors.success + "20" }]}>
                      <Shield size={28} color={Colors.success} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.featureTitle}>Face ID Verification</Text>
                    <Text style={styles.featureDescription}>
                      All users must verify their identity through facial recognition. Only real people, no bots.
                    </Text>
                  </View>

                  <View style={styles.featureCard}>
                    <View style={[styles.featureIconContainer, { backgroundColor: Colors.info + "20" }]}>
                      <MapPin size={28} color={Colors.info} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.featureTitle}>Location Control</Text>
                    <Text style={styles.featureDescription}>
                      You control your search radius. Your exact location is never shared with other users.
                    </Text>
                  </View>

                  <View style={styles.featureCard}>
                    <View style={[styles.featureIconContainer, { backgroundColor: Colors.warning + "20" }]}>
                      <Users size={28} color={Colors.warning} strokeWidth={2.5} />
                    </View>
                    <Text style={styles.featureTitle}>AI Moderation</Text>
                    <Text style={styles.featureDescription}>
                      Advanced AI monitors video chats for inappropriate behavior to keep everyone safe.
                    </Text>
                  </View>
                </View>

                <View style={styles.agreementContainer}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setAcceptedTerms(!acceptedTerms)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                      {acceptedTerms && <Check size={16} color={Colors.white} strokeWidth={3} />}
                    </View>
                    <Text style={styles.agreementText}>
                      I agree to the{" "}
                      <Text
                        style={styles.linkText}
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push("/terms");
                        }}
                      >
                        Terms of Service
                      </Text>
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, acceptedPrivacy && styles.checkboxChecked]}>
                      {acceptedPrivacy && <Check size={16} color={Colors.white} strokeWidth={3} />}
                    </View>
                    <Text style={styles.agreementText}>
                      I agree to the{" "}
                      <Text
                        style={styles.linkText}
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push("/privacy-policy");
                        }}
                      >
                        Privacy Policy
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              step === "privacy" && (!acceptedTerms || !acceptedPrivacy) && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={step === "privacy" && (!acceptedTerms || !acceptedPrivacy)}
          >
            <LinearGradient
              colors={
                step === "privacy" && (!acceptedTerms || !acceptedPrivacy)
                  ? [Colors.surface, Colors.surface]
                  : (Colors.gradient1 as [string, string, ...string[]])
              }
              style={styles.nextButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextButtonText}>
                {step === "privacy" ? "Get Started" : "Next"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: Colors.textTertiary,
  },
  dotActive: {
    width: 32,
    backgroundColor: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  stepContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  heroIconContainer: {
    marginBottom: 40,
  },
  heroIconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  featuresContainer: {
    width: "100%",
    gap: 20,
  },
  featureCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  nextButton: {
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  nextButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  agreementContainer: {
    marginTop: 32,
    gap: 16,
    width: "100%",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  agreementText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: "700" as const,
    textDecorationLine: "underline" as const,
  },
});
