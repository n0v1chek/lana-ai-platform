# 🚀 Lana AI Helper - Frontend

## Быстрый старт

### 1. Распаковка и установка
```bash
unzip lana-frontend.zip -d lana-frontend
cd lana-frontend
npm install
```

### 2. Настройка переменных окружения
```bash
# Создайте файл .env.local
echo "NEXT_PUBLIC_API_URL=https://lanaaihelper.ru/api" > .env.local
```

### 3. Запуск в режиме разработки
```bash
npm run dev
# Откроется на http://localhost:3000
```

### 4. Сборка для продакшена
```bash
npm run build
npm run start
```

---

## 📁 Структура проекта

```
lana-frontend/
├── src/
│   ├── app/                    # Страницы (App Router)
│   │   ├── page.tsx            # Главная (лендинг)
│   │   ├── layout.tsx          # Корневой layout
│   │   ├── globals.css         # Глобальные стили
│   │   ├── (auth)/
│   │   │   ├── login/          # /login
│   │   │   └── register/       # /register
│   │   └── (dashboard)/
│   │       ├── chat/           # /chat
│   │       ├── history/        # /history
│   │       ├── pricing/        # /pricing
│   │       └── settings/       # /settings
│   ├── components/
│   │   ├── ui/                 # UI компоненты (Button, Input, Card)
│   │   └── chat/               # Компоненты чата
│   ├── lib/
│   │   └── api.ts              # API клиент (axios)
│   ├── stores/
│   │   ├── authStore.ts        # Zustand store для авторизации
│   │   └── chatStore.ts        # Zustand store для чата
│   └── types/
│       └── index.ts            # TypeScript типы
├── tailwind.config.ts          # Конфигурация Tailwind
├── next.config.mjs             # Конфигурация Next.js
└── package.json
```

---

## 🖥️ Страницы

| Маршрут | Описание | Доступ |
|---------|----------|--------|
| `/` | Главная страница (лендинг) | Публичный |
| `/login` | Страница входа | Публичный |
| `/register` | Страница регистрации | Публичный |
| `/chat` | AI чат | Требует авторизации |
| `/history` | История диалогов | Требует авторизации |
| `/pricing` | Тарифы и подписки | Требует авторизации |
| `/settings` | Настройки аккаунта | Требует авторизации |

---

## 🎨 Дизайн

- **Шрифты:** Space Grotesk (заголовки), Plus Jakarta Sans (текст), JetBrains Mono (код)
- **Цвета:** Индиго/Фиолетовый градиент (lana-500: #6366f1)
- **Тема:** Поддержка светлой и тёмной темы
- **Адаптив:** Mobile-first, responsive

---

## 🔌 API интеграция

API URL по умолчанию: `https://lanaaihelper.ru/api`

### Endpoints:
- `POST /auth/register` — Регистрация
- `POST /auth/login/json` — Вход
- `GET /auth/me` — Профиль
- `POST /chat/send` — Отправить сообщение AI
- `GET /chat/conversations` — История диалогов
- `GET /subscriptions/plans` — Тарифы
- `POST /subscriptions/upgrade` — Апгрейд подписки

---

## 🚀 Деплой на сервер

### Вариант 1: Standalone (рекомендуется)

```bash
# next.config.mjs
const nextConfig = {
  output: 'standalone',
};

# Сборка
npm run build

# Запуск
node .next/standalone/server.js
```

### Вариант 2: PM2

```bash
npm install -g pm2
npm run build
pm2 start npm --name "lana-frontend" -- start
pm2 save
```

### Вариант 3: Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name app.lanaaihelper.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ✅ Чеклист деплоя

- [ ] Распаковать архив
- [ ] `npm install`
- [ ] Создать `.env.local` с `NEXT_PUBLIC_API_URL`
- [ ] `npm run build`
- [ ] Настроить PM2 или Docker
- [ ] Настроить Nginx с SSL
- [ ] Проверить работу всех страниц

---

## 📞 Контакты

**Проект:** Lana AI Helper  
**Домен:** https://lanaaihelper.ru  
**Владелец:** Живчин Александр Семенович  
**Email:** zhivchinas@gmail.com

---

**Разработчик:** Живчин Александр Семенович  
*Создано с помощью Claude AI - Ноябрь 2025*
