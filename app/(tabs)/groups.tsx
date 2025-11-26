import { LinearGradient } from "expo-linear-gradient";
import { MessageCircle, Send, Search } from "lucide-react-native";
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
  type: "date" | "friend" | "group";
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
    type: "date",
  },
  {
    id: "2",
    name: "Sarah Miller",
    avatar: "👩",
    lastMessage: "I'd love to grab coffee sometime!",
    timestamp: "1h ago",
    unread: 0,
    interests: ["☕ Coffee", "📚 Reading", "🎨 Art"],
    type: "friend",
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "👨",
    lastMessage: "Haha that's awesome!",
    timestamp: "3h ago",
    unread: 1,
    interests: ["🏋️ Fitness", "🍜 Food", "🎬 Movies"],
    type: "group",
  },
];

export default function WhatsThePlanScreen() {
  const insets = useSafeAreaInsets();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchText, setSearchText] = useState("");
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

  const filteredMatches = MATCHES.filter(match => 
    match.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (selectedMatch) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.background, Colors.backgroundLight]}
          style={styles.container}
        >
          <KeyboardAvoidingView
            style={styles.chatContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={0}
          >
            <View style={[styles.chatHeader, { paddingTop: insets.top + 16 }]}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedMatch(null)}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <View style={styles.chatHeaderInfo}>
                <View style={styles.chatHeaderAvatarContainer}>
                  <Text style={styles.chatHeaderAvatar}>{selectedMatch.avatar}</Text>
                </View>
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
                  <Text style={[styles.messageText, message.sender === "me" && styles.myMessageText]}>{message.text}</Text>
                  <Text style={[styles.messageTime, message.sender === "me" && styles.myMessageTime]}>{message.timestamp}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={[styles.inputSection, { paddingBottom: Math.max(insets.bottom, 12) }]}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor={Colors.textTertiary}
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>
              Connect with your matches
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchWrapper}>
              <Search size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search conversations..."
                placeholderTextColor={Colors.textTertiary}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>

          <View style={styles.matchesContainer}>
            {filteredMatches.map((match) => (
              <TouchableOpacity
                key={match.id}
                style={styles.matchCard}
                onPress={() => setSelectedMatch(match)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    match.type === "date"
                      ? Colors.gradient1 as [string, string, ...string[]]
                      : match.type === "group"
                      ? Colors.gradient3 as [string, string, ...string[]]
                      : Colors.gradient2 as [string, string, ...string[]]
                  }
                  style={styles.matchAvatarGradient}
                >
                  <Text style={styles.matchAvatarEmoji}>{match.avatar}</Text>
                </LinearGradient>
                {match.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{match.unread}</Text>
                  </View>
                )}

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

                <MessageCircle size={24} color={Colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>💬 Conversation Tips</Text>
            <Text style={styles.infoText}>
              • Ask about their interests{"\n"}
              • Suggest specific date ideas{"\n"}
              • Be genuine and respectful{"\n"}
              • Start conversations that lead to connections
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </View>
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
    fontSize: 36,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500" as const,
  },
  matchesContainer: {
    gap: 14,
    marginBottom: 24,
  },
  matchCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    position: "relative" as const,
  },
  matchAvatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  matchAvatarEmoji: {
    fontSize: 32,
  },
  unreadBadge: {
    position: "absolute" as const,
    top: 12,
    left: 60,
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: "800" as const,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  matchInfo: {
    flex: 1,
    gap: 6,
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  matchTimestamp: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textTertiary,
  },
  matchLastMessage: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
  },
  interestsRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
    flexWrap: "wrap",
  },
  interestTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 10,
  },
  interestText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 14,
  },
  infoText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 20,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.backgroundElevated,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 22,
    color: Colors.text,
    fontWeight: "600" as const,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chatHeaderAvatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  chatHeaderAvatar: {
    fontSize: 24,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  interestsRowSmall: {
    flexDirection: "row",
    gap: 6,
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
    padding: 14,
    borderRadius: 18,
    marginBottom: 4,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  myMessageText: {
    color: Colors.white,
  },
  messageTime: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.textTertiary,
  },
  myMessageTime: {
    color: Colors.white,
    opacity: 0.7,
  },
  inputSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
