import type { Metadata } from "next";
import "./globals.css";
import PrivacyNotice from "@/components/PrivacyNotice";

export const metadata: Metadata = {
  title: "LANA AI Helper — Умный AI-помощник",
  description: "Доступ к лучшим AI моделям: GPT-4o, Claude, Gemini. Работает в России без VPN.",
  keywords: ["AI", "искусственный интеллект", "ChatGPT", "Claude", "нейросеть", "чат-бот"],
  authors: [{ name: "LANA AI Helper" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/images/favicon.png",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <PrivacyNotice />
        {children}
      </body>
    </html>
  );
}
