'use client';
import { useEffect, useState, useCallback } from 'react';
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
  const { isAuthenticated, isLoading: authLoading, isInitialized, fetchUser } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated, loadConversations]);

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

  if (authLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/chat">
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={18} />}>
                  Назад
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">История диалогов</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {conversations.length} {conversations.length === 1 ? 'диалог' : 'диалогов'}
                </p>
              </div>
            </div>
            <CatLogo size={40} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Input
            leftIcon={<Search size={18} />}
            placeholder="Поиск по диалогам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">
            Загрузка диалогов...
          </div>
        ) : filteredConversations.length === 0 ? (
          <Card className="text-center py-12">
            <MessageSquare size={48} className="mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              {searchQuery ? 'Диалоги не найдены' : 'У вас пока нет диалогов'}
            </p>
            <Link href="/chat">
              <Button>Начать диалог</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conv) => (
              <Card
                key={conv.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/chat?id=${conv.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <MessageSquare size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 dark:text-white truncate">
                        {conv.title || 'Новый диалог'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar size={14} />
                        <span>{formatDate(conv.updated_at)}</span>
                        <span>•</span>
                        <span>{conv.messages_count || 0} сообщений</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                    <ChevronRight size={20} className="text-slate-400" />
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
