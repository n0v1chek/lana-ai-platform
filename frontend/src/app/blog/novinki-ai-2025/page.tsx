import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Что нового в AI в 2025 году — главные события — LANA AI",
  description: "Обзор главных событий в мире AI за 2025 год: новые модели, прорывы, тренды. GPT-4o, Claude 4, Gemini 2.5 и другие.",
  keywords: ["новости AI 2025", "новые нейросети", "тренды AI", "GPT-5", "будущее нейросетей"],
  openGraph: {
    title: "Новинки AI в 2025 году",
    description: "Главные события и тренды",
    url: "https://lanaaihelper.ru/blog/novinki-ai-2025",
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
            <span className="text-slate-500">10 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Что нового в AI в 2025 году: главные события
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            2025 год стал прорывным для искусственного интеллекта. 
            Обзор главных релизов, трендов и событий в мире нейросетей.
          </p>

          <div className="prose prose-lg prose-slate max-w-none">

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Главные релизы 2025</h2>

            {/* GPT-4o */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🟢</span>
                <h3 className="text-xl font-bold text-green-900 m-0">GPT-4o и o1/o3 от OpenAI</h3>
              </div>
              <p className="text-green-800 mb-3">
                OpenAI выпустила GPT-4o ("omni") — мультимодальную модель, работающую 
                с текстом, изображениями и аудио. Модели o1 и o3 показали новый уровень 
                "рассуждений" — AI, который думает перед ответом.
              </p>
              <p className="text-green-700 text-sm">
                <strong>Главное:</strong> o1 решает олимпиадные задачи по математике на уровне человека.
              </p>
            </div>

            {/* Claude 4 */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🟠</span>
                <h3 className="text-xl font-bold text-orange-900 m-0">Claude 4 (Sonnet и Opus) от Anthropic</h3>
              </div>
              <p className="text-orange-800 mb-3">
                Anthropic представила Claude 4 — новое поколение с улучшенным кодом, 
                анализом и "честностью". Claude Opus 4 стал одной из умнейших моделей в мире.
              </p>
              <p className="text-orange-700 text-sm">
                <strong>Главное:</strong> Claude 4 лучше всех пишет код и анализирует документы.
              </p>
            </div>

            {/* Gemini 2.5 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔵</span>
                <h3 className="text-xl font-bold text-blue-900 m-0">Gemini 2.5 от Google</h3>
              </div>
              <p className="text-blue-800 mb-3">
                Google обновила Gemini до версии 2.5 с контекстом 1 миллион символов. 
                Теперь можно загружать целые книги и видео для анализа.
              </p>
              <p className="text-blue-700 text-sm">
                <strong>Главное:</strong> Рекордный контекст позволяет работать с огромными документами.
              </p>
            </div>

            {/* DeepSeek */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔴</span>
                <h3 className="text-xl font-bold text-red-900 m-0">DeepSeek R1 из Китая</h3>
              </div>
              <p className="text-red-800 mb-3">
                Китайский стартап DeepSeek удивил мир моделью R1, которая конкурирует 
                с GPT-4 при значительно меньшей стоимости. Открытый код и доступность.
              </p>
              <p className="text-red-700 text-sm">
                <strong>Главное:</strong> Качество топовых моделей по цене в 10-20 раз ниже.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Главные тренды 2025</h2>

            <div className="space-y-4 my-6">
              <div className="flex items-start gap-4 bg-slate-100 p-5 rounded-xl">
                <span className="text-3xl">🧠</span>
                <div>
                  <h3 className="font-bold text-slate-900 m-0">Reasoning Models</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    AI, которые "думают" перед ответом. o1, o3, DeepSeek R1 — модели, 
                    решающие сложные задачи через цепочку рассуждений.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-slate-100 p-5 rounded-xl">
                <span className="text-3xl">🎬</span>
                <div>
                  <h3 className="font-bold text-slate-900 m-0">Мультимодальность</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    AI понимает не только текст, но и изображения, видео, аудио. 
                    GPT-4o, Gemini 2.5 работают со всеми типами контента.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-slate-100 p-5 rounded-xl">
                <span className="text-3xl">🤖</span>
                <div>
                  <h3 className="font-bold text-slate-900 m-0">AI-агенты</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    AI, которые выполняют задачи автономно: ищут информацию, 
                    пишут код, работают с файлами. Claude Computer Use, Devin.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-slate-100 p-5 rounded-xl">
                <span className="text-3xl">📉</span>
                <div>
                  <h3 className="font-bold text-slate-900 m-0">Снижение цен</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Конкуренция и оптимизация привели к снижению цен на AI. 
                    DeepSeek показал, что качество не требует огромных затрат.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-slate-100 p-5 rounded-xl">
                <span className="text-3xl">🏢</span>
                <div>
                  <h3 className="font-bold text-slate-900 m-0">Enterprise AI</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Компании массово внедряют AI в бизнес-процессы. 
                    От поддержки клиентов до анализа данных и автоматизации.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Что это значит для пользователей</h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-900 mb-2">✅ Хорошие новости</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• AI стал умнее и полезнее</li>
                  <li>• Цены снижаются</li>
                  <li>• Больше выбор моделей</li>
                  <li>• Новые возможности</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <h3 className="font-bold text-yellow-900 mb-2">⚠️ Вызовы</h3>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• Сложно выбрать модель</li>
                  <li>• Быстро устаревает информация</li>
                  <li>• Нужно учиться использовать</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Все новинки 2025 в одном месте</h3>
              <p className="opacity-90 mb-6">GPT-4o, Claude 4, Gemini 2.5, DeepSeek — попробуйте сами</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Начать сейчас
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/luchshie-nejroseti-2025" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Лучшие нейросети 2025</h3>
              <p className="text-sm text-slate-500 mt-1">Полный обзор моделей</p>
            </Link>
            <Link href="/blog/gpt4o-vs-gemini" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">GPT-4o vs Gemini</h3>
              <p className="text-sm text-slate-500 mt-1">Битва титанов</p>
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
