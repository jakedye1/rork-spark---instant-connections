import { LinearGradient } from "expo-linear-gradient";
import { Send, Search, ChevronLeft } from "lucide-react-native";
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
import { GlassCard } from "@/components/GlassCard";
import { GlassInput } from "@/components/GlassInput";

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

export default function MessagesScreen() {
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
            {/* Chat Header */}
            <View style={[styles.chatHeader, { paddingTop: insets.top + 8 }]}>
               <GlassCard intensity={30} style={styles.headerGlass}>
                  <View style={styles.headerRow}>
                     <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setSelectedMatch(null)}
                     >
                        <ChevronLeft size={28} color={Colors.white} />
                     </TouchableOpacity>
                     
                     <View style={styles.chatHeaderInfo}>
                        <LinearGradient
                           colors={Colors.gradientPrimary as [string, string, ...string[]]}
                           style={styles.avatarGradient}
                        >
                           <Text style={styles.avatarEmoji}>{selectedMatch.avatar}</Text>
                        </LinearGradient>
                        
                        <View style={styles.chatHeaderText}>
                           <Text style={styles.chatHeaderName}>{selectedMatch.name}</Text>
                           <Text style={styles.chatHeaderStatus}>Online</Text>
                        </View>
                     </View>
                  </View>
               </GlassCard>
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
                    styles.messageBubbleWrapper,
                    message.sender === "me" ? styles.myMessageWrapper : styles.theirMessageWrapper,
                  ]}
                >
                   <GlassCard 
                     intensity={message.sender === "me" ? 40 : 20} 
                     style={[
                       styles.messageBubble,
                       message.sender === "me" ? styles.myMessage : styles.theirMessage
                     ]}
                     variant={message.sender === "me" ? "default" : "dark"}
                   >
                     <Text style={[styles.messageText, message.sender === "me" && styles.myMessageText]}>
                       {message.text}
                     </Text>
                     <Text style={[styles.messageTime, message.sender === "me" && styles.myMessageTime]}>
                       {message.timestamp}
                     </Text>
                   </GlassCard>
                </View>
              ))}
            </ScrollView>

            <View style={[styles.inputSection, { paddingBottom: Math.max(insets.bottom, 12) }]}>
              <GlassCard intensity={20} style={styles.inputGlass}>
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
                      <LinearGradient
                        colors={Colors.gradientPrimary as [string, string, ...string[]]}
                        style={styles.sendGradient}
                      >
                         <Send size={18} color={Colors.charcoal} />
                      </LinearGradient>
                    </TouchableOpacity>
                 </View>
              </GlassCard>
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
          </View>

          <View style={styles.searchContainer}>
             <GlassInput
                placeholder="Search conversations..."
                value={searchText}
                onChangeText={setSearchText}
                icon={<Search size={20} color={Colors.textSecondary} />}
             />
          </View>

          <View style={styles.matchesContainer}>
            {filteredMatches.map((match) => (
              <TouchableOpacity
                key={match.id}
                onPress={() => setSelectedMatch(match)}
                activeOpacity={0.8}
              >
                <GlassCard intensity={20} style={styles.matchCard}>
                   <View style={styles.matchCardContent}>
                      <LinearGradient
                         colors={[Colors.glassLight, Colors.glass]}
                         style={styles.matchAvatarContainer}
                      >
                         <Text style={styles.matchAvatarEmoji}>{match.avatar}</Text>
                      </LinearGradient>
                      
                      <View style={styles.matchInfo}>
                         <View style={styles.matchHeader}>
                            <Text style={styles.matchName}>{match.name}</Text>
                            <Text style={styles.matchTimestamp}>{match.timestamp}</Text>
                         </View>
                         <Text style={styles.matchLastMessage} numberOfLines={1}>
                            {match.lastMessage}
                         </Text>
                      </View>
                      
                      {match.unread > 0 && (
                         <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{match.unread}</Text>
                         </View>
                      )}
                   </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
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
    backgroundColor: Colors.background,
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
    fontWeight: "900",
    color: Colors.white,
    marginBottom: 8,
  },
  searchContainer: {
    marginBottom: 8,
  },
  matchesContainer: {
    gap: 12,
  },
  matchCard: {
    borderRadius: 24,
  },
  matchCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  matchAvatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  matchAvatarEmoji: {
    fontSize: 24,
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
    fontWeight: "700",
    color: Colors.white,
  },
  matchTimestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  matchLastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.babyBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.charcoal,
  },
  bottomSpacer: {
    height: 80,
  },
  // Chat Screen Styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  headerGlass: {
    borderRadius: 24,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 20,
  },
  chatHeaderText: {
    justifyContent: "center",
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: Colors.babyBlue,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  messageBubbleWrapper: {
    width: "100%",
  },
  myMessageWrapper: {
    alignItems: "flex-end",
  },
  theirMessageWrapper: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 20,
    padding: 16,
  },
  myMessage: {
    borderBottomRightRadius: 4,
    borderColor: Colors.babyBlue,
  },
  theirMessage: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  myMessageText: {
    color: Colors.white,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 6,
    color: Colors.textTertiary,
    alignSelf: "flex-end",
  },
  myMessageTime: {
    color: "rgba(255,255,255,0.6)",
  },
  inputSection: {
    paddingHorizontal: 16,
  },
  inputGlass: {
    borderRadius: 30,
    overflow: "hidden",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingLeft: 20,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 10,
  },
  sendButton: {
    marginLeft: 8,
  },
  sendGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
