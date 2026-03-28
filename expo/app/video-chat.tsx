import { useRouter } from "expo-router";
import { X, Volume2, VolumeX, SkipForward, Heart, Sparkles, MessageCircle, Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useChats } from "@/contexts/ChatsContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { CameraView } from "expo-camera";

const { width, height } = Dimensions.get("window");

const MOCK_NAMES = [
  "Sarah M.", "Alex K.", "Jordan T.", "Taylor S.", "Morgan L.",
  "Casey R.", "Riley P.", "Jamie W.", "Quinn H.", "Avery C.",
];

const MOCK_AGES = ["22", "25", "28", "24", "30", "26", "23", "27", "29", "31"];

type ChatMessage = {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
};

export default function VideoChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { decrementCall, user } = useAuth();
  const { addChat, addMessage: addChatMessage } = useChats();
  const { cameraPermission, microphonePermission, requestAllPermissions } = usePermissions();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  console.log('=== VideoChatScreen mounted ===');
  const [timer, setTimer] = useState(5);
  const [phase, setPhase] = useState<"countdown" | "chat">("countdown");
  const [isMuted, setIsMuted] = useState(false);
  const [hasDecrementedCall, setHasDecrementedCall] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "them",
      text: "What's the plan",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [currentPerson, setCurrentPerson] = useState(() => ({
    name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
    age: MOCK_AGES[Math.floor(Math.random() * MOCK_AGES.length)],
  }));

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
          type: "date",
          name: `${currentPerson.name}`,
          isActive: true,
          participantName: currentPerson.name,
          participantAge: currentPerson.age,
        });
        setCurrentChatId(chatId);
        
        await addChatMessage(chatId, {
          text: "What's the plan",
          sender: "them",
        });
      }
    };
    
    initChat();
  }, [currentPerson.name, currentPerson.age, addChat, addChatMessage, currentChatId]);
  const timerScale = useRef(new Animated.Value(1)).current;
  const heartPulse = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(0)).current;
  const chatSlideAnim = useRef(new Animated.Value(width)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartPulse, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(heartPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [heartPulse]);

  useEffect(() => {
    if (phase === "countdown" && timer > 0) {
      Animated.sequence([
        Animated.timing(timerScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(timerScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const interval = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(interval);
    } else if (timer === 0) {
      setPhase("chat");
    }
  }, [timer, phase, timerScale]);

  const handleSkip = async () => {
    console.log('Skipping to next person');
    
    if (!user?.isPremium && user?.callsRemaining === 0) {
      setShowSubscriptionModal(true);
      return;
    }
    
    await decrementCall();
    setPhase("countdown");
    setTimer(5);
    
    const newPerson = {
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      age: MOCK_AGES[Math.floor(Math.random() * MOCK_AGES.length)],
    };
    setCurrentPerson(newPerson);
    setCurrentChatId(null);
    setMessages([{
      id: "1",
      sender: "them",
      text: "What's the plan",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  };

  const handleExit = () => {
    console.log('Exiting video chat, navigating to home');
    
    if (!user?.isPremium && user?.callsRemaining === 0) {
      setShowSubscriptionModal(true);
      return;
    }
    
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleStay = () => {
    if (!user?.isPremium && user?.callsRemaining === 0) {
      setShowSubscriptionModal(true);
      return;
    }
    
    router.push("/match-success");
  };

  useEffect(() => {
    if (showSubscriptionModal) {
      Animated.spring(modalScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      modalScale.setValue(0);
    }
  }, [showSubscriptionModal, modalScale]);

  useEffect(() => {
    Animated.spring(chatSlideAnim, {
      toValue: showChat ? 0 : width,
      useNativeDriver: true,
      tension: 50,
      friction: 10,
    }).start();
  }, [showChat, chatSlideAnim]);

  const handleSendMessage = async () => {
    if (messageText.trim() && currentChatId) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "me",
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
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
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
          <Text style={styles.placeholderEmoji}>👤</Text>
          <Text style={styles.placeholderText}>{currentPerson.name}, {currentPerson.age}</Text>
        </View>
      </View>

      <View style={[styles.localVideo, { top: 60 + insets.top }]}>
        {Platform.OS !== 'web' && permissionsGranted ? (
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

      <TouchableOpacity 
        style={[styles.closeButton, { top: 60 + insets.top }]} 
        onPress={handleExit}
        activeOpacity={0.8}
      >
        <View style={styles.closeButtonInner}>
          <X size={24} color={Colors.white} strokeWidth={2.5} />
        </View>
      </TouchableOpacity>

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {phase === "countdown" && (
          <View style={styles.countdownContainer}>
            <Animated.View
              style={[
                styles.countdownCircle,
                {
                  transform: [{ scale: timerScale }],
                },
              ]}
            >
              <Text style={styles.countdownText}>{timer}</Text>
            </Animated.View>
            <Text style={styles.countdownLabel}>
              Decide if you want to keep talking
            </Text>
          </View>
        )}

        {phase === "chat" && (
          <View style={styles.controlsContainer}>
            <View style={styles.buttonsWrapper}>
              <TouchableOpacity
                style={styles.volumeButton}
                onPress={() => setIsMuted(!isMuted)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isMuted ? ['#6B7280', '#4B5563'] : ['#10B981', '#059669']}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isMuted ? (
                    <VolumeX size={26} color={Colors.white} strokeWidth={2.5} />
                  ) : (
                    <Volume2 size={26} color={Colors.white} strokeWidth={2.5} />
                  )}
                </LinearGradient>
                <Text style={styles.buttonLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.skipButtonCircle} 
                onPress={handleSkip}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.gradientButtonLarge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <SkipForward size={32} color={Colors.white} strokeWidth={2.5} />
                </LinearGradient>
                <Text style={styles.buttonLabel}>Next</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.heartButton} 
                onPress={handleStay}
                activeOpacity={0.8}
              >
                <Animated.View style={{ transform: [{ scale: heartPulse }] }}>
                  <LinearGradient
                    colors={['#FF6B9D', '#FF1B5E']}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Heart size={28} color={Colors.white} fill={Colors.white} strokeWidth={2} />
                    <View style={styles.sparkleContainer}>
                      <Sparkles size={14} color={Colors.pastelYellow} style={styles.sparkle1} />
                      <Sparkles size={12} color={Colors.pastelYellow} style={styles.sparkle2} />
                    </View>
                  </LinearGradient>
                </Animated.View>
                <Text style={styles.buttonLabel}>Match</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => setShowChat(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MessageCircle size={26} color={Colors.white} strokeWidth={2.5} />
                </LinearGradient>
                <Text style={styles.buttonLabel}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>

      <Modal
        visible={showSubscriptionModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSubscriptionModal(false);
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)/home');
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: modalScale }],
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.pastelYellow, Colors.babyBlue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalGradientBg}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalEmojiContainer}>
                  <Text style={styles.modalEmoji}>🚀</Text>
                </View>
                <Text style={styles.modalTitle}>Unlock Unlimited Calls</Text>
              </View>

              <Text style={styles.modalDescription}>
                You&apos;ve used all 5 free calls! Upgrade to Premium to continue connecting with amazing people.
              </Text>

              <View style={styles.modalFeatures}>
                <View style={styles.modalFeature}>
                  <View style={styles.modalFeatureIconContainer}>
                    <Text style={styles.modalFeatureIcon}>✨</Text>
                  </View>
                  <Text style={styles.modalFeatureText}>Unlimited video calls</Text>
                </View>
                <View style={styles.modalFeature}>
                  <View style={styles.modalFeatureIconContainer}>
                    <Text style={styles.modalFeatureIcon}>⚡</Text>
                  </View>
                  <Text style={styles.modalFeatureText}>Priority matching</Text>
                </View>
                <View style={styles.modalFeature}>
                  <View style={styles.modalFeatureIconContainer}>
                    <Text style={styles.modalFeatureIcon}>🎯</Text>
                  </View>
                  <Text style={styles.modalFeatureText}>Ad-free experience</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalSubscribeButton}
                onPress={() => {
                  setShowSubscriptionModal(false);
                  router.push('/premium');
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.charcoal, '#2C2C2C']}
                  style={styles.modalSubscribeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Sparkles size={20} color={Colors.pastelYellow} style={styles.buttonSparkle} />
                  <Text style={styles.modalSubscribeText}>Get Premium Now</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowSubscriptionModal(false);
                  if (router.canGoBack()) {
                    router.back();
                  } else {
                    router.replace('/(tabs)/home');
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Go Back</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>

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
            <TouchableOpacity 
              style={styles.chatCloseButton}
              onPress={() => setShowChat(false)}
              activeOpacity={0.7}
            >
              <X size={24} color={Colors.charcoal} />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((message) => (
              <View key={message.id} style={[
                styles.messageBubble,
                message.sender === "me" ? styles.myMessage : styles.theirMessage
              ]}>
                <Text style={[
                  styles.messageText,
                  message.sender === "me" ? styles.myMessageText : styles.theirMessageText
                ]}>
                  {message.text}
                </Text>
                <Text style={[
                  styles.timestamp,
                  message.sender === "me" ? styles.myTimestamp : styles.theirTimestamp
                ]}>
                  {message.timestamp}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.inputContainer, Platform.OS === 'ios' && { paddingBottom: 34 }]}>
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
    backgroundColor: "#0F0F0F",
    alignItems: "center",
    justifyContent: "center",
    position: "relative" as const,
  },
  placeholderEmoji: {
    fontSize: 100,
    marginBottom: 20,
    textShadowColor: "rgba(255, 107, 157, 0.3)",
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
    shadowColor: "#FF6B9D",
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
  safeArea: {
    flex: 1,
    justifyContent: "flex-end",
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
  closeButtonInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  countdownContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  countdownCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.pastelYellow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: Colors.pastelYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  countdownText: {
    fontSize: 64,
    fontWeight: "900" as const,
    color: Colors.charcoal,
  },
  countdownLabel: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.white,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  controlsContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  buttonsWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 20,
  },
  volumeButton: {
    alignItems: "center",
    gap: 8,
  },
  skipButtonCircle: {
    alignItems: "center",
    gap: 8,
  },
  heartButton: {
    alignItems: "center",
    gap: 8,
  },
  chatButton: {
    alignItems: "center",
    gap: 8,
  },
  gradientButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  gradientButtonLarge: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 5,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "800" as const,
    color: Colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.8,
  },
  sparkleContainer: {
    position: "absolute" as const,
    top: -2,
    right: -2,
  },
  sparkle1: {
    position: "absolute" as const,
    top: 0,
    right: 0,
  },
  sparkle2: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(46, 46, 46, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 10,
    overflow: 'hidden',
  },
  modalGradientBg: {
    padding: 32,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalEmojiContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  modalEmoji: {
    fontSize: 52,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.charcoal,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.charcoal,
    opacity: 0.75,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  modalFeatures: {
    marginBottom: 28,
    gap: 12,
  },
  modalFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  modalFeatureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.babyBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFeatureIcon: {
    fontSize: 22,
  },
  modalFeatureText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.charcoal,
    flex: 1,
  },
  modalSubscribeButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
  },
  modalSubscribeGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modalSubscribeText: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  buttonSparkle: {
    marginRight: 4,
  },
  modalCancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.charcoal,
    opacity: 0.6,
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 70,
    backgroundColor: Colors.softPink,
    borderBottomWidth: 0,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative" as const,
  },
  chatTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    letterSpacing: 0.5,
    textAlign: "center" as const,
  },
  chatCloseButton: {
    position: "absolute" as const,
    right: 24,
    top: 70,
    padding: 8,
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
    maxWidth: width * 0.75,
    marginVertical: 4,
    padding: 12,
    borderRadius: 20,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: Colors.softPink,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
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
    color: Colors.charcoal,
    fontWeight: "500" as const,
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
    color: Colors.charcoal,
    opacity: 0.5,
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
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
