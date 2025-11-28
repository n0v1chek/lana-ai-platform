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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lana-500 to-purple-500 flex items-center justify-center">
              <CatLogo size={24} />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Lana AI
            </span>
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
              Редакция от 28 ноября 2025 года
            </p>

            <h2>1. Что такое cookies</h2>
            <p>
              Cookies (куки) — это небольшие текстовые файлы, которые сохраняются на вашем
              устройстве при посещении веб-сайтов. Они помогают сайту запоминать информацию
              о вашем визите.
            </p>

            <h2>2. Какие cookies мы используем</h2>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 my-4">
              <strong>Мы используем только строго необходимые (технические) cookies.</strong>
            </div>

            <h3>2.1. Технические cookies</h3>
            <p>Необходимы для работы сайта:</p>
            <ul>
              <li><strong>Авторизация</strong> — хранение токена для входа в аккаунт</li>
              <li><strong>Сессия</strong> — поддержание активной сессии пользователя</li>
              <li><strong>Настройки интерфейса</strong> — тема оформления (светлая/тёмная)</li>
            </ul>

            <h3>2.2. Чего мы НЕ используем</h3>
            <ul>
              <li>Рекламные cookies</li>
              <li>Cookies для отслеживания (tracking)</li>
              <li>Аналитические cookies третьих сторон</li>
              <li>Cookies социальных сетей</li>
              <li>Cookies для таргетированной рекламы</li>
            </ul>

            <h2>3. Срок хранения</h2>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2 border-b">Тип</th>
                  <th className="text-left p-2 border-b">Назначение</th>
                  <th className="text-left p-2 border-b">Срок</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-b">token</td>
                  <td className="p-2 border-b">Авторизация</td>
                  <td className="p-2 border-b">30 дней</td>
                </tr>
                <tr>
                  <td className="p-2 border-b">theme</td>
                  <td className="p-2 border-b">Тема оформления</td>
                  <td className="p-2 border-b">1 год</td>
                </tr>
              </tbody>
            </table>

            <h2>4. Управление cookies</h2>
            <p>
              4.1. Вы можете отключить cookies в настройках браузера. Однако это может
              привести к невозможности использования некоторых функций сайта (например, авторизации).
            </p>
            <p>
              4.2. При отключении cookies вы не сможете войти в свой аккаунт.
            </p>

            <h2>5. Согласие</h2>
            <p>
              5.1. Продолжая использовать сайт, вы соглашаетесь на использование
              технических cookies, необходимых для работы сервиса.
            </p>
            <p>
              5.2. Поскольку мы используем только строго необходимые cookies,
              отдельное согласие на их использование не требуется в соответствии
              с законодательством.
            </p>

            <h2>6. Передача данных</h2>
            <p>
              Мы НЕ передаём данные cookies третьим лицам и НЕ используем их
              для отслеживания вашей активности на других сайтах.
            </p>

            <h2>7. Контакты</h2>
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
