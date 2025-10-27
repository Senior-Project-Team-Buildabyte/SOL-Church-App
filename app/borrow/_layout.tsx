import { Stack } from "expo-router";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import AuthHeaderBar from "@/components/universal/auth-header";

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Stack
        screenOptions={{
          header: () => <AuthHeaderBar />,
          headerShown: true,
        }}
      >
        {/* Main borrow tab */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Explicitly add qr-scanner page */}
        <Stack.Screen name="qr-scanner" options={{ headerShown: true }} />
      </Stack>
    </SafeAreaProvider>
  );
}

