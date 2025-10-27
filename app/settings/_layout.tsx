import { Stack } from "expo-router";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import AuthHeaderBar from "@/components/universal/auth-header";

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Stack screenOptions={{ 
          header: () => <AuthHeaderBar/>,
          headerShown: true }} />
      </View>
    </SafeAreaProvider>
  );
}