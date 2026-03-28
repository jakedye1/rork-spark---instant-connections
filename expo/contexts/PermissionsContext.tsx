import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

type PermissionStatus = "undetermined" | "granted" | "denied";

type PermissionsContextType = {
  cameraPermission: PermissionStatus;
  microphonePermission: PermissionStatus;
  hasRequestedPermissions: boolean;
  requestCameraPermission: () => Promise<boolean>;
  requestMicrophonePermission: () => Promise<boolean>;
  requestAllPermissions: () => Promise<{ camera: boolean; microphone: boolean }>;
  markPermissionsRequested: () => Promise<void>;
  checkPermissions: () => Promise<void>;
};

const PERMISSIONS_STORAGE_KEY = "@spark_permissions_requested";

export const [PermissionsProvider, usePermissions] = createContextHook<PermissionsContextType>(() => {
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus>("undetermined");
  const [microphonePermission, setMicrophonePermission] = useState<PermissionStatus>("undetermined");
  const [hasRequestedPermissions, setHasRequestedPermissions] = useState(false);

  const loadPermissionState = useCallback(async () => {
    try {
      const requested = await AsyncStorage.getItem(PERMISSIONS_STORAGE_KEY);
      if (requested === "true") {
        setHasRequestedPermissions(true);
      }
    } catch (error) {
      console.error("Failed to load permission state:", error);
    }
  }, []);

  const checkPermissions = useCallback(async () => {
    try {
      if (Platform.OS === "web") {
        setCameraPermission("granted");
        setMicrophonePermission("granted");
        return;
      }

      const [cameraStatus, micStatus] = await Promise.all([
        Camera.getCameraPermissionsAsync(),
        Camera.getMicrophonePermissionsAsync(),
      ]);

      setCameraPermission(
        cameraStatus.granted ? "granted" : cameraStatus.canAskAgain ? "undetermined" : "denied"
      );
      setMicrophonePermission(
        micStatus.granted ? "granted" : micStatus.canAskAgain ? "undetermined" : "denied"
      );
    } catch (error) {
      console.error("Failed to check permissions:", error);
    }
  }, []);

  useEffect(() => {
    loadPermissionState();
    checkPermissions();
  }, [loadPermissionState, checkPermissions]);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      if (Platform.OS === "web") {
        return true;
      }

      const { status } = await Camera.requestCameraPermissionsAsync();
      const granted = status === "granted";
      
      setCameraPermission(granted ? "granted" : "denied");
      return granted;
    } catch (error) {
      console.error("Failed to request camera permission:", error);
      return false;
    }
  }, []);

  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      if (Platform.OS === "web") {
        return true;
      }

      const { status } = await Camera.requestMicrophonePermissionsAsync();
      const granted = status === "granted";
      
      setMicrophonePermission(granted ? "granted" : "denied");
      return granted;
    } catch (error) {
      console.error("Failed to request microphone permission:", error);
      return false;
    }
  }, []);

  const requestAllPermissions = useCallback(async (): Promise<{ camera: boolean; microphone: boolean }> => {
    const [camera, microphone] = await Promise.all([
      requestCameraPermission(),
      requestMicrophonePermission(),
    ]);

    return { camera, microphone };
  }, [requestCameraPermission, requestMicrophonePermission]);

  const markPermissionsRequested = useCallback(async () => {
    try {
      await AsyncStorage.setItem(PERMISSIONS_STORAGE_KEY, "true");
      setHasRequestedPermissions(true);
    } catch (error) {
      console.error("Failed to mark permissions as requested:", error);
    }
  }, []);

  return useMemo(
    () => ({
      cameraPermission,
      microphonePermission,
      hasRequestedPermissions,
      requestCameraPermission,
      requestMicrophonePermission,
      requestAllPermissions,
      markPermissionsRequested,
      checkPermissions,
    }),
    [
      cameraPermission,
      microphonePermission,
      hasRequestedPermissions,
      requestCameraPermission,
      requestMicrophonePermission,
      requestAllPermissions,
      markPermissionsRequested,
      checkPermissions,
    ]
  );
});
