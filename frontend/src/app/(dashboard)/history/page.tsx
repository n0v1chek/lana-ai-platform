'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CatLogo } from '@/components/CatLogo';
import {
  ArrowLeft,
  MessageSquare,
  Trash2,
  Search,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { chatApi } from '@/lib/api';
import { Button, Input, Card } from '@/components/ui';
import type { Conversation } from '@/types';

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, fetchUser } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: number) => {
    if (!confirm('Удалить этот диалог?')) return;
    
    try {
      await chatApi.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lana-500 to-purple-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CatLogo size={28} />
          </div>
          <p className="text-slate-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={18} />}>
                Назад
              </Button>
            </Link>
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              История диалогов
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Поиск по диалогам..."
            leftIcon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Conversations List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-lana-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Загрузка диалогов...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <Card className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {searchQuery ? 'Ничего не найдено' : 'Нет диалогов'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {searchQuery
                ? 'Попробуйте изменить поисковый запрос'
                : 'Начните новый разговор с AI'}
            </p>
            <Link href="/chat">
              <Button>Начать чат</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conv) => (
              <Card
                key={conv.id}
                className="group hover:shadow-md transition-all duration-200"
                padding="md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lana-100 to-purple-100 dark:from-lana-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-lana-600 dark:text-lana-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 dark:text-white truncate">
                        {conv.title || 'Без названия'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={14} />
                        <span>{formatDate(conv.created_at)}</span>
                        <span>•</span>
                        <span>{conv.messages_count || 0} сообщений</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteConversation(conv.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <Link href={`/chat?id=${conv.id}`}>
                      <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={16} />}>
                        Открыть
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
