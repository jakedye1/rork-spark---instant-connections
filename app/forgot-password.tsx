import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Mail, Lock, ArrowLeft, KeyRound } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";

type Step = "email" | "code" | "password";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { sendPasswordResetEmail, resetPassword } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const success = await sendPasswordResetEmail(email);
      if (success) {
        Alert.alert(
          "Code Sent",
          "A 6-digit reset code has been logged to the console. In a production app, this would be sent to your email.",
          [{ text: "OK", onPress: () => setStep("code") }]
        );
      } else {
        Alert.alert("Error", "No account found with this email");
      }
    } catch (error) {
      console.error("Send code error:", error);
      Alert.alert("Error", "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode) {
      Alert.alert("Error", "Please enter the reset code");
      return;
    }

    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const success = await resetPassword(email, resetCode, newPassword);
      if (success) {
        Alert.alert(
          "Success",
          "Your password has been reset successfully!",
          [{ text: "OK", onPress: () => router.replace("/auth") }]
        );
      } else {
        Alert.alert("Error", "Invalid or expired reset code");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      Alert.alert("Error", "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.description}>
        Enter your email address and we&apos;ll send you a code to reset your password
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Mail size={20} color={Colors.mediumGray} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.mediumGray}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSendCode}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? "Sending..." : "Send Reset Code"}
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderCodeStep = () => (
    <>
      <Text style={styles.title}>Enter Reset Code</Text>
      <Text style={styles.description}>
        Enter the 6-digit code that was logged to the console
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <KeyRound size={20} color={Colors.mediumGray} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="6-digit code"
            placeholderTextColor={Colors.mediumGray}
            value={resetCode}
            onChangeText={setResetCode}
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Lock size={20} color={Colors.mediumGray} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor={Colors.mediumGray}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputWrapper}>
          <Lock size={20} color={Colors.mediumGray} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor={Colors.mediumGray}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleSendCode}
        disabled={isLoading}
      >
        <Text style={styles.secondaryButtonText}>Resend Code</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <LinearGradient
      colors={[Colors.babyBlue, Colors.pastelYellow]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.charcoal} />
            </TouchableOpacity>

            <View style={styles.formContainer}>
              {step === "email" ? renderEmailStep() : renderCodeStep()}
            </View>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 20,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.charcoal,
  },
  primaryButton: {
    height: 56,
    backgroundColor: Colors.pastelYellow,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.pastelYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  secondaryButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
});
