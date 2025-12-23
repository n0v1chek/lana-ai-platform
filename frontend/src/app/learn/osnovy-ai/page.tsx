import type { Metadata } from "next";
import Link from "next/link";
type TableValue = { headers: string[]; rows: string[][] };
type ContentBlock = 
  | { type: "text"; value: string }
  | { type: "heading"; value: string }
  | { type: "tip"; value: string }
  | { type: "warning"; value: string }
  | { type: "table"; value: TableValue };



export const metadata: Metadata = {
  title: "Основы AI и нейросетей — Бесплатный курс | LANA AI",
  description: "Узнайте что такое нейросети, как работают ChatGPT, Claude, Gemini. Сравнение моделей, выбор AI под задачу. Бесплатные уроки для начинающих.",
  keywords: ["основы AI", "что такое нейросети", "ChatGPT обучение", "Claude vs ChatGPT", "Gemini обзор", "выбор нейросети"],
};

const lessons = [
  {
    id: "chto-takoe-nejroseti",
    num: 1,
    title: "Что такое нейросети простыми словами",
    description: "Разбираемся как работают нейросети без сложной математики. Почему они \"умные\" и что на самом деле происходит внутри.",
    
    content: [
      {
        type: "text",
        value: "Нейросеть — это программа, которая учится на примерах. Представьте ребёнка, который смотрит тысячи фотографий кошек и собак, пока не научится их различать. Нейросети работают похоже, только вместо глаз у них математические формулы."
      },
      {
        type: "heading",
        value: "Как нейросеть понимает текст?"
      },
      {
        type: "text", 
        value: "Языковые модели (ChatGPT, Claude) обучены на огромных объёмах текста из интернета. Они выучили паттерны языка: какие слова обычно идут вместе, как строятся предложения, что логично отвечать на вопросы. Когда вы пишете запрос, модель предсказывает наиболее вероятное продолжение — слово за словом."
      },
      {
        type: "tip",
        value: "Нейросеть не \"понимает\" как человек. Она очень хорошо имитирует понимание, предсказывая статистически верные ответы."
      },
      {
        type: "heading",
        value: "Почему нейросети иногда ошибаются?"
      },
      {
        type: "text",
        value: "Галлюцинации — когда AI уверенно выдаёт неправду — происходят потому, что модель оптимизирована на \"звучать убедительно\", а не на \"быть правдивой\". Она генерирует вероятный текст, даже если факты неверны."
      },
      {
        type: "warning",
        value: "Всегда проверяйте факты, которые выдаёт нейросеть. Особенно цифры, даты и цитаты."
      },
    ],
  },
  {
    id: "sravnenie-chatgpt-claude-gemini",
    num: 2,
    title: "ChatGPT, Claude, Gemini, DeepSeek — сравнение",
    description: "Честное сравнение главных нейросетей 2025 года. Плюсы, минусы, для чего лучше подходит каждая.",
    
    content: [
      {
        type: "text",
        value: "На рынке десятки нейросетей, но лидеров можно пересчитать по пальцам. Разберём каждую."
      },
      {
        type: "heading",
        value: "ChatGPT (OpenAI)"
      },
      {
        type: "text",
        value: "Самая известная нейросеть. GPT-4o — флагман, отлично справляется с большинством задач. Сильные стороны: универсальность, работа с изображениями, огромная база знаний. Минусы: цензура, иногда избыточно осторожен."
      },
      {
        type: "heading",
        value: "Claude (Anthropic)"
      },
      {
        type: "text",
        value: "Главный конкурент ChatGPT. Claude 3.5 Sonnet — лучший для работы с кодом и длинными текстами. Контекст до 200K токенов — можно загрузить целую книгу. Минусы: иногда отказывается от задач из-за \"этических соображений\"."
      },
      {
        type: "heading",
        value: "Gemini (Google)"
      },
      {
        type: "text",
        value: "Нейросеть от Google с доступом к актуальной информации. Gemini 2.5 Pro имеет контекст в 1 миллион токенов — рекорд рынка. Отлично работает с данными и аналитикой. Минусы: иногда уступает в креативности."
      },
      {
        type: "heading",
        value: "DeepSeek"
      },
      {
        type: "text",
        value: "Китайская нейросеть, которая удивила мир. DeepSeek V3 показывает качество на уровне GPT-4 при гораздо меньшей стоимости. Отлично для кода. Минусы: цензура на политические темы Китая."
      },
      {
        type: "table",
        value: {
          headers: ["Модель", "Лучше всего для", "Контекст"],
          rows: [
            ["GPT-4o", "Универсальные задачи", "128K"],
            ["Claude 3.5", "Код, длинные тексты", "200K"],
            ["Gemini 2.5", "Аналитика, данные", "1M"],
            ["DeepSeek V3", "Код, бюджетные задачи", "64K"],
          ]
        }
      },
    ],
  },
  {
    id: "kak-vybrat-nejroset",
    num: 3,
    title: "Как выбрать нейросеть под вашу задачу",
    description: "Практические рекомендации: какую модель использовать для текстов, кода, изображений, аналитики.",
    
    content: [
      {
        type: "text",
        value: "Универсальной нейросети не существует. Выбор зависит от задачи, бюджета и требований к качеству."
      },
      {
        type: "heading",
        value: "Для написания текстов"
      },
      {
        type: "text",
        value: "Claude 3.5 Sonnet — лучший выбор для статей, постов, копирайтинга. Пишет естественно, меньше \"воды\". GPT-4o — хорошая альтернатива, особенно для коротких текстов."
      },
      {
        type: "heading",
        value: "Для программирования"
      },
      {
        type: "text",
        value: "Claude 3.5 Sonnet или DeepSeek V3. Claude лучше понимает контекст большого проекта. DeepSeek дешевле и тоже отлично справляется."
      },
      {
        type: "heading",
        value: "Для анализа данных"
      },
      {
        type: "text",
        value: "Gemini 2.5 Pro — огромный контекст позволяет загрузить большие датасеты. GPT-4o с Code Interpreter тоже хорош для аналитики."
      },
      {
        type: "heading",
        value: "Для генерации изображений"
      },
      {
        type: "text",
        value: "Midjourney — лучшее качество и стиль. DALL-E 3 — проще использовать, интегрирован в ChatGPT. Ideogram — лучший для текста на изображениях."
      },
      {
        type: "tip",
        value: "Начните с бесплатных вариантов, чтобы понять что вам нужно. Потом переходите на платные для серьёзных задач."
      },
    ],
  },
  {
    id: "besplatnye-vs-platnye",
    num: 4,
    title: "Бесплатные vs платные AI — что выбрать",
    description: "Разбираем ограничения бесплатных версий и когда стоит платить за AI.",
    
    content: [
      {
        type: "text",
        value: "Почти все топовые нейросети имеют бесплатные версии. Но есть нюансы."
      },
      {
        type: "heading",
        value: "Что даёт бесплатная версия"
      },
      {
        type: "text",
        value: "ChatGPT Free: GPT-4o-mini (слабее полной версии), ограничения на количество запросов. Claude Free: лимиты на сообщения, нет доступа к Opus. Gemini Free: полноценный доступ, но с рекламой."
      },
      {
        type: "heading",
        value: "Когда стоит платить"
      },
      {
        type: "text",
        value: "1) Вы используете AI каждый день для работы. 2) Нужны длинные тексты или анализ больших документов. 3) Критична скорость и нет времени ждать. 4) Нужны продвинутые функции (код, изображения)."
      },
      {
        type: "heading",
        value: "Лайфхак: агрегаторы"
      },
      {
        type: "text",
        value: "Сервисы вроде LANA AI дают доступ ко всем моделям по единой подписке. Платите один раз — используете GPT-4o, Claude, Gemini, DeepSeek без отдельных аккаунтов."
      },
      {
        type: "tip",
        value: "Если вы в России — агрегаторы особенно полезны. Не нужен VPN и иностранные карты."
      },
    ],
  },
];

export default function OsnovyAiPage() {
  return (
    <>
      {/* Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto">
          <Link href="/learn" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Все модули
          </Link>
          <div className="text-sm font-medium opacity-80 mb-2">Модуль 01</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">🧠 Основы AI и нейросетей</h1>
          <p className="text-lg text-white/90 mb-4">
            Что такое нейросети, как они работают, обзор лучших моделей. Выбираем AI под задачу.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">{lessons.length} урока</span>
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {lessons.map((lesson, idx) => (
              <div key={lesson.id} id={lesson.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden scroll-mt-24">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {lesson.num}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{lesson.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400">{lesson.description}</p>
                </div>
                <div className="p-6 space-y-4">
                  {lesson.content.map((block, i) => {
                    if (block.type === "text") {
                      return <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">{block.value as string}</p>;
                    }
                    if (block.type === "heading") {
                      return <h3 key={i} className="text-lg font-semibold text-slate-900 dark:text-white mt-6">{block.value as string}</h3>;
                    }
                    if (block.type === "tip") {
                      return (
                        <div key={i} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                          <div className="flex gap-3">
                            <span className="text-green-600">💡</span>
                            <p className="text-green-800 dark:text-green-300">{block.value as string}</p>
                          </div>
                        </div>
                      );
                    }
                    if (block.type === "warning") {
                      return (
                        <div key={i} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                          <div className="flex gap-3">
                            <span className="text-amber-600">⚠️</span>
                            <p className="text-amber-800 dark:text-amber-300">{block.value as string}</p>
                          </div>
                        </div>
                      );
                    }
                    if (block.type === "table" && typeof block.value === "object") {
                      const table = block.value as { headers: string[]; rows: string[][] };
                      return (
                        <div key={i} className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-100 dark:bg-slate-700">
                                {table.headers.map((h, hi) => (
                                  <th key={hi} className="px-4 py-2 text-left font-semibold text-slate-900 dark:text-white">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {table.rows.map((row, ri) => (
                                <tr key={ri} className="border-b border-slate-200 dark:border-slate-700">
                                  {row.map((cell, ci) => (
                                    <td key={ci} className="px-4 py-2 text-slate-700 dark:text-slate-300">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Next Module */}
          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">Следующий модуль:</p>
            <Link
              href="/learn/prompt-injiniring"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:opacity-90 transition font-semibold"
            >
              Промпт-инжиниринг
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
