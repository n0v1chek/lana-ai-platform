import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Нейросеть для резюме и сопроводительных писем — LANA AI",
  description: "Как написать резюме и сопроводительное письмо с помощью AI. Шаблоны, примеры промптов, советы по поиску работы.",
  keywords: ["нейросеть для резюме", "AI резюме", "ChatGPT резюме", "сопроводительное письмо AI", "помощь с резюме"],
  openGraph: {
    title: "AI для резюме и сопроводительных писем",
    description: "Напишите идеальное резюме с нейросетью",
    url: "https://lanaaihelper.ru/blog/nejroset-dlya-rezyume",
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
            <span className="text-slate-500">7 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Как написать резюме и сопроводительное письмо с AI
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            AI поможет составить резюме, которое пройдёт ATS-системы, и написать 
            персонализированное сопроводительное письмо за минуты.
          </p>

          <div className="prose prose-lg prose-slate max-w-none">

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Что AI может сделать</h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-900 mb-2">✅ Резюме</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Структурировать опыт</li>
                  <li>• Подобрать ключевые слова</li>
                  <li>• Улучшить формулировки</li>
                  <li>• Адаптировать под вакансию</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-bold text-blue-900 mb-2">✅ Cover Letter</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Написать с нуля</li>
                  <li>• Персонализировать</li>
                  <li>• Подчеркнуть достижения</li>
                  <li>• Адаптировать стиль</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Шаг 1: Улучшение резюме</h2>

            <div className="bg-slate-100 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Промпт для улучшения:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Я ищу работу [должность]. Вот моё текущее резюме: [вставить текст]. 
                Улучши формулировки, добавь количественные достижения где возможно, 
                оптимизируй для ATS-систем. Дай результат в том же формате."
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 my-4">
              <p className="text-yellow-900 font-medium mb-2">💡 Секрет: количественные достижения</p>
              <p className="text-yellow-800 text-sm">
                <strong>Плохо:</strong> "Увеличил продажи"<br/>
                <strong>Хорошо:</strong> "Увеличил продажи на 45% за 6 месяцев, привлёк 120 новых клиентов"
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Шаг 2: Адаптация под вакансию</h2>

            <div className="bg-slate-100 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Промпт для адаптации:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Вот описание вакансии: [вставить текст вакансии]. 
                Вот моё резюме: [вставить резюме]. 
                Адаптируй резюме под эту вакансию: подчеркни релевантный опыт, 
                добавь ключевые слова из вакансии, убери нерелевантное."
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Шаг 3: Сопроводительное письмо</h2>

            <div className="bg-slate-100 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Промпт для cover letter:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Напиши сопроводительное письмо на вакансию [должность] в компании [название]. 
                Вот описание вакансии: [текст]. Вот моё резюме: [текст]. 
                Письмо должно быть: персонализированным под компанию, показывать мою мотивацию, 
                подчёркивать 2-3 главных достижения. Длина: 200-250 слов."
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Примеры промптов</h2>

            <div className="space-y-4 my-6">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="font-medium text-purple-900 mb-2">Анализ вакансии:</p>
                <p className="text-purple-800 font-mono text-sm">
                  "Проанализируй эту вакансию: [текст]. Выдели: ключевые требования, 
                  важные навыки, ключевые слова для резюме, что компания ценит в кандидатах."
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="font-medium text-purple-900 mb-2">Подготовка к интервью:</p>
                <p className="text-purple-800 font-mono text-sm">
                  "Я иду на собеседование на позицию [должность]. Вот описание вакансии: [текст]. 
                  Дай мне 10 вероятных вопросов и примеры хороших ответов на них."
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="font-medium text-purple-900 mb-2">Ответ на вопрос "Расскажите о себе":</p>
                <p className="text-purple-800 font-mono text-sm">
                  "Помоги составить elevator pitch на 60 секунд для собеседования. 
                  Моя позиция: [должность]. Мой опыт: [кратко]. Вакансия: [описание]."
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Важные советы</h2>

            <div className="space-y-3 my-6">
              <div className="flex items-start gap-3 bg-slate-100 p-4 rounded-xl">
                <span className="text-xl">1️⃣</span>
                <div>
                  <p className="font-medium text-slate-900">Проверяйте факты</p>
                  <p className="text-slate-600 text-sm">AI может приукрасить — убедитесь, что всё правда</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-100 p-4 rounded-xl">
                <span className="text-xl">2️⃣</span>
                <div>
                  <p className="font-medium text-slate-900">Персонализируйте</p>
                  <p className="text-slate-600 text-sm">Добавьте свой голос, не отправляйте шаблонный текст</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-100 p-4 rounded-xl">
                <span className="text-xl">3️⃣</span>
                <div>
                  <p className="font-medium text-slate-900">Адаптируйте каждый раз</p>
                  <p className="text-slate-600 text-sm">Одно резюме на все вакансии — плохая стратегия</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Какую модель выбрать</h2>

            <p className="text-slate-600 mb-4">
              Для резюме и cover letter лучше всего подходит <strong>Claude Sonnet</strong> — 
              он пишет наиболее естественные и структурированные тексты. 
              <strong>GPT-4o</strong> тоже отлично справляется.
            </p>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Создайте идеальное резюме</h3>
              <p className="opacity-90 mb-6">AI поможет выделиться среди кандидатов</p>
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
            <Link href="/blog/nejroset-dlya-tekstov" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Нейросети для текстов</h3>
              <p className="text-sm text-slate-500 mt-1">Какой AI лучше пишет?</p>
            </Link>
            <Link href="/blog/ai-dlya-anglijskogo" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">AI для английского</h3>
              <p className="text-sm text-slate-500 mt-1">Учите язык с нейросетью</p>
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
