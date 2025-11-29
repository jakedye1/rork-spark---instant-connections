import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronRight,
  MessageCircle,
  Mail,
  FileText,
  AlertCircle,
  Shield,
  HelpCircle,
  ExternalLink,
  Phone,
  X,
  Send,
} from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Platform,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useRorkAgent, createRorkTool } from "@rork/toolkit-sdk";
import { z } from "zod";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    question: "How do I start a video call?",
    answer: "Go to the Home tab and tap on any profile card. You'll see options to start a video call or add them to your connections.",
  },
  {
    question: "How do I create or join a group?",
    answer: "Navigate to the Groups tab, where you can browse existing groups or create your own based on shared interests.",
  },
  {
    question: "How do I change my preferences?",
    answer: "Go to Profile > Account Settings to update your location, distance preferences, and other settings.",
  },
  {
    question: "What is Premium?",
    answer: "Premium gives you unlimited video calls, ad-free experience, priority matching, and exclusive features.",
  },
  {
    question: "How do I report someone?",
    answer: "Go to Privacy & Safety settings to report users or block them. We take safety seriously and review all reports.",
  },
  {
    question: "How do I delete my account?",
    answer: "Contact our support team via email to request account deletion. We'll process your request within 48 hours.",
  },
];



export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, error, sendMessage } = useRorkAgent({
    tools: {
      searchFAQ: createRorkTool({
        description: "Search through FAQ to find relevant answers to user questions",
        zodSchema: z.object({
          query: z.string().describe("Search query to find in FAQ"),
        }),
        execute(input) {
          console.log('Searching FAQ for:', input.query);
          const query = input.query.toLowerCase();
          const results = FAQ_DATA.filter(
            (faq) =>
              faq.question.toLowerCase().includes(query) ||
              faq.answer.toLowerCase().includes(query)
          );
          if (results.length > 0) {
            return results.map(r => `Q: ${r.question}\nA: ${r.answer}`).join('\n\n');
          }
          return "No results found in FAQ. Try rephrasing your question or contact support.";
        },
      }),
      escalateToHuman: createRorkTool({
        description: "Escalate the conversation to a human support agent when needed",
        zodSchema: z.object({
          reason: z.string().describe("Reason for escalation"),
        }),
        execute(input) {
          console.log('Escalating to human support:', input.reason);
          return "Your request has been escalated to our support team. They'll contact you via email within 24 hours.";
        },
      }),
    },
  });

  useEffect(() => {
    if (messages.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleEmailSupport = async () => {
    const email = "support@sparkapp.com";
    const subject = "Support Request";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Email Not Available",
          `Please email us at ${email}`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Failed to open email:", error);
      Alert.alert("Error", "Failed to open email client");
    }
  };

  const handleCallSupport = async () => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Phone Support",
        "Call us at: 1-800-SPARK-APP",
        [{ text: "OK" }]
      );
      return;
    }

    const phoneNumber = "tel:18007727527";
    try {
      const canOpen = await Linking.canOpenURL(phoneNumber);
      if (canOpen) {
        await Linking.openURL(phoneNumber);
      } else {
        Alert.alert(
          "Phone Not Available",
          "Call us at: 1-800-SPARK-APP",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Failed to open phone:", error);
      Alert.alert("Error", "Failed to open phone dialer");
    }
  };

  const handleOpenTerms = () => {
    console.log('Terms of Service button pressed - navigating to /terms');
    router.push('/terms');
  };

  const handleOpenPrivacy = () => {
    console.log('Privacy Policy button pressed - navigating to /privacy-policy');
    router.push('/privacy-policy');
  };

  const handleOpenAbout = () => {
    console.log('About Spark button pressed - navigating to /about');
    router.push('/about');
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert("Empty Feedback", "Please enter your feedback before submitting.");
      return;
    }

    Alert.alert(
      "Feedback Submitted",
      "Thank you for your feedback! We'll review it and get back to you soon.",
      [
        {
          text: "OK",
          onPress: () => setFeedbackText(""),
        },
      ]
    );
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleOpenLiveChat = () => {
    console.log('Opening live chat modal');
    setShowLiveChat(true);
  };

  const handleCloseLiveChat = () => {
    console.log('Closing live chat modal');
    setShowLiveChat(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    console.log('Sending message:', chatInput);
    const messageText = chatInput;
    setChatInput("");

    try {
      await sendMessage(messageText);
    } catch (err) {
      console.error('Failed to send message:', err);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.contactRow}
                onPress={handleEmailSupport}
              >
                <View style={styles.contactLeft}>
                  <Mail size={24} color={Colors.charcoal} />
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactTitle}>Email Support</Text>
                    <Text style={styles.contactDescription}>
                      support@sparkapp.com
                    </Text>
                  </View>
                </View>
                <ExternalLink size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.contactRow}
                onPress={handleCallSupport}
              >
                <View style={styles.contactLeft}>
                  <Phone size={24} color={Colors.charcoal} />
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactTitle}>Phone Support</Text>
                    <Text style={styles.contactDescription}>
                      1-800-SPARK-APP
                    </Text>
                  </View>
                </View>
                <ExternalLink size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.contactRow}
                onPress={handleOpenLiveChat}
              >
                <View style={styles.contactLeft}>
                  <MessageCircle size={24} color={Colors.charcoal} />
                  <View style={styles.contactTextContainer}>
                    <Text style={styles.contactTitle}>Live Chat</Text>
                    <Text style={styles.contactDescription}>
                      AI-powered instant support
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            <View style={styles.card}>
              {FAQ_DATA.map((faq, index) => (
                <View key={index}>
                  {index > 0 && <View style={styles.divider} />}
                  <TouchableOpacity
                    style={styles.faqRow}
                    onPress={() => toggleFAQ(index)}
                  >
                    <View style={styles.faqLeft}>
                      <HelpCircle size={24} color={Colors.charcoal} />
                      <View style={styles.faqTextContainer}>
                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                        {expandedFAQ === index && (
                          <Text style={styles.faqAnswer}>{faq.answer}</Text>
                        )}
                      </View>
                    </View>
                    <ChevronRight
                      size={20}
                      color={Colors.mediumGray}
                      style={{
                        transform: [
                          { rotate: expandedFAQ === index ? "90deg" : "0deg" },
                        ],
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Send Feedback</Text>
            <View style={styles.card}>
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackLabel}>
                  We&apos;d love to hear from you!
                </Text>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Share your thoughts, suggestions, or report issues..."
                  placeholderTextColor={Colors.mediumGray}
                  multiline
                  numberOfLines={6}
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitFeedback}
                >
                  <Text style={styles.submitButtonText}>Submit Feedback</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal & Policies</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.legalRow}
                onPress={handleOpenTerms}
              >
                <View style={styles.legalLeft}>
                  <FileText size={24} color={Colors.charcoal} />
                  <Text style={styles.legalText}>Terms of Service</Text>
                </View>
                <ExternalLink size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.legalRow}
                onPress={handleOpenPrivacy}
              >
                <View style={styles.legalLeft}>
                  <Shield size={24} color={Colors.charcoal} />
                  <Text style={styles.legalText}>Privacy Policy</Text>
                </View>
                <ExternalLink size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.legalRow} onPress={handleOpenAbout}>
                <View style={styles.legalLeft}>
                  <AlertCircle size={24} color={Colors.charcoal} />
                  <Text style={styles.legalText}>About Spark</Text>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.versionCard}>
              <Text style={styles.versionText}>Spark App v1.0.0</Text>
              <Text style={styles.versionSubtext}>
                © 2025 Spark. All rights reserved.
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showLiveChat}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseLiveChat}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[Colors.babyBlue, Colors.pastelYellow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalGradient}
          >
            <SafeAreaView style={styles.modalSafeArea} edges={["top"]}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <MessageCircle size={24} color={Colors.charcoal} />
                  <View>
                    <Text style={styles.modalTitle}>Live Support</Text>
                    <Text style={styles.modalSubtitle}>AI-powered assistance</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseLiveChat}
                >
                  <X size={24} color={Colors.charcoal} />
                </TouchableOpacity>
              </View>

              <ScrollView
                ref={scrollViewRef}
                style={styles.chatScrollView}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
              >
                {messages.length === 0 && (
                  <View style={styles.welcomeContainer}>
                    <MessageCircle size={48} color={Colors.charcoal} opacity={0.3} />
                    <Text style={styles.welcomeTitle}>Welcome to Live Support!</Text>
                    <Text style={styles.welcomeText}>
                      I&apos;m here to help answer your questions about Spark.
                    </Text>
                    <Text style={styles.welcomeText}>
                      Ask me anything about features, settings, or troubleshooting.
                    </Text>
                  </View>
                )}

                {messages.map((m) => {
                  if (m.role === "system") return null;
                  return (
                  <View
                    key={m.id}
                    style={[
                      styles.messageContainer,
                      m.role === "user"
                        ? styles.userMessageContainer
                        : styles.assistantMessageContainer,
                    ]}
                  >
                    {m.parts.map((part, i) => {
                      if (part.type === "text" && part.text) {
                        return (
                          <View
                            key={`${m.id}-${i}`}
                            style={[
                              styles.messageBubble,
                              m.role === "user"
                                ? styles.userBubble
                                : styles.assistantBubble,
                            ]}
                          >
                            <Text
                              style={[
                                styles.messageText,
                                m.role === "user"
                                  ? styles.userMessageText
                                  : styles.assistantMessageText,
                              ]}
                            >
                              {part.text}
                            </Text>
                          </View>
                        );
                      }

                      if (part.type === "tool") {
                        const toolName = part.toolName || "tool";

                        if (
                          part.state === "input-streaming" ||
                          part.state === "input-available"
                        ) {
                          return (
                            <View
                              key={`${m.id}-${i}`}
                              style={styles.toolMessageContainer}
                            >
                              <ActivityIndicator
                                size="small"
                                color={Colors.charcoal}
                              />
                              <Text style={styles.toolMessageText}>
                                {toolName === "searchFAQ"
                                  ? "Searching FAQ..."
                                  : "Processing..."}
                              </Text>
                            </View>
                          );
                        }

                        if (part.state === "output-error") {
                          return (
                            <View
                              key={`${m.id}-${i}`}
                              style={styles.errorMessageContainer}
                            >
                              <Text style={styles.errorMessageText}>
                                Error: {part.errorText || "Something went wrong"}
                              </Text>
                            </View>
                          );
                        }
                      }

                      return null;
                    })}
                  </View>
                );})}

                {error && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={20} color={Colors.charcoal} />
                    <Text style={styles.errorText}>
                      {error.message || "Failed to connect. Please try again."}
                    </Text>
                  </View>
                )}
              </ScrollView>

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
              >
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.chatInput}
                      placeholder="Ask me anything..."
                      placeholderTextColor={Colors.mediumGray}
                      value={chatInput}
                      onChangeText={setChatInput}
                      multiline
                      maxLength={500}
                      returnKeyType="send"
                      onSubmitEditing={handleSendMessage}
                      blurOnSubmit={false}
                    />
                    <TouchableOpacity
                      style={[
                        styles.sendButton,
                        !chatInput.trim() && styles.sendButtonDisabled,
                      ]}
                      onPress={handleSendMessage}
                      disabled={!chatInput.trim()}
                    >
                      <Send
                        size={20}
                        color={
                          chatInput.trim() ? Colors.charcoal : Colors.mediumGray
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </LinearGradient>
        </View>
      </Modal>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
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
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginLeft: 52,
  },
  faqRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 16,
  },
  faqLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
  },
  faqTextContainer: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    marginTop: 8,
    lineHeight: 20,
  },
  feedbackContainer: {
    padding: 16,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginBottom: 12,
  },
  feedbackInput: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    minHeight: 120,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: Colors.softPink,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  legalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  legalLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  legalText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
  },
  versionCard: {
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
  versionText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.6,
  },
  bottomSpacer: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
  },
  modalGradient: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  modalSubtitle: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.6,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  chatScrollView: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
  },
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginTop: 16,
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  assistantMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: Colors.softPink,
  },
  assistantBubble: {
    backgroundColor: Colors.white,
  },
  messageText: {
    fontSize: 15,
    fontWeight: "500" as const,
    lineHeight: 20,
  },
  userMessageText: {
    color: Colors.charcoal,
  },
  assistantMessageText: {
    color: Colors.charcoal,
  },
  toolMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    maxWidth: "80%",
  },
  toolMessageText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  errorMessageContainer: {
    backgroundColor: "#FFE5E5",
    borderRadius: 16,
    padding: 12,
    maxWidth: "80%",
  },
  errorMessageText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: "#D32F2F",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: "#D32F2F",
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chatInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.softPink,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
});
