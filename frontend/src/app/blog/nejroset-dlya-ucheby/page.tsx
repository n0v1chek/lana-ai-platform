import type { Metadata } from "next";
import { CatLogo } from "@/components/CatLogo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Нейросети для учёбы — как использовать AI студенту — LANA AI",
  description: "Как нейросети помогают в учёбе: рефераты, эссе, подготовка к экзаменам, объяснение сложных тем. Этично ли использовать AI?",
  keywords: ["нейросеть для учёбы", "AI для студентов", "ChatGPT для учёбы", "нейросеть реферат", "AI помощник студента"],
  openGraph: {
    title: "Нейросети для учёбы",
    description: "Как AI помогает студентам",
    url: "https://lanaaihelper.ru/blog/nejroset-dlya-ucheby",
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
            <span className="text-slate-500">10 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Как использовать нейросети для учёбы
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            AI может стать вашим личным репетитором, помочь разобраться в сложных темах 
            и ускорить подготовку. Разбираемся, как использовать нейросети этично и эффективно.
          </p>

          <div className="prose prose-lg prose-slate max-w-none">

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
              <p className="text-yellow-900 font-medium text-lg mb-2">⚠️ Важно</p>
              <p className="text-yellow-800">
                AI — это инструмент для обучения, а не способ списать. 
                Используйте нейросети, чтобы понять тему, а не чтобы сдать работу без понимания.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Как AI помогает в учёбе</h2>

            <div className="space-y-4 my-6">
              <div className="flex items-start gap-4 bg-blue-50 p-5 rounded-xl">
                <span className="text-3xl">📚</span>
                <div>
                  <h3 className="font-bold text-blue-900 m-0">Объяснение сложных тем</h3>
                  <p className="text-blue-800 text-sm mt-1">
                    "Объясни квантовую механику как для пятиклассника" — AI адаптирует объяснение под ваш уровень
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-green-50 p-5 rounded-xl">
                <span className="text-3xl">❓</span>
                <div>
                  <h3 className="font-bold text-green-900 m-0">Ответы на вопросы</h3>
                  <p className="text-green-800 text-sm mt-1">
                    Задавайте любые вопросы по теме — AI объяснит и приведёт примеры
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-purple-50 p-5 rounded-xl">
                <span className="text-3xl">📝</span>
                <div>
                  <h3 className="font-bold text-purple-900 m-0">Помощь с текстами</h3>
                  <p className="text-purple-800 text-sm mt-1">
                    Структура эссе, план реферата, проверка грамматики, улучшение стиля
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-orange-50 p-5 rounded-xl">
                <span className="text-3xl">🧮</span>
                <div>
                  <h3 className="font-bold text-orange-900 m-0">Решение задач с объяснением</h3>
                  <p className="text-orange-800 text-sm mt-1">
                    AI не просто даёт ответ, а показывает ход решения пошагово
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-pink-50 p-5 rounded-xl">
                <span className="text-3xl">🎯</span>
                <div>
                  <h3 className="font-bold text-pink-900 m-0">Подготовка к экзаменам</h3>
                  <p className="text-pink-800 text-sm mt-1">
                    Генерация тестов, вопросов для самопроверки, конспектов
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Какую нейросеть выбрать</h2>

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
                    <td className="border border-slate-300 px-4 py-2">Объяснить тему</td>
                    <td className="border border-slate-300 px-4 py-2">GPT-4o, Claude</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Математика, физика</td>
                    <td className="border border-slate-300 px-4 py-2">o1, DeepSeek R1</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Написать эссе</td>
                    <td className="border border-slate-300 px-4 py-2">Claude Sonnet</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Анализ книги/статьи</td>
                    <td className="border border-slate-300 px-4 py-2">Gemini 2.5 Pro (большой контекст)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2">Иностранный язык</td>
                    <td className="border border-slate-300 px-4 py-2">GPT-4o, Claude</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2">Программирование</td>
                    <td className="border border-slate-300 px-4 py-2">Claude Sonnet, GPT-4o</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Примеры промптов для учёбы</h2>

            <div className="space-y-4 my-6">
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Объяснение темы:</p>
                <p className="text-slate-800 font-mono text-sm">
                  "Объясни теорию относительности простыми словами. Я студент первого курса физфака. Приведи примеры из жизни."
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Помощь с задачей:</p>
                <p className="text-slate-800 font-mono text-sm">
                  "Помоги решить эту задачу по математике: [условие]. Объясни каждый шаг решения, чтобы я понял принцип."
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">План эссе:</p>
                <p className="text-slate-800 font-mono text-sm">
                  "Составь план эссе на тему 'Влияние социальных сетей на подростков'. Нужно 5 пунктов с аргументами за и против."
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Подготовка к экзамену:</p>
                <p className="text-slate-800 font-mono text-sm">
                  "Сгенерируй 10 вопросов для самопроверки по теме 'Великая Отечественная война'. С вариантами ответов."
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Анализ текста:</p>
                <p className="text-slate-800 font-mono text-sm">
                  "Проанализируй стихотворение Пушкина 'Я вас любил'. Разбери метафоры, размер, тему."
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Этичное использование</h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-900 mb-2">✅ Это нормально:</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Попросить объяснить тему</li>
                  <li>• Проверить свою работу</li>
                  <li>• Получить идеи для эссе</li>
                  <li>• Разобрать решение задачи</li>
                  <li>• Улучшить стиль текста</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="font-bold text-red-900 mb-2">❌ Это плохо:</h3>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>• Сдавать AI-текст как свой</li>
                  <li>• Использовать на экзамене</li>
                  <li>• Копировать без понимания</li>
                  <li>• Обманывать преподавателя</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
              <p className="text-blue-900 font-medium mb-2">💡 Главный принцип</p>
              <p className="text-blue-800">
                AI должен помочь вам понять и научиться, а не сделать работу за вас. 
                Если вы не можете объяснить то, что "написали" — вы не научились.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Учитесь эффективнее с AI</h3>
              <p className="opacity-90 mb-6">Персональный репетитор по любому предмету 24/7</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Начать учиться
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/kak-pisat-prompty" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Как писать промпты</h3>
              <p className="text-sm text-slate-500 mt-1">Эффективные запросы к AI</p>
            </Link>
            <Link href="/blog/nejroset-dlya-tekstov" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Нейросети для текстов</h3>
              <p className="text-sm text-slate-500 mt-1">Какой AI лучше пишет?</p>
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
