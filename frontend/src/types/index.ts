// Пользователь
export interface User {
  id: number;
  username: string;
  email: string | null;
  balance: number;
  is_admin?: boolean;
  balance_rub?: number;
  subscription_plan: string;
  subscription_type?: SubscriptionType;
  tokens_remaining?: number;
  messages_today?: number;
  daily_messages_limit?: number;
  created_at: string;
}

// Типы подписок
export type SubscriptionType = 'NONE' | 'MINI' | 'STARTER' | 'PRO' | 'BUSINESS';

// План подписки
export interface SubscriptionPlan {
  type: SubscriptionType;
  name: string;
  price: number;
  coins: number;
  tokens?: number;
  tokens_monthly?: number;
  messages_per_day?: number;
  daily_messages_limit?: number;
  models: string[];
  features: string[];
}

// AI Модели - теперь строки для гибкости
export type AIModel = string;

export interface AIModelInfo {
  id: string;
  model_id: string;
  name: string;
  description?: string;
  price_per_1m_tokens: number;
  price_per_1k_tokens?: number;
  available?: boolean;
}

// Сообщение в чате
export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  tokens_used?: number;
  coins_spent?: number;
  created_at: string;
}

// Диалог
export interface Conversation {
  id: number;
  title: string;
  model: string;
  messages: Message[];
  messages_count?: number;
  created_at: string;
  updated_at: string;
}

// Запрос на отправку сообщения
export interface SendMessageRequest {
  message: string;
  model: string;
  conversation_id?: number;
}

// Ответ от AI
export interface ChatResponse {
  response?: string;
  conversation_id: number;
  tokens_used?: number;
  tokens_remaining?: number;
  coins_spent?: number;
  balance_remaining?: number;
  user_message?: Message;
  assistant_message?: Message;
}

// Авторизация
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Платежи
export interface Payment {
  id: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  subscription_type?: SubscriptionType;
  coins_added?: number;
  created_at: string;
}

// API Error
export interface ApiError {
  detail: string | { error: string; balance?: number; topup_url?: string };
  status_code?: number;
}

// Состояние загрузки
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
