'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, BarChart3, Database, Shield, ArrowLeft, Search,
  RefreshCw, Ban, Unlock, Trash2, DollarSign,
  Banknote, Eye, Bell, AlertTriangle,
  TrendingUp, Coins, MessageSquare, Menu,
  ChevronLeft, ChevronRight, X, Save, Activity
} from 'lucide-react';
import { Button, Card } from '@/components/ui';

interface DashboardData {
  total_users: number;
  active_users_7d: number;
  blocked_users: number;
  new_users_today: number;
  total_balance_coins: number;
  total_balance_rub: number;
  total_deposits_coins: number;
  total_deposits_rub: number;
  total_spent_coins: number;
  total_spent_rub: number;
  total_tokens_used: number;
  profit_coins: number;
  profit_rub: number;
  today_deposits_coins: number;
  today_spent_coins: number;
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
  counts: {
    users: number;
    conversations: number;
    messages: number;
    transactions: number;
  };
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

interface MarginModel {
  model: string;
  requests: number;
  total_tokens: number;
  coins_charged: number;
  revenue_rub: number;
  cost_usd: number;
  cost_rub: number;
  profit_rub: number;
  margin_percent: number;
  avg_usd_rate: number;
  avg_tokens_per_request: number;
  avg_coins_per_request: number;
}

interface MarginAlert {
  type: string;
  model: string;
  margin_percent: number;
  message: string;
}

interface MarginData {
  period_days: number;
  current_usd_rate: number;
  cbr_rate: number;
  summary: {
    total_requests: number;
    total_tokens: number;
    total_revenue_coins: number;
    total_revenue_rub: number;
    total_cost_usd: number;
    total_cost_rub: number;
    total_profit_rub: number;
    average_margin_percent: number;
  };
  models: MarginModel[];
  alerts: MarginAlert[];
  alerts_count: number;
}
interface AnalyticsSource {
  source: string;
  registrations: number;
  paid_users: number;
  conversion_percent: number;
  total_deposited_coins: number;
  total_deposited_rub: number;
  total_spent_coins: number;
  avg_deposit_rub: number;
}
interface AnalyticsFunnel {
  stage: string;
  count: number;
  rate_percent: number;
}
interface AnalyticsData {
  period_days: number;
  summary: {
    total_registrations: number;
    total_paid_users: number;
    overall_conversion_percent: number;
    total_revenue_coins: number;
    total_revenue_rub: number;
  };
  sources: AnalyticsSource[];
}
interface FunnelData {
  period_days: number;
  funnel: AnalyticsFunnel[];
}

type TabType = 'dashboard' | 'analytics' | 'users' | 'monitoring' | 'banner' | 'database' | 'logs';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
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
  const [currencyInfo, setCurrencyInfo] = useState<any>(null);
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [marginData, setMarginData] = useState<MarginData | null>(null);
  const [marginDays, setMarginDays] = useState(7);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [analyticsDays, setAnalyticsDays] = useState(30);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const getToken = () => localStorage.getItem('token');

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

  useEffect(() => {
    checkAdmin();
  }, []);

  const loadCurrency = async () => {
    try {
      const data = await fetchApi("/admin/currency");
      if (data) {
        setCurrencyInfo(data);
      }
    } catch (e) {}
  };

  const checkAdmin = async () => {
    try {
      const user = await fetchApi('/auth/me');
      setIsAdmin(user.is_admin);
      if (user.is_admin) {
        loadDashboard();
        loadCurrency();
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const data = await fetchApi('/admin/dashboard');
      setDashboard(data);
    } catch (e) {
      console.error('Failed to load dashboard:', e);
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
      await fetchApi('/admin/settings/banner', {
        method: 'POST',
        body: JSON.stringify(banner),
      });
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

  const loadMarginData = async (days = 7) => {
    try {
      const data = await fetchApi('/admin/monitoring/margin?days=' + days);
      setMarginData(data);
    } catch (e) {
      console.error('Failed to load margin data:', e);
    }
  };
  const loadAnalytics = async (days = 30) => {
    try {
      const [sources, funnel] = await Promise.all([
        fetchApi("/admin/analytics/sources?days=" + days),
        fetchApi("/admin/analytics/funnel?days=" + days)
      ]);
      setAnalyticsData(sources);
      setFunnelData(funnel);
    } catch (e) {
      console.error("Failed to load analytics:", e);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    if (tab === 'dashboard') loadDashboard();
    if (tab === 'users') loadUsers();
    if (tab === 'monitoring') loadMarginData(marginDays);
    if (tab === 'banner') loadBanner();
    if (tab === 'database') loadDbStats();
    if (tab === 'logs') loadLogs();
    if (tab === 'analytics') loadAnalytics(analyticsDays);
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
      if (selectedUser?.id === userId) {
        loadUserDetail(userId);
      }
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
      const result = await fetchApi('/admin/database/cleanup-old-messages?days=' + days, {
        method: 'POST',
      });
      alert('Удалено: ' + (result.deleted_messages || 0) + ' сообщений');
      loadDbStats();
    } catch (e) {
      console.error('Failed to cleanup messages:', e);
    }
  };

  const handleCleanupConversations = async () => {
    if (!confirm('Удалить пустые диалоги?')) return;
    try {
      const result = await fetchApi('/admin/database/cleanup-empty-conversations', {
        method: 'POST',
      });
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
          <Link href="/chat">
            <Button leftIcon={<ArrowLeft size={18} />}>Вернуться в чат</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Статистика', icon: BarChart3 },
    { id: 'analytics', label: 'Аналитика', icon: TrendingUp },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'monitoring', label: 'Мониторинг', icon: Activity },
    { id: 'banner', label: 'Баннер', icon: Bell },
    { id: 'database', label: 'База данных', icon: Database },
    { id: 'logs', label: 'Логи', icon: Eye },
  ];

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

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

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
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Статистика</h2>
                <Button size="sm" variant="secondary" onClick={loadDashboard} leftIcon={<RefreshCw size={16} />}>
                  Обновить
                </Button>
              </div>

              {dashboard && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={Users} label="Всего пользователей" value={dashboard.total_users} color="blue" />
                  <StatCard icon={TrendingUp} label="Активных за 7 дней" value={dashboard.active_users_7d} color="green" />
                  <StatCard icon={Ban} label="Заблокировано" value={dashboard.blocked_users} color="red" />
                  <StatCard icon={Users} label="Новых сегодня" value={dashboard.new_users_today} color="purple" />
                  <StatCard icon={Coins} label="Баланс (₽)" value={dashboard.total_balance_rub.toFixed(0)} color="amber" />
                  <StatCard icon={TrendingUp} label="Потрачено (₽)" value={dashboard.total_spent_rub.toFixed(0)} color="green" />
                  <StatCard icon={MessageSquare} label="Токенов всего" value={(dashboard.total_tokens_used / 1000000).toFixed(1) + 'M'} color="blue" />
                  <StatCard icon={DollarSign} label="Прибыль (₽)" value={dashboard.profit_rub.toFixed(0)} color="green" />
                  {currencyInfo && (
                    <StatCard icon={Banknote} label="Курс USD/RUB" value={currencyInfo.usd_rate + '₽'} color="cyan" />
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Мониторинг маржи</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={marginDays}
                    onChange={(e) => {
                      setMarginDays(Number(e.target.value));
                      loadMarginData(Number(e.target.value));
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value={1}>1 день</option>
                    <option value={7}>7 дней</option>
                    <option value={30}>30 дней</option>
                    <option value={90}>90 дней</option>
                  </select>
                  <Button size="sm" variant="secondary" onClick={() => loadMarginData(marginDays)} leftIcon={<RefreshCw size={16} />}>
                    Обновить
                  </Button>
                </div>
              </div>

              {marginData && (
                <>
                  {/* Alerts */}
                  {marginData.alerts_count > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />
                        <span className="font-bold text-yellow-800 dark:text-yellow-200">Предупреждения ({marginData.alerts_count})</span>
                      </div>
                      <div className="space-y-2">
                        {marginData.alerts.map((alert, i) => (
                          <div key={i} className="text-sm text-yellow-700 dark:text-yellow-300">
                            • {alert.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={MessageSquare} label="Запросов" value={marginData.summary.total_requests} color="blue" />
                    <StatCard icon={TrendingUp} label="Выручка" value={marginData.summary.total_revenue_rub.toFixed(2) + '₽'} color="green" />
                    <StatCard icon={DollarSign} label="Себестоимость" value={marginData.summary.total_cost_rub.toFixed(2) + '₽'} color="amber" />
                    <StatCard icon={Coins} label="Прибыль" value={marginData.summary.total_profit_rub.toFixed(2) + '₽'} color="green" />
                  </div>

                  {/* Rate Info */}
                  <Card padding="md">
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div><span className="text-slate-500 dark:text-slate-400">Курс ЦБ:</span> <span className="font-medium text-slate-900 dark:text-white">{marginData.cbr_rate}₽</span></div>
                      <div><span className="text-slate-500 dark:text-slate-400">Курс продажи:</span> <span className="font-medium text-slate-900 dark:text-white">{marginData.current_usd_rate}₽</span></div>
                      <div><span className="text-slate-500 dark:text-slate-400">Средняя маржа:</span> <span className="font-bold text-green-600 dark:text-green-400">{marginData.summary.average_margin_percent}%</span></div>
                    </div>
                  </Card>

                  {/* Models Table */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Модель</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300">Запросов</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300 hidden md:table-cell">Токенов</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300">Выручка</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:table-cell">Себест.</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300">Прибыль</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-slate-600 dark:text-slate-300">Маржа</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {marginData.models.map((m, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                              <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{m.model}</td>
                              <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400">{m.requests}</td>
                              <td className="px-4 py-3 text-sm text-right text-slate-600 dark:text-slate-400 hidden md:table-cell">{(m.total_tokens / 1000).toFixed(1)}k</td>
                              <td className="px-4 py-3 text-sm text-right text-slate-900 dark:text-white">{m.revenue_rub.toFixed(2)}₽</td>
                              <td className="px-4 py-3 text-sm text-right text-slate-500 dark:text-slate-400 hidden sm:table-cell">{m.cost_rub.toFixed(2)}₽</td>
                              <td className="px-4 py-3 text-sm text-right font-medium text-green-600 dark:text-green-400">{m.profit_rub.toFixed(2)}₽</td>
                              <td className="px-4 py-3 text-sm text-right">
                                <span className={
                                  m.margin_percent >= 800 
                                    ? 'text-green-600 dark:text-green-400 font-bold' 
                                    : m.margin_percent >= 500 
                                      ? 'text-yellow-600 dark:text-yellow-400 font-medium'
                                      : 'text-red-600 dark:text-red-400 font-medium'
                                }>
                                  {m.margin_percent.toFixed(0)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {marginData.models.length === 0 && (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        Нет данных с себестоимостью за выбранный период
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

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

          {activeTab === 'banner' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Информационный баннер</h2>

              <Card padding="lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={banner.enabled}
                        onChange={(e) => setBanner({ ...banner, enabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-red-500"></div>
                    </label>
                    <span className="text-slate-900 dark:text-white font-medium">Показывать баннер</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Текст баннера</label>
                    <textarea
                      value={banner.text}
                      onChange={(e) => setBanner({ ...banner, text: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Введите текст баннера..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Тип баннера</label>
                    <select
                      value={banner.type}
                      onChange={(e) => setBanner({ ...banner, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
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

          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">База данных</h2>
                <Button size="sm" variant="secondary" onClick={loadDbStats} leftIcon={<RefreshCw size={16} />}>
                  Обновить
                </Button>
              </div>

              {dbStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card padding="lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Количество записей</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Пользователи</span>
                        <span className="font-medium text-slate-900 dark:text-white">{dbStats.counts.users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Диалоги</span>
                        <span className="font-medium text-slate-900 dark:text-white">{dbStats.counts.conversations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Сообщения</span>
                        <span className="font-medium text-slate-900 dark:text-white">{dbStats.counts.messages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Транзакции</span>
                        <span className="font-medium text-slate-900 dark:text-white">{dbStats.counts.transactions}</span>
                      </div>
                    </div>
                  </Card>

                  <Card padding="lg">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Размер таблиц</h3>
                    <div className="space-y-3">
                      {dbStats.table_sizes.map((t: { table: string; size: string }) => (
                        <div key={t.table} className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">{t.table}</span>
                          <span className="font-medium text-slate-900 dark:text-white">{t.size}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              <Card padding="lg">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Очистка данных</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => handleCleanupMessages(90)}>
                    Удалить сообщения старше 90 дней
                  </Button>
                  <Button variant="secondary" onClick={() => handleCleanupMessages(30)}>
                    Удалить сообщения старше 30 дней
                  </Button>
                  <Button variant="secondary" onClick={handleCleanupConversations}>
                    Удалить пустые диалоги
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Логи действий</h2>
                <Button size="sm" variant="secondary" onClick={loadLogs} leftIcon={<RefreshCw size={16} />}>
                  Обновить
                </Button>
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
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300 hidden lg:table-cell">Детали</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {log.created_at ? new Date(log.created_at).toLocaleString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{log.admin_username}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{log.action}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">{log.target_username || '-'}</td>
                          <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-500 hidden lg:table-cell">
                            {log.details ? JSON.stringify(log.details).slice(0, 50) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Аналитика источников</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={analyticsDays}
                    onChange={(e) => { setAnalyticsDays(Number(e.target.value)); loadAnalytics(Number(e.target.value)); }}
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value={7}>7 дней</option>
                    <option value={14}>14 дней</option>
                    <option value={30}>30 дней</option>
                    <option value={90}>90 дней</option>
                  </select>
                  <Button size="sm" variant="secondary" onClick={() => loadAnalytics(analyticsDays)} leftIcon={<RefreshCw size={16} />}>Обновить</Button>
                </div>
              </div>

              {analyticsData && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Users} label="Регистрации" value={analyticsData.summary.total_registrations} color="blue" />
                    <StatCard icon={DollarSign} label="Оплатили" value={analyticsData.summary.total_paid_users} color="green" />
                    <StatCard icon={TrendingUp} label="Конверсия" value={analyticsData.summary.overall_conversion_percent + "%"} color="purple" />
                    <StatCard icon={Coins} label="Выручка" value={analyticsData.summary.total_revenue_rub.toFixed(0) + " ₽"} color="amber" />
                  </div>

                  <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Источники трафика</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Источник</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Регистрации</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Оплатили</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Конверсия</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Выручка</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {analyticsData.sources.map((s, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                              <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{s.source}</td>
                              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.registrations}</td>
                              <td className="px-4 py-3 text-green-600 dark:text-green-400">{s.paid_users}</td>
                              <td className="px-4 py-3">
                                <span className={"px-2 py-1 rounded text-xs " + (s.conversion_percent >= 10 ? "bg-green-100 dark:bg-green-900/30 text-green-600" : s.conversion_percent >= 5 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" : "bg-slate-100 dark:bg-slate-700 text-slate-600")}>
                                  {s.conversion_percent}%
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-900 dark:text-white">{s.total_deposited_rub.toFixed(0)} ₽</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}

              {funnelData && (
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Воронка конверсий</h3>
                  <div className="space-y-3">
                    {funnelData.funnel.map((f, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-40 text-sm text-slate-600 dark:text-slate-400">{f.stage}</div>
                        <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden">
                          <div
                            className={"h-full rounded-full " + (i === 0 ? "bg-blue-500" : i === funnelData.funnel.length - 1 ? "bg-green-500" : "bg-purple-500")}
                            style={{ width: f.rate_percent + "%" }}
                          />
                        </div>
                        <div className="w-20 text-right text-sm font-medium text-slate-900 dark:text-white">{f.count}</div>
                        <div className="w-16 text-right text-sm text-slate-500 dark:text-slate-400">{f.rate_percent}%</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
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
              <button onClick={() => setUserDetailOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <X size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">ID:</span><span className="text-slate-900 dark:text-white">{selectedUser.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Email:</span><span className="text-slate-900 dark:text-white">{selectedUser.email || '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Баланс:</span><span className="font-bold text-green-600 dark:text-green-400">{selectedUser.balance_rub.toFixed(2)} ₽</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Потрачено:</span><span className="text-slate-900 dark:text-white">{(selectedUser.total_spent / 100).toFixed(2)} ₽</span></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Создан:</span><span className="text-slate-900 dark:text-white">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : '-'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Бюджет:</span><span className="text-slate-900 dark:text-white">{selectedUser.budget_period}</span></div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Статус:</span>
                  <span className={selectedUser.is_blocked ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                    {selectedUser.is_blocked ? 'Заблокирован' : 'Активен'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Button size="sm" onClick={() => setAdjustBalanceOpen(true)} leftIcon={<DollarSign size={16} />}>Изменить баланс</Button>
              <Button size="sm" variant="secondary" onClick={() => handleBlockUser(selectedUser.id, !selectedUser.is_blocked)}>
                {selectedUser.is_blocked ? 'Разблокировать' : 'Заблокировать'}
              </Button>
              {!selectedUser.is_admin && (
                <Button size="sm" variant="secondary" className="text-red-600" onClick={() => handleDeleteUser(selectedUser.id)}>Удалить</Button>
              )}
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
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{t.created_at ? new Date(t.created_at).toLocaleString() : '-'}</td>
                      <td className="px-3 py-2">
                        <span className={'px-2 py-0.5 rounded text-xs ' + (t.type === 'spend' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400')}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-900 dark:text-white">{t.amount > 0 ? '+' : ''}{t.amount}</td>
                      <td className="px-3 py-2 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{t.description || t.model || '-'}</td>
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
            <p className="text-slate-500 dark:text-slate-400 mb-4">Текущий баланс: {selectedUser.balance_rub.toFixed(2)} ₽ ({selectedUser.balance} коинов)</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Изменение (коины, + или -)</label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="например: 1000 или -500"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Новый баланс: {selectedUser.balance + adjustAmount} коинов ({((selectedUser.balance + adjustAmount) / 100).toFixed(2)} ₽)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Причина</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Тестирование / Компенсация / Бонус..."
                />
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
        <div className={'w-12 h-12 rounded-xl bg-gradient-to-br ' + (colors[color] || colors.blue) + ' flex items-center justify-center flex-shrink-0'}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl font-bold text-slate-900 dark:text-white truncate">{value}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{label}</div>
        </div>
      </div>
    </div>
  );
}
