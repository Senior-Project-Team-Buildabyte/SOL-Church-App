import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import TabScreenOptions from '../sections/navigation-bar/navbar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
      }}
    >
      <Tabs.Screen
      name="index"
      options={{
        title: "SOL",
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <Ionicons color={focused ? 'black' : 'gray'} name='water-outline' size={24} />
),
      }}
      />
    </Tabs>
  );
}
