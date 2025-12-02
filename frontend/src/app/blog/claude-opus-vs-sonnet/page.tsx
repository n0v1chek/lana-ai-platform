import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Claude Opus vs Claude Sonnet — какую модель выбрать? — LANA AI",
  description: "Сравнение Claude Opus 4 и Claude Sonnet 4. Различия в качестве, скорости и стоимости. Когда какую модель использовать.",
  keywords: ["Claude Opus", "Claude Sonnet", "сравнение Claude", "Anthropic модели", "какой Claude лучше"],
  openGraph: {
    title: "Claude Opus vs Sonnet — сравнение",
    description: "Какую модель Anthropic выбрать?",
    url: "https://lanaaihelper.ru/blog/claude-opus-vs-sonnet",
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
            <span className="text-slate-500 dark:text-slate-400">6 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Claude Opus vs Claude Sonnet — в чём разница?
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Anthropic предлагает несколько версий Claude. Разберёмся, чем отличаются 
            флагманский Opus и универсальный Sonnet, и когда какой выбрать.
          </p>

          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 my-6">
              <p className="text-orange-900 font-medium text-lg mb-2">⚡ Короткий ответ</p>
              <p className="text-orange-800 dark:text-orange-200">
                <strong>Claude Sonnet</strong> — для 90% задач. Отличный баланс качества и скорости.<br/>
                <strong>Claude Opus</strong> — для сложнейших задач, где нужен максимальный интеллект.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Линейка моделей Claude</h2>

            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Anthropic назвала свои модели в честь музыкальных форм — от простых к сложным:
            </p>

            <div className="space-y-3 my-6">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-medium text-slate-900">🎵 Haiku — быстрый и дешёвый</p>
                <p className="text-slate-600 text-sm mt-1">Для простых задач, где важна скорость</p>
              </div>
              <div className="bg-purple-100 rounded-xl p-4">
                <p className="font-medium text-purple-900">🎼 Sonnet — универсальный</p>
                <p className="text-purple-700 text-sm mt-1">Оптимальный баланс для большинства задач</p>
              </div>
              <div className="bg-amber-100 rounded-xl p-4">
                <p className="font-medium text-amber-900 dark:text-amber-100">🎹 Opus — максимальный интеллект</p>
                <p className="text-amber-700 text-sm mt-1">Самая умная модель для сложнейших задач</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Сравнение Opus и Sonnet</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">Параметр</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Claude Sonnet 4</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Claude Opus 4</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Интеллект</td>
                    <td className="border border-slate-300 px-4 py-2">⭐⭐⭐⭐ Высокий</td>
                    <td className="border border-slate-300 px-4 py-2">⭐⭐⭐⭐⭐ Максимальный</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Скорость</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">⚡ Быстрый</td>
                    <td className="border border-slate-300 px-4 py-2 text-yellow-600">🐢 Медленнее</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Цена</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">💰 Доступный</td>
                    <td className="border border-slate-300 px-4 py-2 text-red-600">💰💰💰 Дорогой</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Vision</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">✅ Да</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">✅ Да</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Контекст</td>
                    <td className="border border-slate-300 px-4 py-2">200K</td>
                    <td className="border border-slate-300 px-4 py-2">200K</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Когда выбрать Sonnet</h2>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5 my-4">
              <ul className="text-purple-800 dark:text-purple-200 space-y-2">
                <li>✅ Повседневные рабочие задачи</li>
                <li>✅ Программирование и код-ревью</li>
                <li>✅ Написание и редактирование текстов</li>
                <li>✅ Анализ документов</li>
                <li>✅ Переводы</li>
                <li>✅ Когда нужен быстрый ответ</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Когда выбрать Opus</h2>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 my-4">
              <ul className="text-amber-800 dark:text-amber-200 space-y-2">
                <li>✅ Сложные исследовательские задачи</li>
                <li>✅ Глубокий анализ и рассуждения</li>
                <li>✅ Написание научных работ</li>
                <li>✅ Стратегическое планирование</li>
                <li>✅ Задачи, где Sonnet не справился</li>
                <li>✅ Максимальная точность критична</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Что насчёт версий 3.5 и 3.7?</h2>

            <p className="text-slate-600 dark:text-slate-300 mb-4">
              В LANA AI доступны несколько версий Claude:
            </p>

            <div className="space-y-3 my-6">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-medium text-slate-900">Claude 3.5 Haiku</p>
                <p className="text-slate-600 text-sm mt-1">Самый быстрый и дешёвый. Для простых задач.</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-medium text-slate-900">Claude 3.5 Sonnet</p>
                <p className="text-slate-600 text-sm mt-1">Предыдущее поколение Sonnet. Всё ещё отличный.</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-medium text-slate-900">Claude 3.7 Sonnet</p>
                <p className="text-slate-600 text-sm mt-1">Улучшенная версия с гибридным мышлением.</p>
              </div>
              <div className="bg-purple-100 rounded-xl p-4">
                <p className="font-medium text-purple-900">Claude Sonnet 4 ⭐</p>
                <p className="text-purple-700 text-sm mt-1">Новейший Sonnet. Рекомендуем для большинства.</p>
              </div>
              <div className="bg-amber-100 rounded-xl p-4">
                <p className="font-medium text-amber-900 dark:text-amber-100">Claude Opus 4 🏆</p>
                <p className="text-amber-700 text-sm mt-1">Максимальный интеллект для сложнейших задач.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Все версии Claude доступны</h3>
              <p className="opacity-90 mb-6">От быстрого Haiku до мощного Opus — выбирайте под задачу</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Попробовать Claude
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/claude-vs-chatgpt" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Claude vs ChatGPT</h3>
              <p className="text-sm text-slate-500 mt-1">Сравнение с конкурентом</p>
            </Link>
            <Link href="/blog/gpt4o-vs-gpt4-turbo" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">GPT-4o vs GPT-4 Turbo</h3>
              <p className="text-sm text-slate-500 mt-1">Сравнение моделей OpenAI</p>
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