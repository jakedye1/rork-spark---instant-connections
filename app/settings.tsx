import { LinearGradient } from "expo-linear-gradient";
import {
  MapPin,
  User,
  Bell,
  Shield,
  Eye,
  Globe,
  Smartphone,
  ChevronRight,
  Check,
  FileText,
  Info,
  ChevronLeft,
  MessageCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { GlassCard } from "@/components/GlassCard";

export default function SettingsScreen() {
  const { user, updateSettings } = useAuth();
  const router = useRouter();

  const [locationEnabled, setLocationEnabled] = useState(user?.locationEnabled || false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);

  const handleLocationToggle = async (value: boolean) => {
    setLocationEnabled(value);
    try {
      await updateSettings({
        locationEnabled: value,
      });
    } catch (error) {
      console.error("Failed to update location setting:", error);
      Alert.alert("Error", "Failed to update location setting");
      setLocationEnabled(!value);
    }
  };

  const handleDistanceChange = () => {
    Alert.alert(
      "Change Distance",
      "Select maximum distance for matches",
      [
        { text: "5 miles", onPress: () => updateDistance(5) },
        { text: "25 miles", onPress: () => updateDistance(25) },
        { text: "50 miles", onPress: () => updateDistance(50) },
        { text: "100 miles", onPress: () => updateDistance(100) },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const updateDistance = async (distance: number) => {
    try {
      await updateSettings({
        distance,
      });
    } catch (error) {
      console.error("Failed to update distance:", error);
      Alert.alert("Error", "Failed to update distance");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.background}
      />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <GlassCard intensity={20} style={styles.backButtonGlass}>
               <ChevronLeft size={24} color={Colors.white} />
            </GlassCard>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Settings</Text>
          <View style={styles.placeholderButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <GlassCard intensity={15} style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MapPin size={24} color={Colors.babyBlue} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Location Services</Text>
                    <Text style={styles.settingDescription}>
                      {locationEnabled
                        ? "Find people nearby"
                        : "Location is disabled"}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={locationEnabled}
                  onValueChange={handleLocationToggle}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              {locationEnabled && (
                <>
                  <View style={styles.divider} />
                  <TouchableOpacity
                    style={styles.settingRow}
                    onPress={handleDistanceChange}
                  >
                    <View style={styles.settingLeft}>
                      <Globe size={24} color={Colors.pastelYellow} />
                      <View style={styles.settingTextContainer}>
                        <Text style={styles.settingTitle}>Maximum Distance</Text>
                        <Text style={styles.settingDescription}>
                          {user?.distance || 25} miles
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color={Colors.textTertiary} />
                  </TouchableOpacity>
                </>
              )}
              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MapPin size={24} color={Colors.pastelYellow} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Distance</Text>
                    <Text style={styles.settingDescription}>
                      Display your distance to others
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showDistance}
                  onValueChange={setShowDistance}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MessageCircle size={24} color={Colors.babyBlue} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Messages</Text>
                    <Text style={styles.settingDescription}>
                      When you receive a message
                    </Text>
                  </View>
                </View>
                <Switch
                  value={messageNotifications}
                  onValueChange={setMessageNotifications}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>
            </GlassCard>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Settings</Text>
            <GlassCard intensity={15} style={styles.card}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => router.push("/edit-profile")}
              >
                <View style={styles.settingLeft}>
                  <User size={24} color={Colors.accent} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Edit Profile</Text>
                    <Text style={styles.settingDescription}>
                      Update your info and interests
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.textTertiary} />
              </TouchableOpacity>
              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MapPin size={24} color={Colors.pastelYellow} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Distance</Text>
                    <Text style={styles.settingDescription}>
                      Display your distance to others
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showDistance}
                  onValueChange={setShowDistance}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MessageCircle size={24} color={Colors.babyBlue} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Messages</Text>
                    <Text style={styles.settingDescription}>
                      When you receive a message
                    </Text>
                  </View>
                </View>
                <Switch
                  value={messageNotifications}
                  onValueChange={setMessageNotifications}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>
            </GlassCard>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <GlassCard intensity={15} style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Bell size={24} color={Colors.babyBlue} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Push Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Receive notifications on your device
                    </Text>
                  </View>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MapPin size={24} color={Colors.pastelYellow} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Distance</Text>
                    <Text style={styles.settingDescription}>
                      Display your distance to others
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showDistance}
                  onValueChange={setShowDistance}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Smartphone size={24} color={Colors.pastelYellow} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Email Notifications</Text>
                    <Text style={styles.settingDescription}>
                      Get updates via email
                    </Text>
                  </View>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MapPin size={24} color={Colors.pastelYellow} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Distance</Text>
                    <Text style={styles.settingDescription}>
                      Display your distance to others
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showDistance}
                  onValueChange={setShowDistance}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Check size={24} color={Colors.accent} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>New Matches</Text>
                    <Text style={styles.settingDescription}>
                      When someone matches with you
                    </Text>
                  </View>
                </View>
                <Switch
                  value={matchNotifications}
                  onValueChange={setMatchNotifications}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>
              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MapPin size={24} color={Colors.pastelYellow} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Distance</Text>
                    <Text style={styles.settingDescription}>
                      Display your distance to others
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showDistance}
                  onValueChange={setShowDistance}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MessageCircle size={24} color={Colors.babyBlue} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Messages</Text>
                    <Text style={styles.settingDescription}>
                      When you receive a message
                    </Text>
                  </View>
                </View>
                <Switch
                  value={messageNotifications}
                  onValueChange={setMessageNotifications}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>
            </GlassCard>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy & Safety</Text>
            <GlassCard intensity={15} style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Eye size={24} color={Colors.babyBlue} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Online Status</Text>
                    <Text style={styles.settingDescription}>
                      Let others see when you&apos;re active
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showOnlineStatus}
                  onValueChange={setShowOnlineStatus}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MapPin size={24} color={Colors.pastelYellow} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Distance</Text>
                    <Text style={styles.settingDescription}>
                      Display your distance to others
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showDistance}
                  onValueChange={setShowDistance}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Shield size={24} color={Colors.accent} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Incognito Mode</Text>
                    <Text style={styles.settingDescription}>
                      Browse without being seen
                    </Text>
                  </View>
                </View>
                <Switch
                  value={incognitoMode}
                  onValueChange={setIncognitoMode}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>
              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MapPin size={24} color={Colors.pastelYellow} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Distance</Text>
                    <Text style={styles.settingDescription}>
                      Display your distance to others
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showDistance}
                  onValueChange={setShowDistance}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MessageCircle size={24} color={Colors.babyBlue} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Messages</Text>
                    <Text style={styles.settingDescription}>
                      When you receive a message
                    </Text>
                  </View>
                </View>
                <Switch
                  value={messageNotifications}
                  onValueChange={setMessageNotifications}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>
            </GlassCard>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal & About</Text>
            <GlassCard intensity={15} style={styles.card}>
              <TouchableOpacity 
                style={styles.settingRow}
                onPress={() => router.push("/terms")}
              >
                <View style={styles.settingLeft}>
                  <FileText size={24} color={Colors.textSecondary} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Terms of Service</Text>
                    <Text style={styles.settingDescription}>
                      Read our terms and conditions
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.textTertiary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.settingRow}
                onPress={() => router.push("/privacy-policy")}
              >
                <View style={styles.settingLeft}>
                  <Shield size={24} color={Colors.textSecondary} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Privacy Policy</Text>
                    <Text style={styles.settingDescription}>
                      How we handle your data
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.textTertiary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.settingRow}
                onPress={() => router.push("/about")}
              >
                <View style={styles.settingLeft}>
                  <Info size={24} color={Colors.textSecondary} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>About Spark</Text>
                    <Text style={styles.settingDescription}>
                      Learn more about us
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.textTertiary} />
              </TouchableOpacity>
            </GlassCard>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  backButtonGlass: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 24,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.glassBorder,
    marginLeft: 56, // Align with text
  },
  bottomSpacer: {
    height: 20,
  },
});
