import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  Smartphone,
  Check,
  ChevronRight,
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export default function NotificationsScreen() {
  const router = useRouter();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [groupNotifications, setGroupNotifications] = useState(true);
  const [videoCallNotifications, setVideoCallNotifications] = useState(true);

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
              console.log('Back button pressed in notifications');
              router.back();
            }}
          >
            <ChevronRight
              size={24}
              color={Colors.charcoal}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
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
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity</Text>
            <View style={styles.card}>
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

              <View style={styles.divider} />

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Bell size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Group Invites</Text>
                    <Text style={styles.settingDescription}>
                      When you&apos;re invited to a group
                    </Text>
                  </View>
                </View>
                <Switch
                  value={groupNotifications}
                  onValueChange={setGroupNotifications}
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
                    <Text style={styles.settingTitle}>Video Calls</Text>
                    <Text style={styles.settingDescription}>
                      When someone calls you
                    </Text>
                  </View>
                </View>
                <Switch
                  value={videoCallNotifications}
                  onValueChange={setVideoCallNotifications}
                  trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.mediumGray}
                />
              </View>
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
