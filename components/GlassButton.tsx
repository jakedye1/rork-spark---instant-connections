import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TouchableOpacityProps, 
  ViewStyle, 
  TextStyle,
  ActivityIndicator,
  StyleProp
} from "react-native";
import Colors from "@/constants/colors";

interface GlassButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "glass" | "outline";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function GlassButton({
  title,
  variant = "primary",
  size = "medium",
  icon,
  loading = false,
  style,
  textStyle,
  disabled,
  ...props
}: GlassButtonProps) {
  
  const getGradientColors = () => {
    switch (variant) {
      case "primary": return Colors.gradientPrimary;
      case "secondary": return Colors.gradientGlow;
      case "glass": return [Colors.glassLight, Colors.glass];
      case "outline": return ["transparent", "transparent"];
      default: return Colors.gradientPrimary;
    }
  };

  const getHeight = () => {
    switch (size) {
      case "small": return 40;
      case "large": return 64;
      default: return 56;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "small": return 14;
      case "large": return 20;
      default: return 18;
    }
  };

  const content = (
    <LinearGradient
      colors={getGradientColors() as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.gradient,
        { height: getHeight() },
        variant === "outline" && styles.outline,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? Colors.babyBlue : Colors.charcoal} />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text
            style={[
              styles.text,
              { 
                fontSize: getFontSize(),
                color: variant === "glass" ? Colors.white : (variant === "outline" ? Colors.babyBlue : Colors.charcoal)
              },
              icon && { marginLeft: 8 },
              textStyle
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </LinearGradient>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.container,
        {
          borderRadius: size === "small" ? 20 : (size === "large" ? 32 : 28),
          shadowColor: variant === "primary" ? Colors.shadowNeon : Colors.shadow,
        },
        disabled && styles.disabled,
        style
      ]}
      {...props}
    >
      {variant === "glass" || variant === "outline" ? (
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          {content}
        </BlurView>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  blur: {
    flex: 1,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.babyBlue,
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.6,
  },
});
