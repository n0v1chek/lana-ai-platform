import { create } from 'zustand';
import type { Message, Conversation, AIModel } from '@/types';
import { chatApi } from '@/lib/api';
import { useAuthStore } from './authStore';

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  selectedModel: AIModel;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  lastCoinsSpent: number | null;

  // Actions
  setSelectedModel: (model: AIModel) => void;
  sendMessage: (content: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadConversation: (id: number) => Promise<void>;
  newConversation: () => void;
  deleteConversation: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  selectedModel: 'google/gemini-2.0-flash-001',
  isLoading: false,
  isSending: false,
  error: null,
  lastCoinsSpent: null,

  setSelectedModel: (model: AIModel) => {
    set({ selectedModel: model });
  },

  sendMessage: async (content: string) => {
    const { selectedModel, currentConversation, messages } = get();

    // Добавляем сообщение пользователя сразу
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    set({
      messages: [...messages, userMessage],
      isSending: true,
      error: null,
      lastCoinsSpent: null,
    });

    try {
      const response = await chatApi.send({
        message: content,
        model: selectedModel,
        conversation_id: currentConversation?.id,
      });

      // Добавляем ответ ассистента
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.assistant_message?.content || response.response || '',
        model: selectedModel,
        tokens_used: response.assistant_message?.tokens_used || response.tokens_used,
        created_at: new Date().toISOString(),
      };

      // Обновляем баланс в authStore
      if (response.balance_remaining !== undefined) {
        useAuthStore.getState().updateUser({ balance: response.balance_remaining });
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        currentConversation: state.currentConversation
          ? { ...state.currentConversation, id: response.conversation_id }
          : {
              id: response.conversation_id,
              title: content.slice(0, 50),
              model: selectedModel,
              messages: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
        isSending: false,
        lastCoinsSpent: response.coins_spent || null,
      }));
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: unknown } } };
      let errorMessage = 'Ошибка отправки сообщения';
      
      if (axiosError.response?.data?.detail) {
        const detail = axiosError.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (typeof detail === 'object' && detail !== null && 'error' in detail) {
          errorMessage = (detail as { error: string }).error;
        }
      }
      
      set({
        error: errorMessage,
        isSending: false,
      });
    }
  },

  loadConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const conversations = await chatApi.getConversations();
      set({ conversations, isLoading: false });
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      set({
        error: axiosError.response?.data?.detail || 'Ошибка загрузки диалогов',
        isLoading: false,
      });
    }
  },

  loadConversation: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const conversation = await chatApi.getConversation(id);
      set({
        currentConversation: conversation,
        messages: conversation.messages || [],
        isLoading: false,
      });
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      set({
        error: axiosError.response?.data?.detail || 'Ошибка загрузки диалога',
        isLoading: false,
      });
    }
  },

  newConversation: () => {
    set({
      currentConversation: null,
      messages: [],
      error: null,
      lastCoinsSpent: null,
    });
  },

  deleteConversation: async (id: number) => {
    try {
      await chatApi.deleteConversation(id);
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
        currentConversation:
          state.currentConversation?.id === id ? null : state.currentConversation,
        messages: state.currentConversation?.id === id ? [] : state.messages,
      }));
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      set({
        error: axiosError.response?.data?.detail || 'Ошибка удаления диалога',
      });
    }
  },

  clearError: () => set({ error: null }),
}));
