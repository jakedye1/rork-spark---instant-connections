import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>
          This spark doesn&apos;t exist. Let&apos;s get you back on track.
        </Text>
        <Link href="/(tabs)/home" style={styles.link}>
          <Text style={styles.linkText}>Go to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.babyBlue,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.charcoal,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: Colors.charcoal,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 32,
  },
  link: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    backgroundColor: Colors.pastelYellow,
    borderRadius: 24,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.charcoal,
  },
});
