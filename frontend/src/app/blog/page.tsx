"use client";

import Link from "next/link";
import { useState } from "react";

const mainTabs = [
  { id: "articles", name: "Статьи", icon: "📰" },
  { id: "learning", name: "Обучение", icon: "🎓" },
];

const categories = [
  { id: "all", name: "Все статьи", count: 20 },
  { id: "Гайд", name: "Гайды", count: 9 },
  { id: "Обзор", name: "Обзоры", count: 6 },
  { id: "Сравнение", name: "Сравнения", count: 4 },
  { id: "Бизнес", name: "Для бизнеса", count: 1 },
];

const articles = [
  {
    slug: "chatgpt-v-rossii-2025",
    title: "Как пользоваться ChatGPT в России в 2025 году",
    description: "Подробная инструкция: все способы доступа к ChatGPT без VPN, сравнение вариантов.",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "luchshie-nejroseti-2025",
    title: "Лучшие нейросети для работы в 2025 году",
    description: "Топ-лучшие AI-модели для разных задач. Сравнение возможностей и рекомендации.",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "claude-vs-chatgpt",
    title: "Claude vs ChatGPT — какая нейросеть лучше?",
    description: "Честное сравнение двух главных AI: возможности, плюсы и минусы каждого.",
    tag: "Сравнение",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    slug: "kak-pisat-prompty",
    title: "Как писать промпты для нейросети: полный гайд",
    description: "Секреты эффективного общения с AI. Примеры промптов для разных задач.",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "gemini-google-obzor",
    title: "Gemini от Google — полный обзор нейросети",
    description: "Всё о Gemini 2.0, 2.5 Flash и Pro: возможности, огромный контекст, сравнение.",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "deepseek-obzor",
    title: "DeepSeek — китайская нейросеть, которая удивила мир",
    description: "Почему DeepSeek стал популярным: качество GPT-4 по низкой цене.",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "grok-xai-obzor",
    title: "Grok — нейросеть Илона Маска с характером",
    description: "Обзор Grok 3 от xAI: юмор, меньше цензуры, доступ к данным X.",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "gpt4o-vs-gpt4-turbo",
    title: "GPT-4o vs GPT-4 Turbo — какую модель выбрать?",
    description: "Сравнение моделей OpenAI: скорость, качество, Vision, цена.",
    tag: "Сравнение",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    slug: "claude-opus-vs-sonnet",
    title: "Claude Opus vs Claude Sonnet — в чём разница?",
    description: "Когда использовать Opus, а когда Sonnet. Разбираем линейку Claude.",
    tag: "Сравнение",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    slug: "nejroset-dlya-tekstov",
    title: "Лучшие нейросети для написания текстов",
    description: "Топ-5 AI для копирайтинга, статей, постов. Какую выбрать под задачу.",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "nejroset-dlya-programmistov",
    title: "AI для программистов: какую нейросеть выбрать?",
    description: "Сравнение Cursor, GitHub Copilot, Claude. Что лучше для кода.",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "nejroset-dlya-ucheby",
    title: "Нейросеть для учёбы: как использовать AI студентам",
    description: "Этичное использование AI в учёбе: конспекты, рефераты, подготовка к экзаменам.",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "ai-dlya-biznesa",
    title: "AI для бизнеса: как внедрить нейросети в компанию",
    description: "Практические кейсы автоматизации: поддержка, продажи, контент, HR.",
    tag: "Бизнес",
    tagColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    slug: "ai-dlya-anglijskogo",
    title: "Учим английский с нейросетью: эффективные методы",
    description: "Как использовать ChatGPT и другие AI для изучения языка.",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "nejroset-dlya-rezyume",
    title: "Нейросеть для резюме: как создать идеальное CV",
    description: "Генерация и улучшение резюме с AI. Подготовка к собеседованию.",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "gpt4o-vs-gemini",
    title: "GPT-4o vs Gemini 2.0 — кто победит?",
    description: "Сравнение двух гигантов: OpenAI против Google. Тесты и выводы.",
    tag: "Сравнение",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    slug: "besplatnye-vs-platnye-nejroseti",
    title: "Бесплатные vs платные нейросети: стоит ли платить?",
    description: "Честное сравнение: что дают платные подписки и можно ли обойтись без них.",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "rossijskie-analogi-chatgpt",
    title: "Российские аналоги ChatGPT: какие есть варианты?",
    description: "YandexGPT, GigaChat, Saiga — обзор отечественных нейросетей.",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "novinki-ai-2025",
    title: "Новинки AI в 2025 году: что уже появилось?",
    description: "Обзор последних релизов: Claude 4, GPT-5, новые функции AI.",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "budushchee-nejrosetej",
    title: "Будущее нейросетей: чего ждать?",
    description: "AGI, AI-агенты, персональные помощники. Что ждёт AI в будущем.",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
];

const learningModules = [
  {
    slug: "osnovy-ai",
    num: 1,
    title: "Основы AI и нейросетей",
    description: "Как работают нейросети, сравнение моделей, выбор под задачу.",
    lessons: 5,
    color: "from-blue-500 to-cyan-500",
    icon: "🧠",
  },
  {
    slug: "prompt-injiniring",
    num: 2,
    title: "Промпт-инжиниринг",
    description: "Как писать эффективные промпты для любых задач.",
    lessons: 5,
    color: "from-purple-500 to-pink-500",
    icon: "✍️",
  },
  {
    slug: "ai-dlya-kontenta",
    num: 3,
    title: "AI для контента",
    description: "Создание текстов, изображений, видео с помощью нейросетей.",
    lessons: 5,
    color: "from-pink-500 to-rose-500",
    icon: "🎨",
  },
  {
    slug: "avtomatizaciya-n8n",
    num: 4,
    title: "Автоматизация с n8n",
    description: "Создание workflow, Telegram-ботов, интеграция с AI.",
    lessons: 6,
    color: "from-orange-500 to-amber-500",
    icon: "⚡",
  },
  {
    slug: "ai-boty-dlya-biznesa",
    num: 5,
    title: "AI-боты для бизнеса",
    description: "Консультанты, продажники, системы записи для автоматизации.",
    lessons: 6,
    color: "from-emerald-500 to-teal-500",
    icon: "🤖",
  },
  {
    slug: "ai-agenty",
    num: 6,
    title: "AI-агенты",
    description: "Продвинутый уровень: автономные системы с инструментами.",
    lessons: 6,
    color: "from-violet-500 to-purple-500",
    icon: "🚀",
  },
];

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("articles");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredArticles = activeCategory === "all" 
    ? articles 
    : articles.filter(a => a.tag === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            База знаний
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Статьи, гайды и полный курс по работе с искусственным интеллектом
          </p>
        </div>
      </section>

      {/* Main Tabs */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-4 mb-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content based on active tab */}
      {activeTab === "articles" && (
        <>
          {/* Category Filters */}
          <section className="px-4 pb-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      activeCategory === cat.id
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat.name}
                    <span className="ml-2 text-xs opacity-70">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Articles Grid */}
          <section className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
                {filteredArticles.length} {filteredArticles.length === 1 ? "статья" : "статей"}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={"/blog/" + article.slug}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-700 transition group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={"text-xs font-medium px-2 py-1 rounded-full " + article.tagColor}>
                        {article.tag}
                      </span>
                      
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                      {article.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {article.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "learning" && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-slate-600 dark:text-slate-400">
                Полный курс по AI и автоматизации — от основ до продвинутых агентов
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                6 модулей • 33 урока
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningModules.map((module) => (
                <Link
                  key={module.slug}
                  href={"/learn/" + module.slug}
                  className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">{module.icon}</span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        Модуль {module.num}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                    <p className="text-white/80 text-sm">{module.description}</p>
                  </div>
                  <div className="p-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span>{module.lessons} уроков</span>
                    
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-500">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Готовы попробовать AI?</h2>
          <p className="text-lg opacity-90 mb-8">
            Лучшие нейросети мира. Работает в России без VPN.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
          >
            Попробовать сейчас
          </Link>
        </div>
      </section>
    </>
  );
}
