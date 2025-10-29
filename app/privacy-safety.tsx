import { LinearGradient } from "expo-linear-gradient";
import {
  Shield,
  Eye,
  EyeOff,
  UserX,
  AlertTriangle,
  Lock,
  MapPin,
  Camera,
  MessageSquare,
  ChevronRight,
  Info,
} from "lucide-react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export default function PrivacySafetyScreen() {
  const router = useRouter();

  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [photoAccess, setPhotoAccess] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);

  const handleIncognitoToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        "Incognito Mode",
        "In incognito mode, your profile won't be shown to others unless you like them first. This is a premium feature.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Enable",
            onPress: () => {
              setIncognitoMode(true);
              setShowOnlineStatus(false);
              setShowDistance(false);
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      setIncognitoMode(false);
    }
  };

  const handleBlockedUsers = () => {
    Alert.alert(
      "Blocked Users",
      "You haven't blocked anyone yet. Blocked users won't be able to see your profile or contact you.",
      [{ text: "OK" }],
      { cancelable: true }
    );
  };

  const handleReportUser = () => {
    Alert.alert(
      "Report & Safety",
      "If you encounter inappropriate behavior, harassment, or safety concerns, please report it immediately. We take all reports seriously.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Report Issue", onPress: () => {} },
      ],
      { cancelable: true }
    );
  };

  const handleDataPrivacy = () => {
    Alert.alert(
      "Data & Privacy",
      "Your data is protected and encrypted. We comply with GDPR, CCPA, and iOS privacy requirements. You can request your data or delete your account at any time.",
      [
        { text: "OK" },
        {
          text: "Learn More",
          onPress: () => {
            Alert.alert(
              "Privacy Information",
              "• Your location is never shared without permission\n• Photos are stored securely\n• Messages are encrypted\n• You control who sees your profile\n• You can delete your data anytime",
              [{ text: "OK" }],
              { cancelable: true }
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePhotoAccessToggle = (value: boolean) => {
    if (!value) {
      Alert.alert(
        "Disable Photo Access",
        "Disabling photo access means you won't be able to share photos in chats. You can re-enable this anytime in Settings.",
        [
          { text: "Cancel", style: "cancel", onPress: () => setPhotoAccess(true) },
          { text: "Disable", style: "destructive", onPress: () => setPhotoAccess(false) },
        ],
        { cancelable: true }
      );
    } else {
      setPhotoAccess(true);
    }
  };

  const handleLocationSharingToggle = (value: boolean) => {
    if (!value) {
      Alert.alert(
        "Disable Location Sharing",
        "Disabling location sharing will prevent the app from showing your distance to other users. This may limit your matching opportunities.",
        [
          { text: "Cancel", style: "cancel", onPress: () => setLocationSharing(true) },
          { text: "Disable", onPress: () => setLocationSharing(false) },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        "Enable Location Sharing",
        "This app would like to access your location to show you nearby matches. Your exact location is never shared.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Allow", onPress: () => setLocationSharing(true) },
        ],
        { cancelable: true }
      );
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
            onPress={() => router.back()}
          >
            <ChevronRight
              size={24}
              color={Colors.charcoal}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Safety</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoCard}>
            <Shield size={24} color={Colors.charcoal} />
            <Text style={styles.infoText}>
              Your safety and privacy are our top priorities. Control who sees your
              information and how you interact with others.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Visibility</Text>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Eye size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Profile Visible</Text>
                    <Text style={styles.settingDescription}>
                      Show your profile to others
                    </Text>
                  </View>
                </View>
                <Switch
                  value={profileVisibility}
                  onValueChange={setProfileVisibility}
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <EyeOff size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Incognito Mode</Text>
                    <Text style={styles.settingDescription}>
                      Browse without being seen
                    </Text>
                  </View>
                </View>
                <Switch
                  value={incognitoMode}
                  onValueChange={handleIncognitoToggle}
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>

              <View style={styles.divider} />

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
                  disabled={incognitoMode}
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
                  disabled={incognitoMode}
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Info size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Show Age</Text>
                    <Text style={styles.settingDescription}>
                      Display your age on profile
                    </Text>
                  </View>
                </View>
                <Switch
                  value={showAge}
                  onValueChange={setShowAge}
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Communication</Text>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <MessageSquare size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Read Receipts</Text>
                    <Text style={styles.settingDescription}>
                      Show when you&apos;ve read messages
                    </Text>
                  </View>
                </View>
                <Switch
                  value={readReceipts}
                  onValueChange={setReadReceipts}
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Permissions (iOS Compliance)</Text>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Camera size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Photo Access</Text>
                    <Text style={styles.settingDescription}>
                      Allow sharing photos in chats
                    </Text>
                  </View>
                </View>
                <Switch
                  value={photoAccess}
                  onValueChange={handlePhotoAccessToggle}
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
                    <Text style={styles.settingTitle}>Location Services</Text>
                    <Text style={styles.settingDescription}>
                      Find people nearby
                    </Text>
                  </View>
                </View>
                <Switch
                  value={locationSharing}
                  onValueChange={handleLocationSharingToggle}
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  Alert.alert(
                    "Manage Permissions",
                    "To change app permissions, go to Settings > Privacy & Security on your device.",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Open Settings", onPress: () => Linking.openSettings() },
                    ]
                  );
                }}
              >
                <View style={styles.settingLeft}>
                  <Lock size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>App Permissions</Text>
                    <Text style={styles.settingDescription}>
                      Manage in device settings
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety Controls</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={handleBlockedUsers}
              >
                <View style={styles.settingLeft}>
                  <UserX size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Blocked Users</Text>
                    <Text style={styles.settingDescription}>
                      Manage blocked accounts
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingRow}
                onPress={handleReportUser}
              >
                <View style={styles.settingLeft}>
                  <AlertTriangle size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Report & Safety</Text>
                    <Text style={styles.settingDescription}>
                      Report inappropriate behavior
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data & Privacy</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={handleDataPrivacy}
              >
                <View style={styles.settingLeft}>
                  <Lock size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Data Protection</Text>
                    <Text style={styles.settingDescription}>
                      How we protect your information
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => router.push("/privacy-policy" as any)}
              >
                <View style={styles.settingLeft}>
                  <Shield size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Privacy Policy</Text>
                    <Text style={styles.settingDescription}>
                      Read our privacy policy
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  Alert.alert(
                    "Download Your Data",
                    "Request a copy of all your data. This may take up to 30 days to process.",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Request Data", onPress: () => {} },
                    ]
                  );
                }}
              >
                <View style={styles.settingLeft}>
                  <Info size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Download My Data</Text>
                    <Text style={styles.settingDescription}>
                      Request a copy of your data
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => {
                  Alert.alert(
                    "Delete Account",
                    "This will permanently delete your account and all associated data. This action cannot be undone.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => {
                          Alert.alert(
                            "Are you sure?",
                            "Your account will be permanently deleted.",
                            [
                              { text: "Cancel", style: "cancel" },
                              { text: "Delete Forever", style: "destructive" },
                            ]
                          );
                        },
                      },
                    ]
                  );
                }}
              >
                <View style={styles.settingLeft}>
                  <AlertTriangle size={24} color="#FF3B30" />
                  <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingTitle, { color: "#FF3B30" }]}>
                      Delete Account
                    </Text>
                    <Text style={styles.settingDescription}>
                      Permanently delete your account
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
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
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    lineHeight: 20,
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
    height: 40,
  },
});
