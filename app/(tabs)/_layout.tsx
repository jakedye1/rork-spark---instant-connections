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
        tabBarActiveTintColor: Colors.charcoal,
        tabBarInactiveTintColor: Colors.mediumGray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          ...(Platform.OS === 'ios' ? {
            shadowColor: Colors.shadowDark,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          } : {
            elevation: 8,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600" as const,
        },
        tabBarHideOnKeyboard: Platform.OS !== 'ios',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Flare",
          tabBarIcon: ({ color }) => <Flame size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "What's the Plan",
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />

    </Tabs>
  );
}
