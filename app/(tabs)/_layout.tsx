import { Tabs } from "expo-router";
import { Flame, MessageCircle, User } from "lucide-react-native";
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
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          elevation: 0,
        },
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            <BlurView 
              intensity={80} 
              tint="dark" 
              style={styles.tabBarBlur}
            >
              <View style={styles.tabBarGradient} />
            </BlurView>
          </View>
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700" as const,
          letterSpacing: 0.3,
          marginTop: 4,
        },
        tabBarHideOnKeyboard: Platform.OS !== 'ios',
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Flare",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Flame 
                size={focused ? 26 : 24} 
                color={color} 
                fill={focused ? color : "transparent"}
                strokeWidth={focused ? 2.5 : 2}
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
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <MessageCircle 
                size={focused ? 26 : 24} 
                color={color}
                strokeWidth={focused ? 2.5 : 2}
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
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <User 
                size={focused ? 26 : 24} 
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBarBlur: {
    flex: 1,
    overflow: "hidden",
  },
  tabBarGradient: {
    flex: 1,
    backgroundColor: Colors.glass,
    borderTopWidth: 1,
    borderTopColor: Colors.glassBorder,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  iconContainerActive: {
    backgroundColor: "rgba(130, 199, 255, 0.15)",
    shadowColor: Colors.shadowNeon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
});
