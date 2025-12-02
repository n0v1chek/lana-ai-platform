import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GPT-4o vs GPT-4 Turbo — в чём разница? — LANA AI",
  description: "Сравнение GPT-4o и GPT-4 Turbo от OpenAI. Какую модель выбрать, отличия в скорости, качестве и возможностях.",
  keywords: ["GPT-4o", "GPT-4 Turbo", "сравнение GPT", "OpenAI модели", "какой GPT лучше"],
  openGraph: {
    title: "GPT-4o vs GPT-4 Turbo — сравнение",
    description: "Какую модель OpenAI выбрать?",
    url: "https://lanaaihelper.ru/blog/gpt4o-vs-gpt4-turbo",
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
            <span className="text-slate-500 dark:text-slate-400">5 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            GPT-4o vs GPT-4 Turbo — какую модель выбрать?
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            OpenAI предлагает несколько версий GPT-4. Разберёмся, чем отличаются 
            GPT-4o и GPT-4 Turbo и когда какую использовать.
          </p>

          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 my-6">
              <p className="text-green-900 font-medium text-lg mb-2">⚡ Короткий ответ</p>
              <p className="text-green-800 dark:text-green-200">
                <strong>GPT-4o</strong> — для большинства задач. Быстрее, дешевле, понимает изображения.<br/>
                <strong>GPT-4 Turbo</strong> — для максимального качества текстов, когда скорость не важна.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Сравнение моделей</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">Параметр</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">GPT-4o</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">GPT-4 Turbo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Скорость</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">⚡ Быстрый</td>
                    <td className="border border-slate-300 px-4 py-2 text-yellow-600">🐢 Медленнее</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Цена</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">💰 Дешевле</td>
                    <td className="border border-slate-300 px-4 py-2 text-red-600">💰💰 Дороже</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Vision (изображения)</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">✅ Да</td>
                    <td className="border border-slate-300 px-4 py-2 text-red-600">❌ Нет</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Качество текстов</td>
                    <td className="border border-slate-300 px-4 py-2">Отличное</td>
                    <td className="border border-slate-300 px-4 py-2">Превосходное</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Контекст</td>
                    <td className="border border-slate-300 px-4 py-2">128K</td>
                    <td className="border border-slate-300 px-4 py-2">128K</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Что значит "o" в GPT-4o?</h2>

            <p className="text-slate-600 dark:text-slate-300 mb-4">
              "O" означает "omni" (всё). GPT-4o — мультимодальная модель, которая изначально 
              обучена работать с текстом, изображениями и аудио. Это не просто GPT-4 + надстройка для картинок, 
              а новая архитектура.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Когда выбрать GPT-4o</h2>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 my-4">
              <ul className="text-green-800 dark:text-green-200 space-y-2">
                <li>✅ Повседневные задачи и вопросы</li>
                <li>✅ Работа с изображениями (анализ скриншотов, фото)</li>
                <li>✅ Программирование</li>
                <li>✅ Когда важна скорость ответа</li>
                <li>✅ Большой объём запросов (экономия)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Когда выбрать GPT-4 Turbo</h2>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 my-4">
              <ul className="text-blue-800 dark:text-blue-200 space-y-2">
                <li>✅ Максимальное качество текстов</li>
                <li>✅ Сложные аналитические задачи</li>
                <li>✅ Юридические и медицинские тексты</li>
                <li>✅ Когда нужна максимальная точность</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">А что с GPT-4o-mini?</h2>

            <p className="text-slate-600 dark:text-slate-300 mb-4">
              GPT-4o-mini — облегчённая версия GPT-4o. Ещё быстрее и дешевле, но немного 
              уступает по качеству. Идеальна для простых задач: переводы, ответы на вопросы, 
              базовое редактирование текстов.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5 my-4">
              <p className="text-yellow-900 dark:text-yellow-100 font-medium">💡 Рекомендация</p>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm mt-1">
                Начните с GPT-4o-mini для простых задач. Если качества не хватает — 
                переключитесь на GPT-4o. GPT-4 Turbo используйте только когда нужно 
                максимальное качество.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Все модели GPT-4 в одном месте</h3>
              <p className="opacity-90 mb-6">GPT-4o, GPT-4o-mini и GPT-4 Turbo доступны в LANA AI</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Попробовать
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/chatgpt-v-rossii-2025" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">ChatGPT в России 2025</h3>
              <p className="text-sm text-slate-500 mt-1">Как пользоваться без VPN</p>
            </Link>
            <Link href="/blog/claude-vs-chatgpt" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Claude vs ChatGPT</h3>
              <p className="text-sm text-slate-500 mt-1">Какая нейросеть лучше?</p>
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