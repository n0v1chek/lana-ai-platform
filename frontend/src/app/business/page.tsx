"use client";

import { CatLogo } from "@/components/CatLogo";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
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
  Zap,
  Shield,
  Clock,
  Users,
  Brain,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Building2,
  Store,
  GraduationCap,
  Stethoscope,
  Scale,
  Truck,
  Utensils,
  Home,
  Wrench,
  Camera,
  Palette,
  Code,
  Globe,
  Mail,
  Send,
  Check,
} from "lucide-react";

const services = [
  {
    icon: Headphones,
    title: "Клиентская поддержка 24/7",
    description: "AI-бот мгновенно отвечает на вопросы клиентов в любое время. Обрабатывает типовые обращения, снижает нагрузку на операторов.",
    features: ["Ответы за секунды", "Без выходных", "Обучение на ваших данных"],
  },
  {
    icon: TrendingUp,
    title: "Автоматизация продаж",
    description: "AI квалифицирует лиды, отвечает на возражения, консультирует по товарам и ведёт клиента к покупке.",
    features: ["Квалификация лидов", "Работа с возражениями", "Персональные рекомендации"],
  },
  {
    icon: FileText,
    title: "Генерация контента",
    description: "Посты для соцсетей, статьи для блога, описания товаров, email-рассылки — за минуты вместо часов.",
    features: ["Уникальные тексты", "Ваш tone of voice", "Любые форматы"],
  },
  {
    icon: ShoppingCart,
    title: "Консультант по товарам",
    description: "AI помогает клиентам выбрать товар, сравнивает характеристики, отвечает на вопросы о наличии и доставке.",
    features: ["Знание каталога", "Подбор по параметрам", "Upsell и cross-sell"],
  },
  {
    icon: Calendar,
    title: "Запись и бронирование",
    description: "Автоматическая запись клиентов на услуги, напоминания о визитах, управление расписанием.",
    features: ["Онлайн-запись 24/7", "SMS/email напоминания", "Синхронизация календарей"],
  },
  {
    icon: BarChart3,
    title: "Аналитика и отчёты",
    description: "AI анализирует данные, находит закономерности, готовит понятные отчёты. Превращает цифры в инсайты.",
    features: ["Автоматические отчёты", "Выявление трендов", "Рекомендации"],
  },
  {
    icon: MessageCircle,
    title: "Боты для мессенджеров",
    description: "Интеграция AI-ботов в Telegram, WhatsApp, VK — там, где уже находятся ваши клиенты.",
    features: ["Telegram, WhatsApp, VK", "Единая база знаний", "Передача оператору"],
  },
  {
    icon: Megaphone,
    title: "Маркетинг и реклама",
    description: "Генерация рекламных текстов, идеи для кампаний, A/B варианты, анализ конкурентов.",
    features: ["Рекламные тексты", "Идеи для кампаний", "Анализ конкурентов"],
  },
  {
    icon: BookOpen,
    title: "Обучение сотрудников",
    description: "AI-наставник отвечает на вопросы новичков, помогает в онбординге, объясняет процессы компании.",
    features: ["База знаний компании", "Ответы 24/7", "Тестирование знаний"],
  },
  {
    icon: Settings,
    title: "Кастомные решения",
    description: "Разработка AI-агентов под уникальные бизнес-процессы вашей компании. От идеи до внедрения.",
    features: ["Индивидуальный подход", "Интеграция с системами", "Полное сопровождение"],
  },
];

const industries = [
  { icon: Store, name: "Интернет-магазины", desc: "Консультации, подбор товаров" },
  { icon: Building2, name: "Услуги и сервис", desc: "Запись, поддержка клиентов" },
  { icon: Stethoscope, name: "Медицина и клиники", desc: "Запись к врачу, FAQ" },
  { icon: Scale, name: "Юридические услуги", desc: "Первичные консультации" },
  { icon: Home, name: "Недвижимость", desc: "Подбор объектов, просмотры" },
  { icon: Utensils, name: "Рестораны и кафе", desc: "Бронирование, меню, доставка" },
  { icon: Palette, name: "Салоны красоты", desc: "Онлайн-запись, напоминания" },
  { icon: Wrench, name: "Автосервисы", desc: "Запись, статус ремонта" },
  { icon: GraduationCap, name: "Образование", desc: "Ответы на вопросы, курсы" },
  { icon: Truck, name: "Логистика", desc: "Отслеживание, уведомления" },
  { icon: Camera, name: "Фото и видео", desc: "Бронирование, портфолио" },
  { icon: Code, name: "IT-компании", desc: "Техподдержка, документация" },
];

const advantages = [
  {
    icon: Brain,
    title: "Лучшие AI-модели мира",
    description: "GPT-4o, Claude, Gemini, DeepSeek, Grok — выбираем оптимальную модель под вашу задачу.",
  },
  {
    icon: Zap,
    title: "Быстрый запуск",
    description: "От первого контакта до работающего решения — дни, а не месяцы. Начинаем с MVP.",
  },
  {
    icon: Shield,
    title: "Приватность данных",
    description: "Ваши данные под контролем. Минимальный сбор информации, соответствие законодательству РФ.",
  },
  {
    icon: Users,
    title: "Персональный подход",
    description: "Работаем напрямую без посредников. Один контакт на всём протяжении проекта.",
  },
  {
    icon: Clock,
    title: "Работа 24/7/365",
    description: "AI не устаёт, не болеет, не уходит в отпуск. Клиенты получают помощь в любое время.",
  },
  {
    icon: Globe,
    title: "Доступ из России",
    description: "Все решения работают на территории РФ без VPN. Оплата в рублях, документы по РФ.",
  },
];

const steps = [
  {
    num: "01",
    title: "Обсуждение задачи",
    description: "Разбираемся в вашем бизнесе, процессах, болях. Определяем, где AI даст максимальный эффект.",
  },
  {
    num: "02",
    title: "Предложение решения",
    description: "Готовим концепцию: какие задачи решаем, какие модели используем, как интегрируем.",
  },
  {
    num: "03",
    title: "Разработка и настройка",
    description: "Создаём AI-решение, обучаем на ваших данных, настраиваем интеграции.",
  },
  {
    num: "04",
    title: "Запуск и поддержка",
    description: "Запускаем в работу, мониторим результаты, дорабатываем по обратной связи.",
  },
];

function SuccessModal() {
  const [showSuccess, setShowSuccess] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      window.history.replaceState({}, "", "/business");
    }
  }, [searchParams]);

  if (!showSuccess) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Заявка отправлена!</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Спасибо за обращение. Мы свяжемся с вами в ближайшее время.</p>
        <button
          onClick={() => setShowSuccess(false)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:opacity-90 transition font-semibold"
        >
          Отлично!
        </button>
      </div>
    </div>
  );
}

export default function BusinessPage() {
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("support@lanaaihelper.ru");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={null}>
        <SuccessModal />
      </Suspense>

      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <CatLogo size={80} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition">База знаний</Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition">О проекте</Link>
            <Link href="/contacts" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition">Контакты</Link>
            <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition">Войти</Link>
          </nav>
          <Link href="#contact-form" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition font-medium">
            Обсудить проект
          </Link>
        </div>
      </header>

      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-решения для бизнеса
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Автоматизируйте бизнес
            <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              с помощью нейросетей
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Внедряем AI в ваши процессы: чат-боты для клиентов, автоматизация продаж, генерация контента, аналитика данных. Работает из России без VPN.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#contact-form" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:opacity-90 transition font-semibold text-lg">
              Обсудить задачу
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#services" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition font-semibold text-lg">
              Смотреть услуги
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-white to-purple-50 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Почему выбирают нас</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Конкурентные преимущества, которые делают разницу</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((item, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-600 transition">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-16 px-4 scroll-mt-20 dark:bg-slate-900">

      {/* Реализованные проекты */}
      <section className="py-16 px-4 bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-900" id="cases">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CheckCircle2 className="w-4 h-4" />
              Работающие решения
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Наши проекты</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Реальные кейсы, которые уже приносят результат нашим клиентам</p>
          </div>
          
          <div className="space-y-8">
            {/* Кейс 1: Умный бот для сферы услуг */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-white">
                  <span className="text-5xl mb-4 block">✂️</span>
                  <h3 className="text-2xl font-bold mb-2">Умный бот для записи</h3>
                  <p className="text-white/80">Сфера услуг: барбершопы, салоны красоты, клиники</p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">-70%</span>
                      <span className="text-sm text-white/70">пропущенных записей</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">+35%</span>
                      <span className="text-sm text-white/70">повторных визитов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">24/7</span>
                      <span className="text-sm text-white/70">без выходных</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">В работе у клиентов</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    AI-ассистент, который полностью берёт на себя запись клиентов. Работает круглосуточно, никогда не забывает напомнить о визите, сам предлагает удобное время и даже обрабатывает отмены.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Онлайн-запись без звонков и ожидания</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Автоматические напоминания клиентам</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Ответы на вопросы о ценах и услугах</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Персональные предложения постоянным</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Кейс 2: AI-визуализация */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-cyan-500 to-blue-600 p-8 text-white">
                  <span className="text-5xl mb-4 block">🏠</span>
                  <h3 className="text-2xl font-bold mb-2">AI-визуализация</h3>
                  <p className="text-white/80">Строительство: натяжные потолки, ремонт, дизайн</p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">+60%</span>
                      <span className="text-sm text-white/70">конверсия в продажу</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">30 сек</span>
                      <span className="text-sm text-white/70">генерация изображения</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">0</span>
                      <span className="text-sm text-white/70">возражений "подумаю"</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">Активно используется</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Клиент загружает фото своей комнаты — получает реалистичное изображение с готовым потолком. Менеджер показывает результат прямо на замере — и сделка закрывается на месте.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Фото комнаты → готовый дизайн за секунды</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Выбор цвета, текстуры, освещения</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Работает прямо в Telegram</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Клиент видит результат ДО покупки</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Кейс 3: Автосбор контактов */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white">
                  <span className="text-5xl mb-4 block">📊</span>
                  <h3 className="text-2xl font-bold mb-2">Сбор контактов</h3>
                  <p className="text-white/80">B2B: продажи, холодные звонки, рассылки</p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">10 мин</span>
                      <span className="text-sm text-white/70">вместо 10 часов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">500+</span>
                      <span className="text-sm text-white/70">контактов за запуск</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">CSV</span>
                      <span className="text-sm text-white/70">готово для CRM</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">Ежедневно в работе</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Вводите поисковый запрос — бот находит сайты компаний и автоматически собирает контакты: email, телефоны, Telegram. Готовая база для холодных продаж за минуты.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Поиск по любым ключевым словам</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Email, телефоны, Telegram</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Фильтрация мусора и дублей</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">Экспорт в CSV для любой CRM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">Хотите такое же решение для своего бизнеса?</p>
            <Link href="#contact-form" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:opacity-90 transition font-semibold">
              Обсудить проект
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Что мы делаем</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">AI-решения для любых бизнес-задач</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-600 transition group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-purple-500 group-hover:to-pink-500 transition">
                    <service.icon className="w-7 h-7 text-purple-600 dark:text-purple-400 group-hover:text-white transition" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 text-sm text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Работаем с любыми отраслями</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">AI адаптируется под специфику вашего бизнеса</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-600 transition">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <industry.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{industry.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Как мы работаем</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">От идеи до работающего решения — простой процесс</p>
          </div>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form" className="py-16 px-4 bg-gradient-to-b from-white to-purple-50 dark:from-slate-900 dark:to-slate-800 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Обсудим ваш проект?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">Расскажите о задаче — предложим решение</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-100 dark:border-slate-700">
            <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                try {
                  const res = await fetch("https://lanaaihelper.ru/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: formData.get("name"),
                      contact: formData.get("contact"),
                      task: formData.get("task") || ""
                    })
                  });
                  if (res.ok) {
                    window.location.href = "/business?success=true";
                  } else {
                    alert("Ошибка отправки. Попробуйте позже.");
                  }
                } catch {
                  alert("Ошибка сети. Попробуйте позже.");
                }
              }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Имя / Компания *</label>
                  <input type="text" id="name" name="name" required className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" placeholder="Как к вам обращаться" />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email или Telegram *</label>
                  <input type="text" id="contact" name="contact" required className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition" placeholder="Как с вами связаться" />
                </div>
              </div>
              <div>
                <label htmlFor="task" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Опишите задачу</label>
                <textarea id="task" name="task" rows={4} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none" placeholder="Расскажите, что хотите автоматизировать или какую проблему решить" />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:opacity-90 transition font-semibold text-lg">
                <Send className="w-5 h-5" />
                Отправить заявку
              </button>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">Отвечаем в течение 24 часов. Обычно быстрее.</p>
            </form>
          </div>
          <div className="mt-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">Или свяжитесь напрямую:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={copyEmail} className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition">
                {emailCopied ? <Check className="w-5 h-5 text-green-500" /> : <Mail className="w-5 h-5" />}
                {emailCopied ? "Email скопирован!" : "support@lanaaihelper.ru"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Частые вопросы</h2>
          </div>
          <div className="space-y-4">
            <details className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 group">
              <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                Какие задачи можно автоматизировать с помощью AI?
                <span className="text-purple-500 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Практически любые повторяющиеся задачи: ответы на типовые вопросы клиентов, обработка заявок, генерация контента, анализ данных, запись на услуги, консультации по товарам, техподдержка, онбординг сотрудников и многое другое.</p>
            </details>
            <details className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 group">
              <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                Какие нейросети вы используете?
                <span className="text-purple-500 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Работаем с лучшими моделями: GPT-4o от OpenAI, Claude от Anthropic, Gemini от Google, DeepSeek, Grok и другие. Выбираем оптимальную модель под конкретную задачу.</p>
            </details>
            <details className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 group">
              <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                Сколько времени занимает внедрение?
                <span className="text-purple-500 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Зависит от сложности. Простой чат-бот для FAQ можно запустить за несколько дней. Комплексное решение с интеграциями — от 2 недель. Начинаем с MVP и дорабатываем по мере получения обратной связи.</p>
            </details>
            <details className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 group">
              <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                Как обеспечивается безопасность данных?
                <span className="text-purple-500 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Приватность — наш приоритет. Собираем минимум данных, не храним переписки клиентов, работаем в соответствии с российским законодательством о персональных данных.</p>
            </details>
            <details className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 group">
              <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                Работает ли это в России?
                <span className="text-purple-500 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Да, все наши решения работают на территории РФ без VPN. Оплата в рублях, документы по российскому законодательству. Мы — российский сервис для российского бизнеса.</p>
            </details>
            <details className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 group">
              <summary className="font-semibold text-slate-900 dark:text-white cursor-pointer list-none flex justify-between items-center">
                С какими компаниями вы работаете?
                <span className="text-purple-500 group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Работаем с бизнесом любого размера: от ИП до крупных компаний. Интернет-магазины, сфера услуг, медицина, юристы, недвижимость, образование, IT — AI применим практически везде.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы автоматизировать бизнес?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Расскажите о вашей задаче — найдём решение вместе</p>
            <Link href="#contact-form" className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl hover:bg-purple-50 transition font-semibold text-lg">
              Оставить заявку
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
