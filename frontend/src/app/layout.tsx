import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import PrivacyNotice from "@/components/PrivacyNotice";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "LANA AI Helper — Умный AI-помощник | AI Chat Russia",
  description: "Доступ к лучшим AI моделям: GPT-4o, Claude, Gemini. Работает в России без VPN. Access top AI models in Russia without VPN.",
  keywords: [
    "AI", "искусственный интеллект", "ChatGPT", "Claude", "нейросеть", "чат-бот",
    "AI chat Russia", "ChatGPT alternative Russia", "GPT-4 Russia", "Claude AI Russia",
    "AI assistant", "neural network chat", "Gemini Russia", "AI without VPN"
  ],
  authors: [{ name: "LANA AI Helper" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "LANA AI Helper — AI Chat for Russia",
    description: "Access GPT-4o, Claude, Gemini in Russia without VPN. Доступ к лучшим AI моделям.",
    url: "https://lanaaihelper.ru",
    siteName: "LANA AI Helper",
    locale: "ru_RU",
    alternateLocale: "en_US",
    type: "website",
    images: [
      {
        url: "https://lanaaihelper.ru/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "LANA AI Helper - AI Chat Russia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LANA AI Helper — AI Chat for Russia",
    description: "Access GPT-4o, Claude, Gemini in Russia without VPN.",
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
              "name": "LANA AI Helper",
              "description": "AI chat platform with GPT-4o, Claude, Gemini. Works in Russia without VPN.",
              "url": "https://lanaaihelper.ru",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "inLanguage": ["ru", "en"],
              "offers": {
                "@type": "Offer",
                "price": "49",
                "priceCurrency": "RUB"
              },
              "author": {
                "@type": "Person",
                "name": "Живчин Александр Семенович"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              }
            }),
          }}
        />
      </head>
      <body className="antialiased">
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
