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
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
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

export default function SettingsScreen() {
  const { user, updateSettings } = useAuth();
  const router = useRouter();

  const [locationEnabled, setLocationEnabled] = useState(user?.locationEnabled || false);

  useEffect(() => {
    console.log('Settings screen mounted');
    console.log('Current user:', user);
    return () => {
      console.log('Settings screen unmounted');
    };
  }, []);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);

  const handleLocationToggle = async (value: boolean) => {
    console.log('Location toggle changed:', value);
    setLocationEnabled(value);
    try {
      await updateSettings({
        locationEnabled: value,
      });
      console.log('Location setting updated successfully');
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
    <LinearGradient
      colors={[Colors.babyBlue, Colors.pastelYellow]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log('Back button pressed in settings');
              router.back();
            }}
          >
            <ChevronRight
              size={24}
              color={Colors.charcoal}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Settings</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MapPin size={24} color={Colors.charcoal} />
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
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
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
                      <Globe size={24} color={Colors.charcoal} />
                      <View style={styles.settingTextContainer}>
                        <Text style={styles.settingTitle}>Maximum Distance</Text>
                        <Text style={styles.settingDescription}>
                          {user?.distance || 25} miles
                        </Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color={Colors.mediumGray} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Settings</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => router.push("/edit-profile" as any)}
              >
                <View style={styles.settingLeft}>
                  <User size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Edit Profile</Text>
                    <Text style={styles.settingDescription}>
                      Update your info and interests
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Bell size={24} color={Colors.charcoal} />
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
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Smartphone size={24} color={Colors.charcoal} />
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
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Check size={24} color={Colors.charcoal} />
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
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Bell size={24} color={Colors.charcoal} />
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
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy & Safety</Text>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Eye size={24} color={Colors.charcoal} />
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
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MapPin size={24} color={Colors.charcoal} />
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
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Shield size={24} color={Colors.charcoal} />
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
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal & About</Text>
            <View style={styles.card}>
              <TouchableOpacity 
                style={styles.settingRow}
                onPress={() => {
                  console.log('Navigating to terms');
                  router.push("/terms" as any);
                }}
              >
                <View style={styles.settingLeft}>
                  <FileText size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Terms of Service</Text>
                    <Text style={styles.settingDescription}>
                      Read our terms and conditions
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.settingRow}
                onPress={() => {
                  console.log('Navigating to privacy-policy');
                  router.push("/privacy-policy" as any);
                }}
              >
                <View style={styles.settingLeft}>
                  <Shield size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Privacy Policy</Text>
                    <Text style={styles.settingDescription}>
                      How we handle your data
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity 
                style={styles.settingRow}
                onPress={() => {
                  console.log('Navigating to about');
                  router.push("/about" as any);
                }}
              >
                <View style={styles.settingLeft}>
                  <Info size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>About Spark</Text>
                    <Text style={styles.settingDescription}>
                      Learn more about us
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Version</Text>
                    <Text style={styles.settingDescription}>1.0.0</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.charcoal,
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
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
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
    gap: 12,
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginLeft: 52,
  },
  bottomSpacer: {
    height: 20,
  },
});
