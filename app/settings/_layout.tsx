import { Stack } from "expo-router";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import BackHeaderBar from "@/components/universal/header-back-button";

export default function SettingsLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Stack screenOptions={{ 
          header: () => <BackHeaderBar/>,
          headerShown: true }} />
      </View>
    </SafeAreaProvider>
  );
}