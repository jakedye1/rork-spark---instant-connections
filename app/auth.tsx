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
      colors={Colors.gradientDark as [string, string, ...string[]]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={Colors.gradientHero as [string, string, ...string[]]}
                style={styles.logoCircle}
              >
                <Sparkles size={56} color={Colors.white} strokeWidth={2} />
              </LinearGradient>
              <Text style={styles.logoText}>Spark</Text>
              <Text style={styles.tagline}>Real connections, instantly</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>{isSignUp ? "Create Account" : "Welcome Back"}</Text>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <View style={styles.iconContainer}>
                    <Mail size={20} color={Colors.textSecondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={Colors.textTertiary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    textContentType="emailAddress"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.iconContainer}>
                    <Lock size={20} color={Colors.textSecondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.textTertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCorrect={false}
                    textContentType={isSignUp ? "newPassword" : "password"}
                  />
                </View>

                {isSignUp && (
                  <View style={styles.inputWrapper}>
                    <View style={styles.iconContainer}>
                      <Lock size={20} color={Colors.textSecondary} />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor={Colors.textTertiary}
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
                <LinearGradient
                  colors={Colors.gradient1 as [string, string, ...string[]]}
                  style={styles.authButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.authButtonText}>
                    {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
                  </Text>
                </LinearGradient>
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
    marginBottom: 60,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 17,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 32,
    textAlign: "center",
    letterSpacing: -1,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500" as const,
  },
  authButton: {
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  authButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 20,
  },
  forgotPasswordText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    gap: 8,
  },
  switchText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.textSecondary,
  },
  switchButton: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.primary,
  },
});
