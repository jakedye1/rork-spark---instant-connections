import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, Heart, Shield, Users } from "lucide-react-native";
import React from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export default function AboutScreen() {
  const router = useRouter();
  
  console.log('About screen mounted');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.softPurple, Colors.softPink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <View style={styles.backButtonCircle}>
                <ChevronRight
                  size={20}
                  color={Colors.white}
                  style={{ transform: [{ rotate: "180deg" }] }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>✨</Text>
            </View>
            <Text style={styles.logoText}>Spark</Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.bodyText}>
              Spark brings people together through real-time video connections. We believe that genuine relationships are built on authentic conversations, not endless swiping.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What Makes Us Different</Text>
            <View style={styles.featureCard}>
              <Heart size={32} color={Colors.softPink} />
              <Text style={styles.featureTitle}>Real Connections</Text>
              <Text style={styles.featureText}>
                Live video chat helps you connect authentically before deciding to meet
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Shield size={32} color={Colors.softGreen} />
              <Text style={styles.featureTitle}>Safe & Verified</Text>
              <Text style={styles.featureText}>
                Face ID verification keeps our community safe and authentic
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Users size={32} color={Colors.softPurple} />
              <Text style={styles.featureTitle}>For Everyone</Text>
              <Text style={styles.featureText}>
                Whether you&apos;re looking for dating, friends, or group activities
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.bodyText}>
              Have questions or feedback?{"\n"}
              Email us at support@sparkapp.com{"\n\n"}
              Follow us on social media @sparkapp
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.copyrightText}>
              © 2025 Spark Inc. All rights reserved.
            </Text>
            <Text style={styles.bodyText}>
              Made with ❤️ for building connections
            </Text>
          </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  gradientHeader: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 8,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 48,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: Colors.white,
    marginBottom: 8,
    letterSpacing: 1,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.white,
    opacity: 0.9,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    lineHeight: 26,
    opacity: 0.85,
  },
  featureCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.lightGray,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  featureText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.75,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  copyrightText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.5,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});
