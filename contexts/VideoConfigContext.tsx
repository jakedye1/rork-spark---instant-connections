import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect, useMemo } from "react";
import { Platform } from "react-native";

export type VideoProvider = "webrtc" | "mock" | "twilio" | "agora" | "daily";

export type VideoChatConfig = {
  provider: VideoProvider;
  apiKey?: string;
  roomId?: string;
};

export type VideoConfigContextType = {
  chat1: VideoChatConfig;
  chat2: VideoChatConfig;
  chat3: VideoChatConfig;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const DEFAULT_CONFIGS: {
  chat1: VideoChatConfig;
  chat2: VideoChatConfig;
  chat3: VideoChatConfig;
} = {
  chat1: {
    provider: "mock",
    apiKey: undefined,
  },
  chat2: {
    provider: "mock",
    apiKey: undefined,
  },
  chat3: {
    provider: "mock",
    apiKey: undefined,
  },
};

export const [VideoConfigProvider, useVideoConfig] = createContextHook<VideoConfigContextType>(() => {
  const [config, setConfig] = useState(DEFAULT_CONFIGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      console.log("Fetching video config...");
      setIsLoading(true);
      setError(null);

      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
      
      if (!backendUrl) {
        console.log("No backend URL configured, using default mock config");
        setConfig(DEFAULT_CONFIGS);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/video-config`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch video config: ${response.status}`);
        setConfig(DEFAULT_CONFIGS);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Video config fetched successfully:", data);
      
      setConfig({
        chat1: data.chat1 || DEFAULT_CONFIGS.chat1,
        chat2: data.chat2 || DEFAULT_CONFIGS.chat2,
        chat3: data.chat3 || DEFAULT_CONFIGS.chat3,
      });
    } catch (err) {
      console.error("Error fetching video config:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch video config");
      setConfig(DEFAULT_CONFIGS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return useMemo(
    () => ({
      chat1: config.chat1,
      chat2: config.chat2,
      chat3: config.chat3,
      isLoading,
      error,
      refetch: fetchConfig,
    }),
    [config, isLoading, error]
  );
});
