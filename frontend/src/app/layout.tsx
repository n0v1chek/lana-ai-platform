import type { Metadata } from "next";
import "./globals.css";
import PrivacyNotice from "@/components/PrivacyNotice";

export const metadata: Metadata = {
  title: "LANA AI Helper — Умный AI-помощник",
  description: "Доступ к лучшим AI моделям: GPT-4o, Claude, Gemini. Работает в России без VPN.",
  keywords: ["AI", "искусственный интеллект", "ChatGPT", "Claude", "нейросеть", "чат-бот"],
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
    title: "LANA AI Helper — Умный AI-помощник",
    description: "Доступ к лучшим AI моделям: GPT-4o, Claude, Gemini. Работает в России без VPN.",
    url: "https://lanaaihelper.ru",
    siteName: "LANA AI Helper",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://lanaaihelper.ru/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "LANA AI Helper",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LANA AI Helper — Умный AI-помощник",
    description: "Доступ к лучшим AI моделям: GPT-4o, Claude, Gemini. Работает в России без VPN.",
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
              "description": "Доступ к лучшим AI моделям: GPT-4o, Claude, Gemini. Работает в России без VPN.",
              "url": "https://lanaaihelper.ru",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
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
        <PrivacyNotice />
        {children}
      </body>
    </html>
  );
}
