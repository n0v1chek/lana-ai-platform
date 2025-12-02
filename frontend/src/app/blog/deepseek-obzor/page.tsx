import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DeepSeek — китайская нейросеть: обзор 2025 — LANA AI",
  description: "Обзор DeepSeek Chat и DeepSeek R1. Почему китайская нейросеть стала популярной, цены, возможности, сравнение с ChatGPT.",
  keywords: ["DeepSeek", "DeepSeek Chat", "DeepSeek R1", "китайская нейросеть", "дешёвая нейросеть"],
  openGraph: {
    title: "DeepSeek — обзор китайской нейросети",
    description: "Дешёвая альтернатива ChatGPT из Китая",
    url: "https://lanaaihelper.ru/blog/deepseek-obzor",
  },
};

export default function ArticlePage() {
  return (
    <>
<article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/blog" className="text-purple-600 dark:text-purple-400 hover:underline">← Блог</Link>
            <span className="text-slate-500 dark:text-slate-600">|</span>
            <span className="text-slate-500 dark:text-slate-400">29 ноября 2025</span>
            <span className="text-slate-500 dark:text-slate-600">|</span>
            <span className="text-slate-500 dark:text-slate-400">7 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            DeepSeek — китайская нейросеть, которая удивила мир
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            DeepSeek — AI-модель из Китая, которая показывает результаты на уровне GPT-4, 
            но стоит в разы дешевле. Разбираемся, в чём секрет и стоит ли использовать.
          </p>

          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 my-6">
              <p className="text-red-900 dark:text-red-100 font-medium text-lg mb-2">🇨🇳 Главное о DeepSeek</p>
              <ul className="text-red-800 dark:text-red-200 space-y-1 text-sm">
                <li>Страна: Китай (компания DeepSeek AI)</li>
                <li>Особенность: очень низкая цена при высоком качестве</li>
                <li>Модели: DeepSeek Chat, DeepSeek R1 (reasoning)</li>
                <li>Открытый код: модели доступны для скачивания</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Почему DeepSeek стал популярным?</h2>

            <p className="text-slate-600 dark:text-slate-300 mb-4">
              В январе 2025 года DeepSeek выпустил модель R1, которая на многих тестах обошла GPT-4o 
              и Claude. При этом стоимость использования оказалась в 10-20 раз ниже американских аналогов.
            </p>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 my-6">
              <p className="text-green-900 font-medium mb-2">💰 Цены DeepSeek vs конкуренты:</p>
              <ul className="text-green-800 dark:text-green-200 space-y-1 text-sm">
                <li>DeepSeek Chat: очень дёшево</li>
                <li>GPT-4o: значительно дороже</li>
                <li>Claude Sonnet: дороже</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Модели DeepSeek</h2>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">DeepSeek Chat</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Базовая модель для повседневных задач. Хорошо справляется с текстами, переводами, 
              ответами на вопросы. Идеальна для тех, кому нужен дешёвый и качественный AI.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">DeepSeek R1 (Reasoning)</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Модель с "цепочкой рассуждений" — думает пошагово, как o1 от OpenAI. 
              Лучше для математики, логических задач и программирования. Немного дороже, но всё равно дешевле конкурентов.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Плюсы и минусы</h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">✅ Плюсы</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>Очень дешёвый</li>
                  <li>Качество на уровне GPT-4</li>
                  <li>Хорош для кода</li>
                  <li>Открытые веса (можно запустить локально)</li>
                  <li>Быстрый</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
                <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">❌ Минусы</h3>
                <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
                  <li>Нет поддержки изображений</li>
                  <li>Цензура на политику Китая</li>
                  <li>Меньше знает о западных реалиях</li>
                  <li>Иногда странные ответы на русском</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Для чего использовать DeepSeek?</h2>

            <div className="space-y-4 my-6">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-medium text-slate-900">✅ Хорошо подходит:</p>
                <ul className="text-slate-600 text-sm mt-2 space-y-1">
                  <li>• Программирование и код-ревью</li>
                  <li>• Математические задачи</li>
                  <li>• Переводы</li>
                  <li>• Анализ данных</li>
                  <li>• Когда нужно много запросов (экономия)</li>
                </ul>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-medium text-slate-900">❌ Лучше выбрать другое:</p>
                <ul className="text-slate-600 text-sm mt-2 space-y-1">
                  <li>• Работа с изображениями (нет Vision)</li>
                  <li>• Креативное письмо на русском</li>
                  <li>• Вопросы о Китае/Тайване (цензура)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Как использовать DeepSeek в России</h2>

            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Официальный сайт DeepSeek работает в России, но оплата проблематична. 
              Проще через API-сервисы:
            </p>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 my-6">
              <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3">Через LANA AI</h3>
              <ul className="text-purple-800 dark:text-purple-200 space-y-2 text-sm">
                <li>✅ DeepSeek Chat и R1 доступны</li>
                <li>✅ Оплата в рублях</li>
                <li>✅ Цены ещё ниже благодаря оптовым закупкам</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Попробуйте DeepSeek</h3>
              <p className="opacity-90 mb-6">Самая дешёвая качественная нейросеть. Идеальна для экономии.</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Начать использовать
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/gemini-google-obzor" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Gemini от Google</h3>
              <p className="text-sm text-slate-500 mt-1">Полный обзор нейросети</p>
            </Link>
            <Link href="/blog/luchshie-nejroseti-2025" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Лучшие нейросети 2025</h3>
              <p className="text-sm text-slate-500 mt-1">Лучшие AI модели</p>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-slate-900 text-slate-400 text-center">
        <p>© 2025 LANA AI Helper. ИНН 263109568337</p>
      </footer>
    </>
  );
}