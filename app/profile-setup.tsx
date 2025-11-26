import { LinearGradient } from "expo-linear-gradient";
import { Camera, User, Heart, Users, MapPin, ArrowRight } from "lucide-react-native";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import Colors from "@/constants/colors";

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

export default function ProfileSetupScreen() {
  const { updateProfile } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<"dating" | "friends" | "groups">("dating");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [distance, setDistance] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleContinue = async () => {
    console.log("Continue button pressed");
    console.log("Form data:", { name, age, interests: selectedInterests.length });

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

    setIsSubmitting(true);
    try {
      console.log("Updating profile...");
      await updateProfile({
        name: name.trim(),
        age: age.trim(),
        interests: selectedInterests,
        lookingFor,
        locationEnabled,
        distance,
      });
      console.log("Profile updated successfully");
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to create profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
           {/* Added invisible back button for spacing balance if needed, or we can add a real one if user wants to go back to onboarding */}
           <View style={{ width: 40 }} /> 
           <Text style={styles.headerTitle}>Profile Setup</Text>
           <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.title}>Create Your Vibe</Text>
          <Text style={styles.subtitle}>Let&apos;s get to know the real you</Text>

          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.photoButton}>
              <LinearGradient
                colors={[Colors.glass, Colors.glassDark]}
                style={styles.photoButtonGradient}
              >
                <View style={styles.photoIconContainer}>
                  <Camera size={32} color={Colors.babyBlue} />
                </View>
                <Text style={styles.photoButtonText}>Add Photos</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Name</Text>
            <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </BlurView>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Age</Text>
            <BlurView intensity={20} tint="dark" style={styles.inputBlur}>
              <TextInput
                style={styles.input}
                placeholder="Enter your age"
                placeholderTextColor={Colors.textSecondary}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
              />
            </BlurView>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>I&apos;m looking for</Text>
            <View style={styles.lookingForContainer}>
              <TouchableOpacity
                style={styles.lookingForButtonWrapper}
                onPress={() => setLookingFor("dating")}
              >
                <BlurView 
                  intensity={lookingFor === "dating" ? 40 : 10} 
                  tint="dark" 
                  style={[
                    styles.lookingForButton,
                    lookingFor === "dating" && styles.lookingForButtonActive
                  ]}
                >
                  <Heart
                    size={20}
                    color={lookingFor === "dating" ? Colors.babyBlue : Colors.textSecondary}
                    fill={lookingFor === "dating" ? Colors.babyBlue : "transparent"}
                  />
                  <Text
                    style={[
                      styles.lookingForText,
                      lookingFor === "dating" && styles.lookingForTextActive,
                    ]}
                  >
                    Dating
                  </Text>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.lookingForButtonWrapper}
                onPress={() => setLookingFor("friends")}
              >
                <BlurView 
                  intensity={lookingFor === "friends" ? 40 : 10} 
                  tint="dark" 
                  style={[
                    styles.lookingForButton,
                    lookingFor === "friends" && styles.lookingForButtonActive
                  ]}
                >
                  <User
                    size={20}
                    color={lookingFor === "friends" ? Colors.pastelYellow : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.lookingForText,
                      lookingFor === "friends" && styles.lookingForTextActive,
                    ]}
                  >
                    Friends
                  </Text>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.lookingForButtonWrapper}
                onPress={() => setLookingFor("groups")}
              >
                <BlurView 
                  intensity={lookingFor === "groups" ? 40 : 10} 
                  tint="dark" 
                  style={[
                    styles.lookingForButton,
                    lookingFor === "groups" && styles.lookingForButtonActive
                  ]}
                >
                  <Users
                    size={20}
                    color={lookingFor === "groups" ? Colors.aquaGlow : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.lookingForText,
                      lookingFor === "groups" && styles.lookingForTextActive,
                    ]}
                  >
                    Groups
                  </Text>
                </BlurView>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Interests (Select at least 3)</Text>
            <View style={styles.interestsContainer}>
              {INTERESTS.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  style={styles.interestTagWrapper}
                >
                  <BlurView
                    intensity={selectedInterests.includes(interest) ? 40 : 10}
                    tint="dark"
                    style={[
                      styles.interestTag,
                      selectedInterests.includes(interest) && styles.interestTagActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.interestTagText,
                        selectedInterests.includes(interest) && styles.interestTagTextActive,
                      ]}
                    >
                      {interest}
                    </Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputSection}>
            <BlurView intensity={10} tint="dark" style={styles.locationContainer}>
              <View style={styles.locationHeader}>
                <View style={styles.locationTitleContainer}>
                  <MapPin size={20} color={Colors.babyBlue} />
                  <Text style={[styles.label, { marginBottom: 0 }]}>Location & Distance</Text>
                </View>
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: Colors.glass, true: Colors.babyBlue }}
                  thumbColor={Colors.white}
                  ios_backgroundColor={Colors.glass}
                />
              </View>
              
              {locationEnabled && (
                <View style={styles.locationContent}>
                  <Text style={styles.locationDescription}>
                    Find people within <Text style={{color: Colors.babyBlue}}>{distance}</Text> miles of you
                  </Text>
                  <View style={styles.distanceSliderContainer}>
                    <Text style={styles.distanceLabel}>5 mi</Text>
                    <View style={styles.distanceSlider}>
                      <View style={styles.distanceTrack}>
                        <LinearGradient
                          colors={[Colors.babyBlue, Colors.aquaGlow]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[
                            styles.distanceTrackActive,
                            { width: `${((distance - 5) / 95) * 100}%` },
                          ]}
                        />
                      </View>
                      <View style={styles.distanceMarkers}>
                        {[5, 25, 50, 75, 100].map((value) => (
                          <TouchableOpacity
                            key={value}
                            style={styles.distanceMarker}
                            onPress={() => setDistance(value)}
                          >
                            <View
                              style={[
                                styles.distanceMarkerDot,
                                distance === value && styles.distanceMarkerDotActive,
                              ]}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <Text style={styles.distanceLabel}>100 mi</Text>
                  </View>
                </View>
              )}
            </BlurView>
          </View>

          <TouchableOpacity 
            style={[styles.continueButton, isSubmitting && styles.continueButtonDisabled]} 
            onPress={handleContinue}
            disabled={isSubmitting}
          >
            <LinearGradient
              colors={[Colors.babyBlue, Colors.aquaGlow]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButtonGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.charcoal} />
              ) : (
                <View style={styles.continueContent}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <ArrowRight size={20} color={Colors.charcoal} />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

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
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.white,
    marginTop: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  photoSection: {
    marginBottom: 24,
  },
  photoButton: {
    height: 140,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderStyle: "dashed",
  },
  photoButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  photoIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.glassLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.babyBlue,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 12,
  },
  inputBlur: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.white,
  },
  lookingForContainer: {
    flexDirection: "row",
    gap: 12,
  },
  lookingForButtonWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  lookingForButton: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  lookingForButtonActive: {
    borderColor: Colors.babyBlue,
    backgroundColor: Colors.glassLight,
  },
  lookingForText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  lookingForTextActive: {
    color: Colors.white,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestTagWrapper: {
    borderRadius: 20,
    overflow: "hidden",
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  interestTagActive: {
    borderColor: Colors.pastelYellow,
    backgroundColor: Colors.glassLight,
  },
  interestTagText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  interestTagTextActive: {
    color: Colors.white,
    fontWeight: "600",
  },
  locationContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: 16,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationContent: {
    marginTop: 20,
  },
  locationDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  distanceSliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  distanceLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    width: 40,
  },
  distanceSlider: {
    flex: 1,
    position: "relative",
    height: 20,
    justifyContent: 'center',
  },
  distanceTrack: {
    height: 4,
    backgroundColor: Colors.glassLight,
    borderRadius: 2,
    overflow: "hidden",
  },
  distanceTrackActive: {
    height: "100%",
  },
  distanceMarkers: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  distanceMarker: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  distanceMarkerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textSecondary,
  },
  distanceMarkerDotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.babyBlue,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: Colors.babyBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.charcoal,
  },
  bottomSpacer: {
    height: 40,
  },
});
