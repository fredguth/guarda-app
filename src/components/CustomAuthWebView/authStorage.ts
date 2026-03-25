import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const SECURE_OPTS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

// Dados críticos → SecureStore (Keychain/Keystore nativo)
const SECURE_KEYS = ['access_token', 'id_token', 'auth_code', 'c_nonce', 'user_data'] as const;

// Metadados não-sensíveis → AsyncStorage
const META_KEYS = ['expires_at', 'scope', 'token_type', 'auth_state'] as const;

function extractNonce(token: any): string {
  if (token.c_nonce) return token.c_nonce;
  try {
    const payload = JSON.parse(atob(token.id_token.split('.')[1]));
    return payload.nonce || payload.c_nonce || '';
  } catch {
    return '';
  }
}

export const saveCallbackParams = async (params: Record<string, string>): Promise<void> => {
  await Promise.all([
    params.code  ? SecureStore.setItemAsync('auth_code', params.code, SECURE_OPTS)   : Promise.resolve(),
    params.state ? AsyncStorage.setItem('auth_state', params.state)                  : Promise.resolve(),
  ]);
};

export const saveTokenData = async (token: any): Promise<void> => {
  const expiresAt = token.expires_in ? String(Date.now() + token.expires_in * 1000) : '';
  await Promise.all([
    SecureStore.setItemAsync('access_token', token.access_token, SECURE_OPTS),
    SecureStore.setItemAsync('id_token',     token.id_token,     SECURE_OPTS),
    SecureStore.setItemAsync('c_nonce',      extractNonce(token), SECURE_OPTS),
    AsyncStorage.setItem('token_type', token.token_type || ''),
    AsyncStorage.setItem('expires_at', expiresAt),
    AsyncStorage.setItem('scope',      token.scope || ''),
  ]);
  const saved = await SecureStore.getItemAsync('access_token');
};

export const saveUserData = async (user: any): Promise<void> => {
  await SecureStore.setItemAsync('user_data', JSON.stringify(user), SECURE_OPTS);
};

export const getAuthDataFromStorage = async () => {
  try {
    const [accessToken, idToken, cNonce, authCode, userData, metaPairs] = await Promise.all([
      SecureStore.getItemAsync('access_token'),
      SecureStore.getItemAsync('id_token'),
      SecureStore.getItemAsync('c_nonce'),
      SecureStore.getItemAsync('auth_code'),
      SecureStore.getItemAsync('user_data'),
      AsyncStorage.multiGet([...META_KEYS]),
    ]);
    const meta = Object.fromEntries(metaPairs.map(([k, v]) => [k, v]));
    const user = userData ? JSON.parse(userData) : null;

    return {
      auth:  { code: authCode, state: meta.auth_state },
      token: {
        accessToken,
        idToken,
        cNonce,
        tokenType: meta.token_type,
        expiresAt: meta.expires_at ? parseInt(meta.expires_at) : null,
        scope:     meta.scope,
      },
      user: user ? {
        sub:          user.sub,
        name:         user.name,
        socialName:   user.social_name,
        profile:      user.profile,
        picture:      user.picture,
        email:        user.email,
        emailVerified: user.email_verified === true || user.email_verified === 'true',
        fullData:     user,
      } : null,
    };
  } catch (e) {
    return null;
  }
};

export const clearAllAuthDataFromStorage = async (): Promise<void> => {
  await Promise.all([
    ...SECURE_KEYS.map(k => SecureStore.deleteItemAsync(k, SECURE_OPTS)),
    AsyncStorage.multiRemove([...META_KEYS]),
  ]);
  const tokenAfter = await SecureStore.getItemAsync('access_token');
};

export const isUserAuthenticated = async (): Promise<boolean> => {
  const [token, expiresAt] = await Promise.all([
    SecureStore.getItemAsync('access_token'),
    AsyncStorage.getItem('expires_at'),
  ]);
  if (!token) return false;
  if (expiresAt && Date.now() > parseInt(expiresAt)) {
    await clearAllAuthDataFromStorage();
    return false;
  }
  return true;
};
