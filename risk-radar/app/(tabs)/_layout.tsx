import { Tabs } from 'expo-router';
import { Bell, ChartNoAxesCombined, Map, Search, ShieldAlert, User } from 'lucide-react-native';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#07111d',
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 74,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: '#9aa7b8',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '800' },
      }}
    >
      <Tabs.Screen name="map" options={{ title: 'Map', tabBarIcon: ({ color }) => <Map color={color} size={24} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Search', tabBarIcon: ({ color }) => <Search color={color} size={24} /> }} />
      <Tabs.Screen name="sos" options={{ title: 'SOS', tabBarIcon: ({ color }) => <ShieldAlert color={color} size={25} /> }} />
      <Tabs.Screen name="dashboard" options={{ title: 'Stats', tabBarIcon: ({ color }) => <ChartNoAxesCombined color={color} size={24} /> }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarIcon: ({ color }) => <Bell color={color} size={24} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <User color={color} size={24} /> }} />
    </Tabs>
  );
}
