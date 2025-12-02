import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Лучшие нейросети для написания текстов 2025 — LANA AI",
  description: "Топ-5 AI для копирайтинга, статей, постов в соцсети. Сравнение ChatGPT, Claude, Gemini для работы с текстом.",
  keywords: ["нейросеть для текстов", "AI копирайтинг", "нейросеть для статей", "ChatGPT для текстов", "AI писатель"],
  openGraph: {
    title: "Лучшие нейросети для текстов 2025",
    description: "Какой AI лучше пишет?",
    url: "https://lanaaihelper.ru/blog/nejroset-dlya-tekstov",
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
            <span className="text-slate-500 dark:text-slate-400">8 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Лучшие нейросети для написания текстов в 2025
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Какую нейросеть выбрать для копирайтинга, статей, постов в соцсети? 
            Сравниваем топ-5 AI-моделей для работы с текстом.
          </p>

          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Топ-5 нейросетей для текстов</h2>

            {/* 1. Claude */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🥇</span>
                <h3 className="text-xl font-bold text-purple-900 m-0">Claude Sonnet — лучший для длинных текстов</h3>
              </div>
              <p className="text-purple-800 mb-3">
                Claude от Anthropic — лидер в работе с текстами. Пишет естественно, 
                без "водянистости", хорошо держит структуру даже в длинных документах.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">Статьи</span>
                <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">Документы</span>
                <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">Редактирование</span>
                <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs">Рерайт</span>
              </div>
            </div>

            {/* 2. GPT-4o */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🥈</span>
                <h3 className="text-xl font-bold text-green-900 m-0">GPT-4o — универсальный выбор</h3>
              </div>
              <p className="text-green-800 mb-3">
                ChatGPT (GPT-4o) — самый популярный AI. Хорошо справляется с любыми текстовыми задачами, 
                особенно силён в креативе и маркетинговых текстах.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Посты</span>
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Реклама</span>
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Креатив</span>
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">Email</span>
              </div>
            </div>

            {/* 3. Gemini */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🥉</span>
                <h3 className="text-xl font-bold text-blue-900 m-0">Gemini 2.5 Pro — для работы с источниками</h3>
              </div>
              <p className="text-blue-800 mb-3">
                Gemini от Google имеет контекст 1 млн символов — можно загрузить целую книгу 
                и попросить написать обзор или выжимку. Идеален для исследований.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">Исследования</span>
                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">Рефераты</span>
                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">Обзоры</span>
                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">Анализ</span>
              </div>
            </div>

            {/* 4. Grok */}
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">4️⃣</span>
                <h3 className="text-xl font-bold text-slate-900 m-0">Grok — для неформального контента</h3>
              </div>
              <p className="text-slate-700 mb-3">
                Grok от xAI пишет с юмором и без политкорректности. Отлично подходит 
                для развлекательного контента, мемов, провокационных постов.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs">Юмор</span>
                <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs">Соцсети</span>
                <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs">Неформат</span>
              </div>
            </div>

            {/* 5. DeepSeek */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">5️⃣</span>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100 m-0">DeepSeek — бюджетный вариант</h3>
              </div>
              <p className="text-red-800 dark:text-red-200 mb-3">
                DeepSeek — самый дешёвый из качественных AI. Подойдёт, если нужно 
                генерировать много контента и экономить бюджет.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-red-200 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs">Много текстов</span>
                <span className="bg-red-200 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs">Экономия</span>
                <span className="bg-red-200 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs">Переводы</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Какую выбрать под задачу?</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">Задача</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Лучший выбор</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Статья для блога</td>
                    <td className="border border-slate-300 px-4 py-2">Claude Sonnet</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Пост в соцсети</td>
                    <td className="border border-slate-300 px-4 py-2">GPT-4o или Grok</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Email-рассылка</td>
                    <td className="border border-slate-300 px-4 py-2">GPT-4o</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">SEO-текст</td>
                    <td className="border border-slate-300 px-4 py-2">Claude Sonnet</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Исследование/реферат</td>
                    <td className="border border-slate-300 px-4 py-2">Gemini 2.5 Pro</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Описание товара</td>
                    <td className="border border-slate-300 px-4 py-2">GPT-4o-mini</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Много контента дёшево</td>
                    <td className="border border-slate-300 px-4 py-2">DeepSeek Chat</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Советы по работе с AI-текстами</h2>

            <div className="space-y-4 my-6">
              <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-xl">
                <span className="text-xl">1️⃣</span>
                <div>
                  <p className="font-medium text-slate-900">Давайте контекст</p>
                  <p className="text-slate-600 text-sm">Расскажите для кого текст, какой стиль, какая цель</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-xl">
                <span className="text-xl">2️⃣</span>
                <div>
                  <p className="font-medium text-slate-900">Просите несколько вариантов</p>
                  <p className="text-slate-600 text-sm">"Напиши 3 варианта заголовка" — и выберите лучший</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-xl">
                <span className="text-xl">3️⃣</span>
                <div>
                  <p className="font-medium text-slate-900">Редактируйте итерациями</p>
                  <p className="text-slate-600 text-sm">"Сделай короче", "Добавь примеры", "Убери воду"</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-xl">
                <span className="text-xl">4️⃣</span>
                <div>
                  <p className="font-medium text-slate-900">Проверяйте факты</p>
                  <p className="text-slate-600 text-sm">AI может ошибаться в датах, именах, цифрах</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Все нейросети для текстов в одном месте</h3>
              <p className="opacity-90 mb-6">Claude, GPT-4o, Gemini, Grok, DeepSeek — выбирайте под задачу</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Начать писать
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/kak-pisat-prompty" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Как писать промпты</h3>
              <p className="text-sm text-slate-500 mt-1">Гайд по эффективным запросам</p>
            </Link>
            <Link href="/blog/luchshie-nejroseti-2025" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Лучшие нейросети 2025</h3>
              <p className="text-sm text-slate-500 mt-1">Полный обзор всех моделей</p>
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