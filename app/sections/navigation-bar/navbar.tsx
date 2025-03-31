import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';



export default function TabScreenOptions({ screen_name, tab_name, icon_name }: TabOptionsProps) {
  return (
    <Tabs.Screen
      name={screen_name}
      options={{
        title: tab_name,
        tabBarIcon: ({ focused }: { focused: boolean }) => (
          <Ionicons color={focused ? 'black' : 'gray'} name={icon_name} size={24} />
        ),
      }}
    />
  );
}

type IoniconsName = ComponentProps<typeof Ionicons>['name']

interface TabOptionsProps {
    screen_name: string;
    tab_name: string;
    icon_name: IoniconsName;
  }