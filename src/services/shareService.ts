import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VCSDK } from "vc-sdk-headless";

const PENDING_KEY = "pending_deep_link";

/**
 * Parseia uma URL openid4vp:// (vinda de QR code ou deep link) e retorna
 * um objeto PendingLink pronto para ser salvo e processado.
 */
export function parseOpenId4VPUrl(rawUrl: string): PendingLink {
  // Normaliza: openid4vp://?foo=bar  ou  openid4vp://foo?bar=baz
  const normalized = rawUrl.startsWith("openid4vp://?")
    ? rawUrl
    : rawUrl.replace("openid4vp://", "openid4vp://?");

  const queryString = normalized.split("?")[1] ?? "";
  const params = new URLSearchParams(queryString);

  const origin = params.get("redirect_uri") ?? params.get("client_id") ?? "";
  const requestId = params.get("state") ?? "";
  const appName = params.get("client_metadata")
    ? (() => {
        try {
          return (
            JSON.parse(params.get("client_metadata")!).client_name ?? origin
          );
        } catch {
          return origin;
        }
      })()
    : origin.replace(/:\/\/.*/, "");

  return { appName, shareUrl: rawUrl, origin, requestId };
}

export type PendingLink = {
  shareUrl: string;
  origin: string;
  requestId: string;
  appName: string;
};

type InputDescriptor = {
  id: string;
  name?: string;
  constraints?: {
    fields?: { path?: string[]; filter?: { pattern?: string } }[];
  };
};

function descriptorToCredential(descriptor: InputDescriptor) {
  const typePattern = descriptor.constraints?.fields?.find((f) =>
    f.path?.includes("$.type"),
  )?.filter?.pattern;
  return {
    inputDescriptorId: descriptor.id,
    credentialTypeId: descriptor.id,
    type: typePattern || descriptor.id,
    name: descriptor.name || descriptor.id,
    system: "MGI",
    issuerId: "MGI",
  };
}

function resolveCredentials(requestedCredentials: any[], authRequest: any) {
  if (requestedCredentials.length > 0) return requestedCredentials;
  const descriptors =
    authRequest.presentation_definition?.input_descriptors ?? [];
  return descriptors.map(descriptorToCredential);
}

export async function executeShare(pending: PendingLink) {
  const { requestedCredentials, authRequest } = await VCSDK.share.parseRequest(
    pending.shareUrl,
  );
  const creds = resolveCredentials(requestedCredentials, authRequest);

  const { successCount, error424Count, realErrorCount } =
    await VCSDK.share.downloadCredentials(creds);
  if (successCount === 0)
    throw new Error(
      `Download falhou. 424s: ${error424Count}, erros: ${realErrorCount}`,
    );

  const result = await VCSDK.share.completeShare(authRequest, creds);
  await AsyncStorage.removeItem(PENDING_KEY);

  if (result.success && pending.origin)
    await Linking.openURL(
      `${pending.origin}?verified=true&requestId=${pending.requestId}`,
    );
}

export async function declineShare(origin?: string) {
  VCSDK.share.declineShare();
  await AsyncStorage.removeItem(PENDING_KEY);
  if (origin) await Linking.openURL(`${origin}?verified=false`);
}
