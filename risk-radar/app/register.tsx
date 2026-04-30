import type { ReactNode } from 'react';
import { router } from 'expo-router';
import { Lock, Mail, User } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActionButton } from '../src/components/ActionButton';
import { AppleHeader } from '../src/components/AppleHeader';
import { GlassCard } from '../src/components/GlassCard';
import { Screen } from '../src/components/Screen';
import { api, getErrorMessage } from '../src/api';
import { colors, radii } from '../src/theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function register() {
    try {
      setLoading(true);
      await api.post('/auth/register', { name, email, password });
      Alert.alert('Account created', 'You can sign in now.');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Registration failed', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <AppleHeader eyebrow="Start protected" title="Create account" subtitle="Join the safety network and report incidents in real time." />
      <GlassCard>
        <Input icon={<User color={colors.muted} size={18} />} placeholder="Name" value={name} onChangeText={setName} />
        <Input icon={<Mail color={colors.muted} size={18} />} placeholder="Email" value={email} onChangeText={setEmail} />
        <Input icon={<Lock color={colors.muted} size={18} />} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <ActionButton title="Create account" loading={loading} onPress={register} style={styles.button} />
        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.link}>Already have an account?</Text>
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
