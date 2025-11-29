import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import { useEffect } from "react";
import Colors from "@/constants/colors";

export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log('Index screen - user:', user ? 'logged in' : 'not logged in', 'isLoading:', isLoading);
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <View style={{ width: 80, height: 80, marginBottom: 20, borderRadius: 40, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 40 }}>✨</Text>
        </View>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 20, fontSize: 32, fontWeight: "700", color: Colors.text, letterSpacing: -1 }}>Spark</Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/auth" />;
}
