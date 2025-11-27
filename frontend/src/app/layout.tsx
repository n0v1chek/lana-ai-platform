import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lana AI Helper — Умный AI-помощник",
  description: "Доступ к лучшим AI моделям: GPT-4o, Claude, Gemini. Работает в России без VPN.",
  keywords: ["AI", "искусственный интеллект", "ChatGPT", "Claude", "нейросеть", "чат-бот"],
  authors: [{ name: "Lana AI Helper" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Lana AI Helper — Умный AI-помощник",
    description: "Доступ к лучшим AI моделям: GPT-4o, Claude, Gemini",
    url: "https://lanaaihelper.ru",
    siteName: "Lana AI Helper",
    locale: "ru_RU",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
