'use client';

import { CatLogo } from '@/components/CatLogo';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ArrowRight,
  MessageSquare,
  Zap,
  Shield,
  Globe,
  Sparkles,


  Copy,
  CheckCheck,


  Mail,
  Wallet,
  Lock,
  UserX,
  Headphones,
  TrendingUp,
  FileText,
  ShoppingCart,
  Calendar,
  BarChart3,
  MessageCircle,
  Megaphone,
  BookOpen,
  Settings,

  Rocket,
} from 'lucide-react';

const features = [
  {
    icon: Rocket,
    title: 'Старт от 49₽',
    description: 'Начните использовать AI всего за 49 рублей — хватит на десятки сообщений',
  },
  {
    icon: MessageSquare,
    title: 'Умный чат',
    description: 'Общайтесь с AI на любые темы — от помощи с кодом до творческих задач',
  },
  {
    icon: Zap,
    title: 'Лучшие AI модели',
    description: 'GPT-4o, Claude, Gemini, Llama и все передовые модели в одном месте',
  },
  {
    icon: Wallet,
    title: 'Без подписок',
    description: 'Пополняйте баланс когда удобно, коины не сгорают',
  },
  {
    icon: Shield,
    title: 'Полная приватность',
    description: 'Минимум данных — только необходимое для безопасности',
  },
  {
    icon: Globe,
    title: 'Доступ 24/7',
    description: 'Работает круглосуточно без ограничений по времени',
  },
];

const businessServices = [
  {
    icon: Headphones,
    title: 'Клиентская поддержка 24/7',
    description: 'AI-бот отвечает на вопросы клиентов мгновенно, без выходных и перерывов',
    color: 'bg-blue-500',
  },
  {
    icon: TrendingUp,
    title: 'Автоматизация продаж',
    description: 'AI квалифицирует лиды, отвечает на возражения и ведёт клиента к покупке',
    color: 'bg-green-500',
  },
  {
    icon: FileText,
    title: 'Генерация контента',
    description: 'Посты для соцсетей, статьи, описания товаров, email-рассылки за минуты',
    color: 'bg-purple-500',
  },
  {
    icon: ShoppingCart,
    title: 'Консультант по товарам',
    description: 'AI помогает выбрать товар, сравнивает характеристики, отвечает на вопросы',
    color: 'bg-orange-500',
  },
  {
    icon: Calendar,
    title: 'Запись и бронирование',
    description: 'Автоматическая запись клиентов, напоминания, управление расписанием',
    color: 'bg-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Аналитика и отчёты',
    description: 'AI анализирует данные, находит инсайты и готовит понятные отчёты',
    color: 'bg-cyan-500',
  },
  {
    icon: MessageCircle,
    title: 'Чат-боты для мессенджеров',
    description: 'Интеграция в Telegram, WhatsApp, VK — там, где ваши клиенты',
    color: 'bg-indigo-500',
  },
  {
    icon: Megaphone,
    title: 'Маркетинг и реклама',
    description: 'Генерация рекламных текстов, A/B тесты, анализ конкурентов',
    color: 'bg-red-500',
  },
  {
    icon: BookOpen,
    title: 'Обучение сотрудников',
    description: 'AI-наставник отвечает на вопросы новичков и помогает в онбординге',
    color: 'bg-amber-500',
  },
  {
    icon: Settings,
    title: 'Кастомные решения',
    description: 'Разработаем AI-агента под ваши уникальные бизнес-процессы',
    color: 'bg-slate-500',
  },
];

export default function HomePage() {
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  useEffect(() => {
    const accepted = sessionStorage.getItem('privacy-accepted');
    if (!accepted) {
      setShowPrivacyNotice(true);
    }
  }, []);

  const acceptPrivacy = () => {
    sessionStorage.setItem('privacy-accepted', 'true');
    setShowPrivacyNotice(false);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('support@lanaaihelper.ru');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Privacy Notice Modal */}
      {showPrivacyNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Ваша приватность защищена
              </h3>
            </div>
            
            <div className="space-y-3 mb-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Не собираем персональные данные</strong> — логин, email и пароль для безопасного доступа</span>
              </div>
              <div className="flex items-start gap-2">
                <UserX className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Не используем cookies для отслеживания</strong> — никакой рекламы и аналитики</span>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span><strong>Не храним ваши диалоги</strong> — общение с AI остаётся приватным</span>
              </div>
            </div>
            
            <button
              onClick={acceptPrivacy}
              className="w-full px-4 py-3 bg-lana-500 text-white font-medium rounded-xl hover:bg-lana-600 transition-colors"
            >
              Понятно, продолжить
            </button>
            
            <p className="mt-3 text-xs text-slate-500 text-center">
              Продолжая, вы соглашаетесь с <Link href="/terms" className="text-lana-500 hover:underline">Офертой</Link>, <Link href="/privacy" className="text-lana-500 hover:underline">Политикой конфиденциальности</Link> и <Link href="/cookies" className="text-lana-500 hover:underline">Политикой cookies</Link>
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CatLogo size={24} />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              Возможности
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              Как это работает
            </a>
            <Link href="/business" className="text-purple-600 font-medium hover:text-purple-700 transition-colors border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50">
              Для бизнеса
            </Link>
            <Link href="/blog" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              Блог
            </Link>
            <Link href="/about" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              О нас
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="hidden sm:block px-3 py-1.5 text-sm font-medium bg-lana-500 text-white rounded-xl hover:bg-lana-600 transition-colors"
            >
              Регистрация
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4">
            <nav className="flex flex-col space-y-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white py-2">Возможности</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white py-2">Как это работает</a>
              <Link href="/business" onClick={() => setMobileMenuOpen(false)} className="text-purple-600 font-medium py-2">Для бизнеса</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white py-2">Блог</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white py-2">О нас</Link>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                <Link href="/login" className="flex-1 text-center py-2 border border-slate-300 rounded-xl">Войти</Link>
                <Link href="/register" className="flex-1 text-center py-2 bg-lana-500 text-white rounded-xl">Регистрация</Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-lana-100 dark:bg-lana-900/30 text-lana-700 dark:text-lana-300 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Лучшие AI модели мира • Старт от 49₽
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Ваш умный AI-помощник
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lana-500 to-purple-500">
              {' '}для любых задач
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Общайтесь с лучшими AI-моделями мира. Без подписок — пополняйте баланс 
            и платите только за отправленные сообщения.
          </p>

          {/* Slogan Banner */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
              <Lock className="w-4 h-4" />
              Полная приватность
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              <UserX className="w-4 h-4" />
              Не храним данные
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              <Wallet className="w-4 h-4" />
              Вы решаете сколько платить
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium bg-lana-500 text-white rounded-xl hover:bg-lana-600 hover:shadow-lg hover:shadow-lana-500/25 transition-all"
            >
              Начать за 49₽
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Как это работает
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Минимум данных для регистрации — и email для восстановления доступа
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-100 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Почему выбирают LANA AI
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Мы объединили лучшие AI-модели в одном удобном интерфейсе
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-lana-100 dark:bg-lana-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-lana-600 dark:text-lana-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Как это работает
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl mx-auto">
              Никаких подписок и ежемесячных платежей. Вы сами решаете сколько потратить 
              и какие модели использовать.
            </p>
          </div>
          
          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-lana-100 dark:bg-lana-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-lana-600">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Пополните баланс</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                От 49₽ до любой суммы. Коины не сгорают — используйте когда удобно
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-lana-100 dark:bg-lana-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-lana-600">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Выберите AI модель</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Все популярные модели: от экономичных до премиум. Цена видна сразу
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-lana-100 dark:bg-lana-900/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-lana-600">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Платите за сообщения</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Коины списываются только за отправленные сообщения. 1₽ = 100 коинов
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium bg-lana-500 text-white rounded-xl hover:bg-lana-600 hover:shadow-lg hover:shadow-lana-500/25 transition-all"
            >
              Начать за 49₽
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section id="business" className="py-20 bg-slate-100 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              AI-агенты для бизнеса
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Автоматизируйте рутину и увеличьте продажи с помощью AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-12">
            {businessServices.map((service) => (
              <div
                key={service.title}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-xl ${service.color} flex items-center justify-center mb-3`}>
                  <service.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-lana-500 to-purple-500 rounded-2xl p-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="font-display text-2xl font-bold text-white mb-4 text-center">
                Нужен AI-агент для вашего бизнеса?
              </h3>
              <p className="text-white/80 mb-6 text-center">
                Оставьте заявку или узнайте подробнее о наших решениях
              </p>
              
              <form 
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  try {
                    const res = await fetch('/api/contact', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: formData.get('biz_name'),
                        contact: formData.get('biz_contact'),
                        task: 'Заявка с главной страницы'
                      })
                    });
                    if (res.ok) {
                      alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                      form.reset();
                    } else {
                      alert('Ошибка отправки. Попробуйте позже.');
                    }
                  } catch {
                    alert('Ошибка сети. Попробуйте позже.');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <input
                  type="text"
                  name="biz_name"
                  required
                  placeholder="Имя или компания"
                  className="flex-1 px-4 py-3 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/50"
                />
                <input
                  type="text"
                  name="biz_contact"
                  required
                  placeholder="Email или Telegram"
                  className="flex-1 px-4 py-3 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors whitespace-nowrap"
                >
                  Отправить
                </button>
              </form>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/business"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-colors"
                >
                  Подробнее об услугах
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/30 hover:border-white/50 text-white font-medium rounded-xl transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {copied ? 'Скопировано!' : 'support@lanaaihelper.ru'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-lana-500 to-purple-500 rounded-3xl p-12 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Готовы попробовать?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Начните общаться с AI уже сегодня — всего от 49₽
            </p>
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-lana-600 font-semibold rounded-xl hover:bg-slate-100 transition-colors text-lg"
            >
              Создать аккаунт
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CatLogo size={20} />
            </div>

            <nav className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/contacts" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Контакты
              </Link>
              <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Условия
              </Link>
              <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Конфиденциальность
              </Link>
              <Link href="/cookies" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Cookies
              </Link>
            </nav>

            <p className="text-sm text-slate-500">
              © 2025 LANA AI Helper. ИНН 263109568337
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
