#!/bin/bash

# ============================================
# 🚀 Lana AI Helper - Frontend Deploy Script
# ============================================
# Разработчик: Живчин Александр Семенович
# ============================================

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   🚀 Lana AI Helper - Frontend Deploy  ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Переменные
DEPLOY_DIR="/home/deploy/lana-frontend"
BACKUP_DIR="/home/deploy/backups/frontend"
NODE_VERSION="18"

# 1. Проверка Node.js
echo -e "${YELLOW}[1/7] Проверка Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js не установлен. Устанавливаю...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# 2. Проверка PM2
echo -e "${YELLOW}[2/7] Проверка PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}PM2 не установлен. Устанавливаю...${NC}"
    sudo npm install -g pm2
fi
echo -e "${GREEN}✓ PM2 установлен${NC}"

# 3. Создание директорий
echo -e "${YELLOW}[3/7] Создание директорий...${NC}"
mkdir -p $DEPLOY_DIR
mkdir -p $BACKUP_DIR
echo -e "${GREEN}✓ Директории созданы${NC}"

# 4. Бэкап текущей версии (если есть)
if [ -d "$DEPLOY_DIR/.next" ]; then
    echo -e "${YELLOW}[4/7] Бэкап текущей версии...${NC}"
    BACKUP_NAME="frontend_$(date +%Y%m%d_%H%M%S).tar.gz"
    tar -czf $BACKUP_DIR/$BACKUP_NAME -C $DEPLOY_DIR .next package.json 2>/dev/null || true
    echo -e "${GREEN}✓ Бэкап: $BACKUP_NAME${NC}"
else
    echo -e "${YELLOW}[4/7] Бэкап не требуется (первый деплой)${NC}"
fi

# 5. Распаковка нового кода
echo -e "${YELLOW}[5/7] Распаковка кода...${NC}"
if [ -f "lana-frontend.zip" ]; then
    unzip -o lana-frontend.zip -d $DEPLOY_DIR
    echo -e "${GREEN}✓ Код распакован${NC}"
else
    echo -e "${RED}Файл lana-frontend.zip не найден!${NC}"
    echo -e "${YELLOW}Поместите архив в текущую директорию и запустите скрипт снова.${NC}"
    exit 1
fi

# 6. Установка зависимостей и сборка
echo -e "${YELLOW}[6/7] Установка зависимостей и сборка...${NC}"
cd $DEPLOY_DIR

# Создаём .env.local если его нет
if [ ! -f ".env.local" ]; then
    echo "NEXT_PUBLIC_API_URL=https://lanaaihelper.ru/api" > .env.local
    echo -e "${GREEN}✓ Создан .env.local${NC}"
fi

npm install --production=false
npm run build
echo -e "${GREEN}✓ Сборка завершена${NC}"

# 7. Запуск/перезапуск через PM2
echo -e "${YELLOW}[7/7] Запуск приложения...${NC}"
pm2 delete lana-frontend 2>/dev/null || true
pm2 start npm --name "lana-frontend" -- start
pm2 save
echo -e "${GREEN}✓ Приложение запущено${NC}"

# Финальный вывод
echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════╗"
echo "║        ✅ ДЕПЛОЙ ЗАВЕРШЁН!             ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "Frontend запущен на: ${BLUE}http://localhost:3000${NC}"
echo -e "Проверьте статус: ${YELLOW}pm2 status${NC}"
echo -e "Логи: ${YELLOW}pm2 logs lana-frontend${NC}"
echo ""
echo -e "${YELLOW}Не забудьте настроить Nginx reverse proxy!${NC}"
