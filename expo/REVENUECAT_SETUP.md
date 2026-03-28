# RevenueCat Setup Guide for Spark App

## ⚠️ Critical Information

**DO NOT** use the "Web Billing" API key! You need the platform-specific keys:
- **iOS**: Apple App Store API Key
- **Android**: Google Play Store API Key

## 📋 Complete Setup Steps

### 1. Create a RevenueCat Account

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Sign up or log in
3. Create a new project

### 2. Configure Your App in RevenueCat

1. In the RevenueCat dashboard, click "+ New App"
2. Enter your app details:
   - **App Name**: Spark - Instant Connections
   - **Bundle ID (iOS)**: `app.rork.spark-instant-connections`
   - **Package Name (Android)**: `app.rork.spark-instant-connections`

### 3. Connect App Store Connect (iOS)

1. Go to your app in RevenueCat
2. Navigate to "App Settings" > "Apple App Store"
3. Connect your App Store Connect account:
   - You'll need your App Store Connect credentials
   - Or create a shared secret from App Store Connect

### 4. Connect Google Play Console (Android)

1. Go to your app in RevenueCat
2. Navigate to "App Settings" > "Google Play Store"
3. Follow the instructions to connect your Google Play Console account
4. Upload the service account JSON key

### 5. Create Products in App Store Connect / Google Play Console

#### For iOS (App Store Connect):

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Go to "Features" > "In-App Purchases"
4. Create subscription products:
   - **Weekly Subscription**
     - Product ID: `spark_premium_weekly`
     - Type: Auto-Renewable Subscription
   - **Monthly Subscription**
     - Product ID: `spark_premium_monthly`
     - Type: Auto-Renewable Subscription
   - **Yearly Subscription**
     - Product ID: `spark_premium_yearly`
     - Type: Auto-Renewable Subscription

#### For Android (Google Play Console):

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to "Monetization" > "Products" > "Subscriptions"
4. Create the same subscription products

### 6. Add Products to RevenueCat

1. In RevenueCat dashboard, go to your app
2. Navigate to "Products"
3. Click "+ New" to add products
4. Enter the Product IDs you created:
   - `spark_premium_weekly`
   - `spark_premium_monthly`
   - `spark_premium_yearly`

### 7. Create Entitlements

1. In RevenueCat dashboard, go to "Entitlements"
2. Click "+ New"
3. Create an entitlement named: `premium`
4. Attach all your products to this entitlement

### 8. Create an Offering

1. In RevenueCat dashboard, go to "Offerings"
2. Click "+ New"
3. Create a "Current" offering
4. Add packages:
   - Add weekly package
   - Add monthly package
   - Add yearly package

### 9. Get Your API Keys

1. In RevenueCat dashboard, go to your app
2. Navigate to "API Keys" (in app settings)
3. You'll see three keys:
   - **Apple App Store** - This is your iOS key ✅
   - **Google Play Store** - This is your Android key ✅
   - **Stripe** (Web Billing) - DO NOT use this ❌

4. Copy the correct keys

### 10. Add Environment Variables

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_xxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_xxxxxxxxxxxxxxxxxx
```

**Important**: 
- iOS key starts with `appl_`
- Android key starts with `goog_`
- Do NOT use the key that starts with `sk_` (that's the Web Billing key)

### 11. Configure StoreKit Configuration File (iOS Testing)

For testing on iOS without uploading to App Store Connect:

1. In Xcode, create a StoreKit Configuration file
2. Add your products to the configuration file
3. Configure the testing environment

Or use the `spark.storekit` file provided in this project.

### 12. Test Your Implementation

1. **Run the app**: `bun expo start`
2. **On iOS**: Scan QR code with your iPhone
3. **Check console logs**: Look for initialization messages
4. **Navigate to Premium screen**: Should show your packages
5. **Test purchase**: Use sandbox testing account

## 🔍 Troubleshooting

### Error: "Invalid API key"

**Cause**: You're using the Web Billing key instead of platform-specific keys.

**Solution**: 
- Make sure iOS key starts with `appl_`
- Make sure Android key starts with `goog_`
- Never use keys starting with `sk_`

### Error: "No offerings found"

**Cause**: Products not properly configured in RevenueCat.

**Solution**:
1. Verify products exist in App Store Connect / Google Play Console
2. Verify products are added to RevenueCat
3. Verify entitlement is created and products are attached
4. Verify offering is created and packages are added

### Error: "There is no singleton instance"

**Cause**: RevenueCat not properly initialized.

**Solution**: This is now handled in the code, but make sure:
1. API keys are correctly set in `.env`
2. You've restarted the development server after adding `.env`

### Purchases Not Working in Testing

**For iOS**:
- Create a sandbox testing account in App Store Connect
- Sign out of your regular App Store account on device
- App will automatically use sandbox account for testing

**For Android**:
- Add test users in Google Play Console
- Use a test card or Google Play Test Card

## 📱 Testing Subscriptions

### iOS Sandbox Testing

1. Go to App Store Connect
2. Navigate to "Users and Access" > "Sandbox"
3. Create a sandbox tester account
4. On your iOS device:
   - Go to Settings > App Store
   - Scroll down to "Sandbox Account"
   - Sign in with your sandbox tester
5. Test purchases in your app

### Android Testing

1. Go to Google Play Console
2. Navigate to "Setup" > "License Testing"
3. Add test user emails
4. Use these accounts to test purchases

## 🎯 Expected Console Output

When properly configured, you should see:

```
Initializing RevenueCat...
Platform: ios
API Key configured: Yes (length: 32)
Configuring Purchases with API key...
✅ Purchases configured successfully
Logging in user: user_abc123
Fetching customer info...
Customer info retrieved: user_abc123
Fetching offerings...
✅ RevenueCat initialized successfully
📦 Available offerings: 3
```

## 📚 Additional Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [iOS Subscription Guide](https://developer.apple.com/app-store/subscriptions/)
- [Android Subscription Guide](https://developer.android.com/google/play/billing/subscriptions)
- [Testing In-App Purchases](https://docs.revenuecat.com/docs/sandbox)

## 🚀 Next Steps

After setup is complete:

1. Test purchases with sandbox accounts
2. Verify entitlements are working correctly
3. Test subscription renewals
4. Test restore purchases functionality
5. Prepare for production release

## ⚠️ Before Going Live

1. **Remove test products**: Make sure you're using production products
2. **Test thoroughly**: Test all subscription tiers
3. **Verify billing**: Ensure correct prices are displayed
4. **Legal compliance**: Ensure Terms of Service and Privacy Policy are in place
5. **App Review**: Follow App Store and Play Store guidelines
