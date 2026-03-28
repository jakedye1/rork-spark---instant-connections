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

export default function TermsScreen() {
  const router = useRouter();
  
  console.log('Terms screen mounted');

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
            <Text style={styles.headerTitle}>Terms of Service</Text>
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
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.bodyText}>
              By accessing and using Spark, you accept and agree to be bound by the terms and provision of this agreement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. User Eligibility</Text>
            <Text style={styles.bodyText}>
              You must be at least 18 years old to use this service. By using Spark, you represent and warrant that you meet this age requirement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Conduct</Text>
            <Text style={styles.bodyText}>
              You agree to use Spark in a respectful manner. Prohibited conduct includes:{"\n\n"}
              • Harassment or bullying{"\n"}
              • Sharing inappropriate content{"\n"}
              • Impersonating others{"\n"}
              • Spamming or soliciting{"\n"}
              • Violating others&apos; privacy
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Privacy & Data</Text>
            <Text style={styles.bodyText}>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Account Security</Text>
            <Text style={styles.bodyText}>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Content Ownership</Text>
            <Text style={styles.bodyText}>
              You retain ownership of content you share on Spark, but grant us a license to use, display, and distribute your content in connection with the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Termination</Text>
            <Text style={styles.bodyText}>
              We reserve the right to suspend or terminate your account if you violate these terms or engage in behavior that we determine to be harmful to other users or the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Disclaimer</Text>
            <Text style={styles.bodyText}>
              Spark is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted or error-free service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
            <Text style={styles.bodyText}>
              Spark shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Changes to Terms</Text>
            <Text style={styles.bodyText}>
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Contact</Text>
            <Text style={styles.bodyText}>
              For questions about these terms, please contact us at legal@sparkapp.com
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
