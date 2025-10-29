import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Flame, Heart, Users as UsersIcon, Users2 } from "lucide-react-native";
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
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [pulseAnim, glowAnim]);

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
      >
        <View style={styles.header}>
          <Text style={styles.logo}>✨ Spark</Text>
          <View style={styles.callsCounter}>
            <Flame size={16} color={Colors.charcoal} />
            <Text style={styles.callsText}>
              {user?.isPremium ? '∞ calls' : `${callsRemaining} calls left`}
            </Text>
          </View>
        </View>

        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, mode === "dating" && styles.modeButtonActive]}
            onPress={() => setMode("dating")}
          >
            <Heart
              size={20}
              color={mode === "dating" ? Colors.charcoal : Colors.mediumGray}
            />
            <Text
              style={[styles.modeText, mode === "dating" && styles.modeTextActive]}
            >
              Date
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, mode === "groups" && styles.modeButtonActive]}
            onPress={() => setMode("groups")}
          >
            <Users2
              size={20}
              color={mode === "groups" ? Colors.charcoal : Colors.mediumGray}
            />
            <Text
              style={[styles.modeText, mode === "groups" && styles.modeTextActive]}
            >
              Group
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, mode === "friends" && styles.modeButtonActive]}
            onPress={() => setMode("friends")}
          >
            <UsersIcon
              size={20}
              color={mode === "friends" ? Colors.charcoal : Colors.mediumGray}
            />
            <Text
              style={[styles.modeText, mode === "friends" && styles.modeTextActive]}
            >
              Friends
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.flareSection}>
          <Text style={styles.flareTitle}>The Flare</Text>
          <Text style={styles.flareSubtitle}>
            {mode === "dating"
              ? "Connect instantly with someone special"
              : mode === "groups"
              ? "Meet another friend group live and plan tonight"
              : "Make new friends through live video chat"}
          </Text>

          <Animated.View
            style={[
              styles.flareButtonContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.flareGlow,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.7],
                  }),
                },
              ]}
            />
            <TouchableOpacity style={styles.flareButton} onPress={handleJoinFlare}>
              <View style={styles.flareButtonInner}>
                <Flame size={48} color={Colors.charcoal} />
                <Text style={styles.flareButtonText}>Join Live Chat</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {activeChats.length > 0 && (
          <View style={styles.chatsSection}>
            <Text style={styles.chatsSectionTitle}>What&apos;s the Plan? 💬</Text>
            <Text style={styles.chatsSectionSubtitle}>Continue your conversations</Text>
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
                    <Text style={styles.chatCardEmoji}>
                      {chat.type === "date" ? "💖" : chat.type === "group" ? "👥" : "🫂"}
                    </Text>
                    <View style={[
                      styles.chatTypeBadge,
                      chat.type === "date" && styles.chatTypeBadgeDate,
                      chat.type === "group" && styles.chatTypeBadgeGroup,
                      chat.type === "friend" && styles.chatTypeBadgeFriend,
                    ]}>
                      <Text style={styles.chatTypeBadgeText}>
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
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>⚡</Text>
            <Text style={styles.infoTitle}>Instant Matches</Text>
            <Text style={styles.infoDescription}>
              AI finds your perfect match in seconds
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>🎥</Text>
            <Text style={styles.infoTitle}>Live Video</Text>
            <Text style={styles.infoDescription}>
              Real conversations, no ghosting
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>✅</Text>
            <Text style={styles.infoTitle}>Verified Users</Text>
            <Text style={styles.infoDescription}>
              Face ID keeps everyone safe
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.premiumBanner} 
          onPress={handlePremiumPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.pastelYellow, "#FFE680"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumGradient}
          >
            <Text style={styles.premiumEmoji}>👑</Text>
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>Go Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Unlimited calls • Ad-free • Priority matching
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Out of Free Calls</Text>
              <Text style={styles.modalEmoji}>🚀</Text>
            </View>

            <Text style={styles.modalDescription}>
              You have used all 5 free calls! Upgrade to Premium to continue connecting with amazing people.
            </Text>

            <View style={styles.modalFeatures}>
              <View style={styles.modalFeature}>
                <Text style={styles.modalFeatureIcon}>✨</Text>
                <Text style={styles.modalFeatureText}>Unlimited video calls</Text>
              </View>
              <View style={styles.modalFeature}>
                <Text style={styles.modalFeatureIcon}>⚡</Text>
                <Text style={styles.modalFeatureText}>Priority matching</Text>
              </View>
              <View style={styles.modalFeature}>
                <Text style={styles.modalFeatureIcon}>🎯</Text>
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
                <Text style={styles.modalSubscribeText}>Subscribe Now</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  callsCounter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  callsText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.charcoal,
  },
  modeToggle: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  modeButton: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.white,
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  modeButtonActive: {
    backgroundColor: Colors.pastelYellow,
  },
  modeText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.mediumGray,
  },
  modeTextActive: {
    color: Colors.charcoal,
  },
  flareSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  flareTitle: {
    fontSize: 36,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  flareSubtitle: {
    fontSize: 17,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.65,
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  flareButtonContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  flareGlow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.pastelYellow,
    opacity: 0.4,
  },
  flareButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 6,
    borderColor: Colors.pastelYellow,
  },
  flareButtonInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  flareButtonText: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    letterSpacing: -0.3,
  },
  infoSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 4,
    textAlign: "center",
  },
  infoDescription: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.6,
    textAlign: "center",
  },
  premiumBanner: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  premiumGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  premiumEmoji: {
    fontSize: 40,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  bottomSpacer: {
    height: 20,
  },
  chatsSection: {
    marginBottom: 32,
  },
  chatsSectionTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: "center" as const,
  },
  chatsSectionSubtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.65,
    marginBottom: 20,
    textAlign: "center" as const,
  },
  chatsScrollContent: {
    gap: 16,
    paddingRight: 20,
  },
  chatCard: {
    width: 260,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
  },
  chatCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  chatCardEmoji: {
    fontSize: 48,
  },
  chatTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  chatTypeBadgeDate: {
    backgroundColor: Colors.softPink,
  },
  chatTypeBadgeGroup: {
    backgroundColor: Colors.pastelYellow,
  },
  chatTypeBadgeFriend: {
    backgroundColor: Colors.babyBlue,
  },
  chatTypeBadgeText: {
    fontSize: 12,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    letterSpacing: 0.5,
  },
  chatCardName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  chatCardMessage: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.65,
    marginBottom: 16,
    lineHeight: 22,
  },
  chatCardTime: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.45,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.charcoal,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalFeatures: {
    marginBottom: 24,
    gap: 12,
  },
  modalFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.babyBlue,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  modalFeatureIcon: {
    fontSize: 24,
  },
  modalFeatureText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.charcoal,
    flex: 1,
  },
  modalSubscribeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  modalSubscribeGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubscribeText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
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
});
