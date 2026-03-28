import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MessageCircle, Instagram, Phone, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { useFriends } from "@/contexts/FriendsContext";

const MOCK_NAMES = [
  "Sarah M.", "Alex K.", "Jordan T.", "Taylor S.", "Morgan L.",
  "Casey R.", "Riley P.", "Jamie W.", "Quinn H.", "Avery C.",
];

const MOCK_INTERESTS = [
  ["Travel", "Photography", "Cooking"],
  ["Fitness", "Music", "Reading"],
  ["Gaming", "Art", "Movies"],
  ["Hiking", "Coffee", "Writing"],
  ["Yoga", "Dancing", "Fashion"],
  ["Sports", "Tech", "Animals"],
  ["Nature", "Food", "Adventure"],
  ["Design", "Comedy", "Learning"],
];

export default function MatchSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; age?: string; interests?: string }>();
  const { addFriend } = useFriends();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [friendId, setFriendId] = useState<string | null>(null);
  
  const matchedPerson = React.useMemo(() => {
    if (params.name && params.age) {
      const interests = params.interests ? params.interests.split(',') : [];
      return {
        name: params.name,
        age: params.age,
        interests: interests.length > 0 ? interests : ["Music", "Travel", "Food"],
      };
    }
    const randomName = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
    const randomInterests = MOCK_INTERESTS[Math.floor(Math.random() * MOCK_INTERESTS.length)];
    const randomAge = (18 + Math.floor(Math.random() * 20)).toString();
    return {
      name: randomName,
      age: randomAge,
      interests: randomInterests,
    };
  }, [params]);
  
  useEffect(() => {
    const addMatchedFriend = async () => {
      try {
        console.log('Adding matched person as friend:', matchedPerson);
        const id = await addFriend({
          name: matchedPerson.name,
          age: matchedPerson.age,
          interests: matchedPerson.interests,
          isOnline: true,
        });
        console.log('Friend added with ID:', id);
        setFriendId(id);
      } catch (error) {
        console.error('Failed to add friend on match success:', error);
      }
    };
    addMatchedFriend();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };
  
  const handleChatNow = () => {
    console.log('=== handleChatNow BUTTON PRESSED ===');
    console.log('friendId:', friendId);
    
    if (!friendId) {
      console.error('No friendId available');
      Alert.alert('Hold on!', 'Setting up your chat... Try again in a moment.');
      return;
    }
    
    console.log('Navigating to friend-chat with friendId:', friendId);
    router.push({
      pathname: '/friend-chat',
      params: { friendId: friendId },
    });
  };

  return (
    <LinearGradient
      colors={[Colors.babyBlue, Colors.pastelYellow]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color={Colors.charcoal} />
        </TouchableOpacity>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.successIcon,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.successEmoji}>🎉</Text>
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.title}>It&apos;s a Match!</Text>
            <Text style={styles.subtitle}>
              You both want to keep talking. Here&apos;s how to connect:
            </Text>

            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
              <Text style={styles.name}>{matchedPerson.name}</Text>
              <Text style={styles.age}>{matchedPerson.age} years old</Text>

              <View style={styles.interestsRow}>
                {matchedPerson.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.contactSection}>
              <Text style={styles.contactTitle}>Connect on:</Text>

              <TouchableOpacity 
                style={[styles.contactButton, !friendId && styles.contactButtonDisabled]} 
                onPress={handleChatNow}
                activeOpacity={0.7}
                disabled={!friendId}
              >
                <MessageCircle size={24} color={friendId ? Colors.charcoal : Colors.mediumGray} />
                <Text style={[styles.contactButtonText, !friendId && styles.contactButtonTextDisabled]}>
                  {friendId ? 'Chat Now' : 'Setting up chat...'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactButton}>
                <Instagram size={24} color={Colors.charcoal} />
                <Text style={styles.contactButtonText}>@{matchedPerson.name.toLowerCase().replace(/\s+/g, '')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactButton}>
                <Phone size={24} color={Colors.charcoal} />
                <Text style={styles.contactButtonText}>Share Phone Number</Text>
              </TouchableOpacity>
            </View>


          </Animated.View>
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
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginTop: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  successIcon: {
    alignSelf: "center",
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 32,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  age: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    marginBottom: 16,
  },
  interestsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.pastelYellow,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
  },
  contactButtonDisabled: {
    opacity: 0.5,
  },
  contactButtonTextDisabled: {
    color: Colors.mediumGray,
  },
  planDateButton: {
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
    marginBottom: 16,
  },
  planDateButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
});
