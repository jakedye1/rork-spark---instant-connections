import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import Colors from "@/constants/colors";

export default function Index() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log('Index screen - user:', user ? 'logged in' : 'not logged in', 'isLoading:', isLoading);
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.babyBlue }}>
        <ActivityIndicator size="large" color={Colors.pastelYellow} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/auth" />;
}
