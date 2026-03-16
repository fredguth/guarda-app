import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_STORAGE_KEYS = [
  'auth_params', 'auth_code', 'auth_state',
  'access_token', 'id_token', 'token_type', 'expires_in', 'expires_at', 'scope', 'token_data',
  'user_sub', 'user_name', 'user_social_name', 'user_profile', 'user_picture',
  'user_email', 'user_email_verified', 'user_data',
] as const;

export const saveCallbackParams = async (params: Record<string, string>): Promise<void> => {
  const entries: [string, string][] = [['auth_params', JSON.stringify(params)]];
  if (params.code)  entries.push(['auth_code', params.code]);
  if (params.state) entries.push(['auth_state', params.state]);
  await AsyncStorage.multiSet(entries);
};

export const saveTokenData = async (token: any): Promise<void> => {
  const expiresAt = token.expires_in
    ? String(Date.now() + token.expires_in * 1000)
    : '';
  await AsyncStorage.multiSet([
    ['access_token', token.access_token],
    ['id_token',     token.id_token],
    ['token_type',   token.token_type  || ''],
    ['expires_in',   String(token.expires_in || '')],
    ['expires_at',   expiresAt],
    ['scope',        token.scope       || ''],
    ['c_nonce',      token.c_nonce     || ''],
    ['token_data',   JSON.stringify(token)],
  ]);
};

export const saveUserData = async (user: any): Promise<void> => {
  await AsyncStorage.multiSet([
    ['user_sub',            user.sub           || ''],
    ['user_name',           user.name          || ''],
    ['user_social_name',    user.social_name   || ''],
    ['user_profile',        user.profile       || ''],
    ['user_picture',        user.picture       || ''],
    ['user_email',          user.email         || ''],
    ['user_email_verified', String(user.email_verified || false)],
    ['user_data',           JSON.stringify(user)],
  ]);
};

export const getAuthDataFromStorage = async () => {
  try {
    const pairs = await AsyncStorage.multiGet([...AUTH_STORAGE_KEYS]);
    const storage = Object.fromEntries(pairs.map(([key, value]) => [key, value]));
    return {
      auth: {
        params: storage.auth_params ? JSON.parse(storage.auth_params) : null,
        code:   storage.auth_code,
        state:  storage.auth_state,
      },
      token: {
        accessToken: storage.access_token,
        idToken:     storage.id_token,
        tokenType:   storage.token_type,
        expiresIn:   storage.expires_in ? parseInt(storage.expires_in) : null,
        scope:       storage.scope,
        fullData:    storage.token_data ? JSON.parse(storage.token_data) : null,
      },
      user: {
        sub:           storage.user_sub,
        name:          storage.user_name,
        socialName:    storage.user_social_name,
        profile:       storage.user_profile,
        picture:       storage.user_picture,
        email:         storage.user_email,
        emailVerified: storage.user_email_verified === 'true',
        fullData:      storage.user_data ? JSON.parse(storage.user_data) : null,
      },
    };
  } catch {
    return null;
  }
};

export const clearAllAuthDataFromStorage = async (): Promise<void> => {
  await AsyncStorage.multiRemove([...AUTH_STORAGE_KEYS]);
};

export const isUserAuthenticated = async (): Promise<boolean> => {
  const pairs = await AsyncStorage.multiGet(['access_token', 'expires_at']);
  const token = pairs[0][1];
  const expiresAt = pairs[1][1];
  if (!token) return false;
  if (expiresAt && Date.now() > parseInt(expiresAt)) {
    await clearAllAuthDataFromStorage();
    return false;
  }
  return true;
};
