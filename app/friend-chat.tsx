import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Send, Smile, Image as ImageIcon } from "lucide-react-native";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { useFriends } from "@/contexts/FriendsContext";

const { width } = Dimensions.get("window");

type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: Date;
};

export default function FriendChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ friendId: string }>();
  const { getFriend, addMessage, getMessages } = useFriends();
  const scrollViewRef = useRef<ScrollView>(null);
  
  console.log('=== FriendChatScreen MOUNTED ===');
  console.log('params:', JSON.stringify(params));
  console.log('params type:', typeof params);
  console.log('params.friendId:', params.friendId);
  console.log('params.friendId type:', typeof params.friendId);
  
  const friendId = React.useMemo(() => {
    if (!params.friendId) {
      console.error('NO FRIEND ID IN PARAMS!');
      return "";
    }
    const id = Array.isArray(params.friendId) ? params.friendId[0] : params.friendId;
    console.log('Extracted friendId:', id);
    return id;
  }, [params.friendId]);
  
  const [friend, setFriend] = useState<ReturnType<typeof getFriend>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  React.useEffect(() => {
    console.log('=== useEffect TRIGGERED ===');
    console.log('friendId in useEffect:', friendId);
    
    if (!friendId) {
      console.error('NO FRIEND ID! Cannot load friend data');
      return;
    }
    
    const foundFriend = getFriend(friendId);
    console.log('Friend lookup result:', foundFriend ? 'FOUND' : 'NOT FOUND');
    if (foundFriend) {
      console.log('Friend data:', JSON.stringify(foundFriend));
    }
    
    setFriend(foundFriend);
    
    if (foundFriend) {
      const storedMessages = getMessages(friendId);
      console.log('Stored messages count:', storedMessages.length);
      
      if (storedMessages.length === 0) {
        const initialMessage: Message = {
          id: "initial",
          text: "What's the plan",
          sender: "them",
          timestamp: new Date(),
        };
        setMessages([initialMessage]);
      } else {
        setMessages(storedMessages);
      }
    } else {
      console.error('Friend not found with ID:', friendId);
    }
  }, [friendId]);

  const handleSend = async () => {
    if (inputText.trim().length === 0 || !friendId) return;

    const messageText = inputText.trim();
    setInputText("");

    await addMessage(friendId, {
      text: messageText,
      sender: "me",
    });

    const updatedMessages = getMessages(friendId);
    setMessages(updatedMessages);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(async () => {
      const responses = [
        "That's awesome! 😄",
        "Tell me more!",
        "I totally agree!",
        "What do you think about that?",
        "Sounds interesting! 🤔",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      await addMessage(friendId, {
        text: randomResponse,
        sender: "them",
      });

      const updatedMessagesAfterResponse = getMessages(friendId);
      setMessages(updatedMessagesAfterResponse);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={["#A78BFA", "#7C3AED"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.white} strokeWidth={2.5} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.newFriendBadge}>✨ New Friend! ✨</Text>
          <Text style={styles.headerTitle}>{friend?.name || "Friend"}</Text>
          <Text style={styles.headerSubtitle}>{friend?.isOnline ? "Active now" : "Offline"}</Text>
        </View>

        <View style={styles.headerRight} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === "me" ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sender === "me" ? styles.myMessageText : styles.theirMessageText,
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  message.sender === "me" ? styles.myTimestamp : styles.theirTimestamp,
                ]}
              >
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Smile size={24} color={Colors.pastelPurple} strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <ImageIcon size={24} color={Colors.pastelPurple} strokeWidth={2} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            returnKeyType="default"
            blurOnSubmit={false}
          />

          <TouchableOpacity
            style={[styles.sendButton, inputText.trim().length === 0 && styles.sendButtonDisabled]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={inputText.trim().length === 0}
          >
            <LinearGradient
              colors={inputText.trim().length > 0 ? ["#A78BFA", "#7C3AED"] : ["#4B5563", "#374151"]}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Send size={20} color={Colors.white} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  newFriendBadge: {
    fontSize: 13,
    fontWeight: "800" as const,
    color: Colors.pastelYellow,
    marginBottom: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "rgba(255, 255, 255, 0.8)",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    marginVertical: 4,
    padding: 12,
    borderRadius: 20,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.pastelPurple,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#2D2D2D",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  myMessageText: {
    color: Colors.white,
    fontWeight: "500" as const,
  },
  theirMessageText: {
    color: Colors.white,
    fontWeight: "400" as const,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
  myTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  theirTimestamp: {
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#1A1A1A",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  input: {
    flex: 1,
    backgroundColor: "#2D2D2D",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.white,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
