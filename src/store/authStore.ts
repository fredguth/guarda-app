import { create } from 'zustand';

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
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  login: (authData) => set({ 
    isAuthenticated: true, 
    user: authData.user, 
    accessToken: authData.accessToken 
  }),
}));
