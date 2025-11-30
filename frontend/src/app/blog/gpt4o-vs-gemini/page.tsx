import type { Metadata } from "next";
import { CatLogo } from "@/components/CatLogo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GPT-4o vs Gemini 2.5 Pro — сравнение гигантов 2025 — LANA AI",
  description: "Битва OpenAI и Google: GPT-4o против Gemini 2.5 Pro. Сравнение возможностей, качества, скорости. Какую модель выбрать?",
  keywords: ["GPT-4o vs Gemini", "сравнение нейросетей", "OpenAI vs Google", "Gemini 2.5 Pro", "какая нейросеть лучше"],
  openGraph: {
    title: "GPT-4o vs Gemini — битва гигантов",
    description: "OpenAI против Google: кто победит?",
    url: "https://lanaaihelper.ru/blog/gpt4o-vs-gemini",
  },
};

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <CatLogo size={32} />
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-slate-600 hover:text-purple-600 transition">Блог</Link>
            <Link href="/register" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition">
              Попробовать
            </Link>
          </nav>
        </div>
      </header>

      <article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/blog" className="text-purple-600 hover:underline">← Блог</Link>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">29 ноября 2025</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">7 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            GPT-4o vs Gemini 2.5 Pro — битва титанов AI
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            OpenAI и Google — два главных игрока в AI. Сравниваем их флагманские модели: 
            GPT-4o и Gemini 2.5 Pro. Кто победит?
          </p>

          <div className="prose prose-lg prose-slate max-w-none">

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
              <p className="text-yellow-900 font-medium text-lg mb-2">⚡ Короткий ответ</p>
              <p className="text-yellow-800">
                <strong>GPT-4o</strong> — лучше для креатива, кода и повседневных задач<br/>
                <strong>Gemini 2.5 Pro</strong> — лучше для работы с большими документами и исследований
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Сравнение характеристик</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">Параметр</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">GPT-4o</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Gemini 2.5 Pro</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Компания</td>
                    <td className="border border-slate-300 px-4 py-2">OpenAI</td>
                    <td className="border border-slate-300 px-4 py-2">Google</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Контекст</td>
                    <td className="border border-slate-300 px-4 py-2">128K символов</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600 font-medium">1M символов 🏆</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Vision</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">✅ Да</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">✅ Да</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Видео</td>
                    <td className="border border-slate-300 px-4 py-2 text-red-600">❌ Нет</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">✅ Да 🏆</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Генерация картинок</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">✅ DALL-E 🏆</td>
                    <td className="border border-slate-300 px-4 py-2 text-red-600">❌ Нет</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Скорость</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">Быстрый 🏆</td>
                    <td className="border border-slate-300 px-4 py-2">Средний</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Поиск в интернете</td>
                    <td className="border border-slate-300 px-4 py-2">Через плагины</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">Встроенный 🏆</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Главное преимущество Gemini: контекст</h2>

            <p className="text-slate-600 mb-4">
              1 миллион символов — это примерно 700 000 слов. Можно загрузить:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <span className="text-2xl">📚</span>
                <p className="text-blue-900 font-medium text-sm mt-1">Книга целиком</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <span className="text-2xl">📁</span>
                <p className="text-blue-900 font-medium text-sm mt-1">Весь проект</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <span className="text-2xl">📊</span>
                <p className="text-blue-900 font-medium text-sm mt-1">Годовой отчёт</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <span className="text-2xl">🎬</span>
                <p className="text-blue-900 font-medium text-sm mt-1">Видео</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Главное преимущество GPT-4o: экосистема</h2>

            <p className="text-slate-600 mb-4">
              OpenAI имеет развитую экосистему: DALL-E для картинок, GPTs (кастомные боты), 
              плагины, API с лучшей документацией. ChatGPT — самый популярный AI в мире.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Когда что выбрать</h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-900 mb-2">GPT-4o лучше для:</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>✅ Креативного письма</li>
                  <li>✅ Программирования</li>
                  <li>✅ Генерации изображений</li>
                  <li>✅ Повседневных задач</li>
                  <li>✅ Чат-ботов</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-bold text-blue-900 mb-2">Gemini лучше для:</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>✅ Анализа больших документов</li>
                  <li>✅ Работы с видео</li>
                  <li>✅ Исследований</li>
                  <li>✅ Поиска информации</li>
                  <li>✅ Google Workspace</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Качество ответов</h2>

            <p className="text-slate-600 mb-4">
              По качеству ответов модели очень близки. На большинстве задач разница минимальна. 
              Выбор зависит от конкретных потребностей:
            </p>

            <div className="space-y-3 my-6">
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="font-medium text-slate-900">Нужно обработать 500-страничный PDF?</p>
                <p className="text-slate-600 text-sm mt-1">→ Gemini (большой контекст)</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="font-medium text-slate-900">Нужно написать код и объяснить?</p>
                <p className="text-slate-600 text-sm mt-1">→ GPT-4o (лучше объясняет)</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="font-medium text-slate-900">Нужно сгенерировать картинку?</p>
                <p className="text-slate-600 text-sm mt-1">→ GPT-4o (есть DALL-E)</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="font-medium text-slate-900">Нужно проанализировать видео?</p>
                <p className="text-slate-600 text-sm mt-1">→ Gemini (понимает видео)</p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 my-6">
              <p className="text-purple-900 font-medium mb-2">💡 Лучшая стратегия</p>
              <p className="text-purple-800">
                Используйте обе модели под разные задачи. В LANA AI доступны и GPT-4o, 
                и Gemini 2.5 Pro — выбирайте под конкретную задачу.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Попробуйте обе модели</h3>
              <p className="opacity-90 mb-6">GPT-4o и Gemini 2.5 Pro в одном месте</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Сравнить самому
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/gemini-google-obzor" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Gemini от Google</h3>
              <p className="text-sm text-slate-500 mt-1">Полный обзор</p>
            </Link>
            <Link href="/blog/claude-vs-chatgpt" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Claude vs ChatGPT</h3>
              <p className="text-sm text-slate-500 mt-1">Ещё одно сравнение</p>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-slate-900 text-slate-400 text-center">
        <p>© 2025 LANA AI Helper. ИНН 263109568337</p>
      </footer>
    </div>
  );
}
