import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gemini от Google — полный обзор нейросети 2025 — LANA AI",
  description: "Обзор Gemini 2.0 Flash, 2.5 Flash и 2.5 Pro. Возможности, цены, сравнение с ChatGPT. Как использовать Gemini в России.",
  keywords: ["Gemini", "Google Gemini", "Gemini 2.5", "нейросеть Google", "Gemini vs ChatGPT"],
  openGraph: {
    title: "Gemini от Google — полный обзор 2025",
    description: "Всё о нейросети Gemini: модели, возможности, цены",
    url: "https://lanaaihelper.ru/blog/gemini-google-obzor",
  },
};

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            LANA AI
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
            <span className="text-slate-500">8 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Gemini от Google — полный обзор нейросети
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Gemini — семейство AI-моделей от Google, конкурирующее с ChatGPT и Claude. 
            Разберём все версии, их возможности и когда какую использовать.
          </p>

          <div className="prose prose-lg prose-slate max-w-none">
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
              <p className="text-blue-900 font-medium text-lg mb-2">🔵 Главное о Gemini</p>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>Разработчик: Google DeepMind</li>
                <li>Контекст: до 1 млн символов (рекорд в индустрии)</li>
                <li>Vision: анализ изображений во всех версиях</li>
                <li>Интеграция: Google Workspace, Android</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Модели Gemini в 2025</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-4 py-2 text-left">Модель</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Контекст</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Лучше всего для</th>
                    <th className="border border-slate-300 px-4 py-2 text-left">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Gemini 2.0 Flash</td>
                    <td className="border border-slate-300 px-4 py-2">1M символов</td>
                    <td className="border border-slate-300 px-4 py-2">Быстрые задачи, чат</td>
                    <td className="border border-slate-300 px-4 py-2 text-green-600">💰 Дёшево</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2 font-medium">Gemini 2.5 Flash</td>
                    <td className="border border-slate-300 px-4 py-2">1M символов</td>
                    <td className="border border-slate-300 px-4 py-2">Баланс цена/качество</td>
                    <td className="border border-slate-300 px-4 py-2 text-yellow-600">💰💰 Средне</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Gemini 2.5 Pro</td>
                    <td className="border border-slate-300 px-4 py-2">1M символов</td>
                    <td className="border border-slate-300 px-4 py-2">Сложные задачи, анализ</td>
                    <td className="border border-slate-300 px-4 py-2 text-orange-600">💰💰💰 Дорого</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Преимущества Gemini</h2>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Огромный контекст — 1 млн символов</h3>
            <p className="text-slate-600 mb-4">
              Это примерно 700 000 слов или книга на 1500 страниц. Можно загрузить целый учебник 
              или кодовую базу и задавать вопросы. У ChatGPT контекст 128K — в 8 раз меньше.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Мультимодальность</h3>
            <p className="text-slate-600 mb-4">
              Gemini понимает текст, изображения, видео и аудио. Можно загрузить фото документа, 
              скриншот ошибки или даже видео и получить анализ.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Интеграция с Google</h3>
            <p className="text-slate-600 mb-4">
              Gemini встроен в Gmail, Google Docs, Sheets. Может искать в интернете в реальном времени,
              работать с вашими файлами на Google Drive.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Gemini vs ChatGPT</h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-bold text-blue-900 mb-2">Gemini лучше:</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>✅ Работа с большими документами</li>
                  <li>✅ Анализ видео</li>
                  <li>✅ Поиск в интернете</li>
                  <li>✅ Интеграция с Google сервисами</li>
                  <li>✅ Выгодная цена</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-900 mb-2">ChatGPT лучше:</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>✅ Генерация изображений (DALL-E)</li>
                  <li>✅ Качество кода</li>
                  <li>✅ Креативное письмо</li>
                  <li>✅ Плагины и GPTs</li>
                  <li>✅ Голосовой режим</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Как использовать Gemini в России</h2>

            <p className="text-slate-600 mb-4">
              Официально Gemini в России недоступен. Но есть способы:
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 my-6">
              <h3 className="font-bold text-purple-900 mb-3">Через LANA AI (рекомендуем)</h3>
              <ul className="text-purple-800 space-y-2 text-sm">
                <li>✅ Все три версии Gemini доступны</li>
                <li>✅ Без VPN</li>
                <li>✅ Оплата в рублях</li>
                <li>✅ Поддержка изображений</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Какую версию выбрать?</h2>

            <div className="space-y-4 my-6">
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="font-medium text-slate-900">Gemini 2.0 Flash — для повседневных задач</p>
                <p className="text-slate-600 text-sm mt-1">Быстрые ответы, простые вопросы, переводы, чат. Самый дешёвый вариант.</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="font-medium text-slate-900">Gemini 2.5 Flash — универсальный выбор</p>
                <p className="text-slate-600 text-sm mt-1">Хороший баланс качества и цены. Подходит для большинства задач.</p>
              </div>
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="font-medium text-slate-900">Gemini 2.5 Pro — для сложных задач</p>
                <p className="text-slate-600 text-sm mt-1">Анализ больших документов, сложные рассуждения, исследования.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Попробуйте Gemini прямо сейчас</h3>
              <p className="opacity-90 mb-6">Все версии доступны в LANA AI. Без VPN, оплата в рублях.</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Начать бесплатно
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/claude-vs-chatgpt" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Claude vs ChatGPT</h3>
              <p className="text-sm text-slate-500 mt-1">Сравнение главных конкурентов</p>
            </Link>
            <Link href="/blog/luchshie-nejroseti-2025" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Лучшие нейросети 2025</h3>
              <p className="text-sm text-slate-500 mt-1">Лучшие AI модели</p>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-slate-900 text-slate-400 text-center">
        <p>© 2025 LANA AI Helper. Живчин А.С., самозанятый, ИНН 263109568337</p>
      </footer>
    </div>
  );
}
