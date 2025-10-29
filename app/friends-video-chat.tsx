import { useRouter } from "expo-router";
import { X, Volume2, VolumeX, UserPlus, Sparkles, MessageSquare, Smile } from "lucide-react-native";
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
  PanResponder,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { useFriends } from "@/contexts/FriendsContext";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { CameraView } from "expo-camera";

const { width, height } = Dimensions.get("window");

type IceBreaker = {
  id: string;
  question: string;
  emoji: string;
};

const ICE_BREAKERS: IceBreaker[] = [
  { id: "1", question: "What's your favorite way to spend a weekend?", emoji: "🎉" },
  { id: "2", question: "If you could travel anywhere right now, where would you go?", emoji: "✈️" },
  { id: "3", question: "What's a hobby you've always wanted to try?", emoji: "🎨" },
  { id: "4", question: "What's your go-to comfort food?", emoji: "🍕" },
  { id: "5", question: "Morning person or night owl?", emoji: "🌅" },
  { id: "6", question: "What's the best concert you've ever been to?", emoji: "🎵" },
  { id: "7", question: "Beach vacation or mountain adventure?", emoji: "🏖️" },
  { id: "8", question: "What's a skill you're currently learning?", emoji: "📚" },
];

const MOCK_NAMES = [
  "Sarah M.", "Alex K.", "Jordan T.", "Taylor S.", "Morgan L.",
  "Casey R.", "Riley P.", "Jamie W.", "Quinn H.", "Avery C.",
];

const MOCK_INTERESTS = [
  ["Travel", "Photography", "Cooking"],
  ["Fitness", "Music", "Reading"],
  ["Gaming", "Art", "Movies"],
  ["Hiking", "Coffee", "Writing"],
  ["Yoga", "Dancing", "Fashion"],
  ["Sports", "Tech", "Animals"],
  ["Nature", "Food", "Adventure"],
  ["Design", "Comedy", "Learning"],
];

const getRandomPerson = () => {
  const randomName = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
  const randomInterests = MOCK_INTERESTS[Math.floor(Math.random() * MOCK_INTERESTS.length)];
  const randomAge = (18 + Math.floor(Math.random() * 20)).toString();
  
  return {
    name: randomName,
    age: randomAge,
    interests: randomInterests,
    isOnline: true,
  };
};

export default function FriendsVideoChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addFriend } = useFriends();
  const { user, decrementCall } = useAuth();
  const { cameraPermission, microphonePermission, requestAllPermissions } = usePermissions();
  const [hasDecrementedCall, setHasDecrementedCall] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  console.log('=== FriendsVideoChatScreen mounted ===');

  const [isMuted, setIsMuted] = useState(false);
  const [showIceBreaker, setShowIceBreaker] = useState(false);
  const [currentIceBreaker, setCurrentIceBreaker] = useState<IceBreaker>(ICE_BREAKERS[0]);
  const [currentPerson, setCurrentPerson] = useState(getRandomPerson());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: string; emoji: string; anim: Animated.Value }[]>([]);

  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const iceBreakerSlide = useRef(new Animated.Value(-100)).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const swipeOpacity = useRef(new Animated.Value(1)).current;
  const emojiPickerSlide = useRef(new Animated.Value(300)).current;

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
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [sparkleAnim]);

  useEffect(() => {
    Animated.spring(iceBreakerSlide, {
      toValue: showIceBreaker ? 0 : -100,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [showIceBreaker, iceBreakerSlide]);

  useEffect(() => {
    Animated.spring(emojiPickerSlide, {
      toValue: showEmojiPicker ? 0 : 300,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [showEmojiPicker, emojiPickerSlide]);



  const handleSkip = () => {
    console.log('Skipping to next person');
    
    Animated.parallel([
      Animated.timing(swipeAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(swipeOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      swipeAnim.setValue(0);
      swipeOpacity.setValue(1);
      setCurrentPerson(getRandomPerson());
      console.log('Connected to new person');
    });
  };

  const handleExit = () => {
    console.log('Exiting friends video chat, navigating back');
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleAddFriend = async () => {
    try {
      if (!user) {
        console.error("No user found in auth context");
        Alert.alert("Error", "You must be logged in to add friends. Please sign in again.");
        return;
      }

      console.log('Adding friend:', currentPerson);
      console.log('User object exists:', !!user);
      console.log('User ID:', user.id);
      
      const friendId = await addFriend({
        name: currentPerson.name,
        age: currentPerson.age,
        interests: currentPerson.interests,
        isOnline: currentPerson.isOnline,
      });

      console.log('Friend added successfully with ID:', friendId);

      Alert.alert(
        "Friend Added! 🎉",
        `${currentPerson.name} has been added to your friends list!`,
        [
          {
            text: "Chat Now",
            onPress: () => {
              console.log('=== Chat Now pressed ===');
              console.log('friendId:', friendId);
              console.log('Navigating to friend-chat...');
              
              setTimeout(() => {
                router.push({
                  pathname: '/friend-chat',
                  params: { friendId }
                });
              }, 100);
            },
          },
          {
            text: "Keep Browsing",
            style: "cancel",
            onPress: () => handleSkip(),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to add friend:', error);
      Alert.alert("Error", "Failed to add friend. Please try again.");
    }
  };

  const handleNewIceBreaker = () => {
    const randomBreaker = ICE_BREAKERS[Math.floor(Math.random() * ICE_BREAKERS.length)];
    setCurrentIceBreaker(randomBreaker);
    setShowIceBreaker(true);
    setTimeout(() => setShowIceBreaker(false), 5000);
  };

  const handleEmojiSelect = (emoji: string) => {
    console.log('Sending emoji reaction:', emoji);
    setShowEmojiPicker(false);
    
    const id = Date.now().toString();
    const anim = new Animated.Value(0);
    
    setFloatingEmojis(prev => [...prev, { id, emoji, anim }]);
    
    Animated.timing(anim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    });
  };

  const REACTION_EMOJIS = ['❤️', '😂', '😍', '🔥', '👍', '🎉', '😮', '👏'];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > 3 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
        console.log('onMoveShouldSetPanResponder:', isHorizontalSwipe, 'dx:', gestureState.dx, 'dy:', gestureState.dy);
        return isHorizontalSwipe;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        console.log('Pan responder granted - swipe started');
      },
      onPanResponderMove: (_, gestureState) => {
        console.log('Pan responder move - dx:', gestureState.dx, 'dy:', gestureState.dy);
        swipeAnim.setValue(gestureState.dx);
        const newOpacity = Math.max(0.3, 1 - Math.abs(gestureState.dx) / width);
        swipeOpacity.setValue(newOpacity);
      },
      onPanResponderRelease: (_, gestureState) => {
        console.log('Pan responder released - dx:', gestureState.dx, 'vx:', gestureState.vx);
        const swipeThreshold = width * 0.25;
        const velocityThreshold = 0.5;
        
        if ((gestureState.dx > swipeThreshold || gestureState.vx > velocityThreshold) ||
            (gestureState.dx < -swipeThreshold || gestureState.vx < -velocityThreshold)) {
          console.log('Swipe threshold met - skipping to next');
          const targetValue = gestureState.dx > 0 ? width : -width;
          Animated.parallel([
            Animated.timing(swipeAnim, {
              toValue: targetValue,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(swipeOpacity, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
          ]).start(() => {
            swipeAnim.setValue(0);
            swipeOpacity.setValue(1);
            setCurrentPerson(getRandomPerson());
            console.log('Connected to new person');
          });
        } else {
          console.log('Swipe threshold not met - resetting');
          Animated.parallel([
            Animated.spring(swipeAnim, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 8,
            }),
            Animated.spring(swipeOpacity, {
              toValue: 1,
              useNativeDriver: true,
              tension: 50,
              friction: 8,
            }),
          ]).start();
        }
      },
      onPanResponderTerminate: () => {
        console.log('Pan responder terminated');
        Animated.parallel([
          Animated.spring(swipeAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }),
          Animated.spring(swipeOpacity, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }),
        ]).start();
      },
    })
  ).current;

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
      
      <Animated.View
        style={[
          styles.videoContainer,
          {
            transform: [{ translateX: swipeAnim }],
            opacity: swipeOpacity,
          },
        ]}
        {...panResponder.panHandlers}
      >
      
        <View style={styles.remoteVideo}>
          <View style={styles.placeholderVideo}>
            <Text style={styles.placeholderEmoji}>👋</Text>
            <Text style={styles.placeholderText}>Finding new friends...</Text>
          </View>
        </View>

        <View style={[styles.localVideo, { top: 50 + insets.top }]} pointerEvents="none">
          {Platform.OS !== 'web' && permissionsGranted ? (
            <CameraView 
              style={styles.cameraView} 
              facing="front"
            />
          ) : (
            <View style={styles.placeholderVideoSmall}>
              <Text style={styles.placeholderEmojiSmall}>😊</Text>
            </View>
          )}
        </View>
      </Animated.View>

      <View style={styles.swipeIndicator} pointerEvents="none">
        <Text style={styles.swipeIndicatorText}>👈 Swipe for next 👉</Text>
      </View>

      <TouchableOpacity 
        style={[styles.closeButton, { top: 50 + insets.top }]} 
        onPress={handleExit}
        activeOpacity={0.8}
      >
        <View style={styles.closeButtonInner}>
          <X size={24} color={Colors.white} strokeWidth={2.5} />
        </View>
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.iceBreakerCard,
          {
            transform: [{
              translateY: iceBreakerSlide.interpolate({
                inputRange: [-100, 0],
                outputRange: [-200, 20],
              })
            }],
            opacity: iceBreakerSlide.interpolate({
              inputRange: [-100, 0],
              outputRange: [0, 1],
            })
          }
        ]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[Colors.pastelYellow, "#FFE680"]}
          style={styles.iceBreakerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.iceBreakerEmoji}>{currentIceBreaker.emoji}</Text>
          <Text style={styles.iceBreakerText}>{currentIceBreaker.question}</Text>
        </LinearGradient>
      </Animated.View>

      <SafeAreaView style={styles.rightControls} edges={["right", "bottom"]} pointerEvents="box-none">
          <View style={styles.verticalButtonsContainer}>
            <TouchableOpacity
              style={styles.sideButton}
              onPress={handleNewIceBreaker}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FCD34D', '#F59E0B']}
                style={styles.sideButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MessageSquare size={24} color={Colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <Text style={styles.sideButtonLabel}>Ice Breaker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sideButton}
              onPress={() => setShowEmojiPicker(!showEmojiPicker)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FB7185', '#F43F5E']}
                style={styles.sideButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Smile size={24} color={Colors.white} strokeWidth={2.5} />
              </LinearGradient>
              <Text style={styles.sideButtonLabel}>React</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sideButton}
              onPress={() => setIsMuted(!isMuted)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isMuted ? ['#6B7280', '#4B5563'] : ['#34D399', '#10B981']}
                style={styles.sideButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isMuted ? (
                  <VolumeX size={24} color={Colors.white} strokeWidth={2.5} />
                ) : (
                  <Volume2 size={24} color={Colors.white} strokeWidth={2.5} />
                )}
              </LinearGradient>
              <Text style={styles.sideButtonLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sideButton} 
              onPress={handleAddFriend}
              activeOpacity={0.8}
            >
              <Animated.View 
                style={{ 
                  transform: [{ 
                    rotate: sparkleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '15deg'],
                    })
                  }] 
                }}
              >
                <LinearGradient
                  colors={['#A78BFA', '#7C3AED']}
                  style={styles.sideButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <UserPlus size={24} color={Colors.white} strokeWidth={2.5} />
                  <Animated.View 
                    style={[
                      styles.sparkleIcon,
                      {
                        opacity: sparkleAnim,
                        transform: [{ scale: sparkleAnim }]
                      }
                    ]}
                  >
                    <Sparkles size={14} color={Colors.pastelYellow} />
                  </Animated.View>
                </LinearGradient>
              </Animated.View>
              <Text style={styles.sideButtonLabel}>Add</Text>
            </TouchableOpacity>
          </View>
      </SafeAreaView>

      <Animated.View
        style={[
          styles.emojiPicker,
          {
            transform: [{ translateX: emojiPickerSlide }]
          }
        ]}
      >
        <LinearGradient
          colors={['rgba(30, 30, 30, 0.98)', 'rgba(20, 20, 20, 0.98)']}
          style={styles.emojiPickerGradient}
        >
          <Text style={styles.emojiPickerTitle}>Send Reaction</Text>
          <View style={styles.emojiGrid}>
            {REACTION_EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.emojiButton}
                onPress={() => handleEmojiSelect(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.emojiButtonText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      {floatingEmojis.map(({ id, emoji, anim }) => {
        const randomX = Math.random() * (width - 100) + 50;
        return (
          <Animated.View
            key={id}
            style={[
              styles.floatingEmoji,
              {
                left: randomX,
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height - 200, -100],
                    }),
                  },
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.5, 1.2, 0.8],
                    }),
                  },
                ],
                opacity: anim.interpolate({
                  inputRange: [0, 0.1, 0.9, 1],
                  outputRange: [0, 1, 1, 0],
                }),
              },
            ]}
            pointerEvents="none"
          >
            <Text style={styles.floatingEmojiText}>{emoji}</Text>
          </Animated.View>
        );
      })}
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
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  remoteVideo: {
    width: width,
    height: height,
  },
  placeholderVideo: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 100,
    marginBottom: 20,
    textShadowColor: "rgba(167, 139, 250, 0.4)",
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
    shadowColor: "#A78BFA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
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
  rightControls: {
    position: "absolute" as const,
    right: 0,
    top: 260,
    bottom: 0,
    justifyContent: "center",
    paddingRight: 16,
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
  iceBreakerCard: {
    position: "absolute" as const,
    top: 0,
    left: 20,
    right: 20,
    zIndex: 5,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  iceBreakerGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iceBreakerEmoji: {
    fontSize: 40,
  },
  iceBreakerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    lineHeight: 22,
    letterSpacing: 0.3,
  },

  verticalButtonsContainer: {
    flexDirection: "column",
    gap: 20,
    alignItems: "center",
  },
  sideButton: {
    alignItems: "center",
    gap: 6,
  },
  sideButtonGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 3.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  sideButtonGradientLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF1B5E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  sideButtonLabel: {
    fontSize: 12,
    fontWeight: "800" as const,
    color: Colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  sparkleIcon: {
    position: "absolute" as const,
    top: -2,
    right: -2,
  },
  swipeIndicator: {
    position: "absolute" as const,
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeIndicatorText: {
    fontSize: 17,
    fontWeight: "800" as const,
    color: Colors.white,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    overflow: "hidden",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  emojiPicker: {
    position: "absolute" as const,
    right: 0,
    bottom: 40,
    width: 280,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  emojiPickerGradient: {
    padding: 20,
  },
  emojiPickerTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.white,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  emojiButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  emojiButtonText: {
    fontSize: 32,
  },
  floatingEmoji: {
    position: "absolute" as const,
    zIndex: 100,
  },
  floatingEmojiText: {
    fontSize: 48,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});
