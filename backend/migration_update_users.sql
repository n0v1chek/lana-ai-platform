-- Добавить поля для ежедневных лимитов (если их нет)
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_messages_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_messages_reset_at TIMESTAMP DEFAULT NOW();

-- Изменить тип subscription_plan с ENUM на String (если это ENUM)
-- PostgreSQL не позволяет просто изменить ENUM, поэтому делаем через промежуточную колонку
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan_new VARCHAR(50);
UPDATE users SET subscription_plan_new = subscription_plan::text;
ALTER TABLE users DROP COLUMN IF EXISTS subscription_plan CASCADE;
ALTER TABLE users RENAME COLUMN subscription_plan_new TO subscription_plan;
ALTER TABLE users ALTER COLUMN subscription_plan SET DEFAULT 'free';

-- Обновить лимиты токенов для FREE пользователей
UPDATE users SET tokens_limit = 30000 WHERE subscription_plan = 'free';

-- Переименовать BASIC в STARTER
UPDATE users SET subscription_plan = 'starter' WHERE subscription_plan = 'basic';

-- Обновить лимиты для остальных тарифов
UPDATE users SET tokens_limit = 1000000 WHERE subscription_plan = 'starter';
UPDATE users SET tokens_limit = 5000000 WHERE subscription_plan = 'pro';
UPDATE users SET tokens_limit = 20000000 WHERE subscription_plan = 'business' OR subscription_plan = 'unlimited';
