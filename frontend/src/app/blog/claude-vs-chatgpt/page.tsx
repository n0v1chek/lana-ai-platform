import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Claude vs ChatGPT — какая нейросеть лучше в 2025? — LANA AI Helper",
  description: "Честное сравнение Claude и ChatGPT: возможности, цены, плюсы и минусы. Claude 3.5 Sonnet, Claude Opus 4 vs GPT-4o, o1. Какую выбрать?",
  keywords: ["Claude vs ChatGPT", "сравнение нейросетей", "Claude 3.5", "GPT-4o", "какая нейросеть лучше"],
  openGraph: {
    title: "Claude vs ChatGPT — какая нейросеть лучше?",
    description: "Подробное сравнение двух лучших AI-ассистентов",
    url: "https://lanaaihelper.ru/blog/claude-vs-chatgpt",
  },
};

export default function ArticlePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
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

      {/* Article */}
      <article className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/blog" className="text-purple-600 hover:underline">← Блог</Link>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">29 ноября 2025</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">8 мин чтения</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Claude vs ChatGPT — какая нейросеть лучше в 2025?
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Два главных AI-ассистента — Claude от Anthropic и ChatGPT от OpenAI. Оба умные, 
            оба платные, оба недоступны напрямую в России. Разбираемся, какой выбрать.
          </p>

          {/* Content */}
          <div className="prose prose-lg prose-slate max-w-none">
            
            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Кратко: кто победил?</h2>
            
            <div className="grid md:grid-cols-2 gap-4 my-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                <h3 className="font-bold text-orange-900 mb-2">🏆 Claude лучше для:</h3>
                <ul className="text-orange-800 text-sm space-y-1">
                  <li>• Длинных текстов и документов</li>
                  <li>• Анализа и редактирования</li>
                  <li>• Программирования</li>
                  <li>• Безопасных ответов</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-900 mb-2">🏆 ChatGPT лучше для:</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Креатива и brainstorm</li>
                  <li>• Работы с картинками</li>
                  <li>• Генерации изображений (DALL-E)</li>
                  <li>• Плагинов и интеграций</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Модели Claude в LANA AI</h2>
            <p className="text-slate-600 mb-4">
              Anthropic выпускает несколько версий Claude. Вот что доступно у нас:
            </p>
            
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-slate-300 text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border border-slate-300 px-4 py-2 font-semibold">Модель</th>
                    <th className="border border-slate-300 px-4 py-2 font-semibold">Особенности</th>
                    <th className="border border-slate-300 px-4 py-2 font-semibold">Vision</th>
                    <th className="border border-slate-300 px-4 py-2 font-semibold">Цена</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Claude 3.5 Sonnet</td>
                    <td className="border border-slate-300 px-4 py-2">Лучший баланс цена/качество</td>
                    <td className="border border-slate-300 px-4 py-2">✅ Да</td>
                    <td className="border border-slate-300 px-4 py-2">Средняя</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2 font-medium">Claude 3.5 Haiku</td>
                    <td className="border border-slate-300 px-4 py-2">Быстрый и дешёвый</td>
                    <td className="border border-slate-300 px-4 py-2">✅ Да</td>
                    <td className="border border-slate-300 px-4 py-2">Низкая</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Claude 3.7 Sonnet</td>
                    <td className="border border-slate-300 px-4 py-2">Новейший, улучшенный</td>
                    <td className="border border-slate-300 px-4 py-2">✅ Да</td>
                    <td className="border border-slate-300 px-4 py-2">Средняя</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2 font-medium">Claude Sonnet 4</td>
                    <td className="border border-slate-300 px-4 py-2">Топовое качество</td>
                    <td className="border border-slate-300 px-4 py-2">✅ Да</td>
                    <td className="border border-slate-300 px-4 py-2">Высокая</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">Claude Opus 4</td>
                    <td className="border border-slate-300 px-4 py-2">Самый умный, сложные задачи</td>
                    <td className="border border-slate-300 px-4 py-2">✅ Да</td>
                    <td className="border border-slate-300 px-4 py-2">Премиум</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Модели ChatGPT (OpenAI) в LANA AI</h2>
            
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-slate-300 text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border border-slate-300 px-4 py-2 font-semibold">Модель</th>
                    <th className="border border-slate-300 px-4 py-2 font-semibold">Особенности</th>
                    <th className="border border-slate-300 px-4 py-2 font-semibold">Vision</th>
                    <th className="border border-slate-300 px-4 py-2 font-semibold">Цена</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">GPT-4o</td>
                    <td className="border border-slate-300 px-4 py-2">Универсальная, быстрая</td>
                    <td className="border border-slate-300 px-4 py-2">✅ Да</td>
                    <td className="border border-slate-300 px-4 py-2">Средняя</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2 font-medium">GPT-4o-mini</td>
                    <td className="border border-slate-300 px-4 py-2">Дешёвая для простых задач</td>
                    <td className="border border-slate-300 px-4 py-2">✅ Да</td>
                    <td className="border border-slate-300 px-4 py-2">Низкая</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">GPT-4 Turbo</td>
                    <td className="border border-slate-300 px-4 py-2">Длинный контекст 128K</td>
                    <td className="border border-slate-300 px-4 py-2">❌ Нет</td>
                    <td className="border border-slate-300 px-4 py-2">Высокая</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-300 px-4 py-2 font-medium">o1</td>
                    <td className="border border-slate-300 px-4 py-2">Логика и рассуждения</td>
                    <td className="border border-slate-300 px-4 py-2">❌ Нет</td>
                    <td className="border border-slate-300 px-4 py-2">Высокая</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 px-4 py-2 font-medium">o1-pro</td>
                    <td className="border border-slate-300 px-4 py-2">Максимум для сложных задач</td>
                    <td className="border border-slate-300 px-4 py-2">❌ Нет</td>
                    <td className="border border-slate-300 px-4 py-2">Премиум</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Сравнение по задачам</h2>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">📝 Написание текстов</h3>
            <p className="text-slate-600 mb-4">
              <strong>Claude</strong> пишет более структурированные, аккуратные тексты. Лучше следует инструкциям.
              <br /><strong>ChatGPT</strong> более креативный, иногда "отходит от темы", но идеи генерирует интереснее.
            </p>
            <p className="text-purple-600 font-medium mb-4">Победитель: Claude для деловых текстов, ChatGPT для креатива</p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">💻 Программирование</h3>
            <p className="text-slate-600 mb-4">
              <strong>Claude</strong> отлично пишет чистый, читаемый код. Хорошо объясняет.
              <br /><strong>ChatGPT o1</strong> лучше для сложной логики и алгоритмов.
            </p>
            <p className="text-purple-600 font-medium mb-4">Победитель: Ничья — зависит от задачи</p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">📊 Анализ документов</h3>
            <p className="text-slate-600 mb-4">
              <strong>Claude</strong> может обработать до 200K токенов — это ~500 страниц текста!
              <br /><strong>ChatGPT</strong> ограничен 128K токенов в GPT-4 Turbo.
            </p>
            <p className="text-purple-600 font-medium mb-4">Победитель: Claude</p>

            <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">🖼️ Работа с изображениями</h3>
            <p className="text-slate-600 mb-4">
              Оба понимают картинки (Vision). Но <strong>ChatGPT</strong> умеет ещё и генерировать 
              изображения через DALL-E (в LANA пока недоступно).
            </p>
            <p className="text-purple-600 font-medium mb-4">Победитель: ChatGPT (если нужна генерация)</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Что выбрать?</h2>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 my-6">
              <p className="text-purple-900 mb-4">
                <strong>Наш совет:</strong> не выбирайте что-то одно! В LANA AI доступны обе нейросети. 
                Используйте ту, что лучше подходит для конкретной задачи:
              </p>
              <ul className="text-purple-800 space-y-2">
                <li>• <strong>Claude 3.5 Sonnet</strong> — для текстов, анализа, кода</li>
                <li>• <strong>GPT-4o</strong> — для креатива, картинок, быстрых ответов</li>
                <li>• <strong>Claude Opus 4</strong> — для сложнейших задач</li>
                <li>• <strong>o1</strong> — для математики и логики</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 my-10 text-center text-white">
              <h3 className="text-2xl font-bold mb-3">Попробуйте обе нейросети</h3>
              <p className="opacity-90 mb-6">Claude и ChatGPT в одном месте. Без VPN, оплата в рублях.</p>
              <Link 
                href="/register" 
                className="inline-block bg-white text-purple-600 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Начать бесплатно
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Заключение</h2>
            <p className="text-slate-600 mb-4">
              Claude и ChatGPT — оба отличные AI-ассистенты. Claude сильнее в работе с текстом 
              и документами, ChatGPT — в креативе и мультимодальности. Лучшая стратегия — 
              использовать оба инструмента для разных задач. В LANA AI Helper доступны все модели 
              обеих компаний, и вы платите только за то, что используете.
            </p>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="py-12 px-4 bg-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Читайте также</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/blog/chatgpt-v-rossii-2025" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">ChatGPT в России 2025</h3>
              <p className="text-sm text-slate-500 mt-1">Как пользоваться без VPN</p>
            </Link>
            <Link href="/blog/luchshie-nejroseti-2025" className="bg-white p-4 rounded-xl hover:shadow-md transition">
              <h3 className="font-semibold text-slate-900">Лучшие нейросети 2025</h3>
              <p className="text-sm text-slate-500 mt-1">Топ-10 AI для работы</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-slate-400 text-center">
        <p>© 2025 LANA AI Helper. ИП Живчин А.С., ИНН 263109568337</p>
      </footer>
    </div>
  );
}
