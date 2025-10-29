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
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={48} color={Colors.charcoal} />
            </View>
            <View style={styles.verifiedBadge}>
              <Shield size={16} color={Colors.white} />
            </View>
          </View>

          <Text style={styles.name}>{user?.name || "User"}</Text>
          <Text style={styles.age}>{user?.age ? `${user.age} years old` : "Age not set"}</Text>

          <View style={styles.interestsContainer}>
            {(user?.interests || []).map((interest) => (
              <View key={interest} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.premiumCard} 
          onPress={handlePremiumPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.pastelYellow, "#FFE680"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.premiumGradient}
          >
            <Crown size={32} color={Colors.charcoal} />
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumSubtitle}>
                Unlimited calls • Ad-free • Priority matching
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dating Preferences</Text>

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Users size={24} color={Colors.charcoal} />
              <Text style={styles.preferenceTitle}>I want to meet</Text>
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
            <View style={styles.menuItemLeft}>
              <Settings size={24} color={Colors.charcoal} />
              <Text style={styles.menuItemText}>Account Settings</Text>
            </View>
            <ChevronRight size={20} color={Colors.mediumGray} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              console.log('Notifications pressed - navigating to notifications');
              router.push('/notifications');
            }}
          >
            <View style={styles.menuItemLeft}>
              <Bell size={24} color={Colors.charcoal} />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color={Colors.mediumGray} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              console.log('Privacy & Safety pressed - navigating to privacy-safety');
              router.push('/privacy-safety');
            }}
          >
            <View style={styles.menuItemLeft}>
              <Shield size={24} color={Colors.charcoal} />
              <Text style={styles.menuItemText}>Privacy & Safety</Text>
            </View>
            <ChevronRight size={20} color={Colors.mediumGray} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              console.log('Help & Support pressed - navigating to help-support');
              router.push('/help-support' as any);
            }}
          >
            <View style={styles.menuItemLeft}>
              <HelpCircle size={24} color={Colors.charcoal} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={Colors.mediumGray} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <LogOut size={20} color={Colors.charcoal} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.softGreen,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
  },
  name: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  age: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.white,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  interestText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
  },
  premiumCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
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
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
  },
  bottomSpacer: {
    height: 20,
  },
  preferenceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  preferenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  preferenceTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  preferenceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  preferenceButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: Colors.babyBlue,
    borderWidth: 2,
    borderColor: "transparent",
  },
  preferenceButtonActive: {
    backgroundColor: Colors.softPink,
    borderColor: Colors.charcoal,
  },
  preferenceButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  preferenceButtonTextActive: {
    opacity: 1,
    fontWeight: "700" as const,
  },
});
