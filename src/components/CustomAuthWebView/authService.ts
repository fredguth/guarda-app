import * as Crypto from 'expo-crypto';
import { PkceData } from './types';

export const getOAuthConfig = () => ({
  authorizationUrl: process.env.EXPO_PUBLIC_OAUTH_AUTHORIZATION_URL!,
  clientId:         process.env.EXPO_PUBLIC_OAUTH_CLIENT_ID!,
  redirectUri:      process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URI!,
  scopes:           'openid email profile govbr_confiabilidades',
  mimotoUrl:        process.env.EXPO_PUBLIC_MIMOTO_URL!,
});

const toBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const generatePkce = async (): Promise<PkceData> => {
  const random = Crypto.getRandomBytes(32);
  const codeVerifier = toBase64Url(random.buffer as ArrayBuffer);
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    { encoding: Crypto.CryptoEncoding.BASE64 }
  );
  const codeChallenge = digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return { codeVerifier, codeChallenge };
};

export const buildAuthorizationUrl = (pkce: PkceData): string => {
  const cfg = getOAuthConfig();
  const url = new URL(cfg.authorizationUrl);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', cfg.clientId);
  url.searchParams.set('scope', cfg.scopes);
  url.searchParams.set('redirect_uri', cfg.redirectUri);
  url.searchParams.set('nonce', 'q1w2e3r4t5y6u7i8o9p0');
  url.searchParams.set('state', 'p0o9i8u7y6t5r4e3w2q1');
  url.searchParams.set('code_challenge', pkce.codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  return url.toString();
};

export const fetchUserProfile = async (code: string, pkce: PkceData): Promise<any> => {
  const cfg = getOAuthConfig();
  const url = new URL(`${cfg.mimotoUrl}/v1/mimoto/user/profile`);
  url.searchParams.set('code', code);
  url.searchParams.set('codeVerifier', pkce.codeVerifier);
  url.searchParams.set('redirectUri', cfg.redirectUri);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Profile request failed: ${response.status} - ${errorBody}`);
  }

  const json = await response.json();
  return json.data;
};

/**
 * Obtém o token do Certify via mimoto /get-token/{issuer}.
 * Retorna access_token do Certify + c_nonce, ou null se falhar.
 * DEVE ser chamado antes de fetchUserProfile (ambos consomem o code).
 */
export const fetchCNonce = async (
  issuerId: string,
  code: string,
  pkce: PkceData,
): Promise<{ access_token: string; id_token?: string; c_nonce?: string } | null> => {
  const cfg = getOAuthConfig();
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: cfg.redirectUri,
      code_verifier: pkce.codeVerifier,
    });
    const response = await fetch(
      `${cfg.mimotoUrl}/v1/mimoto/get-token/${issuerId}`,
      { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() },
    );
    if (!response.ok) {
      console.warn('[fetchCNonce] get-token failed:', response.status, await response.text());
      return null;
    }
    const json = await response.json();
    console.log('[fetchCNonce] get-token response keys:', Object.keys(json));
    const token = json.access_token ?? json.response?.access_token;
    const cNonce = json.c_nonce ?? json.response?.c_nonce;
    const idToken = json.id_token ?? json.response?.id_token;
    if (!token) return null;
    return { access_token: token, id_token: idToken, c_nonce: cNonce };
  } catch (e) {
    console.warn('[fetchCNonce] error:', e);
    return null;
  }
};
