import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI для бизнеса — как нейросети автоматизируют работу — LANA AI",
  description: "Как использовать нейросети в бизнесе: автоматизация поддержки, генерация контента, анализ данных, продажи. Реальные примеры.",
  keywords: ["AI для бизнеса", "нейросеть для компании", "автоматизация AI", "ChatGPT для бизнеса", "AI продажи"],
  openGraph: {
    title: "AI для бизнеса — автоматизация с нейросетями",
    description: "Как компании используют AI",
    url: "https://lanaaihelper.ru/blog/ai-dlya-biznesa",
  },
};

export default function ArticlePage() {
  return (
    <>
<article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/blog" className="text-purple-600 dark:text-purple-400 hover:underline">← Блог</Link>
            <span className="text-slate-500 dark:text-slate-600 dark:text-slate-400">|</span>
            <span className="text-slate-500 dark:text-slate-400">29 ноября 2025</span>
            <span className="text-slate-500 dark:text-slate-600 dark:text-slate-400">|</span>
            <span className="text-slate-500 dark:text-slate-400">10 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            AI для бизнеса: как нейросети экономят время и деньги
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Нейросети — не игрушка, а рабочий инструмент. Разбираем конкретные способы 
            применения AI в бизнесе с реальными примерами.
          </p>

          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 my-6">
              <p className="text-green-900 font-medium text-lg mb-2">💰 AI экономит</p>
              <ul className="text-green-800 dark:text-green-200 space-y-1 text-sm">
                <li>• До 80% времени на рутинных задачах</li>
                <li>• Затраты на контент-производство</li>
                <li>• Расходы на первую линию поддержки</li>
                <li>• Время на анализ данных</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Где AI уже работает</h2>

            {/* Поддержка */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎧</span>
                <h3 className="text-xl font-bold text-blue-900 m-0">Клиентская поддержка</h3>
              </div>
              <p className="text-blue-800 mb-3">
                AI-бот отвечает на типовые вопросы 24/7. Сложные случаи передаёт человеку. 
                Один бот заменяет 3-5 операторов первой линии.
              </p>
              <div className="bg-blue-100 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
                <strong>Пример:</strong> Интернет-магазин подключил AI-бота. 
                70% вопросов закрываются автоматически: статус заказа, условия доставки, возврат.
              </div>
            </div>

            {/* Контент */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">✍️</span>
                <h3 className="text-xl font-bold text-purple-900 m-0">Генерация контента</h3>
              </div>
              <p className="text-purple-800 mb-3">
                Посты для соцсетей, описания товаров, email-рассылки, статьи для блога. 
                AI генерирует черновики, человек редактирует и публикует.
              </p>
              <div className="bg-purple-100 rounded-lg p-3 text-sm text-purple-800 dark:text-purple-200">
                <strong>Пример:</strong> Маркетолог делал 5 постов в неделю. 
                С AI делает 20 — тратит время только на финальную редактуру.
              </div>
            </div>

            {/* Продажи */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💼</span>
                <h3 className="text-xl font-bold text-orange-900 m-0">Продажи и лиды</h3>
              </div>
              <p className="text-orange-800 dark:text-orange-200 mb-3">
                AI квалифицирует лиды, отвечает на первичные вопросы, помогает выбрать товар. 
                Менеджеры работают только с "горячими" клиентами.
              </p>
              <div className="bg-orange-100 rounded-lg p-3 text-sm text-orange-800 dark:text-orange-200">
                <strong>Пример:</strong> AI-консультант на сайте недвижимости. 
                Отвечает на вопросы о планировках, ценах, ипотеке. Конверсия выросла на 40%.
              </div>
            </div>

            {/* Аналитика */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📊</span>
                <h3 className="text-xl font-bold text-green-900 m-0">Анализ данных</h3>
              </div>
              <p className="text-green-800 mb-3">
                Загрузите отчёт, и AI найдёт паттерны, аномалии, сделает выводы. 
                То, на что аналитик тратит день, AI делает за минуты.
              </p>
              <div className="bg-green-100 rounded-lg p-3 text-sm text-green-800 dark:text-green-200">
                <strong>Пример:</strong> Финансовый директор загружает квартальный отчёт. 
                AI выделяет ключевые метрики, находит отклонения, предлагает рекомендации.
              </div>
            </div>

            {/* HR */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">👥</span>
                <h3 className="text-xl font-bold text-pink-900 m-0">HR и рекрутинг</h3>
              </div>
              <p className="text-pink-800 mb-3">
                Первичный скрининг резюме, ответы кандидатам, подготовка вопросов для интервью, 
                написание вакансий.
              </p>
              <div className="bg-pink-100 rounded-lg p-3 text-sm text-pink-800">
                <strong>Пример:</strong> HR получает 200 резюме на вакансию. 
                AI отбирает топ-20 по критериям за 5 минут вместо 2 дней.
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">С чего начать</h2>

            <div className="space-y-4 my-6">
              <div className="flex items-start gap-3 bg-slate-100 p-4 rounded-xl">
                <span className="text-xl font-bold text-purple-600">1</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Найдите рутину</p>
                  <p className="text-slate-600 text-sm">Какие задачи отнимают много времени, но не требуют креатива?</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-100 p-4 rounded-xl">
                <span className="text-xl font-bold text-purple-600">2</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Протестируйте на одной задаче</p>
                  <p className="text-slate-600 text-sm">Не пытайтесь автоматизировать всё сразу. Начните с одного процесса.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-100 p-4 rounded-xl">
                <span className="text-xl font-bold text-purple-600">3</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Измерьте результат</p>
                  <p className="text-slate-600 text-sm">Сколько времени экономите? Какое качество? Есть ли ROI?</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-100 p-4 rounded-xl">
                <span className="text-xl font-bold text-purple-600">4</span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Масштабируйте</p>
                  <p className="text-slate-600 text-sm">Если работает — внедряйте в другие процессы.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Какую модель выбрать для бизнеса</h2>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700">
                    <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left">Задача</th>
                    <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left">Рекомендация</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Поддержка клиентов</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">GPT-4o-mini (быстро, дёшево)</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Контент и тексты</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Claude Sonnet (качество)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Анализ документов</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Gemini 2.5 Pro (большой контекст)</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Много запросов</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">DeepSeek (экономия)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Сложные задачи</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-4 py-2">Claude Opus, GPT-4o</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Внедрите AI в ваш бизнес</h3>
              <p className="opacity-90 mb-6">Все модели в одном месте. Начните экономить время уже сегодня.</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Попробовать для бизнеса
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-slate-100 dark:bg-slate-700">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/nejroset-dlya-tekstov" className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900 dark:text-white">Нейросети для текстов</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Какой AI лучше пишет?</p>
            </Link>
            <Link href="/blog/kak-pisat-prompty" className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900 dark:text-white">Как писать промпты</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Эффективные запросы к AI</p>
            </Link>
          </div>
        </div>
      </section>

      
    </>
  );
}