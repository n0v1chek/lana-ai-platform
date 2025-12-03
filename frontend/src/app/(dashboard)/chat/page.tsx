'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CatLogo } from '@/components/CatLogo';
import {
  Plus,
  MessageSquare,
  Settings,
  LogOut,
  CreditCard,
  History,
  Menu,
  X,
  Coins,
  AlertCircle,
  Calendar,
  Wallet,
  Lock,
  Shield,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { ChatMessage, ChatInput, ModelSelector } from '@/components/chat';
import { Button } from '@/components/ui';

interface BudgetData {
  budget_period: string;
  budget_coins: number;
  daily_limit: number;
  daily_spent: number;
  daily_remaining: number;
  period_days: number;
  balance: number;
  can_send: boolean;
  message: string;
}

interface BannerData {
  enabled: boolean;
  text: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

const PERIOD_LABELS: Record<string, string> = {
  none: 'Без лимита',
  week: '1 неделя',
  two_weeks: '2 недели',
  three_weeks: '3 недели',
  month: 'Месяц',
};

const PERIOD_DAYS: Record<string, number> = {
  none: 0,
  week: 7,
  two_weeks: 14,
  three_weeks: 21,
  month: 30,
};

// Модели с поддержкой Vision (изображений)
const VISION_MODELS = new Set([
  'openai/gpt-4o',
  'openai/gpt-4o-mini',
  'anthropic/claude-3.5-sonnet',
  'anthropic/claude-sonnet-4',
  'anthropic/claude-opus-4',
  'anthropic/claude-3.5-haiku',
    'anthropic/claude-3.7-sonnet',
  'google/gemini-2.0-flash-001',
  'google/gemini-2.5-flash',
  'google/gemini-2.5-pro',
  'x-ai/grok-3',
]);

function ChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [budgetSettingsOpen, setBudgetSettingsOpen] = useState(false);
  
  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('none');
  const [budgetCoins, setBudgetCoins] = useState(0);
  const [budgetSaving, setBudgetSaving] = useState(false);
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState(49);
  const [topupLoading, setTopupLoading] = useState(false);

  const { user, isAuthenticated, isLoading: authLoading, isInitialized, fetchUser, logout } = useAuthStore();
  const {
    messages,
    conversations,
    selectedModel,
    isSending,
    error,
    lastCoinsSpent,
    setSelectedModel,
    sendMessage,
    loadConversations,
    loadConversation,
    newConversation,
    clearError,
  } = useChatStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const authStorage = sessionStorage.getItem('auth-storage');
      let token = null;
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.token;
        } catch {}
      }
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
      loadBudget();
    }
  }, [isAuthenticated, loadConversations]);

  // Загрузка диалога по id из URL
  useEffect(() => {
    const convId = searchParams.get('id');
    if (convId && isAuthenticated) {
      loadConversation(parseInt(convId));
    }
  }, [searchParams, isAuthenticated, loadConversation]);

  // Загрузка баннера
  useEffect(() => {
    const loadBanner = async () => {
      try {
        const url = (process.env.NEXT_PUBLIC_API_URL || '') + '/admin/settings/banner';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.enabled && data.text) {
            setBanner(data);
          }
        }
      } catch (e) {
        // Баннер не критичен
      }
    };
    loadBanner();
  }, []);

  const handleTopup = async () => {
    if (topupAmount < 49) {
      alert('Минимальная сумма 49₽');
      return;
    }
    setTopupLoading(true);
    try {
      const authStorage = sessionStorage.getItem('auth-storage');
      let token = null;
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.token;
        } catch {}
      }
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ amount: topupAmount })
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.confirmation_url;
      } else {
        const err = await res.json();
        alert(err.detail || 'Ошибка создания платежа');
      }
    } catch (e) {
      alert('Ошибка соединения');
    } finally {
      setTopupLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);
  useEffect(() => {
    if (lastCoinsSpent) {
      loadBudget();
    }
  }, [lastCoinsSpent]);

  const loadBudget = async () => {
    try {
      const authStorage = sessionStorage.getItem('auth-storage');
      let token = null;
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.token;
        } catch {}
      }
      const res = await fetch('/api/budget', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBudget(data);
        setSelectedPeriod(data.budget_period);
        setBudgetCoins(data.budget_coins || data.balance);
      }
    } catch {
      console.error('Failed to load budget');
    }
  };

  const saveBudget = async () => {
    try {
      setBudgetSaving(true);
      const authStorage = sessionStorage.getItem('auth-storage');
      let token = null;
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.token;
        } catch {}
      }
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          period: selectedPeriod,
          coins: selectedPeriod === 'none' ? 0 : budgetCoins,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBudget(data);
        setBudgetSettingsOpen(false);
      }
    } catch {
      console.error('Failed to save budget');
    } finally {
      setBudgetSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const balance = user?.balance || 0;
  const hasBalance = balance > 0;
  const canSend = budget ? budget.can_send : hasBalance;
  const dailyLimit = budget?.daily_limit || 0;
  
  const dailyRemaining = budget?.daily_remaining || balance;
  const hasBudgetLimit = budget?.budget_period !== 'none' && dailyLimit > 0;
  const previewDailyLimit = PERIOD_DAYS[selectedPeriod] > 0 ? Math.floor(budgetCoins / PERIOD_DAYS[selectedPeriod]) : 0;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <CatLogo size={80} />
          <p className="text-slate-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen h-[100dvh] flex bg-slate-50 dark:bg-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <CatLogo size={48} />
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="p-4">
            <Button onClick={newConversation} className="w-full" leftIcon={<Plus size={18} />}>Новый чат</Button>
          </div>
          <div className="flex-1"></div>















          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            {!hasBalance && (
              <Link href="/pricing" className="flex items-center gap-2 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                <AlertCircle size={16} /><span className="text-sm font-medium">Пополните баланс</span>
              </Link>
            )}
            {hasBudgetLimit && dailyRemaining === 0 && hasBalance && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-700 dark:text-orange-400">
                <Lock size={16} /><span className="text-sm">Дневной лимит исчерпан</span>
              </div>
            )}
            <div className="space-y-1">
              <Link href="/history" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <History size={18} className="text-slate-400" /><span className="text-sm text-slate-700 dark:text-slate-300">История</span>
              </Link>
              <Link href="/pricing" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <CreditCard size={18} className="text-slate-400" /><span className="text-sm text-slate-700 dark:text-slate-300">Пополнить</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Settings size={18} className="text-slate-400" /><span className="text-sm text-slate-700 dark:text-slate-300">Настройки</span>
              </Link>
              {user?.is_admin && (
                <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <Shield size={18} className="text-red-400" /><span className="text-sm text-red-600 dark:text-red-400">Админка</span>
                </Link>
              )}
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                <LogOut size={18} /><span className="text-sm">Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
      {budgetSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Лимит расходов</h3>
              </div>
              <button onClick={() => setBudgetSettingsOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X size={20} /></button>
            </div>
            <p className="text-sm text-slate-500 mb-4">Распределите коины на период. Каждый день будет доступен равный лимит.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Период</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PERIOD_LABELS).map(([value, label]) => (
                  <button key={value} onClick={() => { setSelectedPeriod(value); if (budgetCoins === 0) setBudgetCoins(balance); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedPeriod === value ? 'bg-lana-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>{label}</button>
                ))}
              </div>
            </div>
            {selectedPeriod !== 'none' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Бюджет на период (коинов)</label>
                  <input type="number" value={budgetCoins} onChange={(e) => setBudgetCoins(Math.max(0, Math.min(balance, parseInt(e.target.value) || 0)))} max={balance} className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                  <div className="flex justify-between mt-1"><span className="text-xs text-slate-500">Мин: 100</span><span className="text-xs text-slate-500">Ваш баланс: {balance}</span></div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4">
                  <div className="flex items-center gap-2 mb-2"><Calendar size={16} className="text-blue-500" /><span className="text-sm font-medium text-blue-700 dark:text-blue-300">Дневной лимит: {previewDailyLimit} коинов</span></div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">При достижении лимита чат заблокируется до следующего дня</p>
                </div>
              </>
            )}
            {selectedPeriod === 'none' && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Без лимита — используйте весь баланс как хотите</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={saveBudget} isLoading={budgetSaving} className="flex-1">Сохранить</Button>
              <Button variant="secondary" onClick={() => setBudgetSettingsOpen(false)}>Отмена</Button>
            </div>
          </div>
        </div>
      )}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><Menu size={20} /></button>
            <ModelSelector value={selectedModel} onChange={(model) => { setSelectedModel(model); loadBudget(); }} disabled={isSending} />
          </div>
          <div className="flex items-center gap-3">
            {lastCoinsSpent && <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg font-medium">-{lastCoinsSpent}</span>}
            <button onClick={() => setBudgetSettingsOpen(true)} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900 dark:text-white">{balance.toLocaleString()} коинов</div>
                {hasBudgetLimit && <div className="text-xs text-slate-500">Сегодня: <span className={dailyRemaining > 0 ? "text-green-600" : "text-red-600"}>{dailyRemaining}/{dailyLimit}</span></div>}
              </div>
              <Coins size={20} className="text-amber-500" />
            </button>
          </div>
        </header>
        {/* System Banner */}
        {banner && (
          <div className={`px-4 py-3 flex items-center gap-3 border-b ${
            banner.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' :
            banner.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300' :
            banner.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' :
            'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
          }`}>
            <Info className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{banner.text}</span>
          </div>
        )}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-sm text-red-700 dark:text-red-400 flex-1">{error}</p>
            <button onClick={clearError} className="text-red-500 hover:text-red-700"><X size={18} /></button>
          </div>
        )}
        {hasBudgetLimit && dailyRemaining === 0 && hasBalance && (
          <div className="mx-4 mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl flex items-center gap-3">
            <Lock className="text-orange-500 flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Дневной лимит исчерпан</p>
              <p className="text-xs text-orange-600 dark:text-orange-500">Попробуйте завтра или измените настройки лимита</p>
            </div>
            <button onClick={() => setBudgetSettingsOpen(true)} className="text-sm text-orange-600 dark:text-orange-400 underline">Изменить</button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">Чем могу помочь?</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8">{!hasBalance ? 'Пополните баланс чтобы начать общение с AI' : !canSend ? 'Дневной лимит исчерпан. Попробуйте завтра или измените настройки.' : 'Задайте любой вопрос — я постараюсь дать полезный ответ'}</p>
                {canSend ? (
                  <div className="grid gap-2">
                    {['Объясни квантовые вычисления простыми словами', 'Напиши код на Python для сортировки списка', 'Придумай идею для мобильного приложения'].map((prompt, i) => (
                      <button key={i} onClick={() => sendMessage(prompt)} className="text-left px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-lana-300 dark:hover:border-lana-600 transition-colors text-sm text-slate-600 dark:text-slate-400">{prompt}</button>
                    ))}
                  </div>
                ) : !hasBalance ? (
                  <Link href="/pricing"><Button size="lg">Пополнить баланс</Button></Link>
                ) : (
                  <Button size="lg" onClick={() => setBudgetSettingsOpen(true)}>Изменить лимит</Button>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-4 space-y-6">
              {messages.map((message) => (<ChatMessage key={message.id} message={message} />))}
              {isSending && (
                <div className="flex gap-4">
                  <CatLogo size={32} />
                  <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <p className="text-sm text-slate-500 mb-2">AI печатает ответ...</p><div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className="sticky bottom-0 z-30 bg-slate-50 dark:bg-slate-900 pb-safe">
        <p className="text-xs text-slate-400 text-center py-2">⚠️ AI может генерировать неточную информацию. Проверяйте важные факты.</p>
        <ChatInput 
          onSend={(msg, fileId, fileType) => sendMessage(msg, fileId, fileType)} 
          isLoading={isSending} 
          disabled={!canSend}
          supportsVision={VISION_MODELS.has(selectedModel)}
          supportsDocuments={VISION_MODELS.has(selectedModel)}
        />
      </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"><div className="text-center"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lana-500 to-purple-500 flex items-center justify-center mx-auto mb-4 animate-pulse"></div><p className="text-slate-500">Загрузка...</p></div></div>}>
      <ChatPageContent />
    </Suspense>
  );
}
