import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
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

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  
  console.log('Privacy Policy screen mounted');

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
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Privacy Policy</Text>
            <Text style={styles.updateText}>Last updated: January 2025</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.bodyText}>
              At Spark, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information We Collect</Text>
            <Text style={styles.bodyText}>
              We collect information that you provide directly to us:{"\n\n"}
              • Account information (name, email, age){"\n"}
              • Profile information (photos, interests, preferences){"\n"}
              • Location data (with your permission){"\n"}
              • Messages and communications{"\n"}
              • Video call metadata (not content)
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.bodyText}>
              We use the collected information to:{"\n\n"}
              • Provide and maintain our services{"\n"}
              • Match you with compatible users{"\n"}
              • Improve user experience{"\n"}
              • Send notifications and updates{"\n"}
              • Ensure safety and prevent fraud{"\n"}
              • Comply with legal obligations
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Sharing</Text>
            <Text style={styles.bodyText}>
              We do not sell your personal information. We may share your data with:{"\n\n"}
              • Other users (profile information only){"\n"}
              • Service providers who help operate our platform{"\n"}
              • Law enforcement when required by law{"\n"}
              • Business partners with your consent
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Video Call Privacy</Text>
            <Text style={styles.bodyText}>
              Video calls are peer-to-peer and encrypted. We do not record or store video call content. Only metadata (duration, participants) is retained for quality and safety purposes.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.bodyText}>
              We implement industry-standard security measures including:{"\n\n"}
              • Encryption of data in transit and at rest{"\n"}
              • Secure authentication systems{"\n"}
              • Regular security audits{"\n"}
              • Access controls and monitoring
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.bodyText}>
              You have the right to:{"\n\n"}
              • Access your personal data{"\n"}
              • Correct inaccurate information{"\n"}
              • Delete your account and data{"\n"}
              • Opt-out of marketing communications{"\n"}
              • Export your data{"\n"}
              • Object to data processing
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Retention</Text>
            <Text style={styles.bodyText}>
              We retain your information for as long as your account is active or as needed to provide services. When you delete your account, we remove your data within 30 days, except where required by law.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Children&apos;s Privacy</Text>
            <Text style={styles.bodyText}>
              Spark is not intended for users under 18. We do not knowingly collect information from children. If we discover that a child has provided us with personal information, we will delete it immediately.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>International Users</Text>
            <Text style={styles.bodyText}>
              Your information may be transferred to and processed in countries other than your own. We ensure adequate protections are in place for international data transfers.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to This Policy</Text>
            <Text style={styles.bodyText}>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.bodyText}>
              For privacy-related questions or to exercise your rights, contact us at:{"\n\n"}
              privacy@sparkapp.com{"\n"}
              1-800-SPARK-APP
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
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.white,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  updateText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.white,
    opacity: 0.9,
  },
  section: {
    marginBottom: 28,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  bodyText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    lineHeight: 26,
    opacity: 0.85,
  },
  bottomSpacer: {
    height: 40,
  },
});
