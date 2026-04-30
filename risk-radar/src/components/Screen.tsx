import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

type Props = {
  children: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, scroll = true }: Props) {
  const content = <View style={[styles.content, !scroll && styles.contentFill]}>{children}</View>;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <LinearGradient colors={[colors.bg, colors.bg2, '#070b14']} style={StyleSheet.absoluteFill} />
      <View style={styles.orbOne} />
      <View style={styles.orbTwo} />
      {scroll ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  contentFill: {
    flex: 1,
  },
  orbOne: {
    position: 'absolute',
    top: -90,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(10,132,255,0.23)',
  },
  orbTwo: {
    position: 'absolute',
    top: 170,
    left: -120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,59,48,0.18)',
  },
});
