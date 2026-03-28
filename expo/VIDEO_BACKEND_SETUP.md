# Video Chat Backend Integration Guide

This document explains how the Spark app's video chat feature is designed to work with swappable backend video providers.

## Architecture Overview

The video chat system is designed to be **backend-agnostic** and support multiple video providers without hardcoding any SDKs or API keys in the frontend.

### Components

1. **VideoConfigContext** (`contexts/VideoConfigContext.tsx`)
   - Fetches video configuration from backend
   - Manages 3 independent video chat configurations (chat1, chat2, chat3)
   - Provides fallback to mock provider if backend is unavailable

2. **VideoCall Component** (`components/VideoCall.tsx`)
   - Generic video call component that switches between providers
   - Supports: WebRTC, Twilio, Agora, Daily, Mock
   - Handles errors and connection states

3. **Video Chat Screens**
   - `video-chat.tsx` - 1:1 dating video calls (uses config.chat1)
   - `group-video-chat.tsx` - Group video calls (uses config.chat2)
   - `friends-video-chat.tsx` - Friends video calls (uses config.chat3)

## How It Works

### 1. Frontend Requests Configuration

On app start, the `VideoConfigContext` makes a GET request to:
```
GET ${EXPO_PUBLIC_BACKEND_URL}/video-config
```

Expected response format:
```typescript
{
  chat1: {
    provider: "webrtc" | "twilio" | "agora" | "daily" | "mock",
    apiKey?: string,
    roomId?: string
  },
  chat2: { ... },
  chat3: { ... }
}
```

### 2. Video Screens Use Configuration

Each video chat screen uses the appropriate config:
```typescript
const { chat1 } = useVideoConfig();

<VideoCall 
  config={chat1}
  roomId={generateRoomId()}
  userId={user.id}
/>
```

### 3. VideoCall Component Initializes Provider

The `VideoCall` component switches on `config.provider` and initializes the appropriate SDK.

## Setting Up Backend

### Prerequisites
- Backend must be enabled in Rork
- Backend should support video configuration endpoints

### Step 1: Create Backend Function

Create a backend function to serve video configuration:

```typescript
// backend/functions/video-config.ts
export async function GET(request: Request) {
  // Get configuration from environment variables or database
  const config = {
    chat1: {
      provider: process.env.SPARK_VIDEO_CHAT1_PROVIDER || "mock",
      apiKey: process.env.SPARK_VIDEO_CHAT1_API_KEY,
    },
    chat2: {
      provider: process.env.SPARK_VIDEO_CHAT2_PROVIDER || "mock",
      apiKey: process.env.SPARK_VIDEO_CHAT2_API_KEY,
    },
    chat3: {
      provider: process.env.SPARK_VIDEO_CHAT3_PROVIDER || "mock",
      apiKey: process.env.SPARK_VIDEO_CHAT3_API_KEY,
    },
  };

  return Response.json(config);
}
```

### Step 2: Set Environment Variables

In your backend environment, set:
```bash
SPARK_VIDEO_CHAT1_PROVIDER=webrtc
SPARK_VIDEO_CHAT1_API_KEY=your_api_key_here

SPARK_VIDEO_CHAT2_PROVIDER=webrtc
SPARK_VIDEO_CHAT2_API_KEY=your_api_key_here

SPARK_VIDEO_CHAT3_PROVIDER=webrtc
SPARK_VIDEO_CHAT3_API_KEY=your_api_key_here
```

### Step 3: Set Frontend Backend URL

In the frontend `.env` file:
```bash
EXPO_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

## Supported Providers

### Mock (Default)
- No SDK required
- Shows local camera using expo-camera
- Good for testing and development

### WebRTC
- Custom WebRTC implementation
- Requires WebRTC server/signaling
- Most flexible option

### Twilio
- Requires Twilio Video SDK
- Needs API key and room tokens

### Agora
- Requires Agora RTC SDK
- Needs App ID and tokens

### Daily
- Requires Daily.co SDK
- Needs API key

## Adding a New Provider

To add support for a new video provider:

1. Update the `VideoProvider` type in `VideoConfigContext.tsx`:
```typescript
export type VideoProvider = "webrtc" | "mock" | "twilio" | "agora" | "daily" | "your_provider";
```

2. Add initialization logic in `VideoCall.tsx`:
```typescript
const initializeYourProvider = async () => {
  if (!config.apiKey) {
    throw new Error("Your Provider API key not configured");
  }
  // Initialize your provider SDK
};

// In initializeVideoCall():
case "your_provider":
  await initializeYourProvider();
  break;
```

3. Install any required SDKs in package.json

## Current State

- ✅ Frontend architecture is ready for backend integration
- ✅ Configuration context fetches from backend
- ✅ Generic VideoCall component supports multiple providers
- ✅ Graceful fallback to mock provider if backend unavailable
- ⏳ Backend functions need to be created (when backend is enabled)
- ⏳ Video provider SDKs need to be installed and initialized

## Next Steps

1. **Enable backend** in Rork (click Integrations → Backend)
2. **Create `/video-config` endpoint** in backend
3. **Set environment variables** for your chosen providers
4. **Install provider SDKs** (e.g., `npm install @twilio/video`)
5. **Implement provider-specific logic** in `VideoCall.tsx`
6. **Test** each video chat type with different providers

## Notes

- Each video chat type (dating, groups, friends) can use a different provider
- You can change providers by updating backend env vars - no app redeployment needed
- The mock provider is always available as a fallback
- API keys are never exposed in the mobile app code
