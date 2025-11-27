'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <header className="border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-lana-500 dark:text-lana-400">
            LANA AI Helper
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-lana-500 dark:text-lana-400 transition-colors">Главная</Link>
            <Link href="/pricing" className="hover:text-lana-500 dark:text-lana-400 transition-colors">Тарифы</Link>
            <Link href="/contacts" className="hover:text-lana-500 dark:text-lana-400 transition-colors">Контакты</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4 text-slate-900 dark:text-white">О проекте</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-12">Познакомьтесь с создателем LANA AI Helper</p>

        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-gradient-to-br from-lana-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold">АЖ</div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Живчин Александр Семенович</h2>
              <p className="text-lana-500 dark:text-lana-400 mb-4">Основатель и разработчик</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Frontend</div>
                  <div className="text-lana-500 dark:text-lana-400">Next.js</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Backend</div>
                  <div className="text-lana-500 dark:text-lana-400">FastAPI</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-slate-500 dark:text-slate-400">DevOps</div>
                  <div className="text-lana-500 dark:text-lana-400">Docker</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Дизайн</div>
                  <div className="text-lana-500 dark:text-lana-400">UI/UX</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">О проекте LANA AI Helper</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">LANA AI Helper — это платформа, которая предоставляет доступ к лучшим нейросетям мира через единый удобный интерфейс. Проект создан с целью сделать искусственный интеллект доступным для каждого.</p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">Мы верим, что AI должен быть простым в использовании, доступным по цене и безопасным. Для регистрации нужен только логин и пароль.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-lana-500 dark:text-lana-400">50+</div>
            <div className="text-slate-500 dark:text-slate-400 mt-2">Лучших AI моделей</div>
          </div>
          <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-lana-500 dark:text-lana-400">2025</div>
            <div className="text-slate-500 dark:text-slate-400 mt-2">Год запуска</div>
          </div>
          <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-lana-500 dark:text-lana-400">24/7</div>
            <div className="text-slate-500 dark:text-slate-400 mt-2">Доступность</div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/register" className="inline-block bg-lana-500 hover:bg-lana-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors">Начать использовать</Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 mt-16 py-8 text-center text-slate-500 dark:text-slate-400">
        <p>© 2025 LANA AI Helper. Все права защищены.</p>
        <p className="mt-2">Самозанятый Живчин Александр Семенович · ИНН 263109568337</p>
      </footer>
    </div>
  );
}
