import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'SOL',
          tabBarIcon: ({ color }) => <SimpleLineIcons size={16} name="drop" color={color} />,
        }}
      />
      <Tabs.Screen
        name="connect"
        
        options={{
          title: 'Connect',
          tabBarIcon: ({ color }) => <SimpleLineIcons size={16} name="arrow-up-circle" color={color} />,
        }}
      />

      <Tabs.Screen
        name="events"
        
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <FontAwesome size={16} name="calendar-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="give"
        
        options={{
          title: 'Give',
          
          tabBarIcon: ({ color }) => <FontAwesome6 size={16} name="hand-holding-heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="media"
        
        options={{
          title: 'Media',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={16} name="television-play" color={color} />,
        }}
      />
      <Tabs.Screen
        name="borrow"
        
        options={{
          title: 'Borrow',
          tabBarIcon: ({ color }) => <SimpleLineIcons size={16} name="drawer" color={color} />,
        }}
      />
    </Tabs>
  );
}
