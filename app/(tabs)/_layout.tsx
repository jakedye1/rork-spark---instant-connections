import { Tabs } from "expo-router";
import { Flame, MessageCircle, User } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          ...(Platform.OS === 'ios' ? {
            shadowColor: Colors.shadowDark,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
          } : {
            elevation: 16,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700" as const,
          letterSpacing: 0.3,
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
            <Flame 
              size={focused ? 28 : 24} 
              color={color} 
              fill={focused ? color : "transparent"}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <MessageCircle 
              size={focused ? 28 : 24} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User 
              size={focused ? 28 : 24} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}
