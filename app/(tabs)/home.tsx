import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Flame, Heart, Users as UsersIcon, Users2, Sparkles, Zap } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useChats } from "@/contexts/ChatsContext";

type Mode = "dating" | "friends" | "groups";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { getActiveChats } = useChats();
  const activeChats = getActiveChats();
  const [mode, setMode] = useState<Mode>("dating");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0)).current;
  const flareFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.03,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(flareFloat, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(flareFloat, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim, glowAnim, flareFloat]);

  const handleJoinFlare = async () => {
    console.log('=== Join Flare Pressed ===');
    console.log('Current mode:', mode);
    console.log('User exists:', !!user);
    console.log('Is premium:', user?.isPremium);
    console.log('Calls remaining:', user?.callsRemaining);
    
    if (!user) {
      console.error('No user found, cannot proceed');
      return;
    }
    
    if (!user.isPremium && user.callsRemaining === 0) {
      console.log('Out of calls, showing subscription modal');
      setShowSubscriptionModal(true);
      return;
    }
    
    console.log('All checks passed, navigating to:', mode);
    
    let targetRoute: "/video-chat" | "/group-video-chat" | "/friends-video-chat" = "/video-chat";
    if (mode === "groups") {
      targetRoute = "/group-video-chat";
    } else if (mode === "friends") {
      targetRoute = "/friends-video-chat";
    }
    
    console.log('Target route:', targetRoute);
    console.log('Calling router.push now...');
    
    router.push(targetRoute);
    console.log('router.push called, waiting for navigation...');
  };

  const handlePremiumPress = () => {
    console.log('Premium button pressed - navigating to /premium');
    router.push('/premium');
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

  const callsRemaining = user?.isPremium ? 999 : (user?.callsRemaining ?? 5);

  const getModeConfig = () => {
    switch (mode) {
      case "dating":
        return {
          gradient: [Colors.babyBlue, Colors.primaryDark],
          title: "Find Your Spark",
          subtitle: "Connect instantly with someone special nearby",
          icon: Heart,
        };
      case "friends":
        return {
          gradient: [Colors.aquaGlow, Colors.accentDark],
          title: "Make New Friends",
          subtitle: "Meet amazing people through live video chat",
          icon: UsersIcon,
        };
      case "groups":
        return {
          gradient: [Colors.pastelYellow, Colors.secondaryDark],
          title: "Group Hangout",
          subtitle: "Meet another friend group and plan something fun",
          icon: Users2,
        };
    }
  };

  const config = getModeConfig();
  const ModeIcon = config.icon;
  const gradient1 = config.gradient as [string, string, ...string[]];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight, Colors.background]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.appName}>Spark</Text>
            </View>
            
            <TouchableOpacity style={styles.flareCounter} onPress={handlePremiumPress}>
              <BlurView intensity={40} tint="dark" style={styles.flareBlur}>
                <LinearGradient
                  colors={[Colors.glass, Colors.glassDark]}
                  style={styles.flareGradient}
                >
                  <Animated.View
                    style={{
                      transform: [
                        {
                          translateY: flareFloat.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -3],
                          }),
                        },
                      ],
                    }}
                  >
                    <Flame size={22} color={Colors.pastelYellow} fill={Colors.pastelYellow} />
                  </Animated.View>
                  <View style={styles.flareTextContainer}>
                    <Text style={styles.flareLabel}>Flares</Text>
                    <Text style={styles.flareValue}>
                      {user?.isPremium ? '∞' : callsRemaining}
                    </Text>
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={styles.modeSelector}>
            <Text style={styles.modeSelectorTitle}>What are you looking for?</Text>
            <View style={styles.modeButtons}>
              <TouchableOpacity
                style={styles.modeButton}
                onPress={() => setMode("dating")}
                activeOpacity={0.8}
              >
                <BlurView 
                  intensity={mode === "dating" ? 60 : 40} 
                  tint="dark" 
                  style={styles.modeBlur}
                >
                  <LinearGradient
                    colors={mode === "dating" ? [Colors.babyBlue, Colors.primaryDark] : [Colors.glass, Colors.glassDark]}
                    style={styles.modeGradient}
                  >
                    <View style={styles.modeIconContainer}>
                      <Heart
                        size={22}
                        color={mode === "dating" ? Colors.white : Colors.textSecondary}
                        fill={mode === "dating" ? Colors.white : "transparent"}
                        strokeWidth={2.5}
                      />
                    </View>
                    <Text style={[styles.modeButtonText, mode === "dating" && styles.modeButtonTextActive]}>
                      Dating
                    </Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modeButton}
                onPress={() => setMode("friends")}
                activeOpacity={0.8}
              >
                <BlurView 
                  intensity={mode === "friends" ? 60 : 40} 
                  tint="dark" 
                  style={styles.modeBlur}
                >
                  <LinearGradient
                    colors={mode === "friends" ? [Colors.aquaGlow, Colors.accentDark] : [Colors.glass, Colors.glassDark]}
                    style={styles.modeGradient}
                  >
                    <View style={styles.modeIconContainer}>
                      <UsersIcon
                        size={22}
                        color={mode === "friends" ? Colors.white : Colors.textSecondary}
                        strokeWidth={2.5}
                      />
                    </View>
                    <Text style={[styles.modeButtonText, mode === "friends" && styles.modeButtonTextActive]}>
                      Friends
                    </Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modeButton}
                onPress={() => setMode("groups")}
                activeOpacity={0.8}
              >
                <BlurView 
                  intensity={mode === "groups" ? 60 : 40} 
                  tint="dark" 
                  style={styles.modeBlur}
                >
                  <LinearGradient
                    colors={mode === "groups" ? [Colors.pastelYellow, Colors.secondaryDark] : [Colors.glass, Colors.glassDark]}
                    style={styles.modeGradient}
                  >
                    <View style={styles.modeIconContainer}>
                      <Users2
                        size={22}
                        color={mode === "groups" ? Colors.white : Colors.textSecondary}
                        strokeWidth={2.5}
                      />
                    </View>
                    <Text style={[styles.modeButtonText, mode === "groups" && styles.modeButtonTextActive]}>
                      Groups
                    </Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroSection}>
            <TouchableOpacity
              style={styles.heroCard}
              onPress={handleJoinFlare}
              activeOpacity={0.95}
            >
              <BlurView intensity={60} tint="dark" style={styles.heroBlur}>
                <LinearGradient
                  colors={gradient1}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroGradient}
                >
                  <Animated.View
                    style={[
                      styles.heroContent,
                      {
                        transform: [{ scale: scaleAnim }],
                      },
                    ]}
                  >
                    <View style={styles.heroIconCircle}>
                      <ModeIcon size={56} color={Colors.white} strokeWidth={2} />
                    </View>
                    <Text style={styles.heroTitle}>{config.title}</Text>
                    <Text style={styles.heroSubtitle}>{config.subtitle}</Text>
                    
                    <View style={styles.startButtonContainer}>
                      <BlurView intensity={80} tint="light" style={styles.startButtonBlur}>
                        <View style={styles.startButton}>
                          <Sparkles size={24} color={Colors.background} strokeWidth={2.5} />
                          <Text style={styles.startButtonText}>Start Now</Text>
                        </View>
                      </BlurView>
                    </View>
                  </Animated.View>

                  <Animated.View
                    style={[
                      styles.heroGlow,
                      {
                        opacity: glowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 0.2],
                        }),
                      },
                    ]}
                  />
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          </View>

          {activeChats.length > 0 && (
            <View style={styles.chatsSection}>
              <View style={styles.chatsSectionHeader}>
                <Text style={styles.chatsSectionTitle}>Active Connections</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/groups')}>
                  <Text style={styles.chatsSectionAction}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chatsScrollContent}
              >
                {activeChats.map((chat) => (
                  <TouchableOpacity
                    key={chat.id}
                    style={styles.chatCard}
                    activeOpacity={0.8}
                    onPress={() => {
                      console.log('Chat pressed:', chat.id, chat.type);
                      router.push('/(tabs)/groups');
                    }}
                  >
                    <BlurView intensity={50} tint="dark" style={styles.chatBlur}>
                      <LinearGradient
                        colors={[Colors.glass, Colors.glassDark]}
                        style={styles.chatCardGradient}
                      >
                        <View style={styles.chatCardHeader}>
                          <Text style={styles.chatCardEmoji}>
                            {chat.type === "date" ? "💖" : chat.type === "group" ? "👥" : "🫂"}
                          </Text>
                          <View style={styles.chatCardBadge}>
                            <Text style={styles.chatCardBadgeText}>
                              {chat.type === "date" ? "Date" : chat.type === "group" ? "Group" : "Friend"}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.chatCardName} numberOfLines={1}>{chat.name}</Text>
                        {chat.lastMessage && (
                          <Text style={styles.chatCardMessage} numberOfLines={2}>{chat.lastMessage}</Text>
                        )}
                        <Text style={styles.chatCardTime}>
                          {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
                        </Text>
                      </LinearGradient>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {!user?.isPremium && (
            <TouchableOpacity 
              style={styles.premiumCard} 
              onPress={handlePremiumPress}
              activeOpacity={0.9}
            >
              <BlurView intensity={50} tint="dark" style={styles.premiumBlur}>
                <LinearGradient
                  colors={[Colors.babyBlue, Colors.aquaGlow]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.premiumGradient}
                >
                  <View style={styles.premiumContent}>
                    <View style={styles.premiumIcon}>
                      <Zap size={36} color={Colors.white} fill={Colors.white} strokeWidth={2} />
                    </View>
                    <View style={styles.premiumTextContainer}>
                      <Text style={styles.premiumTitle}>Unlock Premium</Text>
                      <Text style={styles.premiumSubtitle}>
                        Unlimited flares • Priority matches • No ads
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </BlurView>
            </TouchableOpacity>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>

      <Modal
        visible={showSubscriptionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubscriptionModal(false)}
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
            <BlurView intensity={80} tint="dark" style={styles.modalBlur}>
              <LinearGradient
                colors={[Colors.glass, Colors.glassDark]}
                style={styles.modalGradient}
              >
                <LinearGradient
                  colors={[Colors.babyBlue, Colors.aquaGlow]}
                  style={styles.modalIconContainer}
                >
                  <Sparkles size={56} color={Colors.white} strokeWidth={2} />
                </LinearGradient>

                <Text style={styles.modalTitle}>Out of Flares</Text>
                <Text style={styles.modalDescription}>
                  You&apos;ve used all 5 free flares! Upgrade to Premium for unlimited connections and premium features.
                </Text>

                <View style={styles.modalFeatures}>
                  <View style={styles.modalFeature}>
                    <View style={styles.modalFeatureIcon}>
                      <Text style={styles.modalFeatureIconText}>✨</Text>
                    </View>
                    <Text style={styles.modalFeatureText}>Unlimited video calls</Text>
                  </View>
                  <View style={styles.modalFeature}>
                    <View style={styles.modalFeatureIcon}>
                      <Text style={styles.modalFeatureIconText}>⚡</Text>
                    </View>
                    <Text style={styles.modalFeatureText}>Priority matching</Text>
                  </View>
                  <View style={styles.modalFeature}>
                    <View style={styles.modalFeatureIcon}>
                      <Text style={styles.modalFeatureIconText}>🎯</Text>
                    </View>
                    <Text style={styles.modalFeatureText}>Ad-free experience</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowSubscriptionModal(false);
                    router.push('/premium');
                  }}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={[Colors.babyBlue, Colors.aquaGlow]}
                    style={styles.modalButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.modalButtonText}>Get Premium</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowSubscriptionModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelText}>Maybe Later</Text>
                </TouchableOpacity>
              </LinearGradient>
            </BlurView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradient: {
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  appName: {
    fontSize: 42,
    fontWeight: "900" as const,
    color: Colors.white,
    letterSpacing: -2,
  },
  flareCounter: {
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  flareBlur: {
    overflow: "hidden",
    borderRadius: 22,
  },
  flareGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  flareTextContainer: {
    gap: 2,
  },
  flareLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  flareValue: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  modeSelector: {
    marginBottom: 36,
  },
  modeSelectorTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.white,
    marginBottom: 18,
  },
  modeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modeButton: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  modeBlur: {
    overflow: "hidden",
    borderRadius: 20,
  },
  modeGradient: {
    paddingVertical: 20,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  modeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.textSecondary,
  },
  modeButtonTextActive: {
    color: Colors.white,
  },
  heroSection: {
    marginBottom: 40,
  },
  heroCard: {
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 16,
  },
  heroBlur: {
    overflow: "hidden",
    borderRadius: 32,
  },
  heroGradient: {
    position: "relative" as const,
    minHeight: 360,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  heroContent: {
    alignItems: "center",
    zIndex: 2,
    gap: 20,
  },
  heroIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "900" as const,
    color: Colors.white,
    textAlign: "center",
    letterSpacing: -1.5,
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: "500" as const,
    color: Colors.white,
    opacity: 0.9,
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  startButtonContainer: {
    marginTop: 12,
    borderRadius: 28,
    overflow: "hidden",
  },
  startButtonBlur: {
    overflow: "hidden",
    borderRadius: 28,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 28,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.background,
    letterSpacing: -0.5,
  },
  heroGlow: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
  },
  chatsSection: {
    marginBottom: 40,
  },
  chatsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chatsSectionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  chatsSectionAction: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.babyBlue,
  },
  chatsScrollContent: {
    gap: 16,
    paddingRight: 20,
  },
  chatCard: {
    width: 240,
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  chatBlur: {
    overflow: "hidden",
    borderRadius: 28,
  },
  chatCardGradient: {
    padding: 24,
    minHeight: 180,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  chatCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  chatCardEmoji: {
    fontSize: 36,
  },
  chatCardBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  chatCardBadgeText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  chatCardName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.white,
    marginBottom: 10,
  },
  chatCardMessage: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: 12,
    lineHeight: 22,
  },
  chatCardTime: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.white,
    opacity: 0.7,
  },
  premiumCard: {
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: Colors.shadowAqua,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  premiumBlur: {
    overflow: "hidden",
    borderRadius: 28,
  },
  premiumGradient: {
    padding: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  premiumContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  premiumIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.white,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  premiumSubtitle: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.white,
    opacity: 0.9,
  },
  bottomSpacer: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  modalBlur: {
    overflow: "hidden",
    borderRadius: 32,
  },
  modalGradient: {
    padding: 36,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  modalIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: "900" as const,
    color: Colors.white,
    textAlign: "center",
    marginBottom: 14,
    letterSpacing: -1,
  },
  modalDescription: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  modalFeatures: {
    width: "100%",
    marginBottom: 32,
    gap: 14,
  },
  modalFeature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 18,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  modalFeatureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalFeatureIconText: {
    fontSize: 22,
  },
  modalFeatureText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.white,
    flex: 1,
  },
  modalButton: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 8,
  },
  modalButtonGradient: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  modalCancelButton: {
    paddingVertical: 14,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
});
