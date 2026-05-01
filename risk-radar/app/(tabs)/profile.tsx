import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Award, HeartHandshake, Shield, Siren, TriangleAlert, UserRound } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { api, getErrorMessage } from '../../src/api';
import { ActionButton } from '../../src/components/ActionButton';
import { AppleHeader } from '../../src/components/AppleHeader';
import { GlassCard } from '../../src/components/GlassCard';
import { Screen } from '../../src/components/Screen';
import { colors, radii } from '../../src/theme';

type User = {
  name?: string;
  email?: string;
  role?: string;
  id?: number;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [ranking, setRanking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contribution, setContribution] = useState('');
  const [contributionPoints, setContributionPoints] = useState('10');

  useEffect(() => {
    async function load() {
      try {
        const value = await AsyncStorage.getItem('user');
        if (!value) return;
        const parsed = JSON.parse(value);
        setUser(parsed);
        const [profileRes, rankingRes] = await Promise.all([
          api.get(`/profiles/me/${parsed.id}`),
          api.get('/profiles/rankings/all'),
        ]);
        setProfile(profileRes.data);
        setRanking(rankingRes.data);
      } catch (error) {
        Alert.alert('Profile failed', getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function logout() {
    await AsyncStorage.multiRemove(['token', 'user']);
    router.replace('/');
  }

  async function addContribution() {
    if (!user?.id) return;
    if (!contribution.trim()) {
      Alert.alert('Title required', 'Write what good work you did for the community.');
      return;
    }
    try {
      setSaving(true);
      await api.post('/profiles/philanthropy', {
        user_id: user.id,
        title: contribution.trim(),
        points: Number(contributionPoints || 10),
      });
      setContribution('');
      const [profileRes, rankingRes] = await Promise.all([
        api.get(`/profiles/me/${user.id}`),
        api.get('/profiles/rankings/all'),
      ]);
      setProfile(profileRes.data);
      setRanking(rankingRes.data);
      Alert.alert('Saved', 'Your philanthropy score was updated.');
    } catch (error) {
      Alert.alert('Could not save', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Screen scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.cyan} size="large" />
          <Text style={styles.loadingText}>Loading your profile intelligence...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <AppleHeader
        eyebrow="Public persona"
        title="Profile Reputation"
        subtitle="People can evaluate trust, collaboration, and social compatibility with your score and personality profile."
      />

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
        <View style={styles.personalityPill}>
          <Award color={colors.cyan} size={14} />
          <Text style={styles.personalityText}>{profile?.scores?.personalityType || 'Unknown'}</Text>
        </View>
      </GlassCard>

      <View style={styles.scoreRow}>
        <ScoreCard label="Profile Score" value={profile?.scores?.profileScore ?? 0} color={colors.cyan} />
        <ScoreCard label="Reputation" value={profile?.scores?.reputationScore ?? 0} color={colors.green} />
      </View>
      <View style={styles.scoreRow}>
        <ScoreCard label="Crime Score" value={profile?.scores?.crimeScore ?? 0} color={colors.red} />
        <ScoreCard label="Philanthropy" value={profile?.scores?.philanthropyScore ?? 0} color={colors.purple} />
      </View>

      <GlassCard style={styles.menuCard}>
        <Text style={styles.sectionTitle}>Add Philanthropy Work</Text>
        <Text style={styles.sectionSub}>Log social work, donations, mentoring, volunteer actions, or community service.</Text>
        <TextInput
          value={contribution}
          onChangeText={setContribution}
          placeholder="e.g. Donated blood and organized safety awareness camp"
          placeholderTextColor={colors.soft}
          style={styles.input}
        />
        <TextInput
          value={contributionPoints}
          onChangeText={setContributionPoints}
          keyboardType="numeric"
          placeholder="Points (1-100)"
          placeholderTextColor={colors.soft}
          style={styles.input}
        />
        <ActionButton
          title="Add contribution"
          loading={saving}
          variant="green"
          icon={<HeartHandshake color="#fff" size={18} />}
          onPress={addContribution}
        />
      </GlassCard>

      <GlassCard style={styles.menuCard}>
        <Text style={styles.sectionTitle}>Leaderboards</Text>
        <Text style={styles.sectionSub}>Compare profiles by overall score, crime index, and philanthropy impact.</Text>
        <RankingList title="Top Profiles" icon={<Award color={colors.cyan} size={18} />} data={ranking?.topProfile || []} scoreKey="profileScore" />
        <RankingList title="Top Crime Scores" icon={<TriangleAlert color={colors.red} size={18} />} data={ranking?.topCrime || []} scoreKey="crimeScore" />
        <RankingList title="Top Philanthropists" icon={<HeartHandshake color={colors.purple} size={18} />} data={ranking?.topPhilanthropy || []} scoreKey="philanthropyScore" />
      </GlassCard>

      <ActionButton title="Sign out" variant="dark" onPress={logout} style={styles.logout} />
    </Screen>
  );
}

function ScoreCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <GlassCard style={styles.scoreCard}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <Text style={[styles.scoreValue, { color }]}>{Math.round(value)}</Text>
    </GlassCard>
  );
}

function RankingList({
  title,
  icon,
  data,
  scoreKey,
}: {
  title: string;
  icon: ReactNode;
  data: any[];
  scoreKey: 'profileScore' | 'crimeScore' | 'philanthropyScore';
}) {
  return (
    <View style={styles.rankWrap}>
      <View style={styles.rankTitleRow}>
        {icon}
        <Text style={styles.rankTitle}>{title}</Text>
      </View>
      {data.slice(0, 5).map((item, index) => (
        <Pressable key={`${title}-${item.user?.id || index}`} style={styles.menuItem}>
          <Text style={styles.rankIndex}>#{index + 1}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>{item.user?.name || 'Unknown User'}</Text>
            <Text style={styles.rankMeta}>{item.scores?.personalityType || 'Unknown type'}</Text>
          </View>
          <Text style={styles.rankScore}>{Math.round(item.scores?.[scoreKey] || 0)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  loadingText: {
    color: colors.muted,
    marginTop: 12,
    fontWeight: '700',
  },
  profileCard: {
    alignItems: 'center',
    ...(Platform.OS === 'web' ? { maxWidth: 760, alignSelf: 'center', width: '100%' } : null),
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
  personalityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    marginTop: 10,
    backgroundColor: 'rgba(100,210,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(100,210,255,0.3)',
  },
  personalityText: {
    color: colors.cyan,
    fontWeight: '800',
    fontSize: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  scoreCard: {
    flex: 1,
    minHeight: 92,
    justifyContent: 'center',
  },
  scoreLabel: {
    color: colors.muted,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  scoreValue: {
    marginTop: 6,
    fontSize: 34,
    fontWeight: '900',
  },
  menuCard: {
    marginTop: 16,
    ...(Platform.OS === 'web' ? { maxWidth: 760, alignSelf: 'center', width: '100%' } : null),
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 20,
  },
  sectionSub: {
    color: colors.muted,
    marginTop: 6,
    lineHeight: 20,
    marginBottom: 12,
  },
  input: {
    minHeight: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: colors.text,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  rankWrap: {
    marginTop: 12,
  },
  rankTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    marginBottom: 6,
  },
  rankTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 16,
  },
  menuItem: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.stroke,
    paddingHorizontal: 12,
  },
  rankIndex: {
    color: colors.cyan,
    fontWeight: '900',
    width: 32,
  },
  menuTitle: {
    color: colors.text,
    fontWeight: '800',
  },
  rankMeta: {
    color: colors.muted,
    marginTop: 2,
    fontSize: 12,
  },
  rankScore: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 20,
  },
  logout: {
    marginTop: 18,
    marginBottom: 20,
    ...(Platform.OS === 'web' ? { maxWidth: 760, alignSelf: 'center', width: '100%' } : null),
  },
});
