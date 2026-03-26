import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { VCSDK } from "vc-sdk-headless";

SplashScreen.preventAutoHideAsync();

const SDK_CONFIG = {
  appId: "eca-wallet",
  network: {
    baseUrl:
      process.env.EXPO_PUBLIC_BASE_URL ||
      "https://injiweb.credenciaisverificaveis-hml.dataprev.gov.br",
    oauth: {
      authorizationUrl: process.env.EXPO_PUBLIC_OAUTH_AUTHORIZATION_URL,
      tokenUrl: process.env.EXPO_PUBLIC_OAUTH_TOKEN_URL,
      userInfoUrl: process.env.EXPO_PUBLIC_OAUTH_USER_INFO_URL,
      clientId: process.env.EXPO_PUBLIC_OAUTH_CLIENT_ID,
      clientSecret: process.env.EXPO_PUBLIC_OAUTH_CLIENT_SECRET,
      redirectUri: process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URI,
      scopes: [
        "openid",
        "email",
        "profile",
        "govbr_confiabilidades",
      ] as string[],
    },
  },
  storage: { encrypted: true },
} as const;

export default function RootLayout() {
  useEffect(() => {
    VCSDK.init(SDK_CONFIG).catch(() => {});
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="authorize" />
          <Stack.Screen name="wallet" />
          <Stack.Screen
            name="qr-scanner"
            options={{ presentation: "fullScreenModal" }}
          />
          <Stack.Screen name="verificacao-credencial" />
          <Stack.Screen name="credencial-maioridade" />
          <Stack.Screen name="consentimento" />
          <Stack.Screen name="document-detail" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
