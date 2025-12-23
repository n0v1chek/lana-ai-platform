import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Бесплатное обучение AI и нейросетям — LANA AI",
  description: "Научитесь использовать ChatGPT, Claude, Midjourney, n8n. Бесплатные уроки по нейросетям, промпт-инжинирингу, автоматизации и созданию AI-ботов.",
  keywords: ["обучение AI", "курсы нейросети", "ChatGPT обучение", "промпт инжиниринг", "n8n уроки", "автоматизация бизнеса", "AI боты"],
  openGraph: {
    title: "Бесплатное обучение AI — LANA AI",
    description: "Уроки по нейросетям, автоматизации и AI-ботам",
    url: "https://lanaaihelper.ru/learn",
  },
};

const modules = [
  {
    id: "osnovy-ai",
    num: "01",
    title: "Основы AI и нейросетей",
    description: "Что такое нейросети, как они работают, обзор лучших моделей. Выбираем AI под задачу.",
    lessons: [
      "Что такое нейросети простыми словами",
      "ChatGPT, Claude, Gemini, DeepSeek — сравнение",
      "Как выбрать нейросеть под вашу задачу",
      "Бесплатные vs платные AI — что выбрать",
    ],
    color: "from-blue-500 to-cyan-500",
    icon: "🧠",
    ready: true,
  },
  {
    id: "prompt-injiniring",
    num: "02",
    title: "Промпт-инжиниринг",
    description: "Искусство общения с AI. Техники написания промптов, которые дают результат.",
    lessons: [
      "Анатомия идеального промпта",
      "Техника Chain of Thought (пошаговое мышление)",
      "Few-shot промпты — учим AI на примерах",
      "Role-playing — даём AI роль эксперта",
      "50+ готовых промптов для работы",
    ],
    color: "from-purple-500 to-pink-500",
    icon: "✍️",
    ready: true,
  },
  {
    id: "ai-dlya-kontenta",
    num: "03",
    title: "AI для контента",
    description: "Создание текстов, изображений и видео с помощью нейросетей.",
    lessons: [
      "AI-копирайтинг: статьи, посты, описания",
      "Генерация изображений: Midjourney, DALL-E, Ideogram",
      "AI-видео: Kling, Hailuo, Runway",
      "Автоматизация контент-плана",
    ],
    color: "from-orange-500 to-red-500",
    icon: "🎨",
    ready: true,
  },
  {
    id: "avtomatizaciya-n8n",
    num: "04",
    title: "Автоматизация без кода",
    description: "n8n и Make — создаём автоматизации с AI без программирования.",
    lessons: [
      "Введение в n8n — установка и интерфейс",
      "Первый workflow: Telegram + ChatGPT",
      "Автоматизация с Google Sheets",
      "Создание AI-ассистента в n8n",
      "Интеграция с CRM и базами данных",
    ],
    color: "from-green-500 to-emerald-500",
    icon: "⚡",
    ready: true,
  },
  {
    id: "ai-boty-dlya-biznesa",
    num: "05",
    title: "AI-боты для бизнеса",
    description: "Создание чат-ботов для поддержки, продаж и записи клиентов.",
    lessons: [
      "Архитектура AI-бота для бизнеса",
      "Бот для ответов на вопросы (FAQ)",
      "Бот для записи и бронирования",
      "Бот-продавец: квалификация лидов",
      "Подключение базы знаний к боту",
    ],
    color: "from-indigo-500 to-purple-500",
    icon: "🤖",
    ready: true,
  },
  {
    id: "ai-agenty",
    num: "06",
    title: "AI-агенты",
    description: "Продвинутый уровень: агенты с доступом к данным и инструментам.",
    lessons: [
      "Что такое AI-агенты и зачем они нужны",
      "Агент по базе знаний компании",
      "Агент с доступом к живым данным",
      "Мульти-агентные системы",
      "Деплой агента в продакшн",
    ],
    color: "from-rose-500 to-pink-500",
    icon: "🚀",
    ready: true,
  },
];

export default function LearnPage() {
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>🎓</span>
            Бесплатное обучение
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Научитесь использовать
            <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              нейросети для бизнеса
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            {modules.length} модулей, {totalLessons} уроков — от основ до создания AI-агентов. 
            ChatGPT, Claude, n8n, автоматизация, боты. Всё бесплатно.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#modules"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:opacity-90 transition font-semibold text-lg"
            >
              Начать обучение
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: modules.length, label: "модулей" },
              { value: totalLessons, label: "уроков" },
              { value: "0₽", label: "стоимость" },
              { value: "∞", label: "доступ" },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center border border-slate-200 dark:border-slate-700">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-16 px-4 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Программа обучения</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">От новичка до создания AI-агентов</p>
          </div>

          <div className="space-y-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
              >
                <div className="md:flex">
                  {/* Left: Module info */}
                  <div className={"md:w-1/3 bg-gradient-to-br " + module.color + " p-6 text-white"}>
                    <div className="text-5xl mb-3">{module.icon}</div>
                    <div className="text-sm font-medium opacity-80 mb-1">Модуль {module.num}</div>
                    <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                    <p className="text-sm text-white/80">{module.description}</p>
                    <div className="mt-4 text-sm">
                      <span className="bg-white/20 px-2 py-1 rounded">{module.lessons.length} уроков</span>
                    </div>
                  </div>

                  {/* Right: Lessons */}
                  <div className="md:w-2/3 p-6">
                    <ul className="space-y-2">
                      {module.lessons.map((lesson, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">{lesson}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Link
                        href={"/learn/" + module.id}
                        className={"inline-flex items-center gap-2 bg-gradient-to-r " + module.color + " text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition font-medium"}
                      >
                        Начать модуль
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Выберите модуль и начните обучение прямо сейчас. Это бесплатно и без регистрации.
            </p>
            <Link
              href="#modules"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl hover:bg-purple-50 transition font-semibold text-lg"
            >
              Выбрать модуль
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
