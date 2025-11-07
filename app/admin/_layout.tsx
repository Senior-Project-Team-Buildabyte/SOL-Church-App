import BackHeaderBar from "@/components/universal/header-back-button";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

export default function AdminLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={{ flex: 1 }}>
        <Stack.Screen 
        name="inventory_requests"
        options={{ headerShown: false }} />
        <Stack screenOptions={{ 
          header: () => <BackHeaderBar/>,
          headerShown: true }} />
      </View>
    </SafeAreaProvider>
  );
}
