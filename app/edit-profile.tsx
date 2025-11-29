import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Camera,
  Lock,
  Mail,
  Calendar,
  Heart,
  ChevronRight,
  Save,
  Phone,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react-native";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const name = user?.name || "";
  const age = user?.age || "";
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || []
  );
  const [lookingFor, setLookingFor] = useState<"dating" | "friends" | "groups">(
    user?.lookingFor || "dating"
  );
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [facebook, setFacebook] = useState(user?.facebook || "");
  const [tiktok, setTiktok] = useState(user?.tiktok || "");
  const [twitter, setTwitter] = useState(user?.twitter || "");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const availableInterests = [
    "Music",
    "Movies",
    "Sports",
    "Travel",
    "Food",
    "Art",
    "Gaming",
    "Reading",
    "Fitness",
    "Photography",
    "Cooking",
    "Dancing",
    "Technology",
    "Nature",
    "Fashion",
    "Pets",
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      Alert.alert("Maximum reached", "You can select up to 5 interests");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    if (!age.trim()) {
      Alert.alert("Error", "Please enter your age");
      return;
    }

    if (selectedInterests.length === 0) {
      Alert.alert("Error", "Please select at least one interest");
      return;
    }

    try {
      await updateProfile({
        name: name.trim(),
        age: age.trim(),
        interests: selectedInterests,
        lookingFor,
        locationEnabled: user?.locationEnabled || false,
        distance: user?.distance || 25,
        phoneNumber: phoneNumber.trim(),
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        tiktok: tiktok.trim(),
        twitter: twitter.trim(),
      });
      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const handleChangeProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to change your profile picture."
      );
      return;
    }

    Alert.alert(
      "Change Profile Picture",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus.status !== "granted") {
              Alert.alert("Permission Required", "Camera permission is required to take photos.");
              return;
            }
            
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setProfileImage(result.assets[0].uri);
              console.log("Profile image set:", result.assets[0].uri);
            }
          },
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setProfileImage(result.assets[0].uri);
              console.log("Profile image set:", result.assets[0].uri);
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleChangePassword = () => {
    router.push("/change-password" as any);
  };

  const handleChangeEmail = () => {
    Alert.alert(
      "Change Email",
      "Enter your new email address",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: () => {
            Alert.alert("Success", "Email update link sent to your email");
          },
        },
      ],
      { cancelable: true }
    );
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
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={24} color={Colors.charcoal} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  {profileImage && profileImage.trim().length > 0 ? (
                    <Image source={{ uri: profileImage }} style={styles.avatarImage} contentFit="cover" />
                  ) : (
                    <User size={48} color={Colors.charcoal} />
                  )}
                </View>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={handleChangeProfilePicture}
                >
                  <Camera size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleChangeProfilePicture}>
                <Text style={styles.changePhotoText}>Change Profile Picture</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={handleChangeEmail}
              >
                <View style={styles.settingLeft}>
                  <Mail size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Email</Text>
                    <Text style={styles.settingDescription}>
                      {user?.email || "Not set"}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingRow}
                onPress={handleChangePassword}
              >
                <View style={styles.settingLeft}>
                  <Lock size={24} color={Colors.charcoal} />
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Password</Text>
                    <Text style={styles.settingDescription}>
                      Change your password
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.mediumGray} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.card}>
              <View style={styles.inputRow}>
                <User size={24} color={Colors.charcoal} />
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <View style={styles.readOnlyInputContainer}>
                    <Text style={styles.readOnlyInput}>{name}</Text>
                    <View style={styles.lockedBadge}>
                      <Lock size={12} color={Colors.mediumGray} />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.inputRow}>
                <Calendar size={24} color={Colors.charcoal} />
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <View style={styles.readOnlyInputContainer}>
                    <Text style={styles.readOnlyInput}>{age}</Text>
                    <View style={styles.lockedBadge}>
                      <Lock size={12} color={Colors.mediumGray} />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.inputRow}>
                <Phone size={24} color={Colors.charcoal} />
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter your phone number"
                    placeholderTextColor={Colors.mediumGray}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Media</Text>
            <Text style={styles.sectionDescription}>
              Connect your social media accounts (Optional)
            </Text>
            <View style={styles.card}>
              <View style={styles.inputRow}>
                <Instagram size={24} color={Colors.charcoal} />
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Instagram</Text>
                  <TextInput
                    style={styles.input}
                    value={instagram}
                    onChangeText={setInstagram}
                    placeholder="@username"
                    placeholderTextColor={Colors.mediumGray}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.inputRow}>
                <Facebook size={24} color={Colors.charcoal} />
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Facebook</Text>
                  <TextInput
                    style={styles.input}
                    value={facebook}
                    onChangeText={setFacebook}
                    placeholder="username or profile URL"
                    placeholderTextColor={Colors.mediumGray}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.inputRow}>
                <View style={styles.socialIconContainer}>
                  <Text style={styles.tiktokIcon}>♪</Text>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>TikTok</Text>
                  <TextInput
                    style={styles.input}
                    value={tiktok}
                    onChangeText={setTiktok}
                    placeholder="@username"
                    placeholderTextColor={Colors.mediumGray}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.inputRow}>
                <Twitter size={24} color={Colors.charcoal} />
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Twitter / X</Text>
                  <TextInput
                    style={styles.input}
                    value={twitter}
                    onChangeText={setTwitter}
                    placeholder="@username"
                    placeholderTextColor={Colors.mediumGray}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What are you looking for?</Text>
            <View style={styles.lookingForContainer}>
              <TouchableOpacity
                style={[
                  styles.lookingForButton,
                  lookingFor === "dating" && styles.lookingForButtonActive,
                ]}
                onPress={() => setLookingFor("dating")}
              >
                <Heart
                  size={24}
                  color={
                    lookingFor === "dating" ? Colors.white : Colors.charcoal
                  }
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
                  size={24}
                  color={
                    lookingFor === "friends" ? Colors.white : Colors.charcoal
                  }
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
                <User
                  size={24}
                  color={
                    lookingFor === "groups" ? Colors.white : Colors.charcoal
                  }
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Interests</Text>
            <Text style={styles.sectionDescription}>
              Select up to 5 interests (
              {selectedInterests.length}/5)
            </Text>
            <View style={styles.interestsGrid}>
              {availableInterests.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestChip,
                    selectedInterests.includes(interest) &&
                      styles.interestChipSelected,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.interestChipText,
                      selectedInterests.includes(interest) &&
                        styles.interestChipTextSelected,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButtonLarge} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
  saveButton: {
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
  avatarSection: {
    alignItems: "center",
    paddingVertical: 16,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.softPurple,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.softPurple,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.6,
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.6,
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    padding: 0,
  },
  readOnlyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readOnlyInput: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  lockedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  lookingForContainer: {
    flexDirection: "row",
    gap: 12,
  },
  lookingForButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  lookingForButtonActive: {
    backgroundColor: Colors.softPurple,
    borderColor: Colors.charcoal,
  },
  lookingForText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.charcoal,
  },
  lookingForTextActive: {
    color: Colors.white,
    fontWeight: "700" as const,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  interestChipSelected: {
    backgroundColor: Colors.softPink,
    borderColor: Colors.charcoal,
  },
  interestChipText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  interestChipTextSelected: {
    opacity: 1,
    fontWeight: "700" as const,
  },
  saveButtonLarge: {
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
  saveButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  bottomSpacer: {
    height: 40,
  },
  socialIconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  tiktokIcon: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
});
