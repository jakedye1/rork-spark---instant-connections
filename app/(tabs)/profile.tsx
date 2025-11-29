import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Settings,
  Crown,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  Users,
  ChevronRight,
  Edit3,
  Zap,
} from "lucide-react-native";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut, updateGenderPreference } = useAuth();
  const router = useRouter();

  const handleGenderPreferenceChange = (preference: "female" | "male" | "other" | "everyone") => {
    Alert.alert(
      "Change Gender Preference",
      `Set preference to ${preference}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: Platform.OS === 'ios' ? 'default' : undefined,
          onPress: async () => {
            try {
              await updateGenderPreference(preference);
            } catch {
              Alert.alert("Error", "Failed to update preference");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePremiumPress = () => {
    console.log('Premium button pressed from profile - navigating to /premium');
    router.push('/premium');
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch {
              Alert.alert("Error", "Failed to sign out");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={Colors.gradientHero as [string, string, ...string[]]}
                style={styles.avatar}
              >
                <User size={52} color={Colors.white} strokeWidth={2} />
              </LinearGradient>
              <View style={styles.verifiedBadge}>
                <Shield size={16} color={Colors.white} strokeWidth={2.5} />
              </View>
              <TouchableOpacity 
                style={styles.editBadge}
                onPress={() => router.push('/edit-profile')}
              >
                <Edit3 size={14} color={Colors.white} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <Text style={styles.name}>{user?.name || "User"}</Text>
            <Text style={styles.age}>{user?.age ? `${user.age} years old` : "Age not set"}</Text>

            {(user?.interests && user.interests.length > 0) && (
              <View style={styles.interestsContainer}>
                {user.interests.map((interest) => (
                  <View key={interest} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            )}
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
                    <Zap size={36} color={Colors.white} fill={Colors.white} strokeWidth={2} />
                  </View>
                  <View style={styles.premiumTextContainer}>
                    <View style={styles.premiumTitleRow}>
                      <Text style={styles.premiumTitle}>Go Premium</Text>
                      <Crown size={20} color={Colors.white} strokeWidth={2} />
                    </View>
                    <Text style={styles.premiumSubtitle}>
                      Unlimited flares • Priority matches • No ads
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.preferenceCard}>
              <View style={styles.preferenceHeader}>
                <Users size={24} color={Colors.primary} strokeWidth={2} />
                <Text style={styles.preferenceTitle}>Looking for</Text>
              </View>
              <View style={styles.preferenceOptions}>
                <TouchableOpacity
                  style={[
                    styles.preferenceButton,
                    user?.genderPreference === "female" && styles.preferenceButtonActive,
                  ]}
                  onPress={() => handleGenderPreferenceChange("female")}
                >
                  <Text
                    style={[
                      styles.preferenceButtonText,
                      user?.genderPreference === "female" && styles.preferenceButtonTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.preferenceButton,
                    user?.genderPreference === "male" && styles.preferenceButtonActive,
                  ]}
                  onPress={() => handleGenderPreferenceChange("male")}
                >
                  <Text
                    style={[
                      styles.preferenceButtonText,
                      user?.genderPreference === "male" && styles.preferenceButtonTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.preferenceButton,
                    user?.genderPreference === "other" && styles.preferenceButtonActive,
                  ]}
                  onPress={() => handleGenderPreferenceChange("other")}
                >
                  <Text
                    style={[
                      styles.preferenceButtonText,
                      user?.genderPreference === "other" && styles.preferenceButtonTextActive,
                    ]}
                  >
                    Other
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.preferenceButton,
                    user?.genderPreference === "everyone" && styles.preferenceButtonActive,
                  ]}
                  onPress={() => handleGenderPreferenceChange("everyone")}
                >
                  <Text
                    style={[
                      styles.preferenceButtonText,
                      user?.genderPreference === "everyone" && styles.preferenceButtonTextActive,
                    ]}
                  >
                    Everyone
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                console.log('Account Settings pressed - navigating to settings');
                router.push('/settings');
              }}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: Colors.primary + "20" }]}>
                <Settings size={22} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.menuItemText}>Account Settings</Text>
              <ChevronRight size={20} color={Colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                console.log('Notifications pressed - navigating to notifications');
                router.push('/notifications');
              }}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: Colors.accent + "20" }]}>
                <Bell size={22} color={Colors.accent} strokeWidth={2} />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
              <ChevronRight size={20} color={Colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                console.log('Privacy & Safety pressed - navigating to privacy-safety');
                router.push('/privacy-safety');
              }}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: Colors.success + "20" }]}>
                <Shield size={22} color={Colors.success} strokeWidth={2} />
              </View>
              <Text style={styles.menuItemText}>Privacy & Safety</Text>
              <ChevronRight size={20} color={Colors.textTertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                console.log('Help & Support pressed - navigating to help-support');
                router.push('/help-support' as any);
              }}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: Colors.info + "20" }]}>
                <HelpCircle size={22} color={Colors.info} strokeWidth={2} />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
              <ChevronRight size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <View style={[styles.menuIconContainer, { backgroundColor: Colors.error + "20" }]}>
              <LogOut size={20} color={Colors.error} strokeWidth={2} />
            </View>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

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
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative" as const,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  verifiedBadge: {
    position: "absolute" as const,
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.background,
  },
  editBadge: {
    position: "absolute" as const,
    bottom: 4,
    left: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.background,
  },
  name: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -1,
  },
  age: {
    fontSize: 17,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  interestText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  premiumCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 32,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  premiumTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  premiumSubtitle: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.white,
    opacity: 0.9,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.text,
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.error + "40",
  },
  logoutText: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.error,
    flex: 1,
  },
  bottomSpacer: {
    height: 20,
  },
  preferenceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  preferenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  preferenceTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  preferenceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  preferenceButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  preferenceButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  preferenceButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  preferenceButtonTextActive: {
    color: Colors.white,
    fontWeight: "700" as const,
  },
});
