import { Tabs } from "expo-router";
import { Flame, MessageCircle, User, Video } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.babyBlue,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
        },
        tabBarBackground: () => (
          <View style={styles.dockContainer}>
             <BlurView intensity={80} tint="dark" style={styles.dockBlur} />
             <View style={styles.dockBorder} />
          </View>
        ),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 4,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Flame 
                size={24} 
                color={color} 
                fill={focused ? color : "transparent"} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          title: "Live Match",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Video 
                size={24} 
                color={color}
                fill={focused ? color : "transparent"} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <MessageCircle 
                size={24} 
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <User 
                size={24} 
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    overflow: "hidden",
    backgroundColor: "rgba(11, 11, 13, 0.8)", // Semi-transparent background
  },
  dockBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  dockBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.glassBorder,
  },
  iconWrapper: {
    width: 48,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    marginBottom: 4,
  },
  iconWrapperActive: {
    backgroundColor: "rgba(130, 199, 255, 0.15)",
    shadowColor: Colors.babyBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
});
