import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { usePendingDeepLink } from "../src/hooks/usePendingDeepLink";
import { executeShare, declineShare } from "../src/services/shareService";

export default function ConsentimentoScreen() {
  const router = useRouter();
  const { app, purpose, retentionPolicy } = useLocalSearchParams<{
    app?: string;
    purpose?: string;
    retentionPolicy?: string;
  }>();
  const [loading, setLoading] = useState(false);
  const pendingRef = usePendingDeepLink();

  const handlePermitir = async () => {
    const pending = pendingRef.current;
    if (!pending?.shareUrl) return Alert.alert("Erro", "Requisição inválida.");

    // Biometric check before sharing
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Autentique-se para compartilhar",
          cancelLabel: "Cancelar",
        });
        if (!result.success) return;
      }
    } catch {}

    setLoading(true);
    try {
      await executeShare(pending);
      router.replace("/wallet");
    } catch (e: any) {
      Alert.alert("Erro", e?.message || "Não foi possível compartilhar.");
    } finally {
      setLoading(false);
    }
  };

  const handleNaoPermitir = async () => {
    await declineShare(pendingRef.current?.origin);
    router.replace("/wallet");
  };

  const appName = app || "...";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleNaoPermitir}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.securityBadge}>
          <Ionicons name="shield-checkmark" size={16} color="#065F46" />
          <Text style={styles.securityText}>Conexão Segura</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Title */}
        <Text style={styles.title}>Autoriza compartilhar seus dados?</Text>

        {/* Requester Info */}
        <View style={styles.requesterCard}>
          <View style={styles.requesterIconPlaceholder}>
            <Ionicons name="business" size={32} color="#3B82F6" />
          </View>
          <Text style={styles.requesterLabel}>Solicitado por</Text>
          <Text style={styles.requesterName}>{appName}</Text>
          {purpose ? (
            <Text style={styles.requesterReason}>{purpose}</Text>
          ) : null}
        </View>

        {/* Data List */}
        <Text style={styles.sectionTitle}>
          Dados solicitados (obrigatórios):
        </Text>
        <View style={styles.dataContainer}>
          <View style={styles.dataRow}>
            <View style={styles.dataLeft}>
              <Ionicons
                name="checkmark-done-circle-outline"
                size={24}
                color="#6B7280"
              />
              <Text style={styles.dataLabel}>Maior de 18 anos</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </View>
        </View>

        {/* Retention Policy */}
        {retentionPolicy ? (
          <View style={styles.retentionCard}>
            <Ionicons name="shield-half-outline" size={20} color="#6B7280" />
            <View style={styles.retentionTexts}>
              <Text style={styles.retentionLabel}>Política de Retenção</Text>
              <Text style={styles.retentionValue}>
                {retentionPolicy === "ephemeral"
                  ? "Uso Único (Sem armazenamento)"
                  : retentionPolicy}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          Ao autorizar o compartilhamento, você concorda que o solicitante terá
          acesso apenas aos dados listados acima.
        </Text>

        {loading ? (
          <ActivityIndicator
            color="#000"
            size="large"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePermitir}
            >
              <Ionicons
                name="finger-print"
                size={20}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.primaryButtonText}>
                Autorizar Compartilhamento
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleNaoPermitir}
            >
              <Text style={styles.secondaryButtonText}>Não autorizar</Text>
            </TouchableOpacity>
          </>
        )}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  closeButton: {
    padding: 4,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  securityText: {
    color: "#065F46",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 32,
    lineHeight: 38,
  },
  requesterCard: {
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  requesterIconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  requesterLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  requesterName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  requesterReason: {
    fontSize: 15,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  dataContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  dataLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataLabel: {
    fontSize: 16,
    color: "#111827",
    marginLeft: 16,
    fontWeight: "500",
  },
  retentionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  retentionTexts: {
    marginLeft: 12,
  },
  retentionLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  retentionValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  disclaimer: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: "#000000",
    borderRadius: 100,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4B5563",
    fontSize: 16,
    fontWeight: "600",
  },
});
