'use client';

import { CatLogo } from '@/components/CatLogo';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <header className="border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <CatLogo size={32} />
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-slate-600 hover:text-indigo-500 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Главная</Link>
            <Link href="/contacts" className="text-slate-600 hover:text-indigo-500 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Контакты</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium mb-4">
            О проекте
          </span>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Создано с <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">любовью</span> к AI
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Познакомьтесь с человеком, который стоит за LANA AI Helper
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-2xl opacity-20"></div>
          <div className="relative bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white text-2xl font-bold mb-4 shadow-lg shadow-indigo-500/30">
                АЖ
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Живчин Александр Семенович</h2>
              <p className="text-indigo-500 dark:text-indigo-400 font-medium mt-1">Основатель и разработчик</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700 rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-default">
                <div className="text-2xl mb-2">⚛️</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wide">Frontend</div>
                <div className="text-indigo-600 dark:text-indigo-400 font-semibold">Next.js</div>
              </div>
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700 rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-default">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wide">Backend</div>
                <div className="text-indigo-600 dark:text-indigo-400 font-semibold">FastAPI</div>
              </div>
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700 rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-default">
                <div className="text-2xl mb-2">🐳</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wide">DevOps</div>
                <div className="text-indigo-600 dark:text-indigo-400 font-semibold">Docker</div>
              </div>
              <div className="group bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700 rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-default">
                <div className="text-2xl mb-2">🎨</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 uppercase tracking-wide">Дизайн</div>
                <div className="text-indigo-600 dark:text-indigo-400 font-semibold">UI/UX</div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span> О проекте
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                LANA AI Helper — это платформа, которая предоставляет доступ к лучшим нейросетям мира через единый удобный интерфейс. Проект создан с целью сделать искусственный интеллект доступным для каждого.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Я верю, что AI должен быть простым в использовании, доступным по цене и безопасным. Для регистрации нужен логин, email и пароль.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12">
          <div className="group bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-3">🤖</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">22+</div>
            <div className="text-slate-600 dark:text-slate-300 text-sm">AI моделей</div>
          </div>
          <div className="group bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-3">📅</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">2025</div>
            <div className="text-slate-600 dark:text-slate-300 text-sm">Год запуска</div>
          </div>
          <div className="group bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-3">⚡</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">24/7</div>
            <div className="text-slate-600 dark:text-slate-300 text-sm">Доступность</div>
          </div>
        </div>

        <div className="text-center mt-14">
          <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5">
            Начать использовать
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
