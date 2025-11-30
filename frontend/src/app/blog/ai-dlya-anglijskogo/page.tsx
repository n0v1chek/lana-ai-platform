import type { Metadata } from "next";
import { CatLogo } from "@/components/CatLogo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI для изучения английского — нейросеть вместо репетитора — LANA AI",
  description: "Как учить английский с ChatGPT и Claude. Разговорная практика, грамматика, письмо, подготовка к IELTS. Бесплатный репетитор 24/7.",
  keywords: ["AI для английского", "учить английский с нейросетью", "ChatGPT английский", "разговорный английский AI"],
  openGraph: {
    title: "AI для изучения английского",
    description: "Нейросеть как репетитор 24/7",
    url: "https://lanaaihelper.ru/blog/ai-dlya-anglijskogo",
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
            <span className="text-slate-500">8 мин чтения</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Как учить английский с помощью AI
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Нейросеть — это терпеливый репетитор, который доступен 24/7, 
            не устаёт и адаптируется под ваш уровень. Разбираем, как использовать AI для английского.
          </p>

          <div className="prose prose-lg prose-slate max-w-none">

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-6">
              <p className="text-blue-900 font-medium text-lg mb-2">🎯 Почему AI эффективен</p>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Бесконечное терпение — не устаёт объяснять одно и то же</li>
                <li>• Мгновенная обратная связь — сразу исправит ошибки</li>
                <li>• Персонализация — подстраивается под ваш уровень</li>
                <li>• Доступность — практика в любое время</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Способы практики с AI</h2>

            {/* Разговор */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💬</span>
                <h3 className="text-xl font-bold text-green-900 m-0">Разговорная практика</h3>
              </div>
              <p className="text-green-800 mb-3">
                Просто переписывайтесь с AI на английском. Он будет отвечать, исправлять ошибки и объяснять.
              </p>
              <div className="bg-green-100 rounded-lg p-3 text-sm">
                <p className="text-green-800 font-medium mb-1">Промпт:</p>
                <p className="text-green-700 font-mono">"Let's have a casual conversation in English. I'm intermediate level. Correct my mistakes gently and explain why."</p>
              </div>
            </div>

            {/* Грамматика */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📚</span>
                <h3 className="text-xl font-bold text-purple-900 m-0">Объяснение грамматики</h3>
              </div>
              <p className="text-purple-800 mb-3">
                AI объяснит любое грамматическое правило простыми словами с примерами.
              </p>
              <div className="bg-purple-100 rounded-lg p-3 text-sm">
                <p className="text-purple-800 font-medium mb-1">Промпт:</p>
                <p className="text-purple-700 font-mono">"Explain the difference between Present Perfect and Past Simple. Give 5 examples for each and explain when to use which."</p>
              </div>
            </div>

            {/* Письмо */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">✍️</span>
                <h3 className="text-xl font-bold text-orange-900 m-0">Проверка письма</h3>
              </div>
              <p className="text-orange-800 mb-3">
                Напишите текст на английском, и AI проверит грамматику, стиль, предложит улучшения.
              </p>
              <div className="bg-orange-100 rounded-lg p-3 text-sm">
                <p className="text-orange-800 font-medium mb-1">Промпт:</p>
                <p className="text-orange-700 font-mono">"Check this text for grammar and style. Explain every mistake: [ваш текст]"</p>
              </div>
            </div>

            {/* Словарный запас */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📝</span>
                <h3 className="text-xl font-bold text-pink-900 m-0">Расширение словарного запаса</h3>
              </div>
              <p className="text-pink-800 mb-3">
                Просите синонимы, антонимы, примеры использования новых слов в контексте.
              </p>
              <div className="bg-pink-100 rounded-lg p-3 text-sm">
                <p className="text-pink-800 font-medium mb-1">Промпт:</p>
                <p className="text-pink-700 font-mono">"Give me 10 advanced synonyms for 'good' with example sentences for each."</p>
              </div>
            </div>

            {/* Ролевые игры */}
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-6 my-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎭</span>
                <h3 className="text-xl font-bold text-slate-900 m-0">Ролевые ситуации</h3>
              </div>
              <p className="text-slate-700 mb-3">
                Практикуйте реальные ситуации: собеседование, заказ в ресторане, переговоры.
              </p>
              <div className="bg-white rounded-lg p-3 text-sm border">
                <p className="text-slate-800 font-medium mb-1">Промпт:</p>
                <p className="text-slate-600 font-mono">"Let's roleplay a job interview. You're the interviewer for a marketing manager position. Ask me typical questions."</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Примеры полезных промптов</h2>

            <div className="space-y-3 my-6">
              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Для начинающих:</p>
                <p className="text-slate-800 font-mono text-sm">
                  "Be my English tutor. I'm a beginner. Use simple words, speak slowly, and explain everything in Russian if I don't understand."
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Для подготовки к IELTS:</p>
                <p className="text-slate-800 font-mono text-sm">
                  "Help me prepare for IELTS Speaking. Ask me Part 2 questions and give feedback on my answers: vocabulary, grammar, fluency."
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Для бизнес-английского:</p>
                <p className="text-slate-800 font-mono text-sm">
                  "Teach me business English phrases for meetings. Give 10 phrases with explanations and examples of when to use them."
                </p>
              </div>

              <div className="bg-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Для произношения (описание):</p>
                <p className="text-slate-800 font-mono text-sm">
                  "I often confuse 'th' sounds. Explain how to pronounce 'think' vs 'sink' and give me practice sentences."
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Какую модель выбрать</h2>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-900 mb-2">GPT-4o</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>✅ Отличный для разговоров</li>
                  <li>✅ Понимает контекст</li>
                  <li>✅ Хорошие объяснения</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                <h3 className="font-bold text-purple-900 mb-2">Claude Sonnet</h3>
                <ul className="text-purple-800 text-sm space-y-1">
                  <li>✅ Лучший для письма</li>
                  <li>✅ Детальные объяснения</li>
                  <li>✅ Проверка эссе</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
              <p className="text-yellow-900 font-medium mb-2">💡 Совет</p>
              <p className="text-yellow-800">
                Попросите AI исправлять вас сразу, а не в конце разговора: 
                "Correct my mistakes immediately as we talk, and briefly explain each error."
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Начните практиковать английский</h3>
              <p className="opacity-90 mb-6">AI-репетитор доступен 24/7. Практикуйтесь в любое время.</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Начать практику
              </Link>
            </div>
          </div>
        </div>
      </article>

      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/nejroset-dlya-ucheby" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Нейросети для учёбы</h3>
              <p className="text-sm text-slate-500 mt-1">Как AI помогает студентам</p>
            </Link>
            <Link href="/blog/kak-pisat-prompty" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Как писать промпты</h3>
              <p className="text-sm text-slate-500 mt-1">Эффективные запросы к AI</p>
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
