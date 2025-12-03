'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CatLogo } from '@/components/CatLogo';
import {
  ArrowLeft,
  Coins,
  Calculator,
  HelpCircle,
  ArrowRight,
  Zap,
  Brain,
  Globe,
  Bot,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button, Card } from '@/components/ui';

function formatCoinsShort(coins: number): string {
  // Показываем примерную цену за один ответ (~500 токенов = 1/2000 от 1M)
  const perMessage = Math.round(coins / 2000);
  if (perMessage < 1) return '~1';
  
  return '~' + perMessage;
}

// Иконки для моделей
const ICONS: Record<string, any> = {
  'Google': Globe,
  'Meta': Brain,
  'OpenAI': Zap,
  'Anthropic': Bot,
};

const COLORS: Record<string, string> = {
  'economy': 'text-blue-500',
  'standard': 'text-orange-500',
  'premium': 'text-amber-500',
  'ultra': 'text-red-500',
};

interface ModelData {
  name: string;
  provider: string;
  category: string;
  usd_price: number;
  coins: number;
}

interface PricesData {
  usd_rate: number;
  multiplier: number;
  models: ModelData[];
}

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, isInitialized, fetchUser } = useAuthStore();
  const [rubAmount, setRubAmount] = useState<string>('100');
  const [topupLoading, setTopupLoading] = useState(false);
  const [pricesData, setPricesData] = useState<PricesData | null>(null);
  const [pricesLoading, setPricesLoading] = useState(true);

  const loadPrices = useCallback(async () => {
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/payments/prices');
      if (res.ok) {
        setPricesData(await res.json());
      }
    } catch (e) {
      console.error('Failed to load prices:', e);
    } finally {
      setPricesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrices();
  }, [loadPrices]);

  const handleTopup = async () => {
    const amount = parseInt(rubAmount) || 0;
    if (amount < 49) {
      alert('Минимальная сумма 49₽');
      return;
    }
    setTopupLoading(true);
    try {
      const token = (() => {
      const authStorage = sessionStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          return parsed?.state?.token;
        } catch {}
      }
      return null;
    })();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || '') + '/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ amount: amount })
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
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatCoins = (coins: number) => {
    return new Intl.NumberFormat('ru-RU').format(coins);
  };

  const rubToCoins = (rub: number) => rub * 100;
  const coinsToRub = (coins: number) => coins / 100;

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

  const currentBalance = user?.balance || 0;

  const economyModels = pricesData?.models.filter(m => m.category === 'economy') || [];
  const standardModels = pricesData?.models.filter(m => m.category === 'standard') || [];
  const premiumModels = pricesData?.models.filter(m => m.category === 'premium') || [];
  const ultraModels = pricesData?.models.filter(m => m.category === 'ultra') || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={18} />}>
                Назад
              </Button>
            </Link>
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Пополнение баланса
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card className="mb-8 bg-gradient-to-r from-lana-500 to-purple-500 text-white" padding="lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Ваш баланс</p>
                <p className="font-display text-3xl font-bold">
                  {formatCoins(currentBalance)} коинов
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Эквивалент</p>
              <p className="font-display text-2xl font-bold">
                ≈ {formatPrice(coinsToRub(currentBalance))} ₽
              </p>
            </div>
          </div>
        </Card>

        <Card className="mb-8" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-lana-500" />
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Калькулятор коинов
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
                Сумма в рублях
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={rubAmount}
                  onChange={(e) => setRubAmount(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-lana-500 focus:border-transparent"
                  placeholder="100"
                  min="49"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">₽</span>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-400 hidden md:block" />

            <div className="flex-1 w-full">
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">
                Вы получите коинов
              </label>
              <div className="relative">
                <div className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-lg font-semibold">
                  {formatCoins(rubToCoins(parseFloat(rubAmount) || 0))}
                </div>
                <Coins className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
            <span className="font-semibold text-lana-600 dark:text-lana-400">1 ₽ = 100 коинов</span>
            {' • '}
            <span>Минимум 49₽</span>
          </p>

          <div className="mt-6 text-center">
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
              ⚠️ Отключите VPN перед оплатой — YooMoney блокирует иностранные IP
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={handleTopup}
              disabled={topupLoading}
            >
              Пополнить на {rubAmount || 0}₽
            </Button>
          </div>
        </Card>

        <Card className="mb-8" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-lana-500" />
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Стоимость моделей
            </h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Цена зависит от модели и длины ответа. Показана примерная стоимость одного ответа.
          </p>

          {/* Economy */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">💚 Экономичные</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {economyModels.map((model) => (
                <div key={model.name} className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                  {(() => { const Icon = ICONS[model.provider] || Globe; return <Icon className={`w-5 h-5 ${COLORS[model.category]}`} />; })()}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{model.name}</p>
                    <p className="text-xs text-slate-500">{model.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 dark:text-green-400 text-sm">{formatCoinsShort(model.coins)}/ответ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Standard */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2">💛 Стандартные</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {standardModels.map((model) => (
                <div key={model.name} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                  {(() => { const Icon = ICONS[model.provider] || Globe; return <Icon className={`w-5 h-5 ${COLORS[model.category]}`} />; })()}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{model.name}</p>
                    <p className="text-xs text-slate-500">{model.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-yellow-600 dark:text-yellow-400 text-sm">{formatCoinsShort(model.coins)}/ответ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">🧡 Премиум</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {premiumModels.map((model) => (
                <div key={model.name} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                  {(() => { const Icon = ICONS[model.provider] || Globe; return <Icon className={`w-5 h-5 ${COLORS[model.category]}`} />; })()}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{model.name}</p>
                    <p className="text-xs text-slate-500">{model.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600 dark:text-orange-400 text-sm">{formatCoinsShort(model.coins)}/ответ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ultra */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">❤️ Ультра</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {ultraModels.map((model) => (
                <div key={model.name} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                  {(() => { const Icon = ICONS[model.provider] || Globe; return <Icon className={`w-5 h-5 ${COLORS[model.category]}`} />; })()}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{model.name}</p>
                    <p className="text-xs text-slate-500">{model.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600 dark:text-red-400 text-sm">{formatCoinsShort(model.coins)}/ответ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500 text-center">
            Полный список моделей доступен в чате при выборе модели
          </p>
        </Card>

        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
          Частые вопросы
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Card padding="md">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Что такое коины?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Коины — внутренняя валюта платформы. 1 рубль = 100 коинов.
              Списываются за каждое сообщение.
            </p>
          </Card>

          <Card padding="md">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Сколько стоит сообщение?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Экономичные: ~10-70 коинов. Стандартные: ~30-180. Премиум: ~250-450. Ультра: ~900-17000. Точная сумма зависит от длины диалога.
            </p>
          </Card>

          <Card padding="md">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              Коины сгорают?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Нет! Коины бессрочны и остаются на балансе до использования.
            </p>
          </Card>

          </div>
      </main>
    </div>
  );
}
