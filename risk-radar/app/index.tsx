import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ShieldCheck } from "lucide-react-native";
import { colors } from "../src/theme";
import { PrimaryButton } from "../src/components/PrimaryButton";
export default function Welcome() {
  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200",
      }}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["rgba(3,10,18,.55)", colors.bg]}
        style={styles.container}
      >
        <View style={styles.logo}>
          <ShieldCheck size={96} color={colors.red} />
        </View>
        <Text style={styles.title}>
          Risk <Text style={{ color: colors.red }}>Radar</Text>
        </Text>
        <Text style={styles.subtitle}>
          See the risk. Avoid the danger. Stay ahead.
        </Text>
        <PrimaryButton
          title="Get Started"
          onPress={() => router.push("/login")}
        />
        <Pressable onPress={() => router.replace("/(tabs)/map")}>
          <Text style={styles.guest}>Continue as Guest</Text>
        </Pressable>
      </LinearGradient>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 28 },
  logo: { alignItems: "center", marginBottom: 24 },
  title: {
    color: "#fff",
    fontSize: 46,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "#d6dbe2",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    marginBottom: 72,
  },
  guest: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 24,
    fontWeight: "700",
  },
});
