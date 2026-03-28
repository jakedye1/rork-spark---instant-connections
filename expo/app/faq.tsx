import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight, HelpCircle } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    question: "How does Spark work?",
    answer: "Spark connects you with people nearby through live video chats. Our AI matches you based on your interests and preferences. You have 5 seconds to decide if you want to continue the conversation, then up to 1 minute to chat. If both people want to connect, you can exchange contacts and plan to meet.",
  },
  {
    question: "Is Spark free to use?",
    answer: "Yes! Spark offers 5 free video calls. After that, you can upgrade to Premium for unlimited calls, ad-free experience, and priority matching.",
  },
  {
    question: "How do I get more free calls?",
    answer: "Free calls reset daily. Premium members get unlimited calls without waiting.",
  },
  {
    question: "Can I change my profile information?",
    answer: "Yes, you can edit most of your profile information from the Profile tab. However, your name and age cannot be changed after initial setup for security and authenticity purposes.",
  },
  {
    question: "How does location-based matching work?",
    answer: "When you enable location services, Spark uses your general area (not exact location) to find people nearby. You can adjust the search radius from 5 to 100 miles. Your exact location is never shared with other users.",
  },
  {
    question: "Is my video chat private?",
    answer: "All video chats are peer-to-peer encrypted. However, our AI monitors chats for inappropriate behavior to keep everyone safe. We don't record or store video content.",
  },
  {
    question: "What happens if someone is inappropriate?",
    answer: "You can immediately end the call and report the user. Our AI also monitors for inappropriate behavior and will automatically flag violations. Reported users are reviewed and may be banned.",
  },
  {
    question: "How do I block someone?",
    answer: "During or after a video chat, tap the menu button and select 'Block User'. Blocked users won't be able to see your profile or contact you again.",
  },
  {
    question: "Can I cancel my Premium subscription?",
    answer: "Yes, you can cancel anytime from your device's subscription settings (App Store for iOS, Google Play for Android). You'll continue to have Premium access until the end of your billing period.",
  },
  {
    question: "What are the community guidelines?",
    answer: "Be respectful, authentic, and appropriate. No nudity, harassment, hate speech, or illegal activity. Users must be 18+. Violations result in warnings or permanent bans.",
  },
  {
    question: "How do I delete my account?",
    answer: "Go to Profile → Settings → Account Settings, then scroll down to 'Delete Account'. This action is permanent and cannot be undone.",
  },
  {
    question: "Why can't I find matches?",
    answer: "Make sure location services are enabled and you have a good internet connection. Try adjusting your search radius or checking your preferences. If the issue persists, contact support.",
  },
];

export default function FAQScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <LinearGradient
      colors={[Colors.babyBlue, Colors.pastelYellow]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronRight
              size={24}
              color={Colors.charcoal}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FAQ</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <HelpCircle size={48} color={Colors.charcoal} />
            </View>
            <Text style={styles.title}>Frequently Asked Questions</Text>
            <Text style={styles.subtitle}>
              Find answers to common questions about Spark
            </Text>
          </View>

          <View style={styles.faqList}>
            {FAQ_DATA.map((faq, index) => (
              <TouchableOpacity
                key={index}
                style={styles.faqCard}
                onPress={() => toggleFAQ(index)}
                activeOpacity={0.8}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Animated.View
                    style={{
                      transform: [
                        { rotate: expandedIndex === index ? "90deg" : "0deg" },
                      ],
                    }}
                  >
                    <ChevronRight size={20} color={Colors.charcoal} />
                  </Animated.View>
                </View>
                {expandedIndex === index && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactDescription}>
              Contact our support team for personalized assistance
            </Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => router.push("/help-support")}
            >
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    textAlign: "center",
  },
  faqList: {
    gap: 12,
    marginBottom: 24,
  },
  faqCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    lineHeight: 22,
    marginTop: 12,
  },
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 20,
  },
  contactButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: Colors.pastelYellow,
    borderRadius: 24,
    shadowColor: Colors.pastelYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  bottomSpacer: {
    height: 40,
  },
});
