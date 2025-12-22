'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import {
  Users, BarChart3, Database, Shield, ArrowLeft, Search,
  RefreshCw, Ban, Unlock, Trash2, DollarSign,
  Banknote, Eye, Bell, AlertTriangle,
  TrendingUp, Coins, MessageSquare, Menu,
  ChevronLeft, ChevronRight, X, Save, Activity, Send
} from 'lucide-react';
import { Button, Card } from '@/components/ui';

interface CombinedStats {
  period_days: number;
  rates: { cbr: number; selling: number };
  users: {
    total: number;
    new_today: number;
    new_week: number;
    blocked: number;
    paid: number;
    active_period: number;
    conversion_percent: number;
  };
  finance: {
    total_balance_coins: number;
    total_balance_rub: number;
    total_deposited_coins: number;
    total_deposited_rub: number;
    total_spent_coins: number;
    total_spent_rub: number;
    payments_period: number;
    payments_period_rub: number;
    payments_today: number;
    payments_today_rub: number;
  };
  usage: {
    requests: number;
    tokens: number;
    tokens_millions: number;
    revenue_rub: number;
    cost_rub: number;
    profit_rub: number;
    margin_percent: number;
  };
  today: { requests: number; coins: number; tokens: number; rub: number };
  sources: Record<string, { requests: number; users: number; coins: number; rub: number }>;
  top_models: Array<{
    model: string;
    requests: number;
    tokens: number;
    revenue_rub: number;
    cost_rub: number;
    profit_rub: number;
    margin_percent: number;
  }>;
  registration_sources: Array<{ source: string; registrations: number; paid: number; conversion_percent: number }>;
  daily: Array<{ date: string; requests: number; users: number; coins: number; rub: number }>;
}

interface TelegramStats {
  period_days: number;
  summary: {
    telegram: { requests: number; unique_users: number; total_tokens: number; total_coins: number; total_rub: number; cost_usd: number; cost_rub: number };
    web: { requests: number; unique_users: number; total_tokens: number; total_coins: number; total_rub: number; cost_usd: number; cost_rub: number };
    telegram_share_percent: number;
  };
  today: { requests: number; users: number; coins: number; rub: number };
  yesterday: { requests: number; users: number; coins: number; rub: number };
  daily: Array<{ date: string; requests: number; unique_users: number; tokens: number; coins: number; rub: number }>;
  models: Array<{ model: string; requests: number; tokens: number; coins: number; rub: number }>;
  top_users: Array<{ username: string; requests: number; tokens: number; coins: number; rub: number }>;
  hourly: Record<number, number>;
}

interface UserData {
  id: number;
  username: string;
  email: string | null;
  balance: number;
  balance_rub: number;
  is_admin: boolean;
  is_blocked: boolean;
  block_reason: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  budget_period: string;
  budget_coins: number;
  daily_spent: number;
  total_deposited: number;
  total_spent: number;
  tokens_used: number;
  messages_count: number;
}

interface BannerData {
  enabled: boolean;
  text: string;
  type: string;
}

interface DbStats {
  counts: { users: number; conversations: number; messages: number; transactions: number };
  table_sizes: Array<{ table: string; size: string }>;
}

interface AdminLog {
  id: number;
  action: string;
  admin_username: string;
  target_user_id: number | null;
  target_username: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string | null;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string | null;
  model: string | null;
  tokens_used: number;
  created_at: string | null;
}

type TabType = 'dashboard' | 'telegram' | 'users' | 'banner' | 'database' | 'logs';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [periodDays, setPeriodDays] = useState(30);

  const [combinedStats, setCombinedStats] = useState<CombinedStats | null>(null);
  const [telegramStats, setTelegramStats] = useState<TelegramStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersSearch, setUsersSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [adjustBalanceOpen, setAdjustBalanceOpen] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [banner, setBanner] = useState<BannerData>({ enabled: false, text: '', type: 'info' });
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [editingRate, setEditingRate] = useState(false);
  const [newRate, setNewRate] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const getToken = () => {
    const authStorage = sessionStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        return parsed?.state?.token;
      } catch {}
    }
    return null;
  };

  const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    const res = await fetch(API_URL + endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        ...options.headers,
      },
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  };

  const { isInitialized, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isInitialized) {
      if (isAuthenticated && user?.is_admin) {
        setIsAdmin(true);
        loadCombinedStats();
        setLoading(false);
      } else if (isAuthenticated && !user?.is_admin) {
        setIsAdmin(false);
        setLoading(false);
      } else {
        checkAdmin();
      }
    }
  }, [isInitialized, isAuthenticated, user]);

  const checkAdmin = async () => {
    try {
      const user = await fetchApi('/auth/me');
      setIsAdmin(user.is_admin);
      if (user.is_admin) loadCombinedStats();
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadCombinedStats = async (days = periodDays) => {
    try {
      const data = await fetchApi('/admin/stats/combined?days=' + days);
      setCombinedStats(data);
    } catch (e) {
      console.error('Failed to load combined stats:', e);
    }
  };

  const loadTelegramStats = async (days = periodDays) => {
    try {
      const data = await fetchApi('/admin/telegram/stats?days=' + days);
      setTelegramStats(data);
    } catch (e) {
      console.error('Failed to load telegram stats:', e);
    }
  };

  const saveRate = async () => {
    const rate = parseFloat(newRate);
    if (isNaN(rate) || rate < 50 || rate > 500) {
      alert('Курс должен быть от 50 до 500');
      return;
    }
    try {
      await fetchApi('/admin/currency', {
        method: 'POST',
        body: JSON.stringify({ rate }),
      });
      setEditingRate(false);
      setNewRate('');
      loadCombinedStats(periodDays);
    } catch (e) {
      console.error('Failed to save rate:', e);
      alert('Ошибка сохранения курса');
    }
  };

  const loadUsers = async (page = 1, search = '') => {
    try {
      const data = await fetchApi('/admin/users?page=' + page + '&per_page=20&search=' + search);
      setUsers(data.users);
      setUsersTotal(data.total);
      setUsersPage(page);
    } catch (e) {
      console.error('Failed to load users:', e);
    }
  };

  const loadUserDetail = async (userId: number) => {
    try {
      const data = await fetchApi('/admin/users/' + userId);
      setSelectedUser(data.user);
      setUserTransactions(data.transactions || []);
      setUserDetailOpen(true);
    } catch (e) {
      console.error('Failed to load user detail:', e);
    }
  };

  const loadBanner = async () => {
    try {
      const data = await fetchApi('/admin/settings/banner');
      setBanner(data);
    } catch (e) {
      console.error('Failed to load banner:', e);
    }
  };

  const saveBanner = async () => {
    try {
      await fetchApi('/admin/settings/banner', { method: 'POST', body: JSON.stringify(banner) });
      alert('Баннер сохранён');
    } catch (e) {
      console.error('Failed to save banner:', e);
    }
  };

  const loadDbStats = async () => {
    try {
      const data = await fetchApi('/admin/database/stats');
      setDbStats(data);
    } catch (e) {
      console.error('Failed to load db stats:', e);
    }
  };

  const loadLogs = async () => {
    try {
      const data = await fetchApi('/admin/logs?limit=50');
      setLogs(data.logs || []);
    } catch (e) {
      console.error('Failed to load logs:', e);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    if (tab === 'dashboard') loadCombinedStats(periodDays);
    if (tab === 'telegram') loadTelegramStats(periodDays);
    if (tab === 'users') loadUsers();
    if (tab === 'banner') loadBanner();
    if (tab === 'database') loadDbStats();
    if (tab === 'logs') loadLogs();
  };

  const handlePeriodChange = (days: number) => {
    setPeriodDays(days);
    if (activeTab === 'dashboard') loadCombinedStats(days);
    if (activeTab === 'telegram') loadTelegramStats(days);
  };

  const handleBlockUser = async (userId: number, block: boolean) => {
    const reason = block ? prompt('Причина блокировки:') : null;
    if (block && !reason) return;
    try {
      await fetchApi('/admin/users/' + userId + '/' + (block ? 'block' : 'unblock'), {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      loadUsers(usersPage, usersSearch);
      if (selectedUser?.id === userId) loadUserDetail(userId);
    } catch (e) {
      console.error('Failed to block/unblock user:', e);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Удалить пользователя? Это действие необратимо.')) return;
    try {
      await fetchApi('/admin/users/' + userId, { method: 'DELETE' });
      setUserDetailOpen(false);
      loadUsers(usersPage, usersSearch);
    } catch (e) {
      console.error('Failed to delete user:', e);
    }
  };

  const handleAdjustBalance = async () => {
    if (!selectedUser || !adjustReason) return;
    try {
      await fetchApi('/admin/users/' + selectedUser.id + '/adjust-balance', {
        method: 'POST',
        body: JSON.stringify({ amount: adjustAmount, reason: adjustReason }),
      });
      setAdjustBalanceOpen(false);
      setAdjustAmount(0);
      setAdjustReason('');
      loadUserDetail(selectedUser.id);
      loadUsers(usersPage, usersSearch);
    } catch (e) {
      console.error('Failed to adjust balance:', e);
    }
  };

  const handleCleanupMessages = async (days: number) => {
    if (!confirm('Удалить сообщения старше ' + days + ' дней?')) return;
    try {
      const result = await fetchApi('/admin/database/cleanup-old-messages?days=' + days, { method: 'POST' });
      alert('Удалено: ' + (result.deleted_messages || 0) + ' сообщений');
      loadDbStats();
    } catch (e) {
      console.error('Failed to cleanup messages:', e);
    }
  };

  const handleCleanupConversations = async () => {
    if (!confirm('Удалить пустые диалоги?')) return;
    try {
      const result = await fetchApi('/admin/database/cleanup-empty-conversations', { method: 'POST' });
      alert('Удалено: ' + (result.deleted_conversations || 0) + ' диалогов');
      loadDbStats();
    } catch (e) {
      console.error('Failed to cleanup conversations:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <p className="text-slate-500 dark:text-slate-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Доступ запрещён</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">У вас нет прав администратора</p>
          <Link href="/chat"><Button leftIcon={<ArrowLeft size={18} />}>Вернуться в чат</Button></Link>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Статистика', icon: BarChart3 },
    { id: 'telegram', label: 'Telegram', icon: Send },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'banner', label: 'Баннер', icon: Bell },
    { id: 'database', label: 'База данных', icon: Database },
    { id: 'logs', label: 'Логи', icon: Eye },
  ];

  const PeriodSelector = () => (
    <select
      value={periodDays}
      onChange={(e) => handlePeriodChange(Number(e.target.value))}
      className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
    >
      <option value={1}>Сегодня</option>
      <option value={3}>3 дня</option>
      <option value={7}>7 дней</option>
      <option value={14}>14 дней</option>
      <option value={30}>30 дней</option>
      <option value={60}>60 дней</option>
      <option value={90}>90 дней</option>
      <option value={180}>180 дней</option>
      <option value={365}>Год</option>
    </select>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <Menu size={24} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Админ-панель</span>
          </div>
          <Link href="/chat" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
          </Link>
        </div>
      </header>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 lg:translate-x-0 ' + (sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 dark:text-white">Админ-панель</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Lana AI Helper</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
              <X size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as TabType)}
              className={'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ' +
                (activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
            >
              <tab.icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700">
          <Link href="/chat" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Вернуться в чат</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8">
          
          {/* === DASHBOARD TAB === */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Статистика и аналитика</h2>
                <div className="flex items-center gap-2">
                  <PeriodSelector />
                  <Button size="sm" variant="secondary" onClick={() => loadCombinedStats(periodDays)} leftIcon={<RefreshCw size={16} />}>
                    Обновить
                  </Button>
                </div>
              </div>

              {combinedStats && (
                <>
                  {/* Курсы */}
                  <div className="flex flex-wrap items-center gap-4 text-sm bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                    <div><span className="text-slate-500">Курс ЦБ:</span> <span className="font-bold text-slate-900 dark:text-white">{combinedStats.rates.cbr}₽</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Курс продажи:</span>
                      {editingRate ? (
                        <>
                          <input
                            type="number"
                            value={newRate}
                            onChange={(e) => setNewRate(e.target.value)}
                            className="w-20 px-2 py-1 text-sm border rounded dark:bg-slate-700 dark:border-slate-600"
                            placeholder={String(combinedStats.rates.selling)}
                            min="50"
                            max="500"
                          />
                          <span>₽</span>
                          <button onClick={saveRate} className="text-green-600 hover:text-green-700"><Save size={16} /></button>
                          <button onClick={() => { setEditingRate(false); setNewRate(''); }} className="text-red-500 hover:text-red-600"><X size={16} /></button>
                        </>
                      ) : (
                        <>
                          <span className="font-bold text-slate-900 dark:text-white">{combinedStats.rates.selling}₽</span>
                          <button onClick={() => { setEditingRate(true); setNewRate(String(combinedStats.rates.selling)); }} className="text-blue-600 hover:text-blue-700 ml-1" title="Изменить курс">✏️</button>
                        </>
                      )}
                    </div>
                    <div><span className="text-slate-500">Маржа:</span> <span className="font-bold text-green-600">{combinedStats.usage.margin_percent}%</span></div>
                  </div>

                  {/* Основные метрики */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard icon={Users} label="Всего" value={combinedStats.users.total} color="blue" />
                    <StatCard icon={TrendingUp} label="Новых сегодня" value={combinedStats.users.new_today} color="green" />
                    <StatCard icon={DollarSign} label="Оплатили" value={combinedStats.users.paid} color="purple" />
                    <StatCard icon={Activity} label="Активных" value={combinedStats.users.active_period} color="cyan" />
                    <StatCard icon={Coins} label="Конверсия" value={combinedStats.users.conversion_percent + '%'} color="amber" />
                    <StatCard icon={Ban} label="Заблокировано" value={combinedStats.users.blocked} color="red" />
                  </div>

                  {/* Финансы */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <StatCard icon={Banknote} label="Баланс всех" value={combinedStats.finance.total_balance_rub.toFixed(0) + '₽'} color="blue" />
                    <StatCard icon={TrendingUp} label="Пополнено" value={combinedStats.finance.total_deposited_rub.toFixed(0) + '₽'} color="green" />
                    <StatCard icon={MessageSquare} label="Потрачено" value={combinedStats.finance.total_spent_rub.toFixed(0) + '₽'} color="amber" />
                    <StatCard icon={DollarSign} label="Прибыль" value={combinedStats.usage.profit_rub.toFixed(0) + '₽'} color="green" />
                    <StatCard icon={Coins} label="Платежей сегодня" value={combinedStats.finance.payments_today_rub.toFixed(0) + '₽'} color="purple" />
                  </div>

                  {/* Использование по источникам */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card padding="lg">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4">По источникам</h3>
                      <div className="space-y-4">
                        {Object.entries(combinedStats.sources).map(([source, data]) => (
                          <div key={source} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              {source === 'telegram' ? <Send size={20} className="text-blue-500" /> : <MessageSquare size={20} className="text-green-500" />}
                              <span className="font-medium text-slate-900 dark:text-white capitalize">{source}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-slate-900 dark:text-white">{data.requests} запросов</div>
                              <div className="text-sm text-slate-500">{data.users} юзеров • {data.rub}₽</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card padding="lg">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Источники регистраций</h3>
                      <div className="space-y-3">
                        {combinedStats.registration_sources.slice(0, 5).map((src, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400">{src.source}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-slate-900 dark:text-white">{src.registrations} рег.</span>
                              <span className="text-green-600">{src.paid} оплат.</span>
                              <span className={'px-2 py-0.5 rounded text-xs ' + (src.conversion_percent >= 10 ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600')}>{src.conversion_percent}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Топ моделей */}
                  <Card padding="lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Топ моделей</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Модель</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300">Запросов</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:table-cell">Токенов</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300">Выручка</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300 hidden md:table-cell">Себест.</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300">Прибыль</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300">Маржа</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {combinedStats.top_models.map((m, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                              <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{m.model}</td>
                              <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">{m.requests}</td>
                              <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400 hidden sm:table-cell">{(m.tokens / 1000).toFixed(1)}k</td>
                              <td className="px-4 py-3 text-sm text-right text-slate-900 dark:text-white">{m.revenue_rub.toFixed(2)}₽</td>
                              <td className="px-4 py-3 text-sm text-right text-slate-500 hidden md:table-cell">{m.cost_rub.toFixed(2)}₽</td>
                              <td className="px-4 py-3 text-sm text-right font-medium text-green-600">{m.profit_rub.toFixed(2)}₽</td>
                              <td className="px-4 py-3 text-sm text-right">
                                <span className={m.margin_percent >= 800 ? 'text-green-600 font-bold' : m.margin_percent >= 500 ? 'text-yellow-600' : 'text-red-600'}>
                                  {m.margin_percent.toFixed(0)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Динамика */}
                  <Card padding="lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Динамика по дням</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-300">Дата</th>
                            <th className="px-4 py-2 text-right text-sm text-slate-600 dark:text-slate-300">Запросов</th>
                            <th className="px-4 py-2 text-right text-sm text-slate-600 dark:text-slate-300">Юзеров</th>
                            <th className="px-4 py-2 text-right text-sm text-slate-600 dark:text-slate-300">Выручка</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {combinedStats.daily.slice(0, 7).map((d, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2 text-sm text-slate-900 dark:text-white">{d.date}</td>
                              <td className="px-4 py-2 text-sm text-right text-slate-600 dark:text-slate-400">{d.requests}</td>
                              <td className="px-4 py-2 text-sm text-right text-slate-600 dark:text-slate-400">{d.users}</td>
                              <td className="px-4 py-2 text-sm text-right text-green-600">{d.rub}₽</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* === TELEGRAM TAB === */}
          {activeTab === 'telegram' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">📱 Telegram бот</h2>
                <div className="flex items-center gap-2">
                  <PeriodSelector />
                  <Button size="sm" variant="secondary" onClick={() => loadTelegramStats(periodDays)} leftIcon={<RefreshCw size={16} />}>
                    Обновить
                  </Button>
                </div>
              </div>

              {telegramStats && (
                <>
                  {/* Сравнение Telegram vs Web */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card padding="lg" className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3 mb-4">
                        <Send size={24} className="text-blue-500" />
                        <h3 className="font-bold text-slate-900 dark:text-white">Telegram</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-slate-500">Запросов:</span><span className="font-bold text-slate-900 dark:text-white">{telegramStats.summary.telegram.requests}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Юзеров:</span><span className="font-bold text-slate-900 dark:text-white">{telegramStats.summary.telegram.unique_users}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Выручка:</span><span className="font-bold text-green-600">{telegramStats.summary.telegram.total_rub}₽</span></div>
                      </div>
                    </Card>

                    <Card padding="lg" className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3 mb-4">
                        <MessageSquare size={24} className="text-green-500" />
                        <h3 className="font-bold text-slate-900 dark:text-white">Web</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between"><span className="text-slate-500">Запросов:</span><span className="font-bold text-slate-900 dark:text-white">{telegramStats.summary.web.requests}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Юзеров:</span><span className="font-bold text-slate-900 dark:text-white">{telegramStats.summary.web.unique_users}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Выручка:</span><span className="font-bold text-green-600">{telegramStats.summary.web.total_rub}₽</span></div>
                      </div>
                    </Card>

                    <Card padding="lg">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Доля Telegram</h3>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <span className="text-3xl font-bold text-blue-600">{telegramStats.summary.telegram_share_percent}%</span>
                        </div>
                        <div className="overflow-hidden h-4 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                          <div style={{ width: telegramStats.summary.telegram_share_percent + '%' }} className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Сегодня vs Вчера */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={Send} label="Сегодня запросов" value={telegramStats.today.requests} color="blue" />
                    <StatCard icon={Users} label="Сегодня юзеров" value={telegramStats.today.users} color="green" />
                    <StatCard icon={Send} label="Вчера запросов" value={telegramStats.yesterday.requests} color="cyan" />
                    <StatCard icon={Coins} label="Сегодня выручка" value={telegramStats.today.rub + '₽'} color="amber" />
                  </div>

                  {/* Активность по часам */}
                  <Card padding="lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Активность по часам (МСК)</h3>
                    <div className="flex items-end gap-1 h-32">
                      {Array.from({ length: 24 }, (_, hour) => {
                        const count = telegramStats.hourly[hour] || 0;
                        const max = Math.max(...Object.values(telegramStats.hourly), 1);
                        const height = (count / max) * 100;
                        return (
                          <div key={hour} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t" 
                              style={{ height: height + '%', minHeight: count > 0 ? '4px' : '0' }}
                              title={hour + ':00 - ' + count + ' запросов'}
                            />
                            <span className="text-xs text-slate-400 mt-1">{hour}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Топ пользователей Telegram */}
                  <Card padding="lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Топ пользователей Telegram</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-300">Пользователь</th>
                            <th className="px-4 py-2 text-right text-sm text-slate-600 dark:text-slate-300">Запросов</th>
                            <th className="px-4 py-2 text-right text-sm text-slate-600 dark:text-slate-300">Токенов</th>
                            <th className="px-4 py-2 text-right text-sm text-slate-600 dark:text-slate-300">Потрачено</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {telegramStats.top_users.map((u, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                              <td className="px-4 py-2 text-sm font-medium text-slate-900 dark:text-white">{u.username}</td>
                              <td className="px-4 py-2 text-sm text-right text-slate-600 dark:text-slate-400">{u.requests}</td>
                              <td className="px-4 py-2 text-sm text-right text-slate-600 dark:text-slate-400">{(u.tokens / 1000).toFixed(1)}k</td>
                              <td className="px-4 py-2 text-sm text-right text-green-600">{u.rub}₽</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Модели в Telegram */}
                  <Card padding="lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Модели в Telegram</h3>
                    <div className="space-y-3">
                      {telegramStats.models.map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                          <span className="font-medium text-slate-900 dark:text-white">{m.model}</span>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-500">{m.requests} запросов</span>
                            <span className="text-green-600 font-medium">{m.rub}₽</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Динамика Telegram */}
                  <Card padding="lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Динамика по дням</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-300">Дата</th>
                            <th className="px-4 py-2 text-right text-sm text-slate-600 dark:text-slate-300">Запросов</th>
                            <th className="px-4 py-2 text-right text-sm text-slate-600 dark:text-slate-300">Юзеров</th>
                            <th className="px-4 py-2 text-right text-sm text-slate-600 dark:text-slate-300">Токенов</th>
                            <th className="px-4 py-2 text-right text-sm text-slate-600 dark:text-slate-300">Выручка</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {telegramStats.daily.slice(0, 7).map((d, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2 text-sm text-slate-900 dark:text-white">{d.date}</td>
                              <td className="px-4 py-2 text-sm text-right text-slate-600 dark:text-slate-400">{d.requests}</td>
                              <td className="px-4 py-2 text-sm text-right text-slate-600 dark:text-slate-400">{d.unique_users}</td>
                              <td className="px-4 py-2 text-sm text-right text-slate-600 dark:text-slate-400">{(d.tokens / 1000).toFixed(1)}k</td>
                              <td className="px-4 py-2 text-sm text-right text-green-600">{d.rub}₽</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}
              
              {!telegramStats && (
                <div className="text-center py-12">
                  <Send size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500">Загрузка статистики Telegram...</p>
                </div>
              )}
            </div>
          )}

          {/* === USERS TAB === */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Пользователи</h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Поиск..."
                      value={usersSearch}
                      onChange={(e) => setUsersSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadUsers(1, usersSearch)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <Button size="sm" onClick={() => loadUsers(1, usersSearch)}>Найти</Button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Пользователь</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:table-cell">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Баланс</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300 hidden md:table-cell">Статус</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{user.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 dark:text-white">{user.username}</span>
                              {user.is_admin && <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">admin</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hidden sm:table-cell">{user.email || '-'}</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">{user.balance_rub.toFixed(2)} ₽</td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            {user.is_blocked ? (
                              <span className="px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">Заблокирован</span>
                            ) : (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">Активен</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => loadUserDetail(user.id)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400" title="Подробнее">
                                <Eye size={16} />
                              </button>
                              <button onClick={() => handleBlockUser(user.id, !user.is_blocked)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400" title={user.is_blocked ? 'Разблокировать' : 'Заблокировать'}>
                                {user.is_blocked ? <Unlock size={16} /> : <Ban size={16} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Всего: {usersTotal}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => loadUsers(usersPage - 1, usersSearch)} disabled={usersPage <= 1} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50">
                      <ChevronLeft size={18} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Страница {usersPage}</span>
                    <button onClick={() => loadUsers(usersPage + 1, usersSearch)} disabled={users.length < 20} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50">
                      <ChevronRight size={18} className="text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === BANNER TAB === */}
          {activeTab === 'banner' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Информационный баннер</h2>
              <Card padding="lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={banner.enabled} onChange={(e) => setBanner({ ...banner, enabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-red-500"></div>
                    </label>
                    <span className="text-slate-900 dark:text-white font-medium">Показывать баннер</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Текст баннера</label>
                    <textarea value={banner.text} onChange={(e) => setBanner({ ...banner, text: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Введите текст баннера..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Тип баннера</label>
                    <select value={banner.type} onChange={(e) => setBanner({ ...banner, type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="info">Информация (синий)</option>
                      <option value="warning">Предупреждение (жёлтый)</option>
                      <option value="error">Ошибка (красный)</option>
                      <option value="success">Успех (зелёный)</option>
                    </select>
                  </div>
                  <Button onClick={saveBanner} leftIcon={<Save size={18} />}>Сохранить баннер</Button>
                </div>
              </Card>
            </div>
          )}

          {/* === DATABASE TAB === */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">База данных</h2>
                <Button size="sm" variant="secondary" onClick={loadDbStats} leftIcon={<RefreshCw size={16} />}>Обновить</Button>
              </div>
              {dbStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card padding="lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Количество записей</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Пользователи</span><span className="font-medium text-slate-900 dark:text-white">{dbStats.counts.users}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Диалоги</span><span className="font-medium text-slate-900 dark:text-white">{dbStats.counts.conversations}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Сообщения</span><span className="font-medium text-slate-900 dark:text-white">{dbStats.counts.messages}</span></div>
                      <div className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">Транзакции</span><span className="font-medium text-slate-900 dark:text-white">{dbStats.counts.transactions}</span></div>
                    </div>
                  </Card>
                  <Card padding="lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Размер таблиц</h3>
                    <div className="space-y-3">
                      {dbStats.table_sizes.map((t) => (
                        <div key={t.table} className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">{t.table}</span><span className="font-medium text-slate-900 dark:text-white">{t.size}</span></div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
              <Card padding="lg">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Очистка данных</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => handleCleanupMessages(90)}>Удалить сообщения старше 90 дней</Button>
                  <Button variant="secondary" onClick={() => handleCleanupMessages(30)}>Удалить сообщения старше 30 дней</Button>
                  <Button variant="secondary" onClick={handleCleanupConversations}>Удалить пустые диалоги</Button>
                </div>
              </Card>
            </div>
          )}

          {/* === LOGS TAB === */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Логи действий</h2>
                <Button size="sm" variant="secondary" onClick={loadLogs} leftIcon={<RefreshCw size={16} />}>Обновить</Button>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Время</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Админ</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Действие</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300 hidden md:table-cell">Цель</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{log.created_at ? new Date(log.created_at).toLocaleString() : '-'}</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{log.admin_username}</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{log.action}</span></td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">{log.target_username || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* User Detail Modal */}
      {userDetailOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Пользователь: {selectedUser.username}</h3>
              <button onClick={() => setUserDetailOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X size={20} className="text-slate-600 dark:text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate-500">ID:</span><span className="text-slate-900 dark:text-white">{selectedUser.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Email:</span><span className="text-slate-900 dark:text-white">{selectedUser.email || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Баланс:</span><span className="font-bold text-green-600">{selectedUser.balance_rub.toFixed(2)} ₽</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Потрачено:</span><span className="text-slate-900 dark:text-white">{(selectedUser.total_spent / 100).toFixed(2)} ₽</span></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate-500">Создан:</span><span className="text-slate-900 dark:text-white">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Бюджет:</span><span className="text-slate-900 dark:text-white">{selectedUser.budget_period}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Статус:</span><span className={selectedUser.is_blocked ? 'text-red-600' : 'text-green-600'}>{selectedUser.is_blocked ? 'Заблокирован' : 'Активен'}</span></div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Button size="sm" onClick={() => setAdjustBalanceOpen(true)} leftIcon={<DollarSign size={16} />}>Изменить баланс</Button>
              <Button size="sm" variant="secondary" onClick={() => handleBlockUser(selectedUser.id, !selectedUser.is_blocked)}>{selectedUser.is_blocked ? 'Разблокировать' : 'Заблокировать'}</Button>
              {!selectedUser.is_admin && <Button size="sm" variant="secondary" className="text-red-600" onClick={() => handleDeleteUser(selectedUser.id)}>Удалить</Button>}
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Последние транзакции</h4>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">Время</th>
                    <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">Тип</th>
                    <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300">Сумма</th>
                    <th className="px-3 py-2 text-left text-slate-600 dark:text-slate-300 hidden sm:table-cell">Описание</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {userTransactions.map(t => (
                    <tr key={t.id}>
                      <td className="px-3 py-2 text-slate-500">{t.created_at ? new Date(t.created_at).toLocaleString() : '-'}</td>
                      <td className="px-3 py-2"><span className={'px-2 py-0.5 rounded text-xs ' + (t.type === 'spend' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')}>{t.type}</span></td>
                      <td className="px-3 py-2 text-slate-900 dark:text-white">{t.amount > 0 ? '+' : ''}{t.amount}</td>
                      <td className="px-3 py-2 text-slate-500 hidden sm:table-cell">{t.description || t.model || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {adjustBalanceOpen && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Изменить баланс: {selectedUser.username}</h3>
            <p className="text-slate-500 mb-4">Текущий баланс: {selectedUser.balance_rub.toFixed(2)} ₽ ({selectedUser.balance} коинов)</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Изменение (коины, + или -)</label>
                <input type="number" value={adjustAmount} onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="например: 1000 или -500" />
                <p className="text-xs text-slate-500 mt-1">Новый баланс: {selectedUser.balance + adjustAmount} коинов ({((selectedUser.balance + adjustAmount) / 100).toFixed(2)} ₽)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Причина</label>
                <input type="text" value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Тестирование / Компенсация / Бонус..." />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAdjustBalance} disabled={!adjustReason}>Применить</Button>
                <Button variant="secondary" onClick={() => setAdjustBalanceOpen(false)}>Отмена</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    red: 'from-red-500 to-rose-600',
    purple: 'from-purple-500 to-violet-600',
    amber: 'from-amber-500 to-orange-600',
    cyan: 'from-cyan-500 to-teal-600',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <div className={'w-10 h-10 rounded-xl bg-gradient-to-br ' + (colors[color] || colors.blue) + ' flex items-center justify-center flex-shrink-0'}>
          <Icon size={20} className="text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-xl font-bold text-slate-900 dark:text-white truncate">{value}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{label}</div>
        </div>
      </div>
    </div>
  );
}
