import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
      tabBarItemStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -1,
      },
      tabBarLabelStyle: {
        fontsize: 12,
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
	  headerShown: false,
          title: 'SOL',
          tabBarIcon: ({ color }) => <SimpleLineIcons size={16} name="drop" color={color} />,
        }}
      />
      <Tabs.Screen
        name="connect"
        
        options={{
	  headerShown: false,
          title: 'Connect',
          tabBarIcon: ({ color }) => <SimpleLineIcons size={16} name="arrow-up-circle" color={color} />,
        }}
      />

      <Tabs.Screen
        name="events"
        
        options={{
	  headerShown: false,
          title: 'Events',
          tabBarIcon: ({ color }) => <FontAwesome size={16} name="calendar-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="give"
        
        options={{
          title: 'Give',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome6 size={16} name="hand-holding-heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="media"
        
        options={{
          title: 'Media',
	  headerShown: false,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={16} name="television-play" color={color} />,
        }}
      />
      <Tabs.Screen
        name="borrow"
        
        options={{
          title: 'Borrow',
	  headerShown: false,
          tabBarIcon: ({ color }) => <SimpleLineIcons size={16} name="drawer" color={color} />,
        }}
      />
    </Tabs>
  );
}
