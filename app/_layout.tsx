import { Slot, Stack } from "expo-router";
import HeaderBar from '../components/universal/header-bar';
import { initialWindowMetrics, SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView edges={['top', 'left', 'right']} style={{ backgroundColor: 'white' }}>
        <HeaderBar />
      </SafeAreaView>

      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaProvider>
  );
}