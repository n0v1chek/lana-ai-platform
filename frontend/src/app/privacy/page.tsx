'use client';

import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lana-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Lana AI
            </span>
          </Link>
          
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Политика конфиденциальности
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Защита ваших персональных данных
          </p>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm prose prose-slate dark:prose-invert max-w-none">
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Редакция от 24 ноября 2025 года
            </p>

            <h2>1. Общие положения</h2>
            <p>
              1.1. Настоящая Политика конфиденциальности определяет порядок 
              обработки и защиты персональных данных пользователей сервиса Lana AI Helper, 
              расположенного по адресу https://lanaaihelper.ru.
            </p>
            <p>
              1.2. Оператором персональных данных является самозанятый <strong>Живчин Александр 
              Семенович</strong>, ИНН 263109568337.
            </p>
            <p>
              1.3. Используя Сервис, вы даёте согласие на обработку своих персональных данных 
              в соответствии с настоящей Политикой.
            </p>

            <h2>2. Принципы обработки данных</h2>
            <p>
              2.1. Мы придерживаемся принципа минимизации данных — собираем только то, 
              что необходимо для работы Сервиса.
            </p>
            <p>
              2.2. Для регистрации требуется только имя пользователя (никнейм) и пароль 
              (хранится в зашифрованном виде).
            </p>
            <p>
              2.3. Мы <strong>НЕ собираем</strong>: email (не требуется), номер телефона, 
              паспортные данные, адрес проживания, данные банковских карт (обрабатываются ЮKassa).
            </p>

            <h2>3. Какие данные мы собираем</h2>
            <p>
              <strong>Данные аккаунта:</strong> имя пользователя, хеш пароля, дата регистрации, тариф.
            </p>
            <p>
              <strong>Данные об использовании:</strong> количество сообщений и токенов, выбранные модели.
            </p>
            <p>
              <strong>Технические данные:</strong> IP-адрес, тип браузера, дата и время запросов.
            </p>

            <h2>4. Хранение диалогов</h2>
            <p>
              История диалогов хранится для функции «История чатов». Вы можете удалить 
              любой диалог в любой момент. Мы НЕ анализируем и НЕ читаем содержание ваших диалогов.
            </p>

            <h2>5. Передача данных третьим лицам</h2>
            <p>
              Мы передаём данные только: <strong>ЮKassa</strong> (для платежей) и 
              <strong> OpenRouter API</strong> (для обработки запросов к AI без идентификации пользователя).
            </p>
            <p>
              Мы не продаём данные рекламодателям. Данные предоставляются госорганам 
              только по официальному запросу.
            </p>

            <h2>6. Защита данных</h2>
            <p>
              Мы применяем: шифрование паролей (bcrypt), HTTPS, ограничение доступа к БД, 
              резервное копирование, защиту от DDoS.
            </p>

            <h2>7. Права пользователя</h2>
            <p>
              Вы можете: получить информацию о данных, удалить аккаунт и историю, 
              отозвать согласие. Для этого напишите: support@lanaaihelper.ru
            </p>

            <h2>8. Контакты</h2>
            <p>
              <strong>Email:</strong> support@lanaaihelper.ru<br />
              <strong>Оператор:</strong> Живчин Александр Семенович<br />
              <strong>ИНН:</strong> 263109568337
            </p>

            <hr className="my-8" />

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Используя сервис Lana AI Helper, вы подтверждаете согласие с настоящей Политикой.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          © 2025 Lana AI Helper. ИНН: 263109568337
        </div>
      </footer>
    </div>
  );
}
