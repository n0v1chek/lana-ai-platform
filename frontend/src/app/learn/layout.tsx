import { CatLogo } from "@/components/CatLogo";
import { Footer } from "@/components/Footer";
import Link from "next/link";

// Course structured data for SEO
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "Course",
      "position": 1,
      "name": "Основы AI и нейросетей",
      "description": "Узнайте что такое нейросети, как работают ChatGPT, Claude, Gemini",
      "provider": { "@type": "Organization", "name": "LANA AI" },
      "url": "https://lanaaihelper.ru/learn/osnovy-ai",
      "isAccessibleForFree": true,
      "inLanguage": "ru"
    },
    {
      "@type": "Course",
      "position": 2,
      "name": "Промпт-инжиниринг",
      "description": "Техники написания эффективных промптов для нейросетей",
      "provider": { "@type": "Organization", "name": "LANA AI" },
      "url": "https://lanaaihelper.ru/learn/prompt-injiniring",
      "isAccessibleForFree": true,
      "inLanguage": "ru"
    },
    {
      "@type": "Course",
      "position": 3,
      "name": "AI для создания контента",
      "description": "Создание текстов, изображений и видео с помощью нейросетей",
      "provider": { "@type": "Organization", "name": "LANA AI" },
      "url": "https://lanaaihelper.ru/learn/ai-dlya-kontenta",
      "isAccessibleForFree": true,
      "inLanguage": "ru"
    },
    {
      "@type": "Course",
      "position": 4,
      "name": "Автоматизация с n8n",
      "description": "Создание workflow и Telegram-ботов без программирования",
      "provider": { "@type": "Organization", "name": "LANA AI" },
      "url": "https://lanaaihelper.ru/learn/avtomatizaciya-n8n",
      "isAccessibleForFree": true,
      "inLanguage": "ru"
    },
    {
      "@type": "Course",
      "position": 5,
      "name": "AI-боты для бизнеса",
      "description": "Создание умных ботов для автоматизации продаж и поддержки",
      "provider": { "@type": "Organization", "name": "LANA AI" },
      "url": "https://lanaaihelper.ru/learn/ai-boty-dlya-biznesa",
      "isAccessibleForFree": true,
      "inLanguage": "ru"
    },
    {
      "@type": "Course",
      "position": 6,
      "name": "AI-агенты",
      "description": "Продвинутый уровень: автономные AI-системы с инструментами",
      "provider": { "@type": "Organization", "name": "LANA AI" },
      "url": "https://lanaaihelper.ru/learn/ai-agenty",
      "isAccessibleForFree": true,
      "inLanguage": "ru"
    }
  ]
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <CatLogo size={80} />
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-purple-600 dark:text-purple-400 font-medium">
              База знаний
            </Link>
            <Link href="/business" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
              Для бизнеса
            </Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition">
              О нас
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition">
              Попробовать AI
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
