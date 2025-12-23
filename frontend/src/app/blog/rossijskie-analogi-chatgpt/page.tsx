import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Российские аналоги ChatGPT — нейросети из России 2025 — LANA AI",
  description: "Обзор российских нейросетей: YandexGPT, GigaChat, Kandinsky. Сравнение с ChatGPT, возможности, ограничения.",
  keywords: ["российские нейросети", "YandexGPT", "GigaChat", "аналог ChatGPT", "нейросеть Россия"],
  openGraph: {
    title: "Российские аналоги ChatGPT",
    description: "YandexGPT, GigaChat и другие",
    url: "https://lanaaihelper.ru/blog/rossijskie-analogi-chatgpt",
  },
};

export default function ArticlePage() {
  return (
    <>
<article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/blog" className="text-purple-600 dark:text-purple-400 hover:underline">← База знаний</Link>
            <span className="text-slate-500 dark:text-slate-600 dark:text-slate-400">|</span>
            <span className="text-slate-500 dark:text-slate-400">29 ноября 2025</span>
            <span className="text-slate-500 dark:text-slate-600 dark:text-slate-400">|</span>
            <span className="text-slate-500 dark:text-slate-400">9 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Российские аналоги ChatGPT: что есть в 2025 году
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            В России развиваются свои нейросети: YandexGPT, GigaChat от Сбера. 
            Разбираем, могут ли они конкурировать с ChatGPT и Claude.
          </p>

          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Главные российские нейросети</h2>

            {/* YandexGPT */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔍</span>
                <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 m-0">YandexGPT (Алиса)</h3>
              </div>
              <p className="text-yellow-800 dark:text-yellow-200 mb-3">
                Нейросеть от Яндекса, встроенная в Алису и Яндекс Браузер. 
                Хорошо знает русский язык и российские реалии.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-green-700">✅ Бесплатный доступ</div>
                <div className="text-green-700">✅ Интеграция с Яндексом</div>
                <div className="text-green-700">✅ Хороший русский</div>
                <div className="text-red-700">❌ Уступает GPT-4</div>
              </div>
            </div>

            {/* GigaChat */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💚</span>
                <h3 className="text-xl font-bold text-green-900 m-0">GigaChat (Сбер)</h3>
              </div>
              <p className="text-green-800 mb-3">
                Нейросеть от Сбера. Умеет генерировать изображения (Kandinsky). 
                Активно развивается, но пока уступает мировым лидерам.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-green-700">✅ Генерация картинок</div>
                <div className="text-green-700">✅ Понимает русский контекст</div>
                <div className="text-red-700">❌ Слабее в логике</div>
                <div className="text-red-700">❌ Ограниченный API</div>
              </div>
            </div>

            {/* Kandinsky */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎨</span>
                <h3 className="text-xl font-bold text-purple-900 m-0">Kandinsky (Сбер)</h3>
              </div>
              <p className="text-purple-800 mb-3">
                Генератор изображений от Сбера. Бесплатный, понимает русские промпты. 
                Хорошая альтернатива DALL-E и Midjourney.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-green-700">✅ Бесплатный</div>
                <div className="text-green-700">✅ Русские промпты</div>
                <div className="text-green-700">✅ Хорошее качество</div>
                <div className="text-red-700">❌ Только картинки</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Сравнение с мировыми лидерами</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left">Параметр</th>
                    <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left">YandexGPT</th>
                    <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left">GigaChat</th>
                    <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left">GPT-4o</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Качество текстов</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐⭐</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐⭐</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Код</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐⭐⭐⭐</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Русский язык</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐⭐⭐</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐⭐⭐</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Логика и анализ</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐⭐</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐⭐</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">⭐⭐⭐⭐⭐</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Картинки</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-red-600">❌</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-green-600">✅ Kandinsky</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-green-600">✅ DALL-E</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Плюсы российских нейросетей</h2>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 my-4">
              <ul className="text-green-800 dark:text-green-200 space-y-2">
                <li>✅ Работают в России без VPN и ограничений</li>
                <li>✅ Оплата в рублях</li>
                <li>✅ Хорошо понимают русский контекст и реалии</li>
                <li>✅ Интеграция с российскими сервисами</li>
                <li>✅ Часто бесплатны или дешевле</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Минусы российских нейросетей</h2>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5 my-4">
              <ul className="text-red-800 dark:text-red-200 space-y-2">
                <li>❌ Уступают GPT-4 и Claude по качеству</li>
                <li>❌ Слабее в коде и сложной логике</li>
                <li>❌ Меньше возможностей и интеграций</li>
                <li>❌ Меньше обновлений и улучшений</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Когда что использовать</h2>

            <div className="space-y-3 my-6">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-medium text-slate-900 dark:text-white">Простые задачи на русском</p>
                <p className="text-slate-600 text-sm mt-1">→ YandexGPT или GigaChat (бесплатно)</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-medium text-slate-900 dark:text-white">Генерация картинок</p>
                <p className="text-slate-600 text-sm mt-1">→ Kandinsky (бесплатно, хорошее качество)</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-medium text-slate-900 dark:text-white">Программирование</p>
                <p className="text-slate-600 text-sm mt-1">→ GPT-4o или Claude (российские слабы в коде)</p>
              </div>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
                <p className="font-medium text-slate-900 dark:text-white">Серьёзная работа</p>
                <p className="text-slate-600 text-sm mt-1">→ GPT-4o, Claude, Gemini (мировые лидеры)</p>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 my-6">
              <p className="text-purple-900 font-medium mb-2">💡 Оптимальная стратегия</p>
              <p className="text-purple-800 dark:text-purple-200">
                Используйте российские нейросети для простых задач (бесплатно), 
                а для серьёзной работы — мировые модели через LANA AI (доступ в России, оплата в рублях).
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Лучшие мировые модели в России</h3>
              <p className="opacity-90 mb-6">GPT-4o, Claude, Gemini — без VPN, оплата в рублях</p>
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

      <section className="py-12 px-4 bg-slate-100 dark:bg-slate-700">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/chatgpt-v-rossii-2025" className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900 dark:text-white">ChatGPT в России</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Как пользоваться без VPN</p>
            </Link>
            <Link href="/blog/besplatnye-vs-platnye-nejroseti" className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900 dark:text-white">Бесплатные vs платные</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Стоит ли платить за AI?</p>
            </Link>
          </div>
        </div>
      </section>

      
    </>
  );
}