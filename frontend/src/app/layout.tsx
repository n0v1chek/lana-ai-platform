import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import PrivacyNotice from "@/components/PrivacyNotice";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "LANA AI — ChatGPT, генерация фото и видео в России | AI без VPN",
  description: "AI-чаты (GPT-4o, Claude, Gemini), генерация изображений и видео. Работает в России без VPN, оплата картами РФ. AI-агенты для автоматизации бизнеса.",
  keywords: [
    "AI", "искусственный интеллект", "ChatGPT", "Claude", "Gemini", "нейросеть", "чат-бот",
    "генерация изображений", "генерация видео", "AI фото", "AI видео", "text to image", "text to video",
    "ChatGPT в России", "ChatGPT без VPN", "GPT-4 Россия", "Claude AI Россия",
    "AI агенты", "автоматизация бизнеса", "чат-бот для бизнеса", "AI помощник",
    "нейросеть для фото", "нейросеть для видео", "Kling", "Hailuo", "Wan",
    "AI chat Russia", "ChatGPT alternative Russia", "AI without VPN", "оплата картами РФ"
  ],
  metadataBase: new URL("https://lanaaihelper.ru"),
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "LANA AI Helper" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "LANA AI — ChatGPT, фото и видео генерация в России",
    description: "AI-чаты, генерация изображений и видео. GPT-4o, Claude, Gemini без VPN. AI-агенты для бизнеса.",
    url: "https://lanaaihelper.ru",
    siteName: "LANA AI",
    locale: "ru_RU",
    alternateLocale: "en_US",
    type: "website",
    images: [
      {
        url: "https://lanaaihelper.ru/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "LANA AI — ChatGPT, генерация фото и видео в России",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LANA AI — ChatGPT, фото и видео в России без VPN",
    description: "AI-чаты, генерация изображений и видео. Оплата картами РФ. AI-агенты для бизнеса.",
    images: ["https://lanaaihelper.ru/images/og-image.png"],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "LANA AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="apple-touch-icon" href="/images/icon-192.png" />
        <meta name="theme-color" content="#8b5cf6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "LANA AI",
              "alternateName": "LANA AI Helper",
              "description": "AI-чаты (GPT-4o, Claude, Gemini), генерация изображений и видео. Работает в России без VPN. AI-агенты для автоматизации бизнеса.",
              "url": "https://lanaaihelper.ru",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "inLanguage": ["ru", "en"],
              "featureList": [
                "AI Chat с GPT-4o, Claude, Gemini",
                "Генерация изображений по описанию",
                "Генерация видео (Kling, Hailuo, Wan)",
                "AI-агенты для бизнеса",
                "Оплата картами РФ",
                "Работает без VPN"
              ],
              "offers": {
                "@type": "Offer",
                "price": "49",
                "priceCurrency": "RUB",
                "description": "Минимальное пополнение баланса"
              },
              "author": {
                "@type": "Organization",
                "name": "LANA AI",
                "url": "https://lanaaihelper.ru"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "250"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "LANA AI",
              "url": "https://lanaaihelper.ru",
              "logo": "https://lanaaihelper.ru/images/icon-512.png",
              "description": "AI-платформа: чаты, генерация фото и видео, AI-агенты для бизнеса",
              "sameAs": [],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@lanaaihelper.ru",
                "contactType": "customer service",
                "availableLanguage": ["Russian", "English"]
              },
              "areaServed": {
                "@type": "Country",
                "name": "Russia"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Как использовать ChatGPT в России?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "LANA AI предоставляет доступ к ChatGPT (GPT-4o), Claude, Gemini и другим AI моделям в России без VPN. Оплата российскими картами, старт от 49₽."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Можно ли генерировать изображения и видео с помощью AI?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Да, LANA AI поддерживает генерацию изображений и видео по текстовому описанию. Доступны модели Kling, Hailuo, Wan для видео и AI для создания картинок."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Сколько стоит использование AI?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Минимальное пополнение — 49₽. Без подписок, платите только за использование. 1 рубль = 100 коинов. Цены зависят от выбранной модели."
                  }
                }
              ]
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then(reg => console.log('SW registered'))
                  .catch(err => console.log('SW registration failed'));
              });
            }
          `}
        </Script>

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-G2L3FBV3TG" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G2L3FBV3TG');
          `}
        </Script>

        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105576416', 'ym');
            ym(105576416, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div><img src="https://mc.yandex.ru/watch/105576416" style={{position:'absolute', left:'-9999px'}} alt="" /></div>
        </noscript>
        
        <ThemeToggle />
        <PrivacyNotice />
        {children}
      </body>
    </html>
  );
}
