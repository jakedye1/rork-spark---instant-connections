import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Flame, Heart, Users as UsersIcon, Users2, Sparkles, TrendingUp, Zap } from "lucide-react-native";
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
            toValue: 1.05,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2500,
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
          gradient: Colors.gradient2,
          title: "Make New Friends",
          subtitle: "Meet amazing people through live video chat",
          icon: UsersIcon,
        };
      case "groups":
        return {
          gradient: Colors.gradient3,
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
        colors={[Colors.background, Colors.backgroundLight]}
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
            <TouchableOpacity style={styles.callsCounter} onPress={handlePremiumPress}>
              <LinearGradient
                colors={Colors.gradientPremium as [string, string, ...string[]]}
                style={styles.callsGradient}
              >
                <Flame size={20} color={Colors.white} />
                <View>
                  <Text style={styles.callsLabel}>Flares</Text>
                  <Text style={styles.callsValue}>
                    {user?.isPremium ? '∞' : callsRemaining}
                  </Text>
                </View>
              </LinearGradient>
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
                    <ModeIcon size={48} color={Colors.white} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.heroTitle}>{config.title}</Text>
                  <Text style={styles.heroSubtitle}>{config.subtitle}</Text>
                  
                  <View style={styles.startButton}>
                    <Sparkles size={22} color={Colors.primary} strokeWidth={2.5} />
                    <Text style={styles.startButtonText}>Start Now</Text>
                  </View>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.heroGlow,
                    {
                      opacity: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.15],
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
                    <LinearGradient
                      colors={
                        chat.type === "date" 
                          ? Colors.gradient1 as [string, string, ...string[]]
                          : chat.type === "group"
                          ? Colors.gradient3 as [string, string, ...string[]]
                          : Colors.gradient2 as [string, string, ...string[]]
                      }
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
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.featuresSection}>
            <Text style={styles.featuresSectionTitle}>Why Choose Spark?</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: Colors.accent + "20" }]}>
                  <Sparkles size={26} color={Colors.accent} strokeWidth={2.5} />
                </View>
                <Text style={styles.featureTitle}>AI Matching</Text>
                <Text style={styles.featureDescription}>
                  Smart algorithm finds perfect matches
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: Colors.success + "20" }]}>
                  <TrendingUp size={26} color={Colors.success} strokeWidth={2.5} />
                </View>
                <Text style={styles.featureTitle}>Real-Time</Text>
                <Text style={styles.featureDescription}>
                  Instant connections, no waiting
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: Colors.primary + "20" }]}>
                  <Heart size={26} color={Colors.primary} fill={Colors.primary} strokeWidth={2.5} />
                </View>
                <Text style={styles.featureTitle}>Verified</Text>
                <Text style={styles.featureDescription}>
                  Face-verified for safety
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
                colors={Colors.gradientPremium as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.premiumGradient}
              >
                <View style={styles.premiumContent}>
                  <View style={styles.premiumIcon}>
                    <Zap size={32} color={Colors.white} fill={Colors.white} strokeWidth={2} />
                  </View>
                  <View style={styles.premiumTextContainer}>
                    <Text style={styles.premiumTitle}>Unlock Premium</Text>
                    <Text style={styles.premiumSubtitle}>
                      Unlimited flares • Priority matches • No ads
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
            <LinearGradient
              colors={Colors.gradientPremium as [string, string, ...string[]]}
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
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  appName: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: Colors.text,
    letterSpacing: -1.5,
  },
  callsCounter: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  callsGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  callsLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.white,
    opacity: 0.9,
  },
  callsValue: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  modeSelector: {
    marginBottom: 32,
  },
  modeSelectorTitle: {
    fontSize: 20,
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
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  modeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundElevated,
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
    marginBottom: 36,
  },
  heroCard: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  heroGradient: {
    position: "relative" as const,
    minHeight: 320,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  heroContent: {
    alignItems: "center",
    zIndex: 2,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.white,
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: "500" as const,
    color: Colors.white,
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 32,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.textDark,
    letterSpacing: 0.3,
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
    marginBottom: 36,
  },
  chatsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chatsSectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  chatsSectionAction: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  chatsScrollContent: {
    gap: 16,
    paddingRight: 20,
  },
  chatCard: {
    width: 220,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  chatCardGradient: {
    padding: 20,
    minHeight: 160,
  },
  chatCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  chatCardEmoji: {
    fontSize: 32,
  },
  chatCardBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  chatCardBadgeText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  chatCardName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
    marginBottom: 8,
  },
  chatCardMessage: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 10,
    lineHeight: 20,
  },
  chatCardTime: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.white,
    opacity: 0.8,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresSectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: "row",
    gap: 14,
  },
  featureCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 6,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 17,
  },
  premiumCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  premiumGradient: {
    padding: 24,
  },
  premiumContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  premiumIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.white,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  premiumSubtitle: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.white,
    opacity: 0.9,
  },
  premiumArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumArrowText: {
    fontSize: 20,
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
    borderRadius: 32,
    padding: 36,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 16,
  },
  modalIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  modalDescription: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 24,
  },
  modalFeatures: {
    width: "100%",
    marginBottom: 28,
    gap: 14,
  },
  modalFeature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalFeatureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  modalFeatureIconText: {
    fontSize: 20,
  },
  modalFeatureText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    flex: 1,
  },
  modalButton: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  modalButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
    letterSpacing: 0.3,
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
