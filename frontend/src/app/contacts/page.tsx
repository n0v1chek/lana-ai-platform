'use client';

import Link from 'next/link';
import { CatLogo } from '@/components/CatLogo';
import { Mail, MapPin, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ContactsPage() {
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
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Контакты и реквизиты
          </h1>

          <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-lana-100 dark:bg-lana-900/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-lana-600 dark:text-lana-400" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                Реквизиты
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 sm:w-48 mb-1 sm:mb-0">Наименование:</span>
                <span className="text-slate-900 dark:text-white font-medium">Самозанятый</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 sm:w-48 mb-1 sm:mb-0">ФИО:</span>
                <span className="text-slate-900 dark:text-white font-medium">Живчин Александр Семенович</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 sm:w-48 mb-1 sm:mb-0">ИНН:</span>
                <span className="text-slate-900 dark:text-white font-medium font-mono">263109568337</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center py-3">
                <span className="text-slate-500 dark:text-slate-400 sm:w-48 mb-1 sm:mb-0">Налоговый режим:</span>
                <span className="text-slate-900 dark:text-white font-medium">Налог на профессиональный доход (НПД)</span>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                Контакты
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 sm:w-48 mb-1 sm:mb-0">Email:</span>
                <a href="mailto:support@lanaaihelper.ru" className="text-lana-600 dark:text-lana-400 font-medium hover:underline">
                  support@lanaaihelper.ru
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center py-3">
                <span className="text-slate-500 dark:text-slate-400 sm:w-48 mb-1 sm:mb-0">Время ответа:</span>
                <span className="text-slate-900 dark:text-white font-medium">В течение 24 часов</span>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                Об услуге
              </h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Lana AI Helper</strong> — это онлайн-сервис, предоставляющий доступ к 50+ AI-моделям (GPT-4o, Claude, Gemini и другие) для генерации текстов, ответов на вопросы и помощи в решении задач.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                <strong>Как получить услугу:</strong>
              </p>
              <ol className="text-slate-600 dark:text-slate-400 list-decimal list-inside space-y-2 mt-2">
                <li>Зарегистрируйтесь на сайте (бесплатно)</li>
                <li>Пополните баланс (от 49 рублей)</li>
                <li>Выберите AI-модель из 50+ доступных</li>
                <li>Платите только за использованные сообщения</li>
                <li>Коины не сгорают — используйте когда удобно</li>
              </ol>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                <strong>Способы оплаты:</strong> банковские карты (Visa, MasterCard, МИР), СБП, SberPay, ЮMoney.
              </p>
            </div>
          </section>

          <section className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-8">
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Юридические документы
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/terms" className="text-lana-600 dark:text-lana-400 hover:underline">
                Публичная оферта
              </Link>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <Link href="/privacy" className="text-lana-600 dark:text-lana-400 hover:underline">
                Политика конфиденциальности
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          © 2025 Lana AI Helper. ИНН: 263109568337
        </div>
      </footer>
    </div>
  );
}
