import { LinearGradient } from "expo-linear-gradient";
import { Lock, Eye, EyeOff, ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_STORAGE_KEY = "@spark_auth";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    try {
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (!authData) {
        Alert.alert("Error", "Authentication data not found");
        return;
      }

      const auth = JSON.parse(authData);

      if (auth.password !== currentPassword) {
        Alert.alert("Error", "Current password is incorrect");
        return;
      }

      const updatedAuth = {
        ...auth,
        password: newPassword,
      };

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuth));

      Alert.alert("Success", "Password changed successfully", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Failed to change password:", error);
      Alert.alert("Error", "Failed to change password. Please try again.");
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
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Lock size={48} color={Colors.charcoal} />
            </View>
          </View>

          <Text style={styles.description}>
            Create a new password for your account. Make sure it&apos;s at least 6
            characters long.
          </Text>

          <View style={styles.formSection}>
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor={Colors.mediumGray}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} color={Colors.charcoal} />
                  ) : (
                    <Eye size={20} color={Colors.charcoal} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor={Colors.mediumGray}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff size={20} color={Colors.charcoal} />
                  ) : (
                    <Eye size={20} color={Colors.charcoal} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor={Colors.mediumGray}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={Colors.charcoal} />
                  ) : (
                    <Eye size={20} color={Colors.charcoal} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <View style={styles.requirementRow}>
              <View
                style={[
                  styles.requirementDot,
                  newPassword.length >= 6 && styles.requirementDotMet,
                ]}
              />
              <Text style={styles.requirementText}>
                At least 6 characters long
              </Text>
            </View>
            <View style={styles.requirementRow}>
              <View
                style={[
                  styles.requirementDot,
                  newPassword === confirmPassword &&
                    newPassword.length > 0 &&
                    styles.requirementDotMet,
                ]}
              />
              <Text style={styles.requirementText}>Passwords match</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.changeButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.changeButtonText}>Change Password</Text>
          </TouchableOpacity>

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
  iconContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  iconCircle: {
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
  description: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.8,
  },
  formSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    padding: 0,
  },
  eyeButton: {
    padding: 8,
  },
  requirementsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 12,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  requirementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.mediumGray,
  },
  requirementDotMet: {
    backgroundColor: Colors.softGreen,
  },
  requirementText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  changeButton: {
    backgroundColor: Colors.softPurple,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  changeButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  bottomSpacer: {
    height: 40,
  },
});
