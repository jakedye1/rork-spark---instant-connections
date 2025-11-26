import { LinearGradient } from "expo-linear-gradient";
import { Heart, MessageCircle, Share2, Flame } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { GlassCard } from "@/components/GlassCard";

const { width, height } = Dimensions.get("window");

const POSTS = [
  {
    id: "1",
    username: "alex_designs",
    bio: "Creating sparks every day ✨ | Digital Artist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
    likes: "12.4k",
    comments: "842",
  },
  {
    id: "2",
    username: "sarah_travels",
    bio: "Catch me if you can ✈️ | Bali next week!",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop",
    likes: "8.2k",
    comments: "420",
  },
  {
    id: "3",
    username: "mike_music",
    bio: "Bass player 🎸 | Let's jam sometime",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
    likes: "25k",
    comments: "1.2k",
  },
];

export default function HomeScreen() {
  const [activeTab] = useState(0);

  const renderPost = ({ item }: { item: typeof POSTS[0] }) => {
    return (
      <View style={styles.postContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.postImage}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.overlayGradient}
        />

        {/* Right Actions */}
        <View style={styles.rightActions}>
          <GlassCard intensity={30} style={styles.actionButton}>
             <Heart size={28} color={Colors.white} />
             <Text style={styles.actionText}>{item.likes}</Text>
          </GlassCard>

          <GlassCard intensity={30} style={styles.actionButton}>
             <MessageCircle size={28} color={Colors.white} />
             <Text style={styles.actionText}>{item.comments}</Text>
          </GlassCard>

          <GlassCard intensity={30} style={styles.actionButton} variant="neon">
             <Flame size={28} color={Colors.babyBlue} fill={Colors.babyBlue} />
             <Text style={[styles.actionText, { color: Colors.babyBlue }]}>Spark</Text>
          </GlassCard>

          <GlassCard intensity={30} style={styles.actionButton}>
             <Share2 size={28} color={Colors.white} />
             <Text style={styles.actionText}>Share</Text>
          </GlassCard>
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.bio}>{item.bio}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Feed */}
      <FlatList
        data={POSTS}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - (Platform.OS === 'ios' ? 88 : 60)} // Adjust for tab bar
        snapToAlignment="start"
        decelerationRate="fast"
      />

      {/* Header Overlay */}
      <SafeAreaView style={styles.header} edges={["top"]}>
        <View style={styles.headerContent}>
          <GlassCard intensity={20} style={styles.logoPill}>
             <Flame size={20} color={Colors.babyBlue} fill={Colors.babyBlue} />
             <Text style={styles.logoText}>Spark</Text>
          </GlassCard>

          <GlassCard intensity={20} style={styles.profilePill}>
             <Image 
                source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" }}
                style={styles.avatar}
             />
          </GlassCard>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  postContainer: {
    width: width,
    height: height - (Platform.OS === 'ios' ? 88 : 60), // Subtract tab bar height roughly
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  overlayGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 300,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  logoPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  logoText: {
    color: Colors.white,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  profilePill: {
    padding: 4,
    borderRadius: 20,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  rightActions: {
    position: "absolute",
    right: 16,
    bottom: 120, // Above bottom info + tab bar
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    width: 56,
    height: 56, // Taller to accommodate text
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  actionText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  bottomInfo: {
    position: "absolute",
    left: 16,
    right: 80, // Space for right actions
    bottom: 40,
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bio: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
