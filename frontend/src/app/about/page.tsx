'use client';

import { CatLogo } from '@/components/CatLogo';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import {
  Lock,
  Globe,
  Cpu,
  Database,
  Cloud,
  CheckCircle2,
  ArrowRight,
  Code2,
  Layers,
  BookOpen,
  Heart,
  Sparkles,
  Search
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <CatLogo size={80} />
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Главная</Link>
            <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">База знаний</Link>
            <Link href="/contacts" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Контакты</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">О проекте</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Создано с любовью к AI
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Познакомьтесь с человеком, который стоит за LANA AI Helper
          </p>
        </div>

        {/* Founder Card */}
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 md:p-10 mb-16">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Живчин Александр Семенович</h2>
            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">Основатель и разработчик</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              LANA AI Helper — это платформа, которая предоставляет доступ к лучшим нейросетям мира через единый удобный интерфейс. Проект создан с целью сделать искусственный интеллект доступным для каждого.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Наша миссия — создание лучших AI-агентов, которые действительно работают и делают жизнь и бизнес проще для каждого.
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Я верю, что AI должен быть простым в использовании, доступным по цене и безопасным.
            </p>
          </div>
        </div>

        {/* Mission & Free Education */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Наша миссия</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Знания должны быть доступны каждому</p>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-8 md:p-10 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <p className="text-lg text-slate-700 dark:text-slate-200 text-center leading-relaxed mb-6">
              Мы верим, что качественное образование в сфере искусственного интеллекта должно быть доступно каждому — независимо от финансовых возможностей. Поэтому на нашем сайте вы найдёте <strong>полностью бесплатные курсы и обучающие материалы</strong>, которые помогут освоить работу с нейросетями с нуля.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-center leading-relaxed">
              Мы собираем и систематизируем знания, которые сложно найти в открытом доступе, и делаем их понятными для всех. Наша цель — помочь людям использовать возможности AI для улучшения своей жизни и работы.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Бесплатное обучение</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">6 полноценных курсов по AI — от основ нейросетей до создания AI-агентов. Всё бесплатно и без регистрации.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Уникальные материалы</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Статьи и руководства с информацией, которую сложно найти в интернете — практические кейсы и реальный опыт.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Для всех</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Материалы подходят как для новичков, так и для опытных специалистов. Объясняем сложное простым языком.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Search className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Индексация в поисковиках</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Сайт добавлен в Google, Яндекс и Bing. Sitemap отправлен во все поисковые системы для лучшей индексации.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Архитектура платформы</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Современный технологический стек, обеспечивающий масштабируемость и безопасность</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Code2 className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Frontend</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Next.js 14 с Server Components для максимальной производительности и SEO-оптимизации</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">Next.js</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">TypeScript</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">Tailwind</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cpu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Backend</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Высокопроизводительный API на FastAPI с асинхронной обработкой запросов</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">FastAPI</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">Python</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">AsyncIO</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Database</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">PostgreSQL с оптимизированными индексами и кэширование через Redis</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">PostgreSQL</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">Redis</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">SQLAlchemy</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cloud className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Infrastructure</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Контейнеризация и автоматическое масштабирование для стабильной работы</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">Docker</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">Nginx</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300">PM2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Почему нам доверяют</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Безопасность и конфиденциальность</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Шифрование</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Все данные защищены при передаче и хранении</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Работает в России</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Без VPN, с поддержкой российских карт</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <Layers className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Прозрачные цены</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Платите только за использование</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">HTTPS везде</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">Без скрытых комиссий</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm">Аудит безопасности</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Готовы начать?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Присоединяйтесь к пользователям передовых AI-технологий
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Начать обучение
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium px-6 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
            >
              Создать аккаунт
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
