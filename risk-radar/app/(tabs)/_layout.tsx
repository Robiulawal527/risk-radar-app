import { Tabs } from 'expo-router';
import { Bell, BarChart3, Map, PlusCircle, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.soft,
        tabBarStyle: {
          position: 'absolute',
          height: Platform.OS === 'ios' ? 88 : 74,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          marginHorizontal: 14,
          marginBottom: Platform.OS === 'ios' ? 8 : 12,
          borderRadius: 28,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.stroke,
          backgroundColor: 'rgba(12,16,28,0.92)',
          shadowColor: '#000',
          shadowOpacity: 0.28,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 10 },
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '800',
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="report-crime"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
