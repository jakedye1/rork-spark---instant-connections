import { LinearGradient } from "expo-linear-gradient";
import { Camera, User, Heart, Users, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to create profile. Please try again.");
      setIsSubmitting(false);
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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.title}>Create Your Profile</Text>
          <Text style={styles.subtitle}>Let&apos;s get to know you better</Text>

          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.photoButton}>
              <Camera size={32} color={Colors.charcoal} />
              <Text style={styles.photoButtonText}>Add Photos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={Colors.mediumGray}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor={Colors.mediumGray}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>I&apos;m looking for</Text>
            <View style={styles.lookingForContainer}>
              <TouchableOpacity
                style={[
                  styles.lookingForButton,
                  lookingFor === "dating" && styles.lookingForButtonActive,
                ]}
                onPress={() => setLookingFor("dating")}
              >
                <Heart
                  size={20}
                  color={lookingFor === "dating" ? Colors.charcoal : Colors.mediumGray}
                />
                <Text
                  style={[
                    styles.lookingForText,
                    lookingFor === "dating" && styles.lookingForTextActive,
                  ]}
                >
                  Dating
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.lookingForButton,
                  lookingFor === "friends" && styles.lookingForButtonActive,
                ]}
                onPress={() => setLookingFor("friends")}
              >
                <User
                  size={20}
                  color={lookingFor === "friends" ? Colors.charcoal : Colors.mediumGray}
                />
                <Text
                  style={[
                    styles.lookingForText,
                    lookingFor === "friends" && styles.lookingForTextActive,
                  ]}
                >
                  Friends
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.lookingForButton,
                  lookingFor === "groups" && styles.lookingForButtonActive,
                ]}
                onPress={() => setLookingFor("groups")}
              >
                <Users
                  size={20}
                  color={lookingFor === "groups" ? Colors.charcoal : Colors.mediumGray}
                />
                <Text
                  style={[
                    styles.lookingForText,
                    lookingFor === "groups" && styles.lookingForTextActive,
                  ]}
                >
                  Groups
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Interests (Select at least 3)</Text>
            <View style={styles.interestsContainer}>
              {INTERESTS.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestTag,
                    selectedInterests.includes(interest) && styles.interestTagActive,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.interestTagText,
                      selectedInterests.includes(interest) && styles.interestTagTextActive,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputSection}>
            <View style={styles.locationHeader}>
              <View style={styles.locationTitleContainer}>
                <MapPin size={20} color={Colors.charcoal} />
                <Text style={styles.label}>Location & Distance</Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: Colors.mediumGray, true: Colors.pastelYellow }}
                thumbColor={Colors.white}
                ios_backgroundColor={Colors.mediumGray}
              />
            </View>
            {locationEnabled && (
              <View style={styles.locationContent}>
                <Text style={styles.locationDescription}>
                  Find people within {distance} miles of you
                </Text>
                <View style={styles.distanceSliderContainer}>
                  <Text style={styles.distanceLabel}>5 mi</Text>
                  <View style={styles.distanceSlider}>
                    <View style={styles.distanceTrack}>
                      <View
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
          </View>

          <TouchableOpacity 
            style={[styles.continueButton, isSubmitting && styles.continueButtonDisabled]} 
            onPress={handleContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.charcoal} />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    marginBottom: 32,
  },
  photoSection: {
    marginBottom: 24,
  },
  photoButton: {
    height: 140,
    backgroundColor: Colors.white,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.pastelYellow,
    borderStyle: "dashed",
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.charcoal,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  lookingForContainer: {
    flexDirection: "row",
    gap: 12,
  },
  lookingForButton: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.white,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  lookingForButtonActive: {
    backgroundColor: Colors.pastelYellow,
  },
  lookingForText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.mediumGray,
  },
  lookingForTextActive: {
    color: Colors.charcoal,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  interestTagActive: {
    backgroundColor: Colors.pastelYellow,
  },
  interestTagText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.mediumGray,
  },
  interestTagTextActive: {
    color: Colors.charcoal,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  locationDescription: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.charcoal,
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
    fontWeight: "600" as const,
    color: Colors.mediumGray,
  },
  distanceSlider: {
    flex: 1,
    position: "relative",
  },
  distanceTrack: {
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    overflow: "hidden",
  },
  distanceTrackActive: {
    height: "100%",
    backgroundColor: Colors.pastelYellow,
  },
  distanceMarkers: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: -6,
    left: 0,
    right: 0,
  },
  distanceMarker: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  distanceMarkerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.mediumGray,
  },
  distanceMarkerDotActive: {
    borderColor: Colors.pastelYellow,
    backgroundColor: Colors.pastelYellow,
  },
  continueButton: {
    height: 56,
    backgroundColor: Colors.pastelYellow,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: Colors.pastelYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
  bottomSpacer: {
    height: 40,
  },
});
