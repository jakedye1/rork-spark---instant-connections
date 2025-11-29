import { LinearGradient } from "expo-linear-gradient";
import { MessageCircle, Send } from "lucide-react-native";
import React, { useState } from "react";
import {
	  StyleSheet,
	  Text,
	  View,
	  TouchableOpacity,
	  ScrollView,
	  TextInput,
	  KeyboardAvoidingView,
	  Platform,
	  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
	
type Match = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  interests: string[];
};

type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
};
	
const MATCHES: Match[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "👤",
    lastMessage: "That sounds great! When are you free?",
    timestamp: "2m ago",
    unread: 2,
    interests: ["🎮 Gaming", "🎵 Music", "🌍 Travel"],
  },
  {
    id: "2",
    name: "Sarah Miller",
    avatar: "👩",
    lastMessage: "I'd love to grab coffee sometime!",
    timestamp: "1h ago",
    unread: 0,
    interests: ["☕ Coffee", "📚 Reading", "🎨 Art"],
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "👨",
    lastMessage: "Haha that's awesome!",
    timestamp: "3h ago",
    unread: 1,
    interests: ["🏋️ Fitness", "🍜 Food", "🎬 Movies"],
  },
];

export default function WhatsThePlanScreen() {
  const insets = useSafeAreaInsets();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messageText, setMessageText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! Great to match with you!",
      sender: "them",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      text: "Hi! I saw you're into gaming too!",
      sender: "me",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      text: "Yeah! What games do you play?",
      sender: "them",
      timestamp: "10:33 AM",
    },
    {
      id: "4",
      text: "Mostly RPGs and adventure games. Want to meet up sometime?",
      sender: "me",
      timestamp: "10:35 AM",
    },
    {
      id: "5",
      text: "That sounds great! When are you free?",
      sender: "them",
      timestamp: "10:36 AM",
    },
  ]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      console.log('Refreshed matches');
      setRefreshing(false);
    }, 1000);
  }, []);

  if (selectedMatch) {
    return (
      <LinearGradient
        colors={[Colors.babyBlue, Colors.pastelYellow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <View style={[styles.chatHeader, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedMatch(null)}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderAvatar}>{selectedMatch.avatar}</Text>
              <View style={styles.chatHeaderText}>
                <Text style={styles.chatHeaderName}>{selectedMatch.name}</Text>
                <View style={styles.interestsRowSmall}>
                  {selectedMatch.interests.slice(0, 2).map((interest, idx) => (
                    <Text key={idx} style={styles.interestSmall}>{interest.split(" ")[0]}</Text>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.sender === "me" ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageTime}>{message.timestamp}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.planDateSection, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor={Colors.mediumGray}
                value={messageText}
                onChangeText={setMessageText}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Send size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.babyBlue, Colors.pastelYellow]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.charcoal} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>What&apos;s the Plan?</Text>
          <Text style={styles.subtitle}>
            Message your matches and plan your first date
          </Text>
        </View>

        <View style={styles.matchesContainer}>
          {MATCHES.map((match) => (
            <TouchableOpacity
              key={match.id}
              style={styles.matchCard}
              onPress={() => setSelectedMatch(match)}
            >
              <View style={styles.matchAvatar}>
                <Text style={styles.matchAvatarEmoji}>{match.avatar}</Text>
                {match.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{match.unread}</Text>
                  </View>
                )}
              </View>

              <View style={styles.matchInfo}>
                <View style={styles.matchHeader}>
                  <Text style={styles.matchName}>{match.name}</Text>
                  <Text style={styles.matchTimestamp}>{match.timestamp}</Text>
                </View>
                <Text style={styles.matchLastMessage} numberOfLines={1}>
                  {match.lastMessage}
                </Text>
                <View style={styles.interestsRow}>
                  {match.interests.map((interest, idx) => (
                    <View key={idx} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <MessageCircle size={24} color={Colors.charcoal} opacity={0.3} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Tips for Great Conversations</Text>
          <Text style={styles.infoText}>
            • Ask about their interests{"\n"}
            • Suggest specific date ideas{"\n"}
            • Be genuine and respectful{"\n"}
            • Start conversations that lead to great connections
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  matchesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  matchCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  matchAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
  },
  matchAvatarEmoji: {
    fontSize: 28,
  },
  unreadBadge: {
    position: "absolute" as const,
    top: -4,
    right: -4,
    backgroundColor: Colors.pastelYellow,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  matchInfo: {
    flex: 1,
    gap: 4,
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  matchTimestamp: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: Colors.mediumGray,
  },
  matchLastMessage: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  interestsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
    flexWrap: "wrap",
  },
  interestTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  interestText: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: Colors.charcoal,
  },
  infoBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 20,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: Colors.charcoal,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chatHeaderAvatar: {
    fontSize: 32,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  interestsRowSmall: {
    flexDirection: "row",
    gap: 4,
    marginTop: 2,
  },
  interestSmall: {
    fontSize: 14,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.pastelYellow,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
  },
  messageText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.5,
  },
  planDateSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
});
