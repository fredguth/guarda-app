import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const PENDING_KEY = 'pending_deep_link';

const VERIFY_BASE_URL = process.env.EXPO_PUBLIC_VERIFY_BASE_URL!;
const RESPONSE_URI = `${VERIFY_BASE_URL}/v1/verify/vp-submission/direct-post`;
const CLIENT_NAME = process.env.EXPO_PUBLIC_CLIENT_NAME!;

interface PresentationDefinition {
  id: string;
  input_descriptors: any[];
}

interface DeepLinkParams {
  origin?: string;
  requestId?: string;
  state?: string;
  nonce?: string;
  request_uri?: string;
  presentation_definition?: string;
}

interface PendingDeepLink {
  appName: string;
  shareUrl: string;
  origin: string;
  requestId: string;
}

const DEFAULT_PRESENTATION_DEFINITION: PresentationDefinition = {
  id: 'eca-age-check',
  input_descriptors: [{
    id: 'ECACredential',
    name: 'Comprovante de Maioridade',
    purpose: 'Verificar que o usuário é maior de 18 anos',
    constraints: { fields: [{ path: ['$.type'], filter: { type: 'string', pattern: 'ECACredential' } }] },
  }],
};

const BASE_SHARE_PARAMS = {
  response_type: 'vp_token',
  client_id: VERIFY_BASE_URL,
  redirect_uri: RESPONSE_URI,
  response_mode: 'direct_post',
  client_metadata: JSON.stringify({ client_name: CLIENT_NAME }),
};

function buildShareUrl(requestId: string, nonce: string, presentationDefinition: PresentationDefinition): string {
  const params = new URLSearchParams({
    ...BASE_SHARE_PARAMS,
    presentation_definition: JSON.stringify(presentationDefinition),
    nonce,
    state: requestId,
  });
  return `openid4vp://?${params.toString()}`;
}

async function resolveShareUrlFromRequestUri(requestUri: string): Promise<string> {
  const res = await fetch(requestUri);
  const jwt = await res.text();
  const payload = jwtDecode<any>(jwt);

  const redirectUri = payload.response_uri ?? payload.redirect_uri ?? RESPONSE_URI;
  const params = new URLSearchParams({
    ...BASE_SHARE_PARAMS,
    client_id: payload.client_id ?? BASE_SHARE_PARAMS.client_id,
    redirect_uri: redirectUri,
    presentation_definition: payload.presentation_definition
      ? JSON.stringify(payload.presentation_definition)
      : '',
    nonce: payload.nonce ?? '',
    state: payload.state ?? '',
  });
  return `openid4vp://?${params.toString()}`;
}

function extractAppName(origin: string): string {
  return origin.split('://')[0] || 'Aplicativo';
}

function parseDeepLinkParams(url: string): DeepLinkParams {
  return Object.fromEntries(new URL(url).searchParams.entries()) as DeepLinkParams;
}

function resolvePresentationDefinition(raw?: string): PresentationDefinition {
  return raw ? JSON.parse(raw) : DEFAULT_PRESENTATION_DEFINITION;
}

async function resolveShareUrl(params: DeepLinkParams): Promise<string> {
  if (params.request_uri)
    return resolveShareUrlFromRequestUri(params.request_uri);

  return buildShareUrl(
    params.requestId ?? params.state ?? '',
    params.nonce ?? '',
    resolvePresentationDefinition(params.presentation_definition),
  );
}

export async function handleDeepLink(url: string): Promise<{ appName: string }> {
  const params = parseDeepLinkParams(url);
  const origin = params.origin ?? '';
  const appName = extractAppName(origin);
  const shareUrl = await resolveShareUrl(params);

  const pending: PendingDeepLink = { appName, shareUrl, origin, requestId: params.requestId ?? params.state ?? '' };
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(pending));

  return { appName };
}
