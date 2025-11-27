# 🚀 Пошаговая инструкция деплоя Frontend

**Проект:** Lana AI Helper  
**Разработчик:** Живчин Александр Семенович  
**Сервер:** 5.35.91.93

---

## 📋 Что понадобится

- Файл `lana-frontend.zip` (архив с frontend)
- Файл `nginx-lanaaihelper.conf` (конфиг Nginx)
- SSH доступ к серверу

---

## 🔧 Шаг 1: Подключение к серверу

```bash
ssh deploy@5.35.91.93
```

---

## 📦 Шаг 2: Загрузка файлов на сервер

**Вариант A: Через SCP (с локального компьютера)**
```bash
# На локальном компьютере:
scp lana-frontend.zip deploy@5.35.91.93:/home/deploy/
scp nginx-lanaaihelper.conf deploy@5.35.91.93:/home/deploy/
```

**Вариант B: Через wget (если файлы в интернете)**
```bash
# На сервере:
cd /home/deploy
# wget <URL файла>
```

---

## ⚙️ Шаг 3: Установка Node.js (если не установлен)

```bash
# Проверка
node -v

# Если не установлен:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка
node -v   # должно быть v18.x.x
npm -v    # должно быть 9.x.x или 10.x.x
```

---

## 📁 Шаг 4: Распаковка Frontend

```bash
cd /home/deploy

# Создаём директорию
mkdir -p lana-frontend

# Распаковываем
unzip lana-frontend.zip -d lana-frontend

# Переходим в директорию
cd lana-frontend

# Проверяем структуру
ls -la
# Должны увидеть: src/, package.json, tailwind.config.ts и т.д.
```

---

## 🔐 Шаг 5: Настройка переменных окружения

```bash
cd /home/deploy/lana-frontend

# Создаём файл .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://lanaaihelper.ru/api
EOF

# Проверяем
cat .env.local
```

---

## 📥 Шаг 6: Установка зависимостей

```bash
cd /home/deploy/lana-frontend

# Установка
npm install

# Ожидайте ~1-2 минуты
# Должно появиться: added XXX packages
```

---

## 🔨 Шаг 7: Сборка проекта

```bash
cd /home/deploy/lana-frontend

# Сборка для продакшена
npm run build

# Ожидайте ~1-2 минуты
# В конце должно быть:
# ✓ Generating static pages (11/11)
# ○ / - 5.08 kB
# ○ /chat - 41.9 kB
# и т.д.
```

---

## 🚀 Шаг 8: Установка PM2 и запуск

```bash
# Установка PM2 глобально
sudo npm install -g pm2

# Запуск приложения
cd /home/deploy/lana-frontend
pm2 start npm --name "lana-frontend" -- start

# Проверка статуса
pm2 status

# Должно быть:
# │ lana-frontend │ online │

# Сохранение для автозапуска
pm2 save
pm2 startup
# Выполните команду, которую выдаст pm2 startup
```

---

## 🌐 Шаг 9: Настройка Nginx

```bash
# Бэкап текущего конфига
sudo cp /etc/nginx/sites-available/lanaaihelper /etc/nginx/sites-available/lanaaihelper.backup

# Копируем новый конфиг
sudo cp /home/deploy/nginx-lanaaihelper.conf /etc/nginx/sites-available/lanaaihelper

# Проверяем синтаксис
sudo nginx -t

# Если всё OK:
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Перезагружаем Nginx
sudo systemctl reload nginx
```

---

## ✅ Шаг 10: Проверка работы

```bash
# 1. Проверяем что Frontend запущен
pm2 status
# lana-frontend должен быть "online"

# 2. Проверяем локально
curl http://localhost:3000
# Должен вернуть HTML страницу

# 3. Проверяем через домен
curl https://lanaaihelper.ru
# Должен вернуть HTML страницы

# 4. Проверяем API (backend)
curl https://lanaaihelper.ru/health
# Должен вернуть {"status":"healthy"}

# 5. Проверяем в браузере
# Откройте https://lanaaihelper.ru
```

---

## 📊 Полезные команды PM2

```bash
# Статус всех приложений
pm2 status

# Логи frontend
pm2 logs lana-frontend

# Логи в реальном времени
pm2 logs lana-frontend --lines 50

# Перезапуск
pm2 restart lana-frontend

# Остановка
pm2 stop lana-frontend

# Удаление
pm2 delete lana-frontend

# Мониторинг (CPU, RAM)
pm2 monit
```

---

## 🔄 Обновление Frontend (будущие релизы)

```bash
# 1. Загрузить новый архив
cd /home/deploy
# scp или wget новой версии

# 2. Остановить приложение
pm2 stop lana-frontend

# 3. Бэкап текущей версии
tar -czf backup_frontend_$(date +%Y%m%d).tar.gz lana-frontend/

# 4. Распаковать новую версию
unzip -o lana-frontend-new.zip -d lana-frontend

# 5. Установить зависимости и собрать
cd lana-frontend
npm install
npm run build

# 6. Запустить
pm2 restart lana-frontend
```

---

## ❗ Возможные проблемы и решения

### Ошибка: "EACCES permission denied"
```bash
sudo chown -R deploy:deploy /home/deploy/lana-frontend
```

### Ошибка: "Port 3000 already in use"
```bash
# Найти процесс на порту 3000
sudo lsof -i :3000
# Убить процесс
kill -9 <PID>
```

### Frontend не открывается через домен
```bash
# Проверить Nginx
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/lanaaihelper_error.log
```

### PM2 не запускается после перезагрузки
```bash
pm2 startup
# Скопируйте и выполните команду
pm2 save
```

---

## 📁 Итоговая структура на сервере

```
/home/deploy/
├── ai-chat-platform/       # Backend (FastAPI)
│   ├── backend/
│   ├── docker-compose.yml
│   └── ...
├── lana-frontend/          # Frontend (Next.js) ← НОВОЕ
│   ├── src/
│   ├── .next/
│   ├── node_modules/
│   ├── package.json
│   └── .env.local
└── backups/
    └── frontend/
```

---

## ✅ Чеклист

- [ ] Node.js v18 установлен
- [ ] PM2 установлен
- [ ] Frontend распакован в `/home/deploy/lana-frontend`
- [ ] `.env.local` создан
- [ ] `npm install` выполнен
- [ ] `npm run build` успешен
- [ ] PM2 запущен (`pm2 status` → online)
- [ ] Nginx конфиг обновлён
- [ ] `nginx -t` без ошибок
- [ ] https://lanaaihelper.ru открывается
- [ ] Регистрация/Логин работают
- [ ] Чат работает (после пополнения OpenRouter)

---

**Разработчик:** Живчин Александр Семенович  
**Дата:** Ноябрь 2025
