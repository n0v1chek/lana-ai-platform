import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Как писать промпты для нейросети: полный гайд — LANA AI Helper",
  description: "Секреты эффективного общения с AI. Примеры промптов для ChatGPT и Claude: тексты, код, анализ, креатив. Шаблоны и формулы.",
  keywords: ["как писать промпты", "промпты для ChatGPT", "промпт инженерия", "примеры промптов", "prompt engineering"],
  openGraph: {
    title: "Как писать промпты для нейросети",
    description: "Полный гайд с примерами и шаблонами",
    url: "https://lanaaihelper.ru/blog/kak-pisat-prompty",
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
            <span className="text-slate-500 dark:text-slate-600">|</span>
            <span className="text-slate-500 dark:text-slate-400">29 ноября 2025</span>
            <span className="text-slate-500 dark:text-slate-600">|</span>
            <span className="text-slate-500 dark:text-slate-400">12 мин чтения</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Как писать промпты для нейросети: полный гайд
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Промпт — это запрос к нейросети. От того, как вы его напишете, зависит качество ответа. 
            Разберём правила, примеры и готовые шаблоны.
          </p>

          {/* Content */}
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
            
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Главное правило</h2>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 my-6">
              <p className="text-yellow-900 dark:text-yellow-100 font-medium text-lg">
                🎯 Чем точнее запрос — тем точнее ответ
              </p>
              <p className="text-yellow-800 dark:text-yellow-200 mt-2">
                AI не читает мысли. Если вы написали расплывчато — получите расплывчатый ответ.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
                <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">❌ Плохо</h3>
                <p className="text-red-800 dark:text-red-200 text-sm italic">"Напиши текст про маркетинг"</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                <h3 className="font-bold text-green-900 dark:text-green-100 mb-2">✅ Хорошо</h3>
                <p className="text-green-800 text-sm italic">"Напиши пост для Telegram-канала о digital-маркетинге. Тема: 5 трендов SMM в 2025. Стиль: экспертный, но простой. Длина: 1500 знаков. Добавь эмодзи."</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Формула хорошего промпта</h2>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 my-6">
              <p className="text-purple-900 font-mono text-lg mb-4">
                Роль + Задача + Контекст + Формат + Ограничения
              </p>
              <ul className="text-purple-800 dark:text-purple-200 space-y-2 text-sm">
                <li><strong>Роль:</strong> Кем должен быть AI? (эксперт, копирайтер, программист)</li>
                <li><strong>Задача:</strong> Что конкретно нужно сделать?</li>
                <li><strong>Контекст:</strong> Для кого? Зачем? Какая ситуация?</li>
                <li><strong>Формат:</strong> Как должен выглядеть ответ? (список, статья, код)</li>
                <li><strong>Ограничения:</strong> Длина, стиль, что НЕ нужно делать</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Примеры промптов по задачам</h2>

            {/* Тексты */}
            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">📝 Для текстов и контента</h3>
            
            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Пост для соцсетей:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Ты — SMM-специалист с 10-летним опытом. Напиши пост для Instagram о запуске нового продукта — органической косметики для лица. Целевая аудитория: женщины 25-40 лет, заботящиеся о здоровье. Стиль: дружелюбный, вдохновляющий. Длина: до 2000 знаков. Добавь призыв к действию и 5-7 релевантных хештегов."
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Статья для блога:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Напиши SEO-статью на тему 'Как выбрать ноутбук для работы в 2025 году'. Структура: введение, 5-7 критериев выбора с пояснениями, топ-3 модели с ценами, заключение. Длина: 5000-7000 знаков. Ключевые слова для SEO: ноутбук для работы, лучший ноутбук 2025, как выбрать ноутбук. Стиль: экспертный, но понятный новичку."
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Email-рассылка:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Ты — email-маркетолог. Напиши письмо для рассылки интернет-магазина одежды. Цель: вернуть клиентов, которые не покупали 3 месяца. Предложи скидку 20%. Тон: тёплый, персонализированный. Тема письма должна иметь open rate выше 30%. Длина письма: 150-200 слов."
              </p>
            </div>

            {/* Код */}
            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">💻 Для программирования</h3>
            
            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Написать функцию:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Напиши функцию на Python, которая принимает список email-адресов и возвращает только валидные. Используй регулярные выражения. Добавь docstring и типизацию. Покажи примеры использования и тесты."
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Исправить баг:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Вот мой код на JavaScript: [вставить код]. Он должен сортировать массив объектов по дате, но выдаёт ошибку TypeError. Найди ошибку, объясни причину и предложи исправление."
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Code review:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Ты — senior developer. Сделай code review этого React-компонента. Проверь: производительность, чистоту кода, потенциальные баги, соответствие best practices. Предложи улучшения с примерами кода. [вставить код]"
              </p>
            </div>

            {/* Анализ */}
            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">📊 Для анализа</h3>
            
            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Анализ данных:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Проанализируй эти данные о продажах за квартал: [вставить данные]. Найди: 1) Топ-3 продукта по выручке, 2) Месяц с максимальными продажами, 3) Тренды роста/падения. Представь результаты в виде краткого отчёта с выводами и рекомендациями."
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Анализ конкурентов:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Я запускаю сервис доставки еды в Москве. Проанализируй бизнес-модели Яндекс.Еды и Delivery Club. Выдели: их сильные и слабые стороны, ценовую политику, УТП. Предложи, как я могу от них отличиться."
              </p>
            </div>

            {/* Креатив */}
            <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">🎨 Для креатива</h3>
            
            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Генерация идей:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Придумай 10 идей для YouTube-канала о личных финансах. Для каждой идеи укажи: название видео, краткое описание (2-3 предложения), почему это будет интересно аудитории 25-35 лет."
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-sm text-slate-500 mb-2">Нейминг:</p>
              <p className="text-slate-800 font-mono text-sm">
                "Придумай 15 вариантов названия для мобильного приложения — планировщика задач с AI-помощником. Требования: легко произносится, запоминается, свободный домен .com, работает на русском и английском рынках. Для каждого названия объясни идею."
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Продвинутые техники</h2>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Chain of Thought (Цепочка рассуждений)</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Попросите AI думать пошагово — качество ответа вырастет.
            </p>
            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-slate-800 font-mono text-sm">
                "Реши эту задачу пошагово, объясняя каждый шаг рассуждений: [задача]"
              </p>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Few-shot (Примеры)</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Покажите AI примеры желаемого результата.
            </p>
            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-slate-800 font-mono text-sm">
                "Перепиши заголовки в стиле Яндекс.Дзен.<br/><br/>
                Пример 1:<br/>
                Было: 'Обзор iPhone 15'<br/>
                Стало: 'Купил iPhone 15 и пожалел? Честный отзыв после месяца использования'<br/><br/>
                Пример 2:<br/>
                Было: 'Рецепт борща'<br/>
                Стало: 'Борщ по рецепту бабушки: секрет, который знают только в нашей семье'<br/><br/>
                Теперь перепиши: 'Как выбрать ноутбук'"
              </p>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Роль + персона</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Детально опишите, кем должен быть AI.
            </p>
            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-5 my-4">
              <p className="text-slate-800 font-mono text-sm">
                "Ты — Дмитрий, опытный Python-разработчик с 15-летним стажем. Ты работал в Яндексе и Google. Ты любишь чистый код и ненавидишь костыли. Отвечай так, как ответил бы на code review junior-разработчику: строго, но по делу, с конкретными примерами."
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Чего избегать</h2>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 my-6">
              <ul className="text-red-800 dark:text-red-200 space-y-2">
                <li>❌ <strong>Слишком коротко:</strong> "Напиши текст" — непонятно какой</li>
                <li>❌ <strong>Противоречия:</strong> "Коротко и подробно" — AI запутается</li>
                <li>❌ <strong>Несколько задач сразу:</strong> лучше разбить на отдельные запросы</li>
                <li>❌ <strong>Нет контекста:</strong> AI не знает вашу ситуацию</li>
                <li>❌ <strong>Ожидание идеала с первого раза:</strong> уточняйте и дорабатывайте</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Итерации — ключ к успеху</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Редко получается идеальный результат с первого раза. Это нормально! Уточняйте:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-4 space-y-1">
              <li>"Сделай короче"</li>
              <li>"Добавь больше примеров"</li>
              <li>"Перепиши в более формальном стиле"</li>
              <li>"Это хорошо, но измени вот эту часть..."</li>
            </ul>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Практикуйтесь на LANA AI</h3>
              <p className="opacity-90 mb-6">Лучшие нейросети для любых задач. Платите только за использование.</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Попробовать AI сейчас
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Заключение</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Хороший промпт = конкретная роль + чёткая задача + контекст + формат. 
              Не бойтесь экспериментировать и уточнять. С практикой вы научитесь получать 
              от AI именно то, что нужно, с первых попыток.
            </p>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/claude-vs-chatgpt" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Claude vs ChatGPT</h3>
              <p className="text-sm text-slate-500 mt-1">Какая нейросеть лучше?</p>
            </Link>
            <Link href="/blog/luchshie-nejroseti-2025" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Лучшие нейросети 2025</h3>
              <p className="text-sm text-slate-500 mt-1">Лучшие AI модели</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-slate-400 text-center">
        <p>© 2025 LANA AI Helper. ИНН 263109568337</p>
      </footer>
    </>
  );
}