import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Platform, Alert } from "react-native";
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
  PurchasesOfferings,
  LOG_LEVEL,
} from "react-native-purchases";
import { useAuth } from "./AuthContext";

const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || "";
const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || "";

type PurchasesContextType = {
  offerings: PurchasesOfferings | null;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  isPremium: boolean;
  isConfigured: boolean;
  purchasePackage: (pkg: PurchasesPackage) => Promise<{ success: boolean; customerInfo?: CustomerInfo }>;
  restorePurchases: () => Promise<{ success: boolean; customerInfo?: CustomerInfo }>;
};

export const [PurchasesProvider, usePurchases] = createContextHook<PurchasesContextType>(() => {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const { user, setPremium } = useAuth();

  const updatePremiumStatus = useCallback(async (info: CustomerInfo) => {
    const isPremiumActive = 
      info.entitlements.active["premium"] !== undefined;
    
    if (isPremiumActive) {
      await setPremium(true);
    }
  }, [setPremium]);

  useEffect(() => {
    if (Platform.OS === "web") {
      console.log("RevenueCat is not supported on web");
      setIsLoading(false);
      setIsConfigured(false);
      return;
    }

    let listener: ((customerInfo: CustomerInfo) => void) | null = null;

    const initializePurchases = async () => {
      try {
        console.log("Initializing RevenueCat...");
        console.log("Platform:", Platform.OS);
        
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        const apiKey = Platform.OS === "ios" ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
        
        console.log("API Key configured for", Platform.OS, ":", apiKey ? "Yes (length: " + apiKey.length + ")" : "No");
        
        if (!apiKey || apiKey.trim() === "") {
          console.log("❌ RevenueCat API key not configured");
          console.log("\n📋 Setup Instructions:");
          console.log("1. Go to RevenueCat Dashboard: https://app.revenuecat.com");
          console.log("2. Create or select your app");
          console.log("3. Get your API keys from Settings > API Keys");
          console.log("4. For iOS: Copy the 'Apple App Store' key");
          console.log("5. For Android: Copy the 'Google Play Store' key");
          console.log("6. Add to your .env file:");
          console.log("   EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key_here");
          console.log("   EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key_here");
          console.log("\n⚠️  Important: Use the platform-specific keys, NOT the Web Billing key!");
          setIsLoading(false);
          setIsConfigured(false);
          return;
        }

        console.log("Configuring Purchases with API key...");
        await Purchases.configure({
          apiKey,
          appUserID: user?.id,
        });
        console.log("✅ Purchases configured successfully");

        if (user?.id) {
          console.log("Logging in user:", user.id);
          await Purchases.logIn(user.id);
        }

        console.log("Fetching customer info...");
        const info = await Purchases.getCustomerInfo();
        console.log("Customer info retrieved:", info.originalAppUserId);
        setCustomerInfo(info);
        await updatePremiumStatus(info);

        console.log("Fetching offerings...");
        const availableOfferings = await Purchases.getOfferings();
        setOfferings(availableOfferings);

        const packagesCount = availableOfferings.current?.availablePackages.length || 0;
        console.log("✅ RevenueCat initialized successfully");
        console.log("📦 Available offerings:", packagesCount);
        
        if (packagesCount === 0) {
          console.log("\n⚠️  No products found!");
          console.log("\n📋 Product Setup Instructions:");
          console.log("1. Go to RevenueCat Dashboard: https://app.revenuecat.com");
          console.log("2. Select your app");
          console.log("3. Go to 'Products' tab");
          console.log("4. Create products in App Store Connect / Google Play Console first");
          console.log("5. Add those products to RevenueCat");
          console.log("6. Create an 'Entitlement' (e.g., 'premium')");
          console.log("7. Create an 'Offering' and attach packages to it");
        }
        setIsConfigured(true);

        listener = (info: CustomerInfo) => {
          console.log("Customer info updated");
          setCustomerInfo(info);
          updatePremiumStatus(info);
        };
        
        Purchases.addCustomerInfoUpdateListener(listener);
      } catch (error: any) {
        console.error("❌ Error configuring Purchases:", error);
        console.error("Error details:", {
          code: error?.code,
          message: error?.message,
          underlyingErrorMessage: error?.underlyingErrorMessage,
        });
        
        if (error?.message?.includes("Invalid API key")) {
          console.log("\n⚠️  Invalid API Key Error!");
          console.log("This usually means:");
          console.log("1. You're using the wrong key (e.g., Web Billing key instead of iOS/Android key)");
          console.log("2. The key is incorrect or has extra spaces");
          console.log("3. The key doesn't match the platform you're testing on");
          console.log("\nFor iOS: Use the 'Apple App Store' key");
          console.log("For Android: Use the 'Google Play Store' key");
        }
        
        setIsConfigured(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializePurchases();

    return () => {
      if (listener) {
        try {
          Purchases.removeCustomerInfoUpdateListener(listener);
        } catch (error) {
          console.log("Error removing listener:", error);
        }
      }
    };
  }, [user?.id, updatePremiumStatus]);

  const purchasePackage = useCallback(async (
    pkg: PurchasesPackage
  ): Promise<{ success: boolean; customerInfo?: CustomerInfo }> => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Not Available",
        "In-app purchases are only available on mobile devices."
      );
      return { success: false };
    }

    try {
      console.log("Purchasing package:", pkg.identifier);
      const { customerInfo: info } = await Purchases.purchasePackage(pkg);
      
      setCustomerInfo(info);
      
      const isPremiumActive = 
        info.entitlements.active["premium"] !== undefined;
      
      if (isPremiumActive) {
        await setPremium(true);
      }

      return { success: true, customerInfo: info };
    } catch (error: any) {
      console.error("Purchase error:", error);
      
      if (error.userCancelled) {
        console.log("User cancelled purchase");
        return { success: false };
      }

      Alert.alert(
        "Purchase Failed",
        error.message || "Something went wrong. Please try again."
      );
      return { success: false };
    }
  }, [setPremium]);

  const restorePurchases = useCallback(async (): Promise<{ 
    success: boolean; 
    customerInfo?: CustomerInfo 
  }> => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Not Available",
        "Restore purchases is only available on mobile devices."
      );
      return { success: false };
    }

    try {
      console.log("Restoring purchases...");
      const info = await Purchases.restorePurchases();
      
      setCustomerInfo(info);
      
      const isPremiumActive = 
        info.entitlements.active["premium"] !== undefined;
      
      if (isPremiumActive) {
        await setPremium(true);
        Alert.alert(
          "Success",
          "Your purchases have been restored successfully!"
        );
      } else {
        Alert.alert(
          "No Purchases Found",
          "We couldn't find any previous purchases to restore."
        );
      }

      return { success: true, customerInfo: info };
    } catch (error: any) {
      console.error("Restore error:", error);
      Alert.alert(
        "Restore Failed",
        error.message || "Something went wrong. Please try again."
      );
      return { success: false };
    }
  }, [setPremium]);

  const isPremium = 
    customerInfo?.entitlements.active["premium"] !== undefined;

  return useMemo(() => ({
    offerings,
    isLoading,
    customerInfo,
    isPremium,
    isConfigured,
    purchasePackage,
    restorePurchases,
  }), [offerings, isLoading, customerInfo, isPremium, isConfigured, purchasePackage, restorePurchases]);
});
