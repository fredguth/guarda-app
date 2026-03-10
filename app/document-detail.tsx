import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { VCSDK } from "vc-sdk-headless";

export default function DocumentDetailScreen() {
  const router = useRouter();
  const [credential, setCredential] = useState<any>(null);

  useEffect(() => {
    VCSDK.credentials
      .getAll()
      .then((list: any[]) => {
        if (list.length > 0) {
          const latest = list.reduce(
            (a, b) =>
              new Date(a.metadata?.addedDate) >= new Date(b.metadata?.addedDate)
                ? a
                : b,
            list[0],
          );
          setCredential(latest);
        }
      })
      .catch(() => {});
  }, []);

  const subject = credential?.credentialSubject || {};
  const isOver18 = subject.isOver18;
  const issuerName =
    credential?.metadata?.issuerInfo?.name ||
    credential?.issuer ||
    "Ministério da Gestão e Inovação";
  const issuedDate = credential?.metadata?.addedDate
    ? new Date(credential.metadata.addedDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "--";

  const feedbackText = isOver18
    ? "Maior de 18 anos"
    : subject.isOver16
      ? "Entre 16 e 18 anos"
      : subject.isOver14
        ? "Entre 14 e 16 anos"
        : subject.isOver12
          ? "Entre 12 e 14 anos"
          : "Menor de 12 anos";

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
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Credential Card */}
        <View style={styles.credentialCard}>
          <View style={styles.checkContainer}>
            <Ionicons
              name={isOver18 ? "checkmark-circle" : "warning"}
              size={64}
              color={isOver18 ? "#10B981" : "#F59E0B"}
            />
          </View>
          <Text style={styles.credentialTitle}>{feedbackText}</Text>
          <View
            style={[
              styles.statusBadge,
              isOver18 ? styles.statusBadgeSuccess : styles.statusBadgeWarn,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                isOver18 ? styles.statusDotSuccess : styles.statusDotWarn,
              ]}
            />
            <Text
              style={[
                styles.statusText,
                isOver18 ? styles.statusTextSuccess : styles.statusTextWarn,
              ]}
            >
              Credencial Ativa
            </Text>
          </View>
        </View>

        {/* Metadata */}
        <Text style={styles.sectionTitle}>Informações da Credencial</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Emissor</Text>
            <Text style={styles.infoValue}>{issuerName}</Text>
          </View>
          <View style={[styles.infoRow, styles.infoRowBorder]}>
            <Text style={styles.infoLabel}>Data de Emissão</Text>
            <Text style={styles.infoValue}>{issuedDate}</Text>
          </View>
        </View>

        {/* QR Code */}
        <Text style={styles.sectionTitle}>Apresentação</Text>
        <View style={styles.qrCard}>
          <View style={styles.qrPlaceholder}>
            <Ionicons name="qr-code" size={120} color="#1E3A8A" />
          </View>
          <Text style={styles.qrHint}>
            Apresente este código para verificação presencial
          </Text>
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  credentialCard: {
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
  },
  checkContainer: {
    marginBottom: 16,
  },
  credentialTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  statusBadgeSuccess: {
    backgroundColor: "#ECFDF5",
  },
  statusBadgeWarn: {
    backgroundColor: "#FEF3C7",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusDotSuccess: {
    backgroundColor: "#10B981",
  },
  statusDotWarn: {
    backgroundColor: "#F59E0B",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusTextSuccess: {
    color: "#065F46",
  },
  statusTextWarn: {
    color: "#92400E",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  infoRow: {
    paddingVertical: 16,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  qrCard: {
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    padding: 32,
    marginBottom: 32,
  },
  qrPlaceholder: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
  },
  qrHint: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
