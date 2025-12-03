'use client';

import Link from 'next/link';
import { CatLogo } from '@/components/CatLogo';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CatLogo size={80} />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Политика использования cookies
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Информация о файлах cookie на сайте
          </p>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm prose prose-slate dark:prose-invert max-w-none">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Редакция от 2 декабря 2025 года
            </p>

            <h2>1. Что такое cookies</h2>
            <p>
              Cookies (куки) — это небольшие текстовые файлы, которые сохраняются на вашем
              устройстве при посещении веб-сайтов. Они помогают сайту запоминать информацию
              о вашем визите.
            </p>

            <h2>2. Какие cookies мы используем</h2>
            
            <h3>2.1. Технические cookies (обязательные)</h3>
            <p>Необходимы для работы сайта:</p>
            <ul>
              <li><strong>Авторизация</strong> — хранение токена для входа в аккаунт</li>
              <li><strong>Настройки интерфейса</strong> — тема оформления (светлая/тёмная)</li>
              <li><strong>Согласие</strong> — запоминание вашего согласия с политиками</li>
            </ul>

            <h3>2.2. Аналитические cookies</h3>
            <p>Используются для улучшения качества сервиса:</p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-4">
              <p className="mb-2 font-semibold">Яндекс.Метрика (счётчик № 105576416)</p>
              <ul className="mb-0 text-sm">
                <li>Вебвизор — запись действий на сайте</li>
                <li>Карта кликов и скроллинга</li>
                <li>Аналитика форм</li>
                <li>Источники трафика</li>
              </ul>
              <p className="mt-2 text-xs">
                <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer" className="text-lana-500">
                  Политика Яндекса →
                </a>
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-4">
              <p className="mb-2 font-semibold">Google Analytics 4 (G-G2L3FBV3TG)</p>
              <ul className="mb-0 text-sm">
                <li>Статистика посещений</li>
                <li>Источники трафика</li>
                <li>Поведение пользователей</li>
                <li>Конверсии</li>
              </ul>
              <p className="mt-2 text-xs">
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-lana-500">
                  Политика Google →
                </a>
              </p>
            </div>

            <h3>2.3. Рекламные cookies</h3>
            <p>Используются для показа релевантной рекламы:</p>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 my-4">
              <p className="mb-2 font-semibold">Яндекс.Директ</p>
              <ul className="mb-0 text-sm">
                <li>Показ рекламы в поисковых системах</li>
                <li>Ретаргетинг на партнёрских сайтах</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 my-4">
              <p className="mb-2 font-semibold">Google Ads</p>
              <ul className="mb-0 text-sm">
                <li>Показ рекламы в Google и партнёрских сайтах</li>
                <li>Ремаркетинг и отслеживание конверсий</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 my-4">
              <p className="mb-2 font-semibold">Microsoft Advertising (Bing)</p>
              <ul className="mb-0 text-sm">
                <li>Показ рекламы в Bing и MSN</li>
                <li>Отслеживание конверсий</li>
              </ul>
            </div>

            <h2>3. Управление cookies</h2>
            <p>
              Вы можете отключить cookies в настройках браузера. Однако это может
              привести к невозможности использования некоторых функций сайта.
            </p>
            <p>
              Для отключения аналитики и рекламы используйте настройки браузера
              или блокировщики рекламы.
            </p>

            <h2>4. Контакты</h2>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
              <p className="mb-1">По вопросам использования cookies:</p>
              <p className="mb-1">Email: support@lanaaihelper.ru</p>
              <p>Сайт: https://lanaaihelper.ru</p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500">
                См. также:{' '}
                <Link href="/privacy" className="text-lana-500 hover:underline">
                  Политика конфиденциальности
                </Link>
                {' • '}
                <Link href="/terms" className="text-lana-500 hover:underline">
                  Публичная оферта
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
