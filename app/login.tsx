import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomAuthWebView } from "../src/components/CustomAuthWebView/CustomAuthWebView";
import SplashIcon from "../assets/splash2.svg";
import appConfig from "../app.json";

export default function LoginScreen() {
  const router = useRouter();
  const [showWebView, setShowWebView] = useState(false);

  const handleSuccess = async (_authData: any) => {
    setShowWebView(false);
    const saved = await AsyncStorage.getItem("pending_deep_link");
    const appName = saved ? (JSON.parse(saved).appName ?? "") : "";
    if (appName) {
      router.replace({ pathname: "/consentimento", params: { app: appName } });
    } else {
      router.replace("/wallet");
    }
  };

  const handleError = (_error: string) => {
    setShowWebView(false);
  };

  if (showWebView) {
    return (
      <CustomAuthWebView
        onSuccess={handleSuccess}
        onError={handleError}
        onCancel={() => setShowWebView(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SplashIcon width={250} height={250} />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.govbrButton}
          onPress={() => setShowWebView(true)}
        >
          <Text style={styles.govbrButtonText}>Entrar com gov.br</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Versão {appConfig.expo.version}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  govbrButton: {
    backgroundColor: "#000000",
    borderRadius: 100,
    paddingVertical: 18,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  govbrButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  versionText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
});
