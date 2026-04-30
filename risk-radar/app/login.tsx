import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActionButton } from '../src/components/ActionButton';
import { AppleHeader } from '../src/components/AppleHeader';
import { GlassCard } from '../src/components/GlassCard';
import { Screen } from '../src/components/Screen';
import { api, getErrorMessage } from '../src/api';
import { colors, radii } from '../src/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function login() {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      router.replace('/(tabs)/map');
    } catch (error) {
      Alert.alert('Login failed', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <AppleHeader eyebrow="Welcome back" title="Sign in" subtitle="Access your private alerts, reports, and safety profile." />
      <GlassCard>
        <Input icon={<Mail color={colors.muted} size={18} />} placeholder="Email" value={email} onChangeText={setEmail} />
        <Input icon={<Lock color={colors.muted} size={18} />} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <ActionButton title="Sign in" loading={loading} onPress={login} style={styles.button} />
        <Pressable onPress={() => router.push('/register')}>
          <Text style={styles.link}>Create a new account</Text>
        </Pressable>
      </GlassCard>
    </Screen>
  );
}

function Input(props: { icon: ReactNode; placeholder: string; value: string; onChangeText: (v: string) => void; secureTextEntry?: boolean }) {
  return (
    <View style={styles.inputWrap}>
      {props.icon}
      <TextInput
        placeholder={props.placeholder}
        placeholderTextColor={colors.soft}
        value={props.value}
        onChangeText={props.onChangeText}
        secureTextEntry={props.secureTextEntry}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    minHeight: 56,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: 'rgba(255,255,255,0.07)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
  },
  button: {
    marginTop: 8,
  },
  link: {
    color: colors.cyan,
    textAlign: 'center',
    marginTop: 18,
    fontWeight: '800',
  },
});
