import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Автоматизация с n8n и AI — Создание workflow | LANA AI",
  description: "Научитесь создавать автоматизации с n8n: Telegram боты, обработка заявок, интеграция с AI. Пошаговые уроки.",
  keywords: ["n8n автоматизация", "n8n tutorial", "workflow автоматизация", "n8n telegram бот", "n8n AI"],
};

type TableValue = { headers: string[]; rows: string[][] };
type ContentBlock = 
  | { type: "text"; value: string }
  | { type: "heading"; value: string }
  | { type: "tip"; value: string }
  | { type: "warning"; value: string }
  | { type: "table"; value: TableValue };

const lessons = [
  {
    id: "chto-takoe-n8n",
    num: 1,
    title: "Что такое n8n и зачем он нужен",
    description: "Знакомство с платформой автоматизации: возможности, преимущества, когда использовать.",
    
    content: [
      {
        type: "text",
        value: "n8n — это визуальный конструктор автоматизаций с открытым кодом. Вы соединяете блоки (ноды) и создаёте workflow, которые выполняются автоматически. Никакого кода — только drag-and-drop."
      },
      {
        type: "heading",
        value: "Что можно автоматизировать"
      },
      {
        type: "text",
        value: "• Telegram-боты (приём сообщений, ответы, рассылки)\n• Обработка заявок с сайта\n• Интеграция с CRM (amoCRM, Bitrix24)\n• Email-автоответчики\n• Парсинг данных\n• Генерация контента с AI\n• Уведомления в мессенджеры\n• Синхронизация данных между сервисами"
      },
      {
        type: "heading",
        value: "n8n vs аналоги"
      },
      {
        type: "table",
        value: {
          headers: ["Платформа", "Плюсы", "Минусы", "Цена"],
          rows: [
            ["n8n", "Открытый код, self-hosted, гибкость", "Нужен сервер", "Бесплатно (self-hosted)"],
            ["Zapier", "Простота, много интеграций", "Дорого, лимиты", "От /мес"],
            ["Make", "Визуальный, мощный", "Сложнее освоить", "От /мес"],
            ["Albato", "Русскоязычный, CRM-фокус", "Меньше интеграций", "От 990₽/мес"]
          ]
        }
      },
      {
        type: "tip",
        value: "n8n можно развернуть на своём сервере бесплатно. Это идеально для бизнеса: данные под вашим контролем, нет лимитов на количество выполнений."
      },
      {
        type: "heading",
        value: "Базовые понятия"
      },
      {
        type: "text",
        value: "• Workflow — автоматизация целиком (например, \"Telegram-бот\")\n• Node (нода) — один блок действия (\"Отправить сообщение\")\n• Trigger — стартовая нода, запускающая workflow\n• Connection — связь между нодами (данные передаются по стрелкам)\n• Execution — одно выполнение workflow\n• Credentials — сохранённые доступы к сервисам"
      }
    ]
  },
  {
    id: "pervyj-workflow",
    num: 2,
    title: "Создаём первый workflow",
    description: "Пошаговое создание простой автоматизации: от триггера до результата.",
    
    content: [
      {
        type: "text",
        value: "Создадим простой workflow: при получении webhook-запроса отправляем уведомление в Telegram. Это базовый паттерн для обработки заявок с сайта."
      },
      {
        type: "heading",
        value: "Шаг 1: Создание workflow"
      },
      {
        type: "text",
        value: "1. Нажмите \"Create new workflow\"\n2. Назовите его (например, \"Уведомление о заявке\")\n3. На пустом холсте нажмите \"+\" для добавления первой ноды"
      },
      {
        type: "heading",
        value: "Шаг 2: Добавляем Webhook trigger"
      },
      {
        type: "text",
        value: "1. Найдите ноду \"Webhook\"\n2. Добавьте её на холст\n3. В настройках выберите HTTP Method: POST\n4. Скопируйте URL вебхука — его нужно указать на сайте\n\nWebhook — это \"точка входа\". Когда на этот URL приходит запрос, workflow запускается."
      },
      {
        type: "heading",
        value: "Шаг 3: Добавляем Telegram"
      },
      {
        type: "text",
        value: "1. Добавьте ноду \"Telegram\"\n2. Выберите Resource: Message → Operation: Send Message\n3. Создайте Credentials:\n   - Получите токен бота у @BotFather в Telegram\n   - Вставьте токен в n8n\n4. Укажите Chat ID (ваш Telegram ID)\n5. В поле Text напишите сообщение"
      },
      {
        type: "tip",
        value: "Свой Telegram ID можно узнать у бота @userinfobot. Отправьте ему любое сообщение — он ответит вашим ID."
      },
      {
        type: "heading",
        value: "Шаг 4: Используем данные из webhook"
      },
      {
        type: "text",
        value: "В поле Text можно вставить данные из входящего запроса:\n\n\"Новая заявка!\n\nИмя: {{ .name }}\nТелефон: {{ .phone }}\nСообщение: {{ .message }}\"\n\nДвойные скобки {{ }} — это выражения n8n. Они вставляют данные из предыдущей ноды."
      },
      {
        type: "heading",
        value: "Шаг 5: Тестирование и активация"
      },
      {
        type: "text",
        value: "1. Нажмите \"Test workflow\" — откроется окно теста\n2. Отправьте тестовый POST-запрос на webhook URL (можно через Postman)\n3. Проверьте, что сообщение пришло в Telegram\n4. Если всё работает — нажмите \"Activate\" чтобы включить workflow"
      },
      {
        type: "warning",
        value: "В n8n 2.0 появились Save и Publish. Save сохраняет черновик, Publish публикует в production. Не забывайте нажимать Publish после изменений!"
      }
    ]
  },
  {
    id: "telegram-bot-n8n",
    num: 3,
    title: "Telegram-бот на n8n: полный гайд",
    description: "Создаём полноценного бота: обработка команд, inline-кнопки, состояния пользователей.",
    
    content: [
      {
        type: "text",
        value: "Telegram-бот — самый частый кейс автоматизации. В n8n можно создать бота любой сложности: от простого автоответчика до полноценного сервиса с базой данных."
      },
      {
        type: "heading",
        value: "Архитектура бота"
      },
      {
        type: "text",
        value: "Типичная структура workflow для бота:\n\n1. Telegram Trigger — получает все сообщения\n2. Switch — роутер, определяет тип сообщения\n3. Ветки обработки — для команд, текста, callback\n4. Ответы — отправка сообщений/кнопок\n5. База данных — хранение состояний (опционально)"
      },
      {
        type: "heading",
        value: "Настройка Telegram Trigger"
      },
      {
        type: "text",
        value: "1. Добавьте ноду \"Telegram Trigger\"\n2. Подключите credentials с токеном бота\n3. В Updates выберите что получать:\n   - message — текстовые сообщения\n   - callback_query — нажатия inline-кнопок\n   - edited_message — отредактированные сообщения"
      },
      {
        type: "heading",
        value: "Switch для роутинга"
      },
      {
        type: "text",
        value: "Нода Switch направляет сообщения по разным веткам:\n\n• Условие 1: {{ .message.text }} equals \"/start\"\n• Условие 2: {{ .message.text }} starts with \"/\"\n• Условие 3: {{ .callback_query }} is not empty\n• Fallback: всё остальное"
      },
      {
        type: "tip",
        value: "Используйте sticky notes (заметки) на холсте для документации. Подписывайте что делает каждая ветка — через месяц сами скажете себе спасибо."
      },
      {
        type: "heading",
        value: "Inline-кнопки"
      },
      {
        type: "text",
        value: "В ноде Telegram → Send Message:\n\n1. Reply Markup: Inline Keyboard\n2. Inline Keyboard:\n[\n  [\n    { \"text\": \"Да ✅\", \"callback_data\": \"confirm_yes\" },\n    { \"text\": \"Нет ❌\", \"callback_data\": \"confirm_no\" }\n  ]\n]\n\nCallback_data — это то, что вы получите в workflow при нажатии."
      },
      {
        type: "heading",
        value: "Answer Callback Query"
      },
      {
        type: "text",
        value: "После обработки нажатия кнопки ОБЯЗАТЕЛЬНО отправьте Answer Callback Query. Иначе у пользователя будет крутиться загрузка на кнопке.\n\nДобавьте ноду Telegram → Answer Callback Query сразу после получения callback."
      },
      {
        type: "warning",
        value: "Telegram требует ответ на callback_query в течение 10 секунд. Если workflow долгий — отвечайте сразу, а результат отправляйте отдельным сообщением."
      }
    ]
  },
  {
    id: "ai-v-n8n",
    num: 4,
    title: "Интеграция AI в n8n",
    description: "Подключаем ChatGPT, Claude, генерацию изображений к workflow.",
    
    content: [
      {
        type: "text",
        value: "n8n имеет встроенные ноды для работы с AI: OpenAI, Anthropic Claude, LangChain и другие. Можно создавать AI-агентов прямо в workflow."
      },
      {
        type: "heading",
        value: "Доступные AI-ноды"
      },
      {
        type: "table",
        value: {
          headers: ["Нода", "Провайдер", "Возможности"],
          rows: [
            ["OpenAI", "OpenAI", "GPT-4, DALL-E, Whisper"],
            ["Anthropic", "Anthropic", "Claude 3.5, Claude Opus"],
            ["AI Agent", "Разные", "Агент с инструментами"],
            ["Text Classifier", "OpenAI", "Классификация текста"],
            ["Sentiment Analysis", "OpenAI", "Анализ тональности"]
          ]
        }
      },
      {
        type: "heading",
        value: "Пример: AI-ответы в боте"
      },
      {
        type: "text",
        value: "Workflow:\n\n1. Telegram Trigger → получаем сообщение пользователя\n2. OpenAI → отправляем в GPT с системным промптом\n3. Telegram → отправляем ответ пользователю\n\nСистемный промпт:\n\"Ты помощник компании по натяжным потолкам. Отвечай кратко и по делу. Если спрашивают цену — направляй на консультацию. Не обсуждай конкурентов.\""
      },
      {
        type: "heading",
        value: "AI Agent с инструментами"
      },
      {
        type: "text",
        value: "AI Agent — мощная нода, которая позволяет давать AI доступ к инструментам:\n\n• Calculator — математические расчёты\n• Web Search — поиск в интернете\n• HTTP Request — запросы к API\n• Custom Code — ваш JavaScript код\n\nАгент сам решает какой инструмент использовать для ответа на вопрос."
      },
      {
        type: "tip",
        value: "Начните с простого: один вызов OpenAI без агентов. Агенты сложнее отлаживать, но мощнее для комплексных задач."
      },
      {
        type: "heading",
        value: "Контроль расходов"
      },
      {
        type: "text",
        value: "AI API стоит денег. Способы оптимизации:\n\n• Используйте GPT-3.5 вместо GPT-4 для простых задач\n• Ограничьте max_tokens в ответе\n• Кэшируйте типовые ответы\n• Добавьте rate limiting (не больше N запросов в минуту)\n• Мониторьте расходы через OpenAI Dashboard"
      },
      {
        type: "warning",
        value: "Один неправильно настроенный workflow может сжечь весь API-бюджет за день. Всегда тестируйте с лимитами!"
      }
    ]
  },
  {
    id: "baza-dannyh-n8n",
    num: 5,
    title: "Работа с базой данных в n8n",
    description: "PostgreSQL, хранение состояний, CRUD-операции в workflow.",
    
    content: [
      {
        type: "text",
        value: "Для сложных ботов и автоматизаций нужна база данных: хранить пользователей, состояния диалогов, историю заказов. n8n поддерживает PostgreSQL, MySQL, MongoDB и другие."
      },
      {
        type: "heading",
        value: "Когда нужна база данных"
      },
      {
        type: "text",
        value: "• Многошаговые диалоги (нужно помнить на каком шаге пользователь)\n• Хранение заказов/записей\n• Подписки и рассылки\n• Аналитика и статистика\n• Персонализация (имя, настройки пользователя)"
      },
      {
        type: "heading",
        value: "Настройка PostgreSQL"
      },
      {
        type: "text",
        value: "1. Добавьте ноду \"Postgres\"\n2. Создайте Credentials:\n   - Host: адрес сервера (localhost или IP)\n   - Database: имя базы данных\n   - User: пользователь\n   - Password: пароль\n3. Выберите Operation: Execute Query\n4. Напишите SQL-запрос"
      },
      {
        type: "heading",
        value: "Типовые операции"
      },
      {
        type: "text",
        value: "Создать пользователя:\nINSERT INTO users (telegram_id, name, created_at)\nVALUES ({{ .message.from.id }}, '{{ .message.from.first_name }}', NOW())\nON CONFLICT (telegram_id) DO NOTHING;\n\nПолучить пользователя:\nSELECT * FROM users WHERE telegram_id = {{ .message.from.id }};\n\nОбновить состояние:\nUPDATE users SET state = 'awaiting_phone' WHERE telegram_id = {{ .message.from.id }};"
      },
      {
        type: "tip",
        value: "Используйте ON CONFLICT DO NOTHING для INSERT — это предотвратит ошибки при повторной регистрации пользователя."
      },
      {
        type: "heading",
        value: "Паттерн: состояния диалога"
      },
      {
        type: "text",
        value: "Для многошаговых диалогов:\n\n1. В таблице users добавьте поле state (varchar)\n2. В начале workflow читайте текущий state\n3. Switch роутит по state + команде\n4. После действия обновляйте state\n\nСостояния: 'idle', 'awaiting_name', 'awaiting_phone', 'confirming' и т.д."
      },
      {
        type: "warning",
        value: "Всегда экранируйте пользовательский ввод в SQL-запросах! Лучше использовать параметризованные запросы через Expression."
      }
    ]
  },
  {
    id: "deploy-n8n",
    num: 6,
    title: "Развёртывание n8n на сервере",
    description: "Self-hosted n8n: Docker, настройка, безопасность, бэкапы.",
    
    content: [
      {
        type: "text",
        value: "Self-hosted n8n — это полный контроль над данными и никаких лимитов. Для развёртывания нужен VPS-сервер (от 1GB RAM) и базовые знания Docker."
      },
      {
        type: "heading",
        value: "Требования к серверу"
      },
      {
        type: "table",
        value: {
          headers: ["Параметр", "Минимум", "Рекомендуется"],
          rows: [
            ["RAM", "1 GB", "2-4 GB"],
            ["CPU", "1 core", "2 cores"],
            ["Disk", "10 GB", "20+ GB"],
            ["OS", "Ubuntu 20.04+", "Ubuntu 22.04"]
          ]
        }
      },
      {
        type: "heading",
        value: "Docker Compose конфиг"
      },
      {
        type: "text",
        value: "version: '3.8'\nservices:\n  n8n:\n    image: n8nio/n8n\n    restart: always\n    ports:\n      - \"5678:5678\"\n    environment:\n      - N8N_BASIC_AUTH_USER=admin\n      - N8N_BASIC_AUTH_PASSWORD=secure_password\n      - N8N_HOST=n8n.yourdomain.com\n      - N8N_PROTOCOL=https\n      - WEBHOOK_URL=https://n8n.yourdomain.com/\n    volumes:\n      - n8n_data:/home/node/.n8n\n\nvolumes:\n  n8n_data:"
      },
      {
        type: "heading",
        value: "Настройка HTTPS"
      },
      {
        type: "text",
        value: "Для продакшена обязательно нужен HTTPS. Варианты:\n\n1. Caddy (рекомендую) — автоматические SSL сертификаты\n2. Nginx + Let's Encrypt — классика\n3. Cloudflare — проксирование через облако\n\nCaddyfile:\nn8n.yourdomain.com {\n    reverse_proxy n8n:5678\n}"
      },
      {
        type: "tip",
        value: "Caddy автоматически получает и обновляет SSL-сертификаты. Минимум настроек, максимум надёжности."
      },
      {
        type: "heading",
        value: "Бэкапы"
      },
      {
        type: "text",
        value: "n8n хранит данные в SQLite (по умолчанию) или PostgreSQL. Что бэкапить:\n\n• /home/node/.n8n/ — вся директория n8n\n• База данных (если PostgreSQL)\n• Credentials зашифрованы ключом N8N_ENCRYPTION_KEY\n\nСкрипт бэкапа:\ndocker exec n8n tar czf - /home/node/.n8n > backup_20251223.tar.gz"
      },
      {
        type: "heading",
        value: "Безопасность"
      },
      {
        type: "text",
        value: "Чеклист безопасности:\n\n✓ Включите Basic Auth (N8N_BASIC_AUTH_*)\n✓ Используйте HTTPS\n✓ Закройте порт 5678 в firewall (только через reverse proxy)\n✓ Регулярно обновляйте n8n\n✓ Делайте бэкапы\n✓ Не храните секреты в workflow — используйте Credentials"
      },
      {
        type: "warning",
        value: "Сохраните N8N_ENCRYPTION_KEY! Без него невозможно расшифровать credentials при восстановлении из бэкапа."
      }
    ]
  }
];

export default function AvtomatizaciyaN8nPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-12 px-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-4">
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-medium">Модуль 4 из 6</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Автоматизация с n8n
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Создаём workflow без кода: Telegram-боты, обработка заявок, интеграция с AI. 
            От простых автоматизаций до сложных бизнес-процессов.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span>📚</span> 6 уроков
            </span>
            <span className="flex items-center gap-1">
            </span>
            <span className="flex items-center gap-1">
              <span>💻</span> Практический
            </span>
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              id={lesson.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    Урок {lesson.num}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
                <p className="text-white/90">{lesson.description}</p>
              </div>
              <div className="p-6 space-y-4">
                {lesson.content.map((block, i) => {
                  if (block.type === "text") {
                    return <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{block.value as string}</p>;
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
                    const table = block.value as TableValue;
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
      </section>

      {/* Navigation */}
      <section className="py-12 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Link
              href="/learn/ai-dlya-kontenta"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400"
            >
              <span>←</span>
              <span>AI для контента</span>
            </Link>
            <Link
              href="/learn/ai-boty-dlya-biznesa"
              className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
            >
              <span>AI-боты для бизнеса</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
