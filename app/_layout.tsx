import { Stack } from "expo-router";
import HeaderBar from '../components/universal/header-bar';

export default function RootLayout() {
  return (
    <>
      <HeaderBar />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
