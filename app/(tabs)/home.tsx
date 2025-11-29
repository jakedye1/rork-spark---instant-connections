import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Flame, Heart, Users as UsersIcon, Users2, Sparkles, TrendingUp } from "lucide-react-native";
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

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.03,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [scaleAnim, glowAnim]);

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
          gradient: Colors.gradient1,
          title: "Find Your Spark",
          subtitle: "Connect instantly with someone special nearby",
          icon: Heart,
        };
      case "friends":
        return {
          gradient: Colors.gradient3,
          title: "Make New Friends",
          subtitle: "Meet amazing people through live video chat",
          icon: UsersIcon,
        };
      case "groups":
        return {
          gradient: Colors.gradient4,
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
        colors={[Colors.background, Colors.backgroundDark]}
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
              <Text style={styles.greeting}>Hey there! 👋</Text>
              <Text style={styles.appName}>Spark</Text>
            </View>
            <TouchableOpacity style={styles.callsCounter} onPress={handlePremiumPress}>
              <View style={styles.callsIconContainer}>
                <Flame size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.callsLabel}>Calls</Text>
                <Text style={styles.callsValue}>
                  {user?.isPremium ? '∞' : callsRemaining}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.modeSelector}>
            <Text style={styles.modeSelectorTitle}>What are you looking for?</Text>
            <View style={styles.modeButtons}>
              <TouchableOpacity
                style={[styles.modeButton, mode === "dating" && styles.modeButtonActive]}
                onPress={() => setMode("dating")}
                activeOpacity={0.7}
              >
                <View style={[styles.modeIconContainer, mode === "dating" && styles.modeIconContainerActive]}>
                  <Heart
                    size={20}
                    color={mode === "dating" ? Colors.white : Colors.textSecondary}
                    fill={mode === "dating" ? Colors.white : "transparent"}
                  />
                </View>
                <Text style={[styles.modeButtonText, mode === "dating" && styles.modeButtonTextActive]}>
                  Dating
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeButton, mode === "friends" && styles.modeButtonActive]}
                onPress={() => setMode("friends")}
                activeOpacity={0.7}
              >
                <View style={[styles.modeIconContainer, mode === "friends" && styles.modeIconContainerActive]}>
                  <UsersIcon
                    size={20}
                    color={mode === "friends" ? Colors.white : Colors.textSecondary}
                  />
                </View>
                <Text style={[styles.modeButtonText, mode === "friends" && styles.modeButtonTextActive]}>
                  Friends
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeButton, mode === "groups" && styles.modeButtonActive]}
                onPress={() => setMode("groups")}
                activeOpacity={0.7}
              >
                <View style={[styles.modeIconContainer, mode === "groups" && styles.modeIconContainerActive]}>
                  <Users2
                    size={20}
                    color={mode === "groups" ? Colors.white : Colors.textSecondary}
                  />
                </View>
                <Text style={[styles.modeButtonText, mode === "groups" && styles.modeButtonTextActive]}>
                  Groups
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroSection}>
            <TouchableOpacity
              style={styles.heroCard}
              onPress={handleJoinFlare}
              activeOpacity={0.95}
            >
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
                  <View style={styles.heroIcon}>
                    <ModeIcon size={40} color={Colors.white} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.heroTitle}>{config.title}</Text>
                  <Text style={styles.heroSubtitle}>{config.subtitle}</Text>
                  
                  <View style={styles.startButton}>
                    <Sparkles size={20} color={Colors.white} />
                    <Text style={styles.startButtonText}>Start Now</Text>
                  </View>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.heroGlow,
                    {
                      opacity: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 0.4],
                      }),
                    },
                  ]}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {activeChats.length > 0 && (
            <View style={styles.chatsSection}>
              <View style={styles.chatsSectionHeader}>
                <Text style={styles.chatsSectionTitle}>Active Chats</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/groups')}>
                  <Text style={styles.chatsSectionAction}>See All</Text>
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
                    <View style={styles.chatCardHeader}>
                      <View style={[
                        styles.chatCardIcon,
                        chat.type === "date" && styles.chatCardIconDate,
                        chat.type === "group" && styles.chatCardIconGroup,
                        chat.type === "friend" && styles.chatCardIconFriend,
                      ]}>
                        <Text style={styles.chatCardEmoji}>
                          {chat.type === "date" ? "💖" : chat.type === "group" ? "👥" : "🫂"}
                        </Text>
                      </View>
                      {chat.type === "date" && (
                        <View style={styles.chatCardBadge}>
                          <Text style={styles.chatCardBadgeText}>Date</Text>
                        </View>
                      )}
                      {chat.type === "group" && (
                        <View style={[styles.chatCardBadge, styles.chatCardBadgeGroup]}>
                          <Text style={styles.chatCardBadgeText}>Group</Text>
                        </View>
                      )}
                      {chat.type === "friend" && (
                        <View style={[styles.chatCardBadge, styles.chatCardBadgeFriend]}>
                          <Text style={styles.chatCardBadgeText}>Friend</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.chatCardName} numberOfLines={1}>{chat.name}</Text>
                    {chat.lastMessage && (
                      <Text style={styles.chatCardMessage} numberOfLines={2}>{chat.lastMessage}</Text>
                    )}
                    <Text style={styles.chatCardTime}>
                      {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.featuresSection}>
            <Text style={styles.featuresSectionTitle}>Why Spark?</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Sparkles size={24} color={Colors.accent} />
                </View>
                <Text style={styles.featureTitle}>AI Matching</Text>
                <Text style={styles.featureDescription}>
                  Smart algorithm finds your perfect match
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <TrendingUp size={24} color={Colors.success} />
                </View>
                <Text style={styles.featureTitle}>Real-Time</Text>
                <Text style={styles.featureDescription}>
                  Instant video connections, no waiting
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Heart size={24} color={Colors.primary} fill={Colors.primary} />
                </View>
                <Text style={styles.featureTitle}>Verified</Text>
                <Text style={styles.featureDescription}>
                  All users are face-verified for safety
                </Text>
              </View>
            </View>
          </View>

          {!user?.isPremium && (
            <TouchableOpacity 
              style={styles.premiumCard} 
              onPress={handlePremiumPress}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={Colors.gradientDark as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumGradient}
              >
                <View style={styles.premiumContent}>
                  <View style={styles.premiumIcon}>
                    <Sparkles size={28} color={Colors.accent} />
                  </View>
                  <View style={styles.premiumTextContainer}>
                    <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                    <Text style={styles.premiumSubtitle}>
                      Unlimited calls • Priority matching • Ad-free
                    </Text>
                  </View>
                  <View style={styles.premiumArrow}>
                    <Text style={styles.premiumArrowText}>→</Text>
                  </View>
                </View>
              </LinearGradient>
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
            <View style={styles.modalIconContainer}>
              <Sparkles size={48} color={Colors.primary} />
            </View>

            <Text style={styles.modalTitle}>Out of Free Calls</Text>
            <Text style={styles.modalDescription}>
              You&apos;ve used all 5 free calls! Upgrade to Premium for unlimited connections.
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
                colors={Colors.gradient1 as [string, string, ...string[]]}
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
    marginBottom: 28,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  callsCounter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: Colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  callsIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  callsLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  callsValue: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  modeSelector: {
    marginBottom: 28,
  },
  modeSelectorTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 16,
  },
  modeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modeButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  modeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  modeIconContainerActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.textSecondary,
  },
  modeButtonTextActive: {
    color: Colors.white,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroCard: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  heroGradient: {
    position: "relative" as const,
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  heroContent: {
    alignItems: "center",
    zIndex: 2,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.white,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.white,
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
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
    marginBottom: 32,
  },
  chatsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chatsSectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  chatsSectionAction: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  chatsScrollContent: {
    gap: 12,
    paddingRight: 20,
  },
  chatCard: {
    width: 200,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  chatCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  chatCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  chatCardIconDate: {
    backgroundColor: Colors.primaryLight + "20",
  },
  chatCardIconGroup: {
    backgroundColor: Colors.accent + "20",
  },
  chatCardIconFriend: {
    backgroundColor: Colors.secondaryDark + "20",
  },
  chatCardEmoji: {
    fontSize: 24,
  },
  chatCardBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chatCardBadgeGroup: {
    backgroundColor: Colors.accent,
  },
  chatCardBadgeFriend: {
    backgroundColor: Colors.secondary,
  },
  chatCardBadgeText: {
    fontSize: 10,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  chatCardName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  chatCardMessage: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  chatCardTime: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.textTertiary,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresSectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: "row",
    gap: 12,
  },
  featureCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  premiumCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  premiumGradient: {
    padding: 20,
  },
  premiumContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  premiumIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 230, 109, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.white,
    opacity: 0.8,
  },
  premiumArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumArrowText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: "700" as const,
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
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 12,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalFeatures: {
    width: "100%",
    marginBottom: 24,
    gap: 12,
  },
  modalFeature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  modalFeatureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  modalFeatureIconText: {
    fontSize: 18,
  },
  modalFeatureText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.text,
    flex: 1,
  },
  modalButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  modalButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  modalCancelButton: {
    paddingVertical: 12,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
});
