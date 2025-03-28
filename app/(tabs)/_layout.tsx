import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "SOL Church" }} />
      <Tabs.Screen name="events-page" options={{ headerShown: false }} />
    </Tabs>
  );
}
