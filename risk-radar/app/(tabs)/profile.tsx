import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Bell, ChevronRight, MapPinned, Shield, Siren, UserRound } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../../src/components/ActionButton';
import { AppleHeader } from '../../src/components/AppleHeader';
import { GlassCard } from '../../src/components/GlassCard';
import { Screen } from '../../src/components/Screen';
import { colors, radii } from '../../src/theme';

type User = {
  name?: string;
  email?: string;
  role?: string;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then((value) => {
      if (value) setUser(JSON.parse(value));
    });
  }, []);

  async function logout() {
    await AsyncStorage.multiRemove(['token', 'user']);
    router.replace('/');
  }

  return (
    <Screen>
      <AppleHeader eyebrow="Private profile" title="Account" subtitle="Manage your safety identity, saved zones, and emergency actions." />

      <GlassCard style={styles.profileCard}>
        <View style={styles.avatar}>
          <UserRound color={colors.white} size={42} />
        </View>
        <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
        <Text style={styles.email}>{user?.email || 'guest@riskradar.local'}</Text>
        <View style={styles.rolePill}>
          <Shield color={colors.green} size={14} />
          <Text style={styles.roleText}>{user?.role || 'user'}</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.menuCard}>
        <MenuItem icon={<MapPinned color={colors.cyan} size={20} />} title="Saved safe locations" />
        <MenuItem icon={<Bell color={colors.orange} size={20} />} title="Alert preferences" />
        <MenuItem icon={<Siren color={colors.red} size={20} />} title="Emergency contacts" />
      </GlassCard>

      <ActionButton title="Sign out" variant="dark" onPress={logout} style={styles.logout} />
    </Screen>
  );
}

function MenuItem({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <Pressable style={styles.menuItem}>
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={styles.menuTitle}>{title}</Text>
      <ChevronRight color={colors.soft} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(10,132,255,0.24)',
    borderWidth: 1,
    borderColor: 'rgba(100,210,255,0.36)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  email: {
    color: colors.muted,
    marginTop: 6,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    marginTop: 14,
    backgroundColor: 'rgba(50,215,75,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(50,215,75,0.3)',
  },
  roleText: {
    color: colors.green,
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  menuCard: {
    marginTop: 16,
  },
  menuItem: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    color: colors.text,
    flex: 1,
    fontWeight: '800',
  },
  logout: {
    marginTop: 18,
  },
});
