// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import { FriendsProvider } from "@/contexts/FriendsContext";
import { ChatsProvider } from "@/contexts/ChatsContext";
import { ToastProvider, useToast } from "@/contexts/ToastContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { PurchasesProvider } from "@/contexts/PurchasesContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { ToastComponent } = useToast();
  
  return (
    <>
      <Stack screenOptions={{ 
        headerBackTitle: "Back",
        ...(Platform.OS === 'ios' ? {
          headerBackTitleVisible: true,
          headerTintColor: '#1E1E1E',
        } : {})
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="video-chat" options={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }} />
        <Stack.Screen name="group-video-chat" options={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }} />
        <Stack.Screen name="match-success" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="premium" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="settings" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="notifications" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="privacy-safety" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="help-support" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="friends-video-chat" options={{ headerShown: false, presentation: "modal", animation: "slide_from_bottom" }} />
        <Stack.Screen name="friend-chat" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="change-password" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="about" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="terms" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="privacy-policy" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="blocked-users" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="faq" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false, presentation: "modal" }} />
      </Stack>
      {ToastComponent}
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ToastProvider>
            <AuthProvider>
              <PurchasesProvider>
                <PermissionsProvider>
                  <FriendsProvider>
                    <ChatsProvider>
                      <RootLayoutNav />
                    </ChatsProvider>
                  </FriendsProvider>
                </PermissionsProvider>
              </PurchasesProvider>
            </AuthProvider>
          </ToastProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
