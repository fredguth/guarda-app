import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VCSDK } from 'vc-sdk-headless';
import { PENDING_KEY } from './deepLinkHandler';

// HARDCODED: mesmos parâmetros do script simulate-app-flow.js que funciona
const VERIFY_URL = 'https://injiverify.credenciaisverificaveis-dev.dataprev.gov.br';
const VERIFY_CLIENT_ID = VERIFY_URL; // script usa o próprio VERIFY_URL como clientId

const ECA_PRESENTATION_DEFINITION = {
  id: 'eca-age-check',
  input_descriptors: [{
    id: 'ECACredential',
    constraints: { fields: [{ path: ['$.type'], filter: { type: 'string', pattern: 'ECACredential' } }] }
  }]
};

/**
 * Cria um novo vp-request diretamente contra o servidor verify,
 * usando os mesmos parâmetros do script de referência que funciona.
 * Retorna um authRequest compatível com completeShare.
 */
async function createDirectVpRequest(presentationDefinition: any, originalState?: string): Promise<any> {
  console.log('[shareService] Creating direct VP request against verify server...');
  const res = await fetch(`${VERIFY_URL}/v1/verify/vp-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: VERIFY_CLIENT_ID, presentationDefinition }),
  });
  if (!res.ok) throw new Error(`Failed to create VP request: ${res.status}`);
  const data = await res.json();
  console.log('[shareService] VP request created:', data.requestId, '| nonce:', data.authorizationDetails?.nonce);

  return {
    client_id: VERIFY_CLIENT_ID,
    redirect_uri: `${VERIFY_URL}/v1/verify/vp-submission/direct-post`,
    response_type: 'vp_token',
    response_mode: 'direct_post',
    nonce: data.authorizationDetails?.nonce,
    // Use the NEW requestId as state so the server can match the submission
    state: data.requestId,
    presentation_definition: presentationDefinition,
    _transactionId: data.transactionId,
  };
}

interface ResolvedCredential {
  inputDescriptorId: string;
  credentialTypeId: string;
  type: string;
  name: string;
  system: string;
  issuerId: string;
}

interface PendingShare {
  shareUrl: string;
  origin?: string;
  requestId?: string;
}

function extractTypeFromDescriptor(descriptor: any): string {
  return (
    descriptor.constraints?.fields
      ?.find((f: any) => f.path?.includes('$.type'))
      ?.filter?.pattern ?? descriptor.id
  );
}

// Caso adicionar novas credenciais, deve alterar aqui, para ficar dinâmico
function resolveCredentials(requestedCredentials: ResolvedCredential[], authRequest: any): ResolvedCredential[] {
  if (requestedCredentials.length > 0) return requestedCredentials;

  const descriptors: any[] = authRequest.presentation_definition?.input_descriptors ?? [];
  return descriptors.map((d) => ({
    inputDescriptorId: d.id,
    credentialTypeId: d.id,
    type: extractTypeFromDescriptor(d),
    name: d.name || d.id,
    system: 'MGI',
    issuerId: 'MGI',
  }));
}

function isCredentialValid(vc: any, type: string): boolean {
  const types: string[] = Array.isArray(vc.type) ? vc.type : [vc.type];
  const typeMatches = types.some((t) => t === type || t?.includes(type) || type?.includes(t));
  if (!typeMatches) return false;
  if (!vc.expirationDate) return true;
  return new Date(vc.expirationDate) > new Date();
}

async function downloadMissingCredentials(credentials: ResolvedCredential[]): Promise<void> {
  // Always delete existing credentials and download fresh ones
  // The server rejects stale VCs, so we always need a fresh VC
  const existing = await VCSDK.credentials.getAll();
  for (const vc of existing) {
    await VCSDK.credentials.delete(vc.id);
  }

  const { successCount, error424Count, realErrorCount } =
    await VCSDK.share.downloadCredentials(credentials);

  if (successCount === 0)
    throw new Error(`Download falhou. 424s: ${error424Count}, erros: ${realErrorCount}`);
}

async function sendPresentation(authRequest: any, credentials: ResolvedCredential[], pending: PendingShare): Promise<void> {
  const result = await VCSDK.share.completeShare(authRequest, credentials);
  await AsyncStorage.removeItem(PENDING_KEY);

  // Return to calling app — use origin from pending or extract from client_id
  const returnScheme = pending.origin || extractSchemeFromClientId(authRequest);
  if (result.success && returnScheme) {
    try {
      await Linking.openURL(returnScheme);
    } catch (e) {
      console.warn('[shareService] Failed to return to origin app:', e);
    }
  }
}

function extractSchemeFromClientId(authRequest: any): string | null {
  // client_id is often a DID or URL — not useful as a scheme
  // Fall back to checking if we can derive the caller's scheme
  // The brejame deep link comes via openid4vp:// without origin param
  // We can't reliably know the caller, so return null
  return null;
}

export async function executeShare(pending: PendingShare): Promise<void> {
  const { requestedCredentials, authRequest } = await VCSDK.share.parseRequest(pending.shareUrl);
  const credentials = resolveCredentials(requestedCredentials, authRequest);

  await downloadMissingCredentials(credentials);
  await sendPresentation(authRequest, credentials, pending);
}

export async function declineShare(origin?: string): Promise<void> {
  VCSDK.share.declineShare();
  await AsyncStorage.removeItem(PENDING_KEY);
  if (origin) await Linking.openURL(`${origin}?verified=false`);
}
