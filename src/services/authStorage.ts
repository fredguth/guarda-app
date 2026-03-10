import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_SERVICE = 'guarda_auth_tokens';
const TOKEN_STORAGE_KEY = 'guarda_auth_tokens_data';

// --- Secure token storage via Keychain (with AsyncStorage fallback) ---

interface TokenPayload {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  expires_at: string;
  scope: string;
}

export const saveTokenData = async (token: any): Promise<void> => {
  const expiresAt = token.expires_in
    ? String(Date.now() + token.expires_in * 1000)
    : '';

  const payload: TokenPayload = {
    access_token: token.access_token,
    id_token: token.id_token,
    token_type: token.token_type || '',
    expires_in: token.expires_in || 0,
    expires_at: expiresAt,
    scope: token.scope || '',
  };

  // Store in Keychain (secure) with AsyncStorage fallback for dev
  try {
    await Keychain.setGenericPassword(
      TOKEN_SERVICE,
      JSON.stringify(payload),
      {
        service: TOKEN_SERVICE,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      },
    );
  } catch (e) {
    if (!__DEV__) {
      throw new Error('[AUTH] Keychain is required in production but unavailable');
    }
    console.warn('[AUTH] Keychain unavailable, falling back to AsyncStorage (DEV ONLY)');
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(payload));
  }

  // Also write individual keys that the SDK's AuthIntegrationService expects
  await AsyncStorage.multiSet([
    ['access_token', token.access_token || ''],
    ['id_token', token.id_token || ''],
    ['token_type', token.token_type || ''],
    ['expires_in', String(token.expires_in || 0)],
    ['scope', token.scope || ''],
  ]);
};

export const getTokenData = async (): Promise<TokenPayload | null> => {
  try {
    const result = await Keychain.getGenericPassword({ service: TOKEN_SERVICE });
    if (!result) return null;
    return JSON.parse(result.password);
  } catch {
    if (!__DEV__) {
      throw new Error('[AUTH] Keychain is required in production but unavailable');
    }
    try {
      const data = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
};

const clearTokenData = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
  } catch {
    if (!__DEV__) {
      throw new Error('[AUTH] Keychain is required in production but unavailable');
    }
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

// --- User data: derived from id_token in memory, NOT persisted ---
// We only persist the user info in AsyncStorage for display purposes
// (name, picture URL). PII like CPF is never stored.

export const saveUserData = async (user: any): Promise<void> => {
  await AsyncStorage.multiSet([
    ['user_name', user.name || user.social_name || ''],
    ['user_picture', user.picture || ''],
    ['user_email', user.email || ''],
    // Keys expected by SDK's AuthIntegrationService
    ['user_sub', user.sub || ''],
    ['user_social_name', user.social_name || ''],
    ['user_profile', user.profile || ''],
    ['user_email_verified', String(user.email_verified || false)],
    ['user_data', JSON.stringify(user)],
  ]);
};

export const getUserData = async () => {
  const pairs = await AsyncStorage.multiGet(['user_name', 'user_picture', 'user_email']);
  const d = Object.fromEntries(pairs.map(([k, v]) => [k, v]));
  return {
    name: d.user_name || '',
    picture: d.user_picture || '',
    email: d.user_email || '',
  };
};

export const saveCallbackParams = async (params: Record<string, string>): Promise<void> => {
  await AsyncStorage.setItem('auth_params', JSON.stringify(params));
};

// --- Auth check ---

export const isUserAuthenticated = async (): Promise<boolean> => {
  const token = await getTokenData();
  if (!token?.access_token) return false;
  if (token.expires_at && Date.now() > parseInt(token.expires_at)) {
    await clearAllAuthData();
    return false;
  }
  return true;
};

// --- Cleanup ---

export const clearAllAuthData = async (): Promise<void> => {
  await clearTokenData();
  await AsyncStorage.multiRemove([
    'auth_params', 'user_name', 'user_picture', 'user_email', 'pending_deep_link',
    // SDK AuthIntegrationService keys
    'access_token', 'id_token', 'token_type', 'expires_in', 'scope',
    'user_sub', 'user_social_name', 'user_profile', 'user_email_verified', 'user_data',
  ]);
};
