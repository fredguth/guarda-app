import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

function resolveAge(subject: any): { label: string; isWarn: boolean } {
  if (subject.isOver18) return { label: "+18", isWarn: false };
  if (subject.isOver16) return { label: "16-18", isWarn: true };
  if (subject.isOver14) return { label: "14-16", isWarn: true };
  if (subject.isOver12) return { label: "12-14", isWarn: true };
  return { label: "-12", isWarn: true };
}

export default function CredencialMaioridadeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vc: string }>();
  const vc = params.vc ? JSON.parse(params.vc) : null;
  const subject = vc?.credentialSubject || {};
  const { label: age, isWarn } = resolveAge(subject);

  if (!vc) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/wallet")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Credencial</Text>
          <View style={styles.spacer} />
        </View>
        <View style={styles.content}>
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text style={styles.errorText}>Erro ao carregar credencial</Text>
          <TouchableOpacity
            style={styles.backButtonLarge}
            onPress={() => router.replace("/wallet")}
          >
            <Text style={styles.backButtonLargeText}>Voltar para o inicio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/wallet")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Credencial de Maioridade</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>
        {/* Age feedback card */}
        <View
          style={[
            styles.ageCard,
            isWarn ? styles.ageCardWarn : styles.ageCardSuccess,
          ]}
        >
          <Text style={styles.ageLabel}>{age}</Text>
          <Ionicons
            name={isWarn ? "warning" : "checkmark-circle"}
            size={48}
            color={isWarn ? "#92400E" : "#065F46"}
          />
        </View>

        <Text style={styles.feedbackTitle}>
          {subject.isOver18
            ? "Maior de 18 anos"
            : subject.isOver16
              ? "Entre 16 e 18 anos"
              : subject.isOver14
                ? "Entre 14 e 16 anos"
                : subject.isOver12
                  ? "Entre 12 e 14 anos"
                  : "Menor de 12 anos"}
        </Text>

        {/* QR Code placeholder */}
        <View style={styles.qrCard}>
          <Ionicons name="qr-code" size={120} color="#1E3A8A" />
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#6B7280" />
          <Text style={styles.infoText}>
            Esta emissão é feita apenas uma vez, e ficará disponível nesse
            dispositivo, mesmo sem conexão com a Internet.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButtonLarge}
          onPress={() => router.replace("/wallet")}
        >
          <Text style={styles.backButtonLargeText}>Voltar para o inicio</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  // Age card
  ageCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    marginBottom: 24,
  },
  ageCardSuccess: {
    backgroundColor: "#F0FDF4",
  },
  ageCardWarn: {
    backgroundColor: "#FEF3C7",
  },
  ageLabel: {
    fontSize: 48,
    fontWeight: "800",
    color: "#111827",
    marginRight: 16,
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  // QR
  qrCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
  },
  // Info
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    alignItems: "flex-start",
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 12,
    lineHeight: 20,
  },
  // Error
  errorText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  // Back button
  backButtonLarge: {
    backgroundColor: "#000000",
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  backButtonLargeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
