import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '@/lib/api';
import type { User } from '@/types';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,
      isAuthenticated: false,
      error: null,

      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(data);
          sessionStorage.setItem('token', response.access_token);
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error: unknown) {
          const axiosError = error as { response?: { data?: { detail?: string } } };
          const message = axiosError.response?.data?.detail || 'Ошибка входа';
          set({ error: message, isLoading: false, isInitialized: true });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          sessionStorage.setItem('token', response.access_token);
          set({
            user: response.user,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error: unknown) {
          const axiosError = error as { response?: { data?: { detail?: string } } };
          const message = axiosError.response?.data?.detail || 'Ошибка регистрации';
          set({ error: message, isLoading: false, isInitialized: true });
          throw error;
        }
      },

      logout: () => {
        sessionStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      },

      fetchUser: async () => {
        const token = get().token || sessionStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, isLoading: false, isInitialized: true });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authApi.me();
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error: any) {
          const is401 = error?.response?.status === 401;

          if (is401) {
            sessionStorage.removeItem('token');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            set({
              isLoading: false,
              isInitialized: true,
            });
          }
        }
      },

      // Новый метод для инициализации
      initializeAuth: async () => {
        const state = get();
        // Если уже инициализировано - пропускаем
        if (state.isInitialized) return;
        
        // Если есть токен - проверяем его
        const token = state.token || sessionStorage.getItem('token');
        if (token) {
          await get().fetchUser();
        } else {
          set({ isInitialized: true, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token }),
      // Автоматически инициализируем после восстановления из storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          // После гидрации вызываем инициализацию
          state.initializeAuth();
        }
      },
    }
  )
);
