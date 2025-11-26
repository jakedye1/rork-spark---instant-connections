import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Settings,
  Crown,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit3,
  Zap,
  Heart,
  Video,
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const router = useRouter();

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
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
             <View style={styles.avatarWrapper}>
                <LinearGradient
                   colors={Colors.gradientPrimary as [string, string, ...string[]]}
                   style={styles.avatarGradient}
                >
                   <GlassCard intensity={20} style={styles.avatarGlass}>
                      <User size={64} color={Colors.white} />
                   </GlassCard>
                </LinearGradient>
                <TouchableOpacity 
                   style={styles.editButton}
                   onPress={() => router.push('/edit-profile')}
                >
                   <GlassCard intensity={40} style={styles.editButtonGlass} variant="neon">
                      <Edit3 size={16} color={Colors.babyBlue} />
                   </GlassCard>
                </TouchableOpacity>
             </View>

             <Text style={styles.name}>{user?.name || "User"}</Text>
             <Text style={styles.age}>{user?.age ? `${user.age} • ${user?.lookingFor || 'Dating'}` : "Set up your profile"}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
             <GlassCard intensity={20} style={styles.statCard}>
                <Text style={styles.statValue}>124</Text>
                <Text style={styles.statLabel}>Matches</Text>
                <Heart size={16} color={Colors.babyBlue} style={styles.statIcon} />
             </GlassCard>
             
             <GlassCard intensity={20} style={styles.statCard}>
                <Text style={styles.statValue}>8.5k</Text>
                <Text style={styles.statLabel}>Sparks</Text>
                <FlameIcon />
             </GlassCard>

             <GlassCard intensity={20} style={styles.statCard}>
                <Text style={styles.statValue}>42h</Text>
                <Text style={styles.statLabel}>Live</Text>
                <Video size={16} color={Colors.accent} style={styles.statIcon} />
             </GlassCard>
          </View>

          {/* Premium Banner */}
          {!user?.isPremium && (
             <TouchableOpacity onPress={() => router.push('/premium')}>
                <LinearGradient
                   colors={Colors.gradientPremium as [string, string, ...string[]]}
                   style={styles.premiumBanner}
                   start={{ x: 0, y: 0 }}
                   end={{ x: 1, y: 0 }}
                >
                   <View style={styles.premiumContent}>
                      <View style={styles.premiumIcon}>
                         <Crown size={24} color={Colors.white} fill={Colors.white} />
                      </View>
                      <View style={{flex: 1}}>
                         <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                         <Text style={styles.premiumSubtitle}>Get unlimited swipes & more</Text>
                      </View>
                      <ChevronRight size={24} color={Colors.white} />
                   </View>
                </LinearGradient>
             </TouchableOpacity>
          )}

          {/* Settings Menu */}
          <View style={styles.menuContainer}>
             <Text style={styles.sectionTitle}>Settings</Text>
             
             <TouchableOpacity onPress={() => router.push('/settings')}>
                <GlassCard intensity={15} style={styles.menuItem}>
                   <View style={styles.menuRow}>
                      <Settings size={20} color={Colors.white} />
                      <Text style={styles.menuText}>Account Settings</Text>
                      <ChevronRight size={20} color={Colors.textTertiary} />
                   </View>
                </GlassCard>
             </TouchableOpacity>

             <TouchableOpacity onPress={() => router.push('/notifications')}>
                <GlassCard intensity={15} style={styles.menuItem}>
                   <View style={styles.menuRow}>
                      <Bell size={20} color={Colors.white} />
                      <Text style={styles.menuText}>Notifications</Text>
                      <ChevronRight size={20} color={Colors.textTertiary} />
                   </View>
                </GlassCard>
             </TouchableOpacity>

             <TouchableOpacity onPress={() => router.push('/privacy-safety')}>
                <GlassCard intensity={15} style={styles.menuItem}>
                   <View style={styles.menuRow}>
                      <Shield size={20} color={Colors.white} />
                      <Text style={styles.menuText}>Privacy & Safety</Text>
                      <ChevronRight size={20} color={Colors.textTertiary} />
                   </View>
                </GlassCard>
             </TouchableOpacity>

             <TouchableOpacity onPress={() => router.push('/help-support' as any)}>
                <GlassCard intensity={15} style={styles.menuItem}>
                   <View style={styles.menuRow}>
                      <HelpCircle size={20} color={Colors.white} />
                      <Text style={styles.menuText}>Help & Support</Text>
                      <ChevronRight size={20} color={Colors.textTertiary} />
                   </View>
                </GlassCard>
             </TouchableOpacity>
          </View>

          <GlassButton
             title="Sign Out"
             onPress={handleSignOut}
             variant="outline"
             style={{ marginTop: 24, marginBottom: 40 }}
             icon={<LogOut size={20} color={Colors.babyBlue} />}
          />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function FlameIcon() {
  return (
    <View style={styles.statIcon}>
       <Zap size={16} color={Colors.pastelYellow} fill={Colors.pastelYellow} />
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
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatarGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 4,
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  avatarGlass: {
    flex: 1,
    borderRadius: 66,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  editButtonGlass: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 4,
  },
  age: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    borderRadius: 20,
    position: "relative",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  statIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    opacity: 0.8,
  },
  premiumBanner: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
  },
  premiumContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  premiumIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.white,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  menuContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuItem: {
    borderRadius: 20,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
});
