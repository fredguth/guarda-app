import * as Crypto from 'expo-crypto';
import { PkceData } from './types';

export const getOAuthConfig = () => ({
  authorizationUrl: process.env.EXPO_PUBLIC_OAUTH_AUTHORIZATION_URL!,
  tokenUrl:         process.env.EXPO_PUBLIC_OAUTH_TOKEN_URL!,
  userInfoUrl:      process.env.EXPO_PUBLIC_OAUTH_USER_INFO_URL!,
  clientId:         process.env.EXPO_PUBLIC_OAUTH_CLIENT_ID!,
  clientSecret:     process.env.EXPO_PUBLIC_OAUTH_CLIENT_SECRET!,
  redirectUri:      process.env.EXPO_PUBLIC_OAUTH_REDIRECT_URI!,
  scopes:           'openid email profile govbr_confiabilidades',
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

export const fetchToken = async (code: string, pkce: PkceData): Promise<any> => {
  const cfg = getOAuthConfig();
  const response = await fetch(cfg.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${cfg.clientId}:${cfg.clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      code_verifier: pkce.codeVerifier,
      redirect_uri:  cfg.redirectUri,
    }).toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Token request failed: ${response.status} - ${errorBody}`);
  }

  return await response.json();
};

export const fetchUserInfo = async (accessToken: string): Promise<any> => {
  const cfg = getOAuthConfig();
  const response = await fetch(cfg.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`User info request failed: ${response.status} - ${errorBody}`);
  }

  return await response.json();
};
