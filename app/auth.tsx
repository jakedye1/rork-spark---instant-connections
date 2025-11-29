import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Mail, Lock, Sparkles } from "lucide-react-native";
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

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        console.log("Signing up with email:", email);
        await signUp(email, password);
        console.log("Sign up successful, navigating to onboarding");
        router.replace("/onboarding");
      } else {
        console.log("Signing in with email:", email);
        const success = await signIn(email, password);
        if (success) {
          console.log("Sign in successful, navigating to home");
          router.replace("/(tabs)/home");
        } else {
          console.log("Sign in failed - invalid credentials");
          Alert.alert("Error", "Invalid credentials");
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      Alert.alert("Error", isSignUp ? "Sign up failed" : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

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
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Sparkles size={48} color={Colors.charcoal} />
              </View>
              <Text style={styles.logoText}>Spark</Text>
              <Text style={styles.tagline}>Real connections, instantly</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>{isSignUp ? "Create Account" : "Welcome Back"}</Text>

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
                    autoCorrect={false}
                    textContentType="emailAddress"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Lock size={20} color={Colors.mediumGray} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.mediumGray}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCorrect={false}
                    textContentType={isSignUp ? "newPassword" : "password"}
                  />
                </View>

                {isSignUp && (
                  <View style={styles.inputWrapper}>
                    <Lock size={20} color={Colors.mediumGray} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor={Colors.mediumGray}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      autoCorrect={false}
                      textContentType="newPassword"
                    />
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.authButton}
                onPress={handleAuth}
                disabled={isLoading}
              >
                <Text style={styles.authButtonText}>
                  {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                </Text>
              </TouchableOpacity>

              {!isSignUp && (
                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => router.push("/forgot-password")}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                </Text>
                <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                  <Text style={styles.switchButton}>{isSignUp ? "Sign In" : "Sign Up"}</Text>
                </TouchableOpacity>
              </View>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.pastelYellow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: Colors.pastelYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 24,
    textAlign: "center",
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
  authButton: {
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
  authButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  switchText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  switchButton: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
});
