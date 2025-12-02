import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Блог о нейросетях и AI — LANA AI Helper",
  description: "Полезные статьи про искусственный интеллект, ChatGPT, Claude, Gemini. Гайды, сравнения, советы по использованию нейросетей.",
  keywords: ["блог AI", "статьи про нейросети", "ChatGPT уроки", "как пользоваться Claude", "гайды по нейросетям"],
  openGraph: {
    title: "Блог о нейросетях — LANA AI Helper",
    description: "Полезные статьи про AI и нейросети",
    url: "https://lanaaihelper.ru/blog",
  },
};

const articles = [
  {
    slug: "chatgpt-v-rossii-2025",
    title: "Как пользоваться ChatGPT в России в 2025 году",
    description: "Подробная инструкция: все способы доступа к ChatGPT без VPN, сравнение вариантов.",
    date: "29 ноября 2025",
    readTime: "7 мин",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "luchshie-nejroseti-2025",
    title: "Лучшие нейросети для работы в 2025 году",
    description: "Топ-лучшие AI-модели для разных задач. Сравнение возможностей и рекомендации.",
    date: "29 ноября 2025",
    readTime: "10 мин",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "claude-vs-chatgpt",
    title: "Claude vs ChatGPT — какая нейросеть лучше?",
    description: "Честное сравнение двух главных AI: возможности, плюсы и минусы каждого.",
    date: "29 ноября 2025",
    readTime: "8 мин",
    tag: "Сравнение",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    slug: "kak-pisat-prompty",
    title: "Как писать промпты для нейросети: полный гайд",
    description: "Секреты эффективного общения с AI. Примеры промптов для разных задач.",
    date: "29 ноября 2025",
    readTime: "12 мин",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "gemini-google-obzor",
    title: "Gemini от Google — полный обзор нейросети",
    description: "Всё о Gemini 2.0, 2.5 Flash и Pro: возможности, огромный контекст, сравнение.",
    date: "29 ноября 2025",
    readTime: "8 мин",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "deepseek-obzor",
    title: "DeepSeek — китайская нейросеть, которая удивила мир",
    description: "Почему DeepSeek стал популярным: качество GPT-4 по низкой цене.",
    date: "29 ноября 2025",
    readTime: "7 мин",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "grok-xai-obzor",
    title: "Grok — нейросеть Илона Маска с характером",
    description: "Обзор Grok 3 от xAI: юмор, меньше цензуры, доступ к данным X.",
    date: "29 ноября 2025",
    readTime: "6 мин",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "gpt4o-vs-gpt4-turbo",
    title: "GPT-4o vs GPT-4 Turbo — какую модель выбрать?",
    description: "Сравнение моделей OpenAI: скорость, качество, Vision, цена.",
    date: "29 ноября 2025",
    readTime: "5 мин",
    tag: "Сравнение",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    slug: "claude-opus-vs-sonnet",
    title: "Claude Opus vs Claude Sonnet — в чём разница?",
    description: "Когда использовать Opus, а когда Sonnet. Разбираем линейку Claude.",
    date: "29 ноября 2025",
    readTime: "6 мин",
    tag: "Сравнение",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    slug: "nejroset-dlya-tekstov",
    title: "Лучшие нейросети для написания текстов",
    description: "Топ-5 AI для копирайтинга, статей, постов. Какую выбрать под задачу.",
    date: "29 ноября 2025",
    readTime: "8 мин",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "nejroset-dlya-programmistov",
    title: "Лучшие нейросети для программирования",
    description: "Какой AI лучше для кода? Claude, GPT-4o, DeepSeek для разработки.",
    date: "29 ноября 2025",
    readTime: "9 мин",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "nejroset-dlya-ucheby",
    title: "Как использовать нейросети для учёбы",
    description: "AI как репетитор: объяснение тем, помощь с задачами, подготовка к экзаменам.",
    date: "29 ноября 2025",
    readTime: "10 мин",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "ai-dlya-biznesa",
    title: "AI для бизнеса: как нейросети экономят время",
    description: "Автоматизация поддержки, контент, продажи, аналитика с помощью AI.",
    date: "29 ноября 2025",
    readTime: "10 мин",
    tag: "Бизнес",
    tagColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    slug: "ai-dlya-anglijskogo",
    title: "AI для изучения английского языка",
    description: "Нейросеть как репетитор 24/7: практика, грамматика, подготовка к IELTS.",
    date: "29 ноября 2025",
    readTime: "8 мин",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "nejroset-dlya-rezyume",
    title: "Нейросеть для резюме и сопроводительных писем",
    description: "Как написать идеальное резюме с AI. Шаблоны и примеры промптов.",
    date: "29 ноября 2025",
    readTime: "7 мин",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "gpt4o-vs-gemini",
    title: "GPT-4o vs Gemini 2.5 Pro — битва титанов",
    description: "OpenAI против Google: сравнение флагманских моделей 2025 года.",
    date: "29 ноября 2025",
    readTime: "7 мин",
    tag: "Сравнение",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    slug: "besplatnye-vs-platnye-nejroseti",
    title: "Бесплатные vs платные нейросети",
    description: "Стоит ли платить за AI? Сравнение ограничений и возможностей.",
    date: "29 ноября 2025",
    readTime: "8 мин",
    tag: "Гайд",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  {
    slug: "rossijskie-analogi-chatgpt",
    title: "Российские аналоги ChatGPT",
    description: "YandexGPT, GigaChat, Kandinsky: обзор нейросетей из России.",
    date: "29 ноября 2025",
    readTime: "9 мин",
    tag: "Обзор",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    slug: "novinki-ai-2025",
    title: "Что нового в AI в 2025 году",
    description: "Главные релизы и события: GPT-4o, Claude 4, Gemini 2.5, DeepSeek R1.",
    date: "29 ноября 2025",
    readTime: "10 мин",
    tag: "Новости",
    tagColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
  {
    slug: "budushchee-nejrosetej",
    title: "Будущее нейросетей — прогнозы на 2026 год",
    description: "AGI, AI-агенты, персональные помощники. Что ждёт AI в будущем.",
    date: "29 ноября 2025",
    readTime: "11 мин",
    tag: "Аналитика",
    tagColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Блог о нейросетях и AI
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Полезные статьи, гайды и сравнения. Учимся использовать искусственный интеллект эффективно.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {articles.length} статей
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={"/blog/" + article.slug}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg hover:border-purple-200 dark:hover:border-purple-700 transition group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={"text-xs font-medium px-2 py-1 rounded-full " + article.tagColor}>
                    {article.tag}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{article.readTime}</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                  {article.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {article.description}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{article.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
