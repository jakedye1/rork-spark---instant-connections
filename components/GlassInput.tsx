import { BlurView } from "expo-blur";
import React from "react";
import { 
  StyleSheet, 
  TextInput, 
  TextInputProps, 
  View, 
  StyleProp, 
  ViewStyle, 
  Text
} from "react-native";
import Colors from "@/constants/colors";

interface GlassInputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
}

export function GlassInput({
  icon,
  containerStyle,
  label,
  style,
  ...props
}: GlassInputProps) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          <View style={styles.content}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <TextInput
              style={[styles.input, style]}
              placeholderTextColor={Colors.textTertiary}
              selectionColor={Colors.babyBlue}
              {...props}
            />
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    marginBottom: 8,
    marginLeft: 4,
  },
  container: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.glass,
  },
  blur: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 4, // slight vertical padding
    height: 60,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.white,
    height: "100%",
  },
});
