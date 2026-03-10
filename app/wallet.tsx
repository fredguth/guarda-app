import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VCSDK } from "vc-sdk-headless";
import { useWallet } from "../src/hooks/useWallet";
import { useIssuers } from "../src/hooks/useIssuers";
import {
  clearAllAuthData,
  getUserData,
  isUserAuthenticated,
} from "../src/services/authStorage";
import GuardaLogo from "../assets/guarda_logo2.svg";

export default function HomeScreen() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const { credentials, downloading } = useWallet();
  const [modalVisible, setModalVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPicture, setUserPicture] = useState("");

  useEffect(() => {
    isUserAuthenticated().then((authenticated) => {
      if (!authenticated) router.replace("/login");
      else setChecked(true);
    });
  }, []);

  useEffect(() => {
    if (!checked) return;
    getUserData().then((u) => {
      setUserName(u.name);
      setUserEmail(u.email);
      setUserPicture(u.picture);
    });
  }, [checked]);

  if (!checked) return null;

  const handleLogout = async () => {
    setProfileVisible(false);
    try {
      const all = await VCSDK.credentials.getAll();
      await Promise.all(all.map((vc: any) => VCSDK.credentials.delete(vc.id)));
    } catch {}
    await clearAllAuthData();
    await AsyncStorage.removeItem("pending_deep_link");
    router.replace("/login");
  };

  const hasCredentials = credentials.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <GuardaLogo width={42} height={42} style={styles.headerLogo} />
          <Text style={styles.headerTitle}>Documentos</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.iconButton}
          >
            <Ionicons name="add" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setProfileVisible(true)}
            style={styles.iconButton}
          >
            <Ionicons name="person-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {downloading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4C1D95" />
          <Text style={styles.loadingText}>Baixando credencial...</Text>
        </View>
      )}

      {!downloading && !hasCredentials && (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={64} color="#D4D4D8" />
          <Text style={styles.emptyText}>
            Nenhum documento adicionado ainda.
          </Text>
          <Text style={styles.emptySubtext}>
            Toque em "+" para adicionar um documento.
          </Text>
        </View>
      )}

      {!downloading && hasCredentials && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
          snapToInterval={300}
          decelerationRate="fast"
        >
          {credentials.map((cred) => (
            <TouchableOpacity
              key={cred.id}
              style={[
                styles.card,
                cred.isWarn ? styles.cardWarn : styles.cardMaioridade,
              ]}
              activeOpacity={0.8}
              onPress={() => router.push("/document-detail")}
            >
              <Text style={styles.cardTitleWhite}>{cred.title}</Text>
              <Text style={styles.cardSubtitleWhite}>{cred.feedbackText}</Text>
              <View style={styles.cardFooter}>
                <Ionicons
                  name={cred.isWarn ? "warning" : "checkmark-circle"}
                  size={48}
                  color="rgba(255,255,255,0.3)"
                />
                <Text style={styles.cardAcesso}>Acessar Documento</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ width: 20 }} />
        </ScrollView>
      )}

      {/* Footer QR Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => router.push("/qr-scanner")}
        >
          <Ionicons name="qr-code-outline" size={24} color="#FFF" />
          <Text style={styles.qrButtonText}>Ler QR-Code</Text>
        </TouchableOpacity>
      </View>

      {/* Add Document Modal */}
      <AddDocumentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* Profile Modal */}
      <Modal
        visible={profileVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setProfileVisible(false)}
        >
          <View style={styles.profileSheet}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={32} color="#6B7280" />
            </View>
            <Text style={styles.profileName}>{userName || "Usuario"}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function AddDocumentModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { sections, loading } = useIssuers(visible);
  const item = sections[0] ?? null;
  const type = item?.data[0] ?? null;

  const handleSelect = () => {
    if (!item || !type) return;
    onClose();
    router.push({
      pathname: "/verificacao-credencial",
      params: {
        issuer: JSON.stringify(item.issuer),
        type: JSON.stringify(type),
      },
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Adicionar Documento</Text>

          {loading && (
            <ActivityIndicator color="#000" style={{ marginVertical: 20 }} />
          )}

          {!loading && type && (
            <TouchableOpacity
              style={styles.issuerOption}
              onPress={handleSelect}
            >
              <View style={styles.issuerIconContainer}>
                <Ionicons name="shield-checkmark" size={28} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.issuerTitle}>Maioridade 18+</Text>
                <Text style={styles.issuerSubtitle}>
                  {item.issuer.name || item.issuer.id}
                </Text>
              </View>
              <Text style={styles.issuerAction}>Adicionar</Text>
            </TouchableOpacity>
          )}

          {!loading && !type && (
            <Text style={styles.noIssuersText}>
              Nenhum emissor disponivel no momento.
            </Text>
          )}

          <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  // Carousel
  carouselContainer: {
    paddingLeft: 24,
    paddingTop: 20,
    alignItems: "center",
  },
  card: {
    width: 280,
    height: 420,
    borderRadius: 24,
    padding: 24,
    marginRight: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardMaioridade: {
    backgroundColor: "#4C1D95",
  },
  cardWarn: {
    backgroundColor: "#92400E",
  },
  cardTitleWhite: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardSubtitleWhite: {
    fontSize: 16,
    color: "#E5E7EB",
    marginTop: 4,
  },
  cardFooter: {
    marginTop: "auto",
    alignItems: "flex-start",
  },
  cardAcesso: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginTop: 8,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  // Footer
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  qrButton: {
    backgroundColor: "#000000",
    borderRadius: 100,
    paddingVertical: 18,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  qrButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Add Document Modal
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "85%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 20,
  },
  issuerOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  issuerIconContainer: {
    marginRight: 16,
  },
  issuerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  issuerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  issuerAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  noIssuersText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginVertical: 20,
  },
  modalCancel: {
    paddingVertical: 16,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#4B5563",
    fontSize: 16,
    fontWeight: "600",
  },
  // Profile Modal
  profileSheet: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "80%",
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
