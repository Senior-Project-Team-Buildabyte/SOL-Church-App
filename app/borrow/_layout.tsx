import { Stack } from "expo-router";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import BackHeaderBar from "@/components/universal/header-back-button";
import { View } from "react-native";

export default function BorrowLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <View style={{ flex: 1 }}>
          {/* Main borrow tab */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Explicitly add qr-scanner page */}
          <Stack.Screen name="qr-scanner" options={{ headerShown: false }} />
          <Stack screenOptions={{ 
            header: () => <BackHeaderBar/>,
            headerShown: true }} />
      </View>
      
    </SafeAreaProvider>
  );
}
