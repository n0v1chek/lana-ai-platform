import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendMessageRequest,
  ChatResponse,
  Conversation,
  SubscriptionPlan,
  Payment,
  ApiError,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lanaaihelper.ru/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120 секунд для AI ответов
});

// Интерсептор для добавления токена
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Интерсептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========== AUTH API ==========

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login/json', data);
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch<User>('/auth/me', data);
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },
};

// ========== CHAT API ==========

export const chatApi = {
  send: async (data: SendMessageRequest): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/chat/send', {
      message: data.message,
      ai_model: data.model,
      conversation_id: data.conversation_id,
    });
    return response.data;
  },

  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/chat/conversations');
    return response.data;
  },

  getConversation: async (id: number): Promise<Conversation> => {
    const response = await api.get<Conversation>(`/chat/conversations/${id}`);
    return response.data;
  },

  deleteConversation: async (id: number): Promise<void> => {
    await api.delete(`/chat/conversations/${id}`);
  },

  // Новые методы для коинов
  getBalance: async (): Promise<{ balance: number; balance_rub: number }> => {
    const response = await api.get('/chat/balance');
    return response.data;
  },

  getModels: async (): Promise<{ balance: number; models: Array<{ model_id: string; price_per_1m_tokens: number }> }> => {
    const response = await api.get('/chat/models/available');
    return response.data;
  },

  getUsageStats: async (): Promise<{
    balance: number;
    balance_rub: number;
    month_stats: { total_tokens: number; total_coins_spent: number; total_requests: number };
  }> => {
    const response = await api.get('/chat/usage/stats');
    return response.data;
  },
};

// ========== SUBSCRIPTIONS API ==========

export const subscriptionsApi = {
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get<SubscriptionPlan[]>('/subscriptions/plans');
    return response.data;
  },

  getMySubscription: async (): Promise<{ plan: SubscriptionPlan; user: User }> => {
    const response = await api.get('/subscriptions/my-subscription');
    return response.data;
  },

  upgrade: async (planType: string): Promise<{ payment_url: string }> => {
    const response = await api.post('/subscriptions/upgrade', { plan_type: planType });
    return response.data;
  },
};

// ========== PAYMENTS API ==========

export const paymentsApi = {
  create: async (amount: number, planType: string): Promise<{ payment_url: string; payment_id: string }> => {
    const response = await api.post('/payments/create', { amount, plan_type: planType });
    return response.data;
  },

  getHistory: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments/history');
    return response.data;
  },
};

export default api;
