import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState, useCallback, useMemo } from "react";

type UserProfile = {
  id: string;
  name: string;
  age: string;
  interests: string[];
  lookingFor: "dating" | "friends" | "groups";
  locationEnabled: boolean;
  distance: number;
  email: string;
  genderPreference?: "female" | "male" | "other" | "everyone";
  phoneNumber?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  callsRemaining: number;
  isPremium: boolean;
};

type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Omit<UserProfile, "id" | "email" | "callsRemaining" | "isPremium">) => Promise<void>;
  updateSettings: (settings: Partial<Omit<UserProfile, "id" | "email" | "callsRemaining" | "isPremium">>) => Promise<void>;
  updateGenderPreference: (preference: "female" | "male" | "other" | "everyone") => Promise<void>;
  markOnboardingComplete: () => Promise<void>;
  decrementCall: () => Promise<void>;
  setPremium: (isPremium: boolean) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
  resetPassword: (email: string, resetCode: string, newPassword: string) => Promise<boolean>;
};

const AUTH_STORAGE_KEY = "@spark_auth";
const USER_STORAGE_KEY = "@spark_user";
const ONBOARDING_STORAGE_KEY = "@spark_onboarding";
const PASSWORD_RESET_KEY = "@spark_password_reset";

export const [AuthProvider, useAuth] = createContextHook<AuthContextType>(() => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(tabs)";
    const allowedRoutes = ["video-chat", "group-video-chat", "friends-video-chat", "match-success", "premium", "settings", "notifications", "privacy-safety", "help-support", "friend-chat", "edit-profile", "change-password", "about", "terms", "privacy-policy", "forgot-password", "blocked-users", "faq", "permissions-request"];
    const currentRoute = segments[0];

    console.log('AuthContext navigation guard - segments:', segments, 'currentRoute:', currentRoute);
    console.log('AuthContext - inAuthGroup:', inAuthGroup, 'user exists:', !!user);

    if (!user && inAuthGroup) {
      console.log('Redirecting to auth - user not logged in but in auth group');
      router.replace("/auth");
    } else if (user && !inAuthGroup && !allowedRoutes.includes(currentRoute)) {
      console.log('User is logged in but not in tabs or allowed routes, redirecting to home');
      router.replace("/(tabs)/home");
    } else {
      console.log('No redirect needed');
    }
  }, [user, segments, isLoading]);

  const loadUser = useCallback(async () => {
    try {
      const [authData, userData, onboardingData] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        AsyncStorage.getItem(USER_STORAGE_KEY),
        AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
      ]);

      console.log('Loading user - authData:', authData ? 'exists' : 'null');
      console.log('Loading user - userData:', userData ? 'exists' : 'null');

      if (authData && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
            setUser(parsedUser);
          } else {
            console.error('Invalid user data structure:', parsedUser);
            await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, USER_STORAGE_KEY]).catch(err => {
              console.error('Failed to clear corrupted data:', err);
            });
          }
        } catch (parseError) {
          console.error("Failed to parse user data:", parseError);
          console.log('Clearing corrupted data');
          await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, USER_STORAGE_KEY]).catch(err => {
            console.error('Failed to clear corrupted data:', err);
          });
        }
      }

      if (onboardingData === "true") {
        setHasSeenOnboarding(true);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

      console.log('Sign in - storedAuth:', storedAuth ? 'exists' : 'null');
      console.log('Sign in - storedUser:', storedUser ? 'exists' : 'null');

      if (storedAuth && storedUser) {
        try {
          const auth = JSON.parse(storedAuth);
          if (auth.email === email && auth.password === password) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
              setUser(parsedUser);
              return true;
            }
          }
        } catch (parseError) {
          console.error("Failed to parse stored data:", parseError);
          console.log('Clearing corrupted data');
          await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, USER_STORAGE_KEY]);
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error("Sign in failed:", error);
      return false;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const auth = { email, password };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, USER_STORAGE_KEY]);
      setUser(null);
      router.replace("/auth");
    } catch (error) {
      console.error("Sign out failed:", error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      setUser(null);
      router.replace("/auth");
    }
  }, [router]);

  const markOnboardingComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error("Failed to mark onboarding complete:", error);
    }
  }, []);

  const updateProfile = useCallback(async (profile: Omit<UserProfile, "id" | "email" | "callsRemaining" | "isPremium">) => {
    try {
      console.log("updateProfile called");
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      console.log("Auth data exists:", authData ? "yes" : "no");
      
      if (!authData) {
        console.error("No auth data found");
        throw new Error("Not authenticated");
      }

      let auth;
      try {
        auth = JSON.parse(authData);
        console.log("Parsed auth successfully");
      } catch (parseError) {
        console.error("Failed to parse auth data:", parseError);
        console.log("Clearing corrupted auth data");
        await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, USER_STORAGE_KEY]).catch(err => {
          console.error('Failed to clear corrupted data:', err);
        });
        throw new Error("Invalid auth data format");
      }

      if (!auth || !auth.email) {
        console.error("Invalid auth object");
        await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, USER_STORAGE_KEY]).catch(err => {
          console.error('Failed to clear invalid data:', err);
        });
        throw new Error("Invalid auth data");
      }
      
      const newUser: UserProfile = {
        ...profile,
        id: Date.now().toString(),
        email: auth.email,
        callsRemaining: 5,
        isPremium: false,
      };

      console.log("Saving user profile");
      const userDataString = JSON.stringify(newUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, userDataString);
      setUser(newUser);
      console.log("Profile saved successfully, navigating to home");
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Update profile failed:", error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }, [router]);

  const updateSettings = useCallback(async (settings: Partial<Omit<UserProfile, "id" | "email" | "callsRemaining" | "isPremium">>) => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const updatedUser: UserProfile = {
        ...user,
        ...settings,
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Update settings failed:", error);
      throw error;
    }
  }, [user]);

  const updateGenderPreference = useCallback(async (preference: "female" | "male" | "other" | "everyone") => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const updatedUser: UserProfile = {
        ...user,
        genderPreference: preference,
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Update gender preference failed:", error);
      throw error;
    }
  }, [user]);

  const decrementCall = useCallback(async () => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      if (user.isPremium) {
        return;
      }

      const updatedUser: UserProfile = {
        ...user,
        callsRemaining: Math.max(0, user.callsRemaining - 1),
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Decrement call failed:", error);
      throw error;
    }
  }, [user]);

  const setPremium = useCallback(async (isPremium: boolean) => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const updatedUser: UserProfile = {
        ...user,
        isPremium,
        callsRemaining: isPremium ? 999 : user.callsRemaining,
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Set premium failed:", error);
      throw error;
    }
  }, [user]);

  const sendPasswordResetEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedAuth) {
        return false;
      }

      const auth = JSON.parse(storedAuth);
      if (auth.email !== email) {
        return false;
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetData = {
        email,
        code: resetCode,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(PASSWORD_RESET_KEY, JSON.stringify(resetData));
      
      console.log(`Password reset code for ${email}: ${resetCode}`);
      console.log('In a real app, this would be sent via email');
      
      return true;
    } catch (error) {
      console.error("Send password reset email failed:", error);
      return false;
    }
  }, []);

  const resetPassword = useCallback(async (email: string, resetCode: string, newPassword: string): Promise<boolean> => {
    try {
      const resetData = await AsyncStorage.getItem(PASSWORD_RESET_KEY);
      if (!resetData) {
        return false;
      }

      const { email: storedEmail, code, timestamp } = JSON.parse(resetData);
      
      const fifteenMinutes = 15 * 60 * 1000;
      if (Date.now() - timestamp > fifteenMinutes) {
        await AsyncStorage.removeItem(PASSWORD_RESET_KEY);
        return false;
      }

      if (storedEmail !== email || code !== resetCode) {
        return false;
      }

      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedAuth) {
        return false;
      }

      const auth = JSON.parse(storedAuth);
      auth.password = newPassword;
      
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
      await AsyncStorage.removeItem(PASSWORD_RESET_KEY);
      
      return true;
    } catch (error) {
      console.error("Reset password failed:", error);
      return false;
    }
  }, []);

  return useMemo(
    () => ({
      user,
      isLoading,
      hasSeenOnboarding,
      signIn,
      signUp,
      signOut,
      updateProfile,
      updateSettings,
      markOnboardingComplete,
      updateGenderPreference,
      decrementCall,
      setPremium,
      sendPasswordResetEmail,
      resetPassword,
    }),
    [user, isLoading, hasSeenOnboarding, signIn, signUp, signOut, updateProfile, updateSettings, markOnboardingComplete, updateGenderPreference, decrementCall, setPremium, sendPasswordResetEmail, resetPassword]
  );
});
