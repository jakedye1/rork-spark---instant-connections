import { useRouter } from "expo-router";
import { X, Volume2, VolumeX, MessageCircle, Send, Mic, MicOff, Video, VideoOff } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useChats } from "@/contexts/ChatsContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { CameraView } from "expo-camera";

const { width, height } = Dimensions.get("window");

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
};

export default function GroupVideoChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { decrementCall } = useAuth();
  const { addChat, addMessage: addChatMessage } = useChats();
  const { cameraPermission, microphonePermission, requestAllPermissions } = usePermissions();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  console.log('=== GroupVideoChatScreen mounted ===');
  const [isMuted, setIsMuted] = useState(false);
  const [hasDecrementedCall, setHasDecrementedCall] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Group",
      text: "What's the plan",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const chatSlideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      if (Platform.OS === 'web') {
        setPermissionsGranted(true);
        return;
      }
      
      if (cameraPermission === 'granted' && microphonePermission === 'granted') {
        setPermissionsGranted(true);
      } else {
        const result = await requestAllPermissions();
        setPermissionsGranted(result.camera && result.microphone);
        
        if (!result.camera || !result.microphone) {
          console.log('Permissions not granted, navigating back');
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)/home');
          }
        }
      }
    };
    
    checkAndRequestPermissions();
  }, [cameraPermission, microphonePermission, requestAllPermissions, router]);

  useEffect(() => {
    if (!hasDecrementedCall && permissionsGranted) {
      decrementCall();
      setHasDecrementedCall(true);
    }
  }, [hasDecrementedCall, decrementCall, permissionsGranted]);

  useEffect(() => {
    const initChat = async () => {
      if (!currentChatId) {
        const chatId = await addChat({
          type: "group",
          name: "Group Chat",
          isActive: true,
        });
        setCurrentChatId(chatId);
        
        await addChatMessage(chatId, {
          text: "What's the plan",
          sender: "Group",
        });
      }
    };
    
    initChat();
  }, []);

  useEffect(() => {
    Animated.spring(chatSlideAnim, {
      toValue: showChat ? 0 : width,
      useNativeDriver: true,
      tension: 50,
      friction: 10,
    }).start();
  }, [showChat, chatSlideAnim]);

  const handleExit = () => {
    console.log("Exiting group video chat, navigating to home");
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleSendMessage = async () => {
    if (messageText.trim() && currentChatId) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "You",
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
      
      await addChatMessage(currentChatId, {
        text: newMessage.text,
        sender: "me",
      });
    }
  };

  if (!permissionsGranted) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.loadingText}>Requesting camera and microphone access...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.remoteVideo}>
        <View style={styles.placeholderVideo}>
          <Text style={styles.placeholderEmoji}>👥</Text>
          <Text style={styles.placeholderText}>Connecting to group...</Text>
        </View>
      </View>

      <View style={[styles.localVideo, { top: 50 + insets.top }]}>
        {isVideoOff ? (
          <View style={[styles.placeholderVideoSmall, styles.videoOffOverlay]}>
            <View style={styles.videoOffContainer}>
              <View style={styles.videoOffIconCircle}>
                <Text style={styles.videoOffEmoji}>😊</Text>
              </View>
            </View>
          </View>
        ) : Platform.OS !== 'web' && permissionsGranted ? (
          <CameraView 
            style={styles.cameraView} 
            facing="front"
          />
        ) : (
          <View style={styles.placeholderVideoSmall}>
            <Text style={styles.placeholderEmojiSmall}>📹</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={[styles.closeButton, { top: 50 + insets.top }]} onPress={handleExit}>
        <X size={24} color={Colors.white} />
      </TouchableOpacity>

      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <View style={styles.controlsWrapper}>
          <View style={styles.mainControls}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <View style={styles.controlButtonInner}>
                {isMuted ? (
                  <MicOff size={26} color={Colors.white} strokeWidth={2.5} />
                ) : (
                  <Mic size={26} color={Colors.white} strokeWidth={2.5} />
                )}
              </View>
              <Text style={styles.controlLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
              onPress={() => setIsVideoOff(!isVideoOff)}
            >
              <View style={styles.controlButtonInner}>
                {isVideoOff ? (
                  <VideoOff size={26} color={Colors.white} strokeWidth={2.5} />
                ) : (
                  <Video size={26} color={Colors.white} strokeWidth={2.5} />
                )}
              </View>
              <Text style={styles.controlLabel}>{isVideoOff ? "Turn On" : "Turn Off"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, !isSpeakerOn && styles.controlButtonActive]}
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              <View style={styles.controlButtonInner}>
                {isSpeakerOn ? (
                  <Volume2 size={26} color={Colors.white} strokeWidth={2.5} />
                ) : (
                  <VolumeX size={26} color={Colors.white} strokeWidth={2.5} />
                )}
              </View>
              <Text style={styles.controlLabel}>Speaker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowChat(!showChat)}
            >
              <View style={[styles.controlButtonInner, showChat && styles.chatButtonActive]}>
                <MessageCircle size={26} color={Colors.white} strokeWidth={2.5} />
                {messages.length > 0 && (
                  <View style={styles.chatBadge}>
                    <Text style={styles.chatBadgeText}>{messages.length}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.controlLabel}>Chat</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.endCallButton} onPress={handleExit}>
            <View style={styles.endCallButtonInner}>
              <X size={28} color={Colors.white} strokeWidth={3} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Animated.View
        style={[
          styles.chatPanel,
          {
            transform: [{ translateX: chatSlideAnim }],
          },
        ]}
      >
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>What&apos;s the Plan?</Text>
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <X size={24} color={Colors.charcoal} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View key={message.id} style={styles.messageBubble}>
                <Text style={styles.messageSender}>{message.sender}</Text>
                <Text style={styles.messageText}>{message.text}</Text>
                <Text style={styles.messageTime}>{message.timestamp}</Text>
              </View>
            ))}
          </ScrollView>

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
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  cameraView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  remoteVideo: {
    width: width,
    height: height,
    position: "absolute" as const,
  },
  placeholderVideo: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 100,
    marginBottom: 20,
    textShadowColor: "rgba(252, 211, 77, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  placeholderText: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.white,
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  localVideo: {
    position: "absolute" as const,
    right: 20,
    width: 130,
    height: 170,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#FCD34D",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  placeholderVideoSmall: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmojiSmall: {
    fontSize: 48,
  },
  videoOffOverlay: {
    backgroundColor: "#1A1A1A",
  },
  videoOffContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  videoOffIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  videoOffEmoji: {
    fontSize: 28,
  },
  safeArea: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
  },
  closeButton: {
    position: "absolute" as const,
    left: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  controlsWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
    gap: 20,
  },
  mainControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 20,
    width: "100%",
    maxWidth: 500,
  },
  controlButton: {
    alignItems: "center",
    gap: 8,
  },
  controlButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  controlButtonActive: {
    opacity: 1,
  },
  chatButtonActive: {
    backgroundColor: Colors.pastelYellow,
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.white,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  chatBadge: {
    position: "absolute" as const,
    top: -4,
    right: -4,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  chatBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  endCallButton: {
    alignItems: "center",
  },
  endCallButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 15,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  chatPanel: {
    position: "absolute" as const,
    top: 0,
    right: 0,
    width: width,
    height: height,
    backgroundColor: Colors.white,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 16,
    backgroundColor: Colors.pastelYellow,
    borderBottomWidth: 0,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chatTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    letterSpacing: 0.5,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  messageText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    marginBottom: 6,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
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
