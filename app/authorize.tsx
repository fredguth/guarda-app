import { useEffect } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isUserAuthenticated } from "../src/services/authStorage";

export const PENDING_KEY = "pending_deep_link";


const ECA_PRESENTATION_DEFINITION = {
  id: "eca-age-check",
  input_descriptors: [
    {
      id: "ECACredential",
      name: "Comprovante de Maioridade",
      purpose: "Verificar que o usuario e maior de 18 anos",
      constraints: {
        fields: [
          {
            path: ["$.type"],
            filter: { type: "string", pattern: "ECACredential" },
          },
        ],
      },
    },
  ],
};

function buildShareUrl(
  requestId: string,
  nonce: string,
  redirectUri: string,
  clientMetadata: string,
): string {
  const params = new URLSearchParams({
    response_type: "vp_token",
    client_id: redirectUri,
    redirect_uri: redirectUri,
    response_mode: "direct_post",
    presentation_definition: JSON.stringify(ECA_PRESENTATION_DEFINITION),
    client_metadata: clientMetadata,
    nonce,
    state: requestId,
  });
  return `openid4vp://?${params.toString()}`;
}

function parseClientMetadata(raw: string | undefined): {
  clientName: string;
  purpose: string;
  retentionPolicy: string;
} {
  const defaults = {
    clientName: "",
    purpose: "",
    retentionPolicy: "",
  };
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw);
    return {
      clientName: parsed.client_name ?? defaults.clientName,
      purpose: parsed.purpose ?? defaults.purpose,
      retentionPolicy: parsed.retention_policy ?? defaults.retentionPolicy,
    };
  } catch {
    return defaults;
  }
}

async function handleDeepLink(
  params: ReturnType<typeof useLocalSearchParams>,
  router: ReturnType<typeof useRouter>,
) {
  const origin = (params.origin as string) ?? "";
  const requestId = (params.requestId as string) ?? "";
  const nonce = (params.nonce as string) ?? "";
  const redirectUri = params.redirect_uri as string;
  const clientMetadataRaw = params.client_metadata as string | undefined;

  Alert.alert("authorize.tsx", `origin=${origin}\nrequestId=${requestId}\nredirect_uri=${redirectUri ? "OK" : "MISSING"}\nclient_metadata=${clientMetadataRaw ? "OK" : "MISSING"}`);
  const { clientName, purpose, retentionPolicy } = parseClientMetadata(clientMetadataRaw);
  const appName = clientName || origin.replace(/:\/\/.*/, "");

  if (!redirectUri) {
    console.error("[authorize] Deep link sem redirect_uri — não é possível completar a verificação.");
    router.replace("/wallet");
    return;
  }

  const shareUrl = requestId
    ? buildShareUrl(requestId, nonce, redirectUri, clientMetadataRaw || JSON.stringify({ client_name: appName }))
    : "";

  await AsyncStorage.setItem(
    PENDING_KEY,
    JSON.stringify({ appName, shareUrl, origin, requestId }),
  );

  const auth = await isUserAuthenticated();

  const consentParams = { app: appName, purpose, retentionPolicy };

  if (auth) {
    router.replace({ pathname: "/consentimento", params: consentParams });
  } else {
    router.replace("/login");
  }
}

export default function CarteiraDeepLink() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    handleDeepLink(params, router).catch((e) => {
      Alert.alert("Erro no deep link", e?.message || String(e));
    });
  }, [params, router]);

  return null;
}
