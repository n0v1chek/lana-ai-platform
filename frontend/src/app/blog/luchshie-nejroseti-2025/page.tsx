import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Лучшие нейросети для работы в 2025 году — Лучшие AI модели",
  description: "Полный обзор лучших нейросетей 2025: GPT-4o, Claude, Gemini, DeepSeek, Grok. Сравнение возможностей, цен и задач. Все доступны в России.",
  keywords: ["лучшие нейросети 2025", "топ AI", "нейросети для работы", "GPT-4", "Claude", "Gemini", "DeepSeek"],
  openGraph: {
    title: "Лучшие нейросети для работы в 2025 году",
    description: "Лучшие AI модели: обзор и сравнение",
    url: "https://lanaaihelper.ru/blog/luchshie-nejroseti-2025",
  },
};

export default function ArticlePage() {
  return (
    <>
{/* Article */}
      <article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/blog" className="text-purple-600 dark:text-purple-400 hover:underline">← Блог</Link>
            <span className="text-slate-500 dark:text-slate-600 dark:text-slate-400">|</span>
            <span className="text-slate-500 dark:text-slate-400">29 ноября 2025</span>
            <span className="text-slate-500 dark:text-slate-600 dark:text-slate-400">|</span>
            <span className="text-slate-500 dark:text-slate-400">10 мин чтения</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Лучшие нейросети для работы в 2025 году
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Полный гид по AI-моделям: от бюджетных до премиум. Какую нейросеть выбрать 
            для текстов, кода, анализа? Все лучшие модели AI доступны в LANA AI Helper.
          </p>

          {/* Content */}
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 my-6">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">📋 Содержание</h3>
              <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
                <li>• <a href="#openai" className="hover:underline">OpenAI (ChatGPT)</a> — GPT-4o, o1, o3-mini</li>
                <li>• <a href="#anthropic" className="hover:underline">Anthropic (Claude)</a> — Claude 3.5, Opus 4</li>
                <li>• <a href="#google" className="hover:underline">Google (Gemini)</a> — Gemini 2.0, 2.5</li>
                <li>• <a href="#deepseek" className="hover:underline">DeepSeek</a> — DeepSeek Chat, R1</li>
                <li>• <a href="#xai" className="hover:underline">xAI (Grok)</a> — Grok 3</li>
                <li>• <a href="#mistral" className="hover:underline">Mistral AI</a> — Mistral Large</li>
              </ul>
            </div>

            {/* OpenAI */}
            <h2 id="openai" className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🟢 OpenAI (ChatGPT)</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Самые популярные нейросети в мире. OpenAI — создатели ChatGPT, лидеры рынка AI.
            </p>

            <div className="space-y-4 my-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">GPT-4o ⭐ Рекомендуем</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vision</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Универсальная модель. Быстрая, умная, понимает картинки. Лучший выбор для большинства задач.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Тексты</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Код</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Анализ фото</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Перевод</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">GPT-4o-mini</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vision</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Дешёвая и быстрая версия. Для простых задач: ответы на вопросы, короткие тексты.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Бюджетно</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Быстро</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Чат</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">o1</h3>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Reasoning</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Модель для сложной логики. Думает перед ответом, решает математику и алгоритмы.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Математика</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Логика</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Алгоритмы</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">o1-pro</h3>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Premium</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Топовая модель для исследований и сложнейших задач. Дорогая, но максимально умная.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">o3-mini</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Новинка</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Быстрые рассуждения. Дешевле o1, но тоже умеет думать логически.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">GPT-4 Turbo</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Длинный контекст 128K символов. Для работы с большими документами.
                </p>
              </div>
            </div>

            {/* Anthropic */}
            <h2 id="anthropic" className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🟠 Anthropic (Claude)</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Главный конкурент OpenAI. Claude — безопасный, точный, отлично пишет код и тексты.
            </p>

            <div className="space-y-4 my-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Claude 3.5 Sonnet ⭐ Рекомендуем</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vision</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Лучший баланс цена/качество. Отлично пишет, кодит, анализирует. Контекст 200K!
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Тексты</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Код</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Документы</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Claude 3.5 Haiku</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vision</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Быстрый и дешёвый. Для простых задач и большого объёма запросов.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Claude 3.7 Sonnet</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vision</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Улучшенная версия 3.5. Ещё умнее, точнее следует инструкциям.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Claude Sonnet 4</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vision</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Новое поколение Claude. Топовое качество для профессиональных задач.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Claude Opus 4 🏆</h3>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Premium</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Самая умная модель Claude. Для сложнейших задач: исследования, анализ, стратегия.
                </p>
              </div>
            </div>

            {/* Google */}
            <h2 id="google" className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🔵 Google (Gemini)</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              AI от Google. Быстрый, хорошо работает с фактами и поиском информации.
            </p>

            <div className="space-y-4 my-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Gemini 2.0 Flash ⭐ Бюджетный</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vision</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Очень дешёвый и быстрый. Идеален для простых вопросов и чата.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Gemini 2.5 Flash</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vision</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Улучшенная версия. Быстрый и при этом умный.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Gemini 2.5 Pro</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vision</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Топовая модель Google. Контекст 1M символов — рекорд в индустрии!
                </p>
              </div>
            </div>

            {/* DeepSeek */}
            <h2 id="deepseek" className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🟣 DeepSeek</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Китайская компания с прорывными моделями. Очень дешёвые и при этом умные.
            </p>

            <div className="space-y-4 my-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">DeepSeek Chat</h3>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Дёшево</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Отличное качество за минимальные деньги. Хорош для текстов и кода.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">DeepSeek R1</h3>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Reasoning</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Модель с рассуждениями, конкурент o1. Думает перед ответом.
                </p>
              </div>
            </div>

            {/* xAI */}
            <h2 id="xai" className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">⚫ xAI (Grok)</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Компания Илона Маска. Grok — дерзкий AI с чувством юмора.
            </p>

            <div className="space-y-4 my-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Grok 3</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Vision</span>
                </div>
                <p className="text-slate-600 text-sm mb-3">
                  Мощная модель с юмором. Менее "зацензуренная", отвечает на острые вопросы.
                </p>
              </div>
            </div>

            {/* Mistral */}
            <h2 id="mistral" className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🔴 Mistral AI</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Французский стартап. Открытые модели высокого качества.
            </p>

            <div className="space-y-4 my-6">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Mistral Large</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Топовая модель Mistral. Хороша для европейских языков, кода, анализа.
                </p>
              </div>
            </div>

            {/* Summary */}
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Какую выбрать?</h2>
            
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-600 text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 font-semibold">Задача</th>
                    <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 font-semibold">Лучшая модель</th>
                    <th className="border border-slate-300 dark:border-slate-600 px-3 py-2 font-semibold">Альтернатива</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Простой чат</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Gemini 2.0 Flash</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">GPT-4o-mini</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Тексты и статьи</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Claude 3.5 Sonnet</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">GPT-4o</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Программирование</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Claude 3.5 Sonnet</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">DeepSeek Chat</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Анализ фото</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">GPT-4o</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Claude 3.5 Sonnet</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Математика</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">o1</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">DeepSeek R1</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-800">
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Большие документы</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Gemini 2.5 Pro</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Claude Opus 4</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Бюджетно</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">DeepSeek Chat</td>
                    <td className="border border-slate-300 dark:border-slate-600 px-3 py-2">Gemini 2.0 Flash</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Все лучшие модели AI в одном месте</h3>
              <p className="opacity-90 mb-6">GPT-4o, Claude, Gemini, DeepSeek, Grok — без VPN, оплата в рублях</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Попробовать AI сейчас
              </Link>
            </div>

          </div>
        </div>
      </article>

      {/* Footer */}
      
    </>
  );
}