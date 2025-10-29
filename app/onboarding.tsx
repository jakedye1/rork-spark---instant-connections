import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Video, Shield, Zap, Users, MapPin, Heart, Check } from "lucide-react-native";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
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
      colors={[Colors.babyBlue, Colors.pastelYellow]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
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
          {step === "welcome" && (
            <View style={styles.stepContainer}>
              <View style={styles.sparkContainer}>
                <View style={styles.sparkOuter}>
                  <View style={styles.sparkInner}>
                    <Text style={styles.sparkEmoji}>✨</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.title}>Welcome to Spark</Text>
              <Text style={styles.subtitle}>
                Real connections, instantly. Skip the waiting and jump straight into live
                conversations with people who share your interests.
              </Text>
            </View>
          )}

          {step === "how-it-works" && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>How It Works</Text>
              <Text style={styles.subtitle}>Connect in 3 simple steps</Text>

              <View style={styles.featuresContainer}>
                <View style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <Zap size={32} color={Colors.charcoal} />
                  </View>
                  <Text style={styles.featureTitle}>1. AI Matches You</Text>
                  <Text style={styles.featureDescription}>
                    Our smart AI finds people nearby who share your interests and
                    preferences in seconds.
                  </Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <Video size={32} color={Colors.charcoal} />
                  </View>
                  <Text style={styles.featureTitle}>2. Live Video Chat</Text>
                  <Text style={styles.featureDescription}>
                    Jump into The Flare for instant 1-on-1 video calls. 5 seconds to
                    decide, up to 1 minute to connect.
                  </Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <Heart size={32} color={Colors.charcoal} />
                  </View>
                  <Text style={styles.featureTitle}>3. Make Real Plans</Text>
                  <Text style={styles.featureDescription}>
                    Both say yes? Share contacts and plan your first date or hangout
                    instantly.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {step === "privacy" && (
            <View style={styles.stepContainer}>
              <Text style={styles.title}>Your Safety First</Text>
              <Text style={styles.subtitle}>We take your privacy seriously</Text>

              <View style={styles.featuresContainer}>
                <View style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <Shield size={32} color={Colors.charcoal} />
                  </View>
                  <Text style={styles.featureTitle}>Face ID Verification</Text>
                  <Text style={styles.featureDescription}>
                    All users must verify their identity through facial recognition.
                    Only real people, no bots.
                  </Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <MapPin size={32} color={Colors.charcoal} />
                  </View>
                  <Text style={styles.featureTitle}>Location Control</Text>
                  <Text style={styles.featureDescription}>
                    You control your search radius. Your exact location is never shared
                    with other users.
                  </Text>
                </View>

                <View style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <Users size={32} color={Colors.charcoal} />
                  </View>
                  <Text style={styles.featureTitle}>AI Moderation</Text>
                  <Text style={styles.featureDescription}>
                    Advanced AI monitors video chats for inappropriate behavior to keep
                    everyone safe.
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
                    {acceptedTerms && <Check size={16} color={Colors.charcoal} strokeWidth={3} />}
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
                    {acceptedPrivacy && <Check size={16} color={Colors.charcoal} strokeWidth={3} />}
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
            <Text
              style={[
                styles.nextButtonText,
                step === "privacy" && (!acceptedTerms || !acceptedPrivacy) && styles.nextButtonTextDisabled,
              ]}
            >
              {step === "privacy" ? "Get Started" : "Next"}
            </Text>
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
    paddingVertical: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    opacity: 0.4,
  },
  dotActive: {
    opacity: 1,
    width: 24,
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
  sparkContainer: {
    marginBottom: 40,
  },
  sparkOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.pastelYellow,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.pastelYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 10,
  },
  sparkInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  featuresContainer: {
    width: "100%",
    gap: 16,
  },
  featureCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.pastelYellow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  nextButton: {
    height: 56,
    backgroundColor: Colors.pastelYellow,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.pastelYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.lightGray,
    opacity: 0.5,
    shadowOpacity: 0,
  },
  nextButtonTextDisabled: {
    opacity: 0.5,
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
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.pastelYellow,
    borderColor: Colors.pastelYellow,
  },
  agreementText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
    color: Colors.softPurple,
    fontWeight: "700" as const,
    textDecorationLine: "underline" as const,
  },
});
