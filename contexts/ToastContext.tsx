import createContextHook from "@nkzw/create-context-hook";
import React, { useState, useCallback, useMemo, ReactNode } from "react";
import { Toast } from "@/components/Toast";

type ToastType = "success" | "error" | "info" | "warning";

type ToastContextType = {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  ToastComponent: ReactNode;
};

type ToastState = {
  visible: boolean;
  type: ToastType;
  message: string;
  duration: number;
};

export const [ToastProvider, useToast] = createContextHook<ToastContextType>(() => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: "info",
    message: "",
    duration: 3000,
  });

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    setToast({ visible: true, type, message, duration });
  }, []);

  const showSuccess = useCallback((message: string, duration = 3000) => {
    showToast("success", message, duration);
  }, [showToast]);

  const showError = useCallback((message: string, duration = 3000) => {
    showToast("error", message, duration);
  }, [showToast]);

  const showInfo = useCallback((message: string, duration = 3000) => {
    showToast("info", message, duration);
  }, [showToast]);

  const showWarning = useCallback((message: string, duration = 3000) => {
    showToast("warning", message, duration);
  }, [showToast]);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const ToastComponent = useMemo(
    () => <Toast {...toast} onHide={hideToast} />,
    [toast, hideToast]
  );

  return useMemo(
    () => ({ showToast, showSuccess, showError, showInfo, showWarning, ToastComponent }),
    [showToast, showSuccess, showError, showInfo, showWarning, ToastComponent]
  );
});
