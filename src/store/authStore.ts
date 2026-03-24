import { create } from 'zustand';
import { getAuthDataFromStorage, clearAllAuthDataFromStorage } from '../components/CustomAuthWebView/authStorage';

interface User {
  sub?: string;
  name?: string;
  social_name?: string;
  email?: string;
  picture?: string;
  email_verified?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  login: (authData: { user: User; accessToken: string }) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  login: (authData) => set({
    isAuthenticated: true,
    user: authData.user,
    accessToken: authData.accessToken,
  }),
  logout: async () => {
    await clearAllAuthDataFromStorage();
    set({ isAuthenticated: false, user: null, accessToken: null });
  },
  hydrate: async () => {
    const data = await getAuthDataFromStorage();
    if (data?.token?.accessToken && data?.user) {
      set({ isAuthenticated: true, user: data.user, accessToken: data.token.accessToken });
    }
  },
}));
