import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export const unstable_settings = {
  initialRouteName: "index",
  tabs: {
    routes: ["SOL", "Connect", "Events", "Borrow", "Media"]
  }
};

export default function TabLayout() {
  return (
    <Tabs>
      
      <Tabs.Screen
        name='index'
        options={{
          title: 'SOL',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name='events'
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar" color={color} />,
        }}
      />
    </Tabs>
  );
}

