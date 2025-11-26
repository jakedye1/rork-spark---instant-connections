import { LinearGradient } from "expo-linear-gradient";
import { Camera, User, Mic, Bell, Sparkles } from "lucide-react-native";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { GlassCard } from "@/components/GlassCard";
import { GlassInput } from "@/components/GlassInput";
import { GlassButton } from "@/components/GlassButton";

const INTERESTS = [
  "🎮 Gaming",
  "🎵 Music",
  "🏋️ Fitness",
  "🎨 Art",
  "📚 Reading",
  "🌍 Travel",
  "🍕 Foodie",
  "🎬 Movies",
  "⚽ Sports",
  "🐕 Pets",
  "💻 Tech",
  "🧘 Yoga",
];

type SetupStep = "profile" | "permissions";

export default function ProfileSetupScreen() {
  const { updateProfile } = useAuth();
  const { requestAllPermissions, markPermissionsRequested } = usePermissions();
  
  const [step, setStep] = useState<SetupStep>("profile");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleProfileSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Name Required", "Please enter your name");
      return;
    }

    if (!age.trim()) {
      Alert.alert("Age Required", "Please enter your age");
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      Alert.alert("Invalid Age", "Please enter a valid age (18-100)");
      return;
    }

    if (selectedInterests.length < 3) {
      Alert.alert("Interests Required", "Please select at least 3 interests");
      return;
    }

    setStep("permissions");
  };

  const handlePermissionsSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("Saving profile with data:", { name, age, interests: selectedInterests });
      await updateProfile({
        name: name.trim(),
        age: age.trim(),
        interests: selectedInterests,
        lookingFor: "dating",
        locationEnabled: false,
        distance: 25,
      });
      console.log("Profile saved successfully");
      
      try {
        await requestAllPermissions();
        await markPermissionsRequested();
      } catch (permError) {
        console.log("Permission request handled:", permError);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      Alert.alert("Error", "Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {step === "profile" ? (
              <View style={styles.stepContainer}>
                 <Text style={styles.title}>Build your vibe.</Text>
                 <Text style={styles.subtitle}>Let&apos;s get to know the real you</Text>

                 <GlassCard style={styles.formCard} intensity={25}>
                    <View style={styles.formContent}>
                       <TouchableOpacity style={styles.avatarPlaceholder}>
                          <LinearGradient
                             colors={[Colors.glassLight, Colors.glass]}
                             style={styles.avatarGradient}
                          >
                             <Camera size={32} color={Colors.babyBlue} />
                             <Text style={styles.addPhotoText}>Add Photo</Text>
                          </LinearGradient>
                       </TouchableOpacity>

                       <GlassInput
                          label="Name"
                          placeholder="Your Name"
                          value={name}
                          onChangeText={setName}
                          icon={<User size={20} color={Colors.babyBlue} />}
                       />

                       <GlassInput
                          label="Age"
                          placeholder="Your Age"
                          value={age}
                          onChangeText={setAge}
                          keyboardType="number-pad"
                          icon={<Sparkles size={20} color={Colors.pastelYellow} />}
                       />

                       <Text style={styles.label}>Interests (min 3)</Text>
                       <View style={styles.interestsContainer}>
                          {INTERESTS.map((interest) => {
                             const isSelected = selectedInterests.includes(interest);
                             return (
                                <TouchableOpacity
                                   key={interest}
                                   onPress={() => toggleInterest(interest)}
                                   style={[
                                      styles.interestBubble,
                                      isSelected && styles.interestBubbleActive
                                   ]}
                                >
                                   <Text style={[
                                      styles.interestText,
                                      isSelected && styles.interestTextActive
                                   ]}>{interest}</Text>
                                </TouchableOpacity>
                             );
                          })}
                       </View>
                    </View>
                 </GlassCard>

                 <GlassButton
                    title="Next Step"
                    onPress={handleProfileSubmit}
                    loading={isSubmitting}
                    style={styles.button}
                 />
              </View>
            ) : (
              <View style={styles.stepContainer}>
                 <Text style={styles.title}>Enable Access</Text>
                 <Text style={styles.subtitle}>To make sparks happen, we need access to a few things.</Text>

                 <GlassCard style={styles.permissionsCard} intensity={25}>
                    <View style={styles.permissionItem}>
                       <View style={styles.permissionIcon}>
                          <Mic size={24} color={Colors.babyBlue} />
                       </View>
                       <View style={styles.permissionText}>
                          <Text style={styles.permissionTitle}>Microphone</Text>
                          <Text style={styles.permissionDesc}>To talk with your matches</Text>
                       </View>
                    </View>
                    
                    <View style={styles.divider} />

                    <View style={styles.permissionItem}>
                       <View style={styles.permissionIcon}>
                          <Camera size={24} color={Colors.pastelYellow} />
                       </View>
                       <View style={styles.permissionText}>
                          <Text style={styles.permissionTitle}>Camera</Text>
                          <Text style={styles.permissionDesc}>To see each other live</Text>
                       </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.permissionItem}>
                       <View style={styles.permissionIcon}>
                          <Bell size={24} color={Colors.accent} />
                       </View>
                       <View style={styles.permissionText}>
                          <Text style={styles.permissionTitle}>Notifications</Text>
                          <Text style={styles.permissionDesc}>Know when you get a match</Text>
                       </View>
                    </View>
                 </GlassCard>

                 <GlassButton
                    title="Enable Everything"
                    onPress={handlePermissionsSubmit}
                    loading={isSubmitting}
                    style={styles.button}
                    variant="primary"
                 />
                 
                 <TouchableOpacity onPress={async () => {
                    setIsSubmitting(true);
                    try {
                      await updateProfile({
                        name: name.trim(),
                        age: age.trim(),
                        interests: selectedInterests,
                        lookingFor: "dating",
                        locationEnabled: false,
                        distance: 25,
                      });
                    } catch (error) {
                      console.error("Failed to save profile:", error);
                    }
                    setIsSubmitting(false);
                 }}>
                   <Text style={styles.skipText}>Skip for now</Text>
                 </TouchableOpacity>
                 
                 <Text style={styles.footerText}>You can change this anytime in settings</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
    left: 0, right: 0, top: 0, bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    minHeight: "100%",
  },
  stepContainer: {
    gap: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.white,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  formCard: {
    padding: 24,
    borderRadius: 32,
  },
  formContent: {
    gap: 16,
  },
  avatarPlaceholder: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderStyle: "dashed",
  },
  avatarGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoText: {
    color: Colors.babyBlue,
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 4,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  interestBubbleActive: {
    backgroundColor: "rgba(130, 199, 255, 0.2)",
    borderColor: Colors.babyBlue,
  },
  interestText: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  interestTextActive: {
    color: Colors.white,
  },
  button: {
    marginTop: 16,
  },
  permissionsCard: {
    padding: 24,
    borderRadius: 32,
    gap: 24,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  permissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
  },
  permissionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.glassBorder,
  },
  skipText: {
    textAlign: "center",
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
    marginTop: 16,
  },
  footerText: {
    textAlign: "center",
    color: Colors.textTertiary,
    fontSize: 12,
    marginTop: 8,
  },
});
