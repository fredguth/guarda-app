import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import * as Crypto from 'expo-crypto';

export const PENDING_KEY = 'pending_deep_link';

const VERIFY_BASE_URL = process.env.EXPO_PUBLIC_VERIFY_BASE_URL!;
const RESPONSE_URI = `${VERIFY_BASE_URL}/v1/verify/vp-submission/direct-post`;
const CLIENT_NAME = process.env.EXPO_PUBLIC_CLIENT_NAME!;

interface PresentationDefinition {
  id: string;
  input_descriptors: any[];
}

export interface RequestedField {
  id: string;
  name: string;
  type: string;
  // paths dos campos SD-JWT pedidos pelo verifier (ex: ["$.cpf", "$.name"])
  // vazio = ldp_vc ou sem restrição de campos específicos
  disclosurePaths?: string[];
}

interface DeepLinkParams {
  origin?: string;
  requestId?: string;
  state?: string;
  nonce?: string;
  request_uri?: string;
  response_uri?: string;
  presentation_definition?: string;
}

interface PendingDeepLink {
  appName: string;
  shareUrl: string;
  origin: string;
  requestId: string;
  requestedFields: RequestedField[];
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

function generateNonce(): string {
  return Crypto.randomUUID();
}

function buildShareUrl(requestId: string, nonce: string, presentationDefinition: PresentationDefinition, responseUri?: string): string {
  const params = new URLSearchParams({
    ...BASE_SHARE_PARAMS,
    redirect_uri: responseUri || RESPONSE_URI,
    presentation_definition: JSON.stringify(presentationDefinition),
    nonce,
    state: requestId,
  });
  return `openid4vp://?${params.toString()}`;
}

async function resolveShareUrlFromRequestUri(requestUri: string): Promise<{ url: string; pd: PresentationDefinition }> {
  const res = await fetch(requestUri);
  const jwt = await res.text();
  const payload = jwtDecode<any>(jwt);

  const pd: PresentationDefinition = payload.presentation_definition ?? DEFAULT_PRESENTATION_DEFINITION;
  const redirectUri = payload.response_uri ?? payload.redirect_uri ?? RESPONSE_URI;
  const params = new URLSearchParams({
    ...BASE_SHARE_PARAMS,
    client_id: payload.client_id ?? BASE_SHARE_PARAMS.client_id,
    redirect_uri: redirectUri,
    presentation_definition: JSON.stringify(pd),
    nonce: payload.nonce || generateNonce(),
    state: payload.state ?? '',
  });
  return { url: `openid4vp://?${params.toString()}`, pd };
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

async function resolveShareUrl(params: DeepLinkParams): Promise<{ url: string; pd: PresentationDefinition }> {
  if (params.request_uri)
    return resolveShareUrlFromRequestUri(params.request_uri);

  const pd = resolvePresentationDefinition(params.presentation_definition);
  return {
    url: buildShareUrl(
      params.requestId ?? params.state ?? '',
      params.nonce || generateNonce(),
      pd,
      params.response_uri,
    ),
    pd,
  };
}

function extractRequestedFields(pd: PresentationDefinition): RequestedField[] {
  return pd.input_descriptors.map((d) => {
    const fields: any[] = d.constraints?.fields ?? [];
    const typeField = fields.find((f: any) => f.path?.includes('$.type'));
    // Campos que NÃO são $.type são os atributos SD-JWT que o verifier quer ver
    const disclosurePaths = fields
      .filter((f: any) => !f.path?.includes('$.type'))
      .flatMap((f: any) => f.path as string[]);
    return {
      id: d.id,
      name: d.name || d.id,
      type: typeField?.filter?.pattern ?? d.id,
      disclosurePaths: disclosurePaths.length > 0 ? disclosurePaths : undefined,
    };
  });
}

export async function resolveOpenId4VpUrl(url: string): Promise<{ url: string; pd: PresentationDefinition }> {
  const [, query] = url.split('?');
  const params = Object.fromEntries(new URLSearchParams(query || '').entries()) as DeepLinkParams;
  return resolveShareUrl(params);
}

export async function handleDeepLink(url: string): Promise<{ appName: string; requestedFields: RequestedField[] }> {
  const params = parseDeepLinkParams(url);
  const origin = params.origin ?? '';
  const appName = extractAppName(origin);
  const { url: shareUrl, pd } = await resolveShareUrl(params);
  const requestedFields = extractRequestedFields(pd);

  const pending: PendingDeepLink = { appName, shareUrl, origin, requestId: params.requestId ?? params.state ?? '', requestedFields };
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(pending));

  return { appName, requestedFields };
}
