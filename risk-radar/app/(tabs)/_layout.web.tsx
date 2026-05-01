import { Tabs } from 'expo-router';
import { Bell, BarChart3, Map, PlusCircle, User } from 'lucide-react-native';
import { colors } from '../../src/theme';

export default function WebTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: colors.soft,
        tabBarStyle: {
          position: 'absolute',
          top: 18,
          left: '50%',
          transform: [{ translateX: -420 }],
          width: 840,
          height: 66,
          borderRadius: 999,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
          backgroundColor: 'rgba(9,14,28,0.86)',
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: 10,
          shadowColor: '#000',
          shadowOpacity: 0.24,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 12 },
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: 'Risk Map',
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
