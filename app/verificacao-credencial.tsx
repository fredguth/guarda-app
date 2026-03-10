import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { VCSDK } from "vc-sdk-headless";

export default function VerificacaoCredencialScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ issuer: string; type: string }>();
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    const issuer = params.issuer ? JSON.parse(params.issuer) : null;
    const type = params.type ? JSON.parse(params.type) : null;

    if (issuer && type) {
      VCSDK.credentials
        .download(issuer, type)
        .then((vc: any) => {
          router.replace({
            pathname: "/credencial-maioridade",
            params: { vc: JSON.stringify(vc) },
          } as any);
        })
        .catch(() => {
          router.replace("/credencial-maioridade" as any);
        });
    } else {
      const timer = setTimeout(
        () => router.replace("/credencial-maioridade" as any),
        5000,
      );
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verificação</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Verificação de Maioridade</Text>

        <Animated.View
          style={[styles.loadingIcon, { transform: [{ rotate }] }]}
        >
          <Ionicons name="sync" size={64} color="#4C1D95" />
        </Animated.View>

        <Text style={styles.waitText}>
          Aguarde enquanto sua{"\n"}credencial é gerada...
        </Text>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#6B7280" />
          <Text style={styles.infoText}>
            Esta emissão é feita apenas uma vez, e ficará disponível nesse
            dispositivo, mesmo sem conexão com a Internet.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 40,
  },
  loadingIcon: {
    marginBottom: 32,
  },
  waitText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 40,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 12,
    lineHeight: 20,
  },
});
