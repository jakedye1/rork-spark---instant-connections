import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { CameraView } from "expo-camera";
import type { VideoChatConfig } from "@/contexts/VideoConfigContext";
import Colors from "@/constants/colors";

type VideoCallProps = {
  config: VideoChatConfig;
  roomId: string;
  userId?: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
  localVideoStyle?: object;
  remoteVideoStyle?: object;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: string) => void;
};

export default function VideoCall({
  config,
  roomId,
  userId,
  isMuted = false,
  isVideoOff = false,
  localVideoStyle,
  remoteVideoStyle,
  onConnectionChange,
  onError,
}: VideoCallProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`VideoCall initialized with provider: ${config.provider}, roomId: ${roomId}`);
    
    if (!config.provider) {
      const errorMsg = "No video provider configured";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    initializeVideoCall();

    return () => {
      cleanupVideoCall();
    };
  }, [config.provider, roomId]);

  const initializeVideoCall = async () => {
    try {
      console.log(`Initializing ${config.provider} video call...`);
      
      switch (config.provider) {
        case "webrtc":
          await initializeWebRTC();
          break;
        case "twilio":
          await initializeTwilio();
          break;
        case "agora":
          await initializeAgora();
          break;
        case "daily":
          await initializeDaily();
          break;
        case "mock":
        default:
          await initializeMock();
          break;
      }
      
      setIsConnected(true);
      onConnectionChange?.(true);
    } catch (err) {
      console.error(`Failed to initialize ${config.provider}:`, err);
      const errorMsg = err instanceof Error ? err.message : "Failed to initialize video call";
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  const cleanupVideoCall = () => {
    console.log(`Cleaning up ${config.provider} video call...`);
    setIsConnected(false);
    onConnectionChange?.(false);
  };

  const initializeWebRTC = async () => {
    console.log("WebRTC initialization placeholder");
  };

  const initializeTwilio = async () => {
    if (!config.apiKey) {
      throw new Error("Twilio API key not configured");
    }
    console.log("Twilio initialization placeholder");
  };

  const initializeAgora = async () => {
    if (!config.apiKey) {
      throw new Error("Agora API key not configured");
    }
    console.log("Agora initialization placeholder");
  };

  const initializeDaily = async () => {
    if (!config.apiKey) {
      throw new Error("Daily API key not configured");
    }
    console.log("Daily initialization placeholder");
  };

  const initializeMock = async () => {
    console.log("Mock video call - using local camera only");
  };

  if (error) {
    return (
      <View style={[styles.errorContainer, remoteVideoStyle]}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>Video Call Error</Text>
        <Text style={styles.errorDetails}>{error}</Text>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.remoteVideo, remoteVideoStyle]}>
        <View style={styles.placeholderVideo}>
          <Text style={styles.placeholderEmoji}>👤</Text>
          <Text style={styles.placeholderText}>
            {isConnected ? "Connected" : "Connecting..."}
          </Text>
        </View>
      </View>

      <View style={[styles.localVideo, localVideoStyle]}>
        {isVideoOff ? (
          <View style={styles.videoOffContainer}>
            <Text style={styles.videoOffEmoji}>📹</Text>
            <Text style={styles.videoOffText}>Camera Off</Text>
          </View>
        ) : Platform.OS !== 'web' ? (
          <CameraView 
            style={styles.cameraView} 
            facing="front"
          />
        ) : (
          <View style={styles.placeholderVideoSmall}>
            <Text style={styles.placeholderEmojiSmall}>📹</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  remoteVideo: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  placeholderVideo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 80,
    marginBottom: 16,
    opacity: 0.7,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.white,
    opacity: 0.8,
  },
  localVideo: {
    width: "100%",
    height: "100%",
  },
  cameraView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  placeholderVideoSmall: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmojiSmall: {
    fontSize: 48,
  },
  videoOffContainer: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  videoOffEmoji: {
    fontSize: 40,
    opacity: 0.6,
  },
  videoOffText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.white,
    opacity: 0.6,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#1A0000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#FF6B6B",
    marginBottom: 12,
    textAlign: "center",
  },
  errorDetails: {
    fontSize: 14,
    fontWeight: "500" as const,
    color: Colors.white,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
});
