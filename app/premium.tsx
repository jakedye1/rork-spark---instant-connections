import { LinearGradient } from "expo-linear-gradient";
import { Crown, Check, X, Sparkles, Zap, Heart } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { usePurchases } from "@/contexts/PurchasesContext";
import type { PurchasesPackage } from "react-native-purchases";

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { offerings, isLoading, isConfigured, purchasePackage, restorePurchases } = usePurchases();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);

  const features = [
    {
      icon: Zap,
      title: "Unlimited Video Calls",
      description: "Connect with as many people as you want",
    },
    {
      icon: Sparkles,
      title: "Ad-Free Experience",
      description: "Enjoy uninterrupted conversations",
    },
    {
      icon: Heart,
      title: "Priority Matching",
      description: "Get matched faster with compatible people",
    },
    {
      icon: Crown,
      title: "Exclusive Badge",
      description: "Stand out with a premium badge",
    },
  ];

  const availablePackages = offerings?.current?.availablePackages || [];

  React.useEffect(() => {
    if (availablePackages.length > 0 && !selectedPackage) {
      const yearlyPackage = availablePackages.find(
        (pkg) => pkg.packageType === "ANNUAL"
      );
      setSelectedPackage(yearlyPackage || availablePackages[0]);
    }
  }, [availablePackages, selectedPackage]);

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert("Error", "Please select a subscription plan");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await purchasePackage(selectedPackage);

      if (result.success) {
        Alert.alert(
          "Success! 🎉",
          "Welcome to Premium! You now have access to all premium features.",
          [
            {
              text: "Start Exploring",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Purchase error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    setIsProcessing(true);
    try {
      await restorePurchases();
    } finally {
      setIsProcessing(false);
    }
  };

  const getPackageDisplayName = (pkg: PurchasesPackage): string => {
    if (pkg.packageType === "WEEKLY") return "Weekly";
    if (pkg.packageType === "MONTHLY") return "Monthly";
    if (pkg.packageType === "ANNUAL") return "Yearly";
    return pkg.identifier;
  };

  const getPackagePeriod = (pkg: PurchasesPackage): string => {
    if (pkg.packageType === "WEEKLY") return "/week";
    if (pkg.packageType === "MONTHLY") return "/month";
    if (pkg.packageType === "ANNUAL") return "/year";
    return "";
  };

  const getPackageBilling = (pkg: PurchasesPackage): string => {
    if (pkg.packageType === "WEEKLY") return "Billed weekly";
    if (pkg.packageType === "MONTHLY") return "Billed monthly";
    if (pkg.packageType === "ANNUAL") return "Billed annually • Best value";
    return "One-time payment";
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.pastelYellow, Colors.babyBlue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color={Colors.charcoal} />
            </TouchableOpacity>
          </View>

          <View style={styles.webMessage}>
            <Crown size={64} color={Colors.charcoal} strokeWidth={2} />
            <Text style={styles.webMessageTitle}>Premium Subscriptions</Text>
            <Text style={styles.webMessageText}>
              In-app purchases are only available on iOS and Android devices.
              Please use the mobile app to subscribe to Premium.
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.pastelYellow, Colors.babyBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color={Colors.charcoal} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.charcoal} />
            <Text style={styles.loadingText}>Loading subscriptions...</Text>
          </View>
        ) : !isConfigured ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.configScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.configContainer}>
              <Crown size={64} color={Colors.charcoal} strokeWidth={2} />
              <Text style={styles.loadingText}>
                Premium Subscriptions
              </Text>
              <Text style={styles.configText}>
                RevenueCat is not configured yet.
              </Text>
              <Text style={styles.configSubtext}>
                Quick Setup Guide:
              </Text>
              <View style={styles.configSteps}>
                <Text style={styles.configStep}>1. Go to RevenueCat Dashboard</Text>
                <Text style={styles.configStepUrl}>   https://app.revenuecat.com</Text>
                <Text style={styles.configStep}>2. Create or select your app</Text>
                <Text style={styles.configStep}>3. Get API keys from Settings {`>`} API Keys</Text>
                <Text style={styles.configStep}>4. Use platform-specific keys:</Text>
                <Text style={styles.configStepIndent}>• iOS: &quot;Apple App Store&quot; key (appl_...)</Text>
                <Text style={styles.configStepIndent}>• Android: &quot;Google Play Store&quot; key (goog_...)</Text>
                <Text style={styles.configStepWarning}>⚠️  DO NOT use Web Billing key!</Text>
                <Text style={styles.configStep}>5. Add to your .env file:</Text>
                <View style={styles.codeBlock}>
                  <Text style={styles.codeText}>EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxx</Text>
                  <Text style={styles.codeText}>EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxx</Text>
                </View>
                <Text style={styles.configStep}>6. Restart the development server</Text>
              </View>
              <Text style={styles.configNote}>
                📖 Check REVENUECAT_SETUP.md for detailed instructions
              </Text>
              <Text style={styles.configNote}>
                ✅ Check console logs for more details
              </Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : availablePackages.length === 0 ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.configScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.configContainer}>
              <Crown size={64} color={Colors.charcoal} strokeWidth={2} />
              <Text style={styles.loadingText}>
                No Subscription Plans
              </Text>
              <Text style={styles.configText}>
                Products not configured in RevenueCat.
              </Text>
              <Text style={styles.configSubtext}>
                Product Setup Guide:
              </Text>
              <View style={styles.configSteps}>
                <Text style={styles.configStep}>1. Create products in App Store Connect / Google Play</Text>
                <Text style={styles.configStepIndent}>• spark_premium_weekly</Text>
                <Text style={styles.configStepIndent}>• spark_premium_monthly</Text>
                <Text style={styles.configStepIndent}>• spark_premium_yearly</Text>
                <Text style={styles.configStep}>2. Add products to RevenueCat dashboard</Text>
                <Text style={styles.configStep}>3. Create an Entitlement called &quot;premium&quot;</Text>
                <Text style={styles.configStep}>4. Create an Offering and add packages</Text>
              </View>
              <Text style={styles.configNote}>
                📖 Check REVENUECAT_SETUP.md for detailed instructions
              </Text>
              <Text style={styles.configNote}>
                ✅ Check console logs for more details
              </Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroSection}>
              <View style={styles.crownContainer}>
                <Crown size={64} color={Colors.charcoal} strokeWidth={2} />
              </View>
              <Text style={styles.title}>Upgrade to Premium</Text>
              <Text style={styles.subtitle}>
                Unlock the full potential of your connections
              </Text>
            </View>

            <View style={styles.featuresContainer}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <View key={index} style={styles.featureCard}>
                    <View style={styles.featureIconContainer}>
                      <Icon size={28} color={Colors.charcoal} strokeWidth={2} />
                    </View>
                    <View style={styles.featureContent}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </View>
                    <View style={styles.checkContainer}>
                      <Check size={20} color={Colors.softGreen} strokeWidth={3} />
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.plansContainer}>
              {availablePackages.map((pkg) => {
                const isSelected = selectedPackage?.identifier === pkg.identifier;
                const showSavings = pkg.packageType === "ANNUAL" || pkg.packageType === "MONTHLY";

                return (
                  <TouchableOpacity
                    key={pkg.identifier}
                    style={[
                      styles.planCard,
                      isSelected && styles.planCardSelected,
                    ]}
                    onPress={() => setSelectedPackage(pkg)}
                    activeOpacity={0.7}
                  >
                    {showSavings && pkg.packageType === "ANNUAL" && (
                      <View style={styles.savingsBadge}>
                        <Text style={styles.savingsText}>Best Value</Text>
                      </View>
                    )}
                    {showSavings && pkg.packageType === "MONTHLY" && (
                      <View style={styles.savingsBadge}>
                        <Text style={styles.savingsText}>Popular</Text>
                      </View>
                    )}
                    <View style={styles.planHeader}>
                      <View>
                        <Text style={styles.planName}>
                          {getPackageDisplayName(pkg)}
                        </Text>
                        <View style={styles.planPriceRow}>
                          <Text style={styles.planPrice}>
                            {pkg.product.priceString}
                          </Text>
                          <Text style={styles.planPeriod}>
                            {getPackagePeriod(pkg)}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </View>
                    <Text style={styles.planBilling}>
                      {getPackageBilling(pkg)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.subscribeButton,
                (isProcessing || !selectedPackage) && styles.subscribeButtonDisabled,
              ]}
              onPress={handlePurchase}
              disabled={isProcessing || !selectedPackage}
            >
              <LinearGradient
                colors={[Colors.charcoal, "#2C2C2C"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.subscribeGradient}
              >
                <Text style={styles.subscribeText}>
                  {isProcessing ? "Processing..." : "Subscribe Now"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={isProcessing}
            >
              <Text style={styles.restoreText}>Restore Purchases</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              By subscribing, you agree to our Terms of Service and Privacy
              Policy. Subscription automatically renews unless cancelled at least
              24 hours before the end of the current period.
            </Text>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  configScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  configContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginTop: 16,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.6,
    marginTop: 8,
    textAlign: "center",
  },
  webMessage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  webMessageTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    marginTop: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  webMessageText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  crownContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.charcoal,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    textAlign: "center",
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.babyBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.6,
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  plansContainer: {
    marginBottom: 24,
    gap: 12,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    position: "relative" as const,
  },
  planCardSelected: {
    borderColor: Colors.charcoal,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 5,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  planPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.charcoal,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.6,
    marginLeft: 4,
  },
  planBilling: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.6,
  },
  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    opacity: 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    opacity: 1,
    borderColor: Colors.charcoal,
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.charcoal,
  },
  savingsBadge: {
    position: "absolute" as const,
    top: -8,
    right: 16,
    backgroundColor: Colors.softGreen,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  restoreText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.7,
  },
  disclaimer: {
    fontSize: 12,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.5,
    textAlign: "center",
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 20,
  },
  configText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginTop: 16,
    textAlign: "center",
  },
  configSubtext: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginTop: 24,
    textAlign: "center",
  },
  configSteps: {
    marginTop: 16,
    paddingHorizontal: 20,
    alignSelf: "stretch",
  },
  configStep: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginBottom: 10,
    lineHeight: 20,
    textAlign: "left" as const,
    alignSelf: "stretch" as const,
  },
  configStepIndent: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    marginBottom: 6,
    marginLeft: 16,
    lineHeight: 18,
    textAlign: "left" as const,
    alignSelf: "stretch" as const,
  },
  configStepUrl: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    marginBottom: 12,
    marginLeft: 16,
    opacity: 0.7,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
    textAlign: "left" as const,
    alignSelf: "stretch" as const,
  },
  configStepWarning: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#D32F2F",
    marginBottom: 12,
    marginLeft: 16,
    marginTop: 4,
    textAlign: "left" as const,
    alignSelf: "stretch" as const,
  },
  codeBlock: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    alignSelf: "stretch" as const,
    marginHorizontal: 16,
  },
  codeText: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
    lineHeight: 16,
  },
  configNote: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    marginTop: 8,
    textAlign: "center" as const,
  },
  backButton: {
    marginTop: 32,
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: Colors.charcoal,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
});
