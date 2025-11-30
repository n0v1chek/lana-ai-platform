'use client';

import Link from 'next/link';
import { CatLogo } from '@/components/CatLogo';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CatLogo size={24} />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Политика конфиденциальности
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Обработка и защита персональных данных
          </p>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm prose prose-slate dark:prose-invert max-w-none">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Редакция от 30 ноября 2025 года
            </p>

            <h2>1. Общие положения</h2>
            <p>
              1.1. Настоящая Политика определяет порядок обработки и защиты персональных
              данных пользователей сервиса Lana AI Helper (https://lanaaihelper.ru).
            </p>
            <p>
              1.2. Оператором персональных данных является <strong>Живчин Александр Семенович</strong>,
              ИНН 263109568337, плательщик налога на профессиональный доход (самозанятый).
            </p>
            <p>
              1.3. Политика разработана в соответствии с Федеральным законом от 27.07.2006
              № 152-ФЗ «О персональных данных».
            </p>
            <p>
              1.4. Используя Сервис, Пользователь выражает согласие с условиями настоящей Политики.
            </p>

            <h2>2. Какие данные мы собираем</h2>
            <h3>2.1. Данные при регистрации:</h3>
            <ul>
              <li>имя пользователя (логин);</li>
              <li>адрес электронной почты;</li>
              <li>пароль (хранится в зашифрованном виде).</li>
            </ul>

            <h3>2.2. Данные о платежах:</h3>
            <ul>
              <li>информация о транзакциях (сумма, дата, статус);</li>
              <li>идентификатор платежа в системе ЮKassa.</li>
            </ul>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 my-4">
              <strong>Важно:</strong> Мы НЕ получаем и НЕ храним данные банковских карт.
              Платежи обрабатываются платёжной системой ЮKassa.
            </div>

            <h3>2.3. Мы НЕ собираем:</h3>
            <ul>
              <li>паспортные данные;</li>
              <li>данные банковских карт;</li>
              <li>биометрические данные;</li>
              <li>данные о состоянии здоровья;</li>
              <li>политические и религиозные взгляды.</li>
            </ul>

            <h2>3. Цели обработки данных</h2>
            <ul>
              <li>регистрация и идентификация Пользователя;</li>
              <li>предоставление доступа к функционалу Сервиса;</li>
              <li>обработка платежей и начисление коинов;</li>
              <li>техническая поддержка;</li>
              <li>улучшение качества Сервиса на основе аналитики;</li>
              <li>соблюдение требований законодательства.</li>
            </ul>

            <h2>4. Согласие на обработку</h2>
            <p>
              4.1. Согласие даётся путём регистрации на сайте.
            </p>
            <p>
              4.2. Пользователь вправе отозвать согласие, направив заявление на адрес:
              support@lanaaihelper.ru.
            </p>
            <p>
              4.3. Отзыв согласия влечёт удаление учётной записи.
            </p>

            <h2>5. Хранение и защита данных</h2>
            <p>
              5.1. Данные хранятся на защищённых серверах на территории Российской Федерации.
            </p>
            <p>
              5.2. Данные хранятся в течение срока использования Сервиса и удаляются
              по запросу Пользователя или при длительной неактивности аккаунта.
            </p>
            <p>
              5.3. Меры защиты: шифрование паролей, передача данных по HTTPS,
              ограничение доступа к данным.
            </p>

            <h2>6. Передача данных третьим лицам</h2>
            <p>
              6.1. Мы НЕ продаём и НЕ передаём данные для маркетинговых целей.
            </p>
            <p>
              6.2. Данные могут быть переданы:
            </p>
            <ul>
              <li><strong>ЮKassa</strong> — для обработки платежей;</li>
              <li><strong>Яндекс (Яндекс.Метрика)</strong> — для веб-аналитики;</li>
              <li><strong>Google (Google Analytics)</strong> — для веб-аналитики;</li>
              <li><strong>Государственным органам</strong> — по законному запросу.</li>
            </ul>

            <h2>7. Cookies и веб-аналитика</h2>
            <h3>7.1. Технические cookies:</h3>
            <p>
              Сервис использует cookies для авторизации и корректной работы сайта.
            </p>
            
            <h3>7.2. Аналитические cookies:</h3>
            <p>
              Для улучшения качества Сервиса мы используем системы веб-аналитики:
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-4">
              <p className="mb-2"><strong>Яндекс.Метрика</strong> (счётчик № 105576416)</p>
              <ul className="mb-0">
                <li>Вебвизор — запись действий на сайте</li>
                <li>Карта кликов и скроллинга</li>
                <li>Аналитика форм</li>
              </ul>
              <p className="mt-2 text-sm">
                Политика конфиденциальности Яндекса:{' '}
                <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer" className="text-lana-500">
                  yandex.ru/legal/confidential
                </a>
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-4">
              <p className="mb-2"><strong>Google Analytics 4</strong> (ID: G-G2L3FBV3TG)</p>
              <ul className="mb-0">
                <li>Статистика посещений</li>
                <li>Источники трафика</li>
                <li>Поведение пользователей</li>
              </ul>
              <p className="mt-2 text-sm">
                Политика конфиденциальности Google:{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-lana-500">
                  policies.google.com/privacy
                </a>
              </p>
            </div>

            <h3>7.3. Какие данные собирает аналитика:</h3>
            <ul>
              <li>IP-адрес (анонимизируется);</li>
              <li>тип устройства и браузера;</li>
              <li>страницы просмотра;</li>
              <li>источник перехода на сайт;</li>
              <li>действия на сайте (клики, прокрутка).</li>
            </ul>

            <h3>7.4. Отключение аналитики:</h3>
            <p>
              Вы можете отключить сбор данных аналитики:
            </p>
            <ul>
              <li>Установив расширение{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-lana-500">
                  Google Analytics Opt-out
                </a>
              </li>
              <li>Включив режим «Не отслеживать» (Do Not Track) в браузере</li>
              <li>Используя блокировщики рекламы</li>
            </ul>

            <p>
              Подробнее — в{' '}
              <Link href="/cookies" className="text-lana-500 hover:underline">
                Политике cookies
              </Link>.
            </p>

            <h2>8. Права пользователя</h2>
            <p>
              Права субъекта персональных данных определены статьёй 14 Федерального закона
              № 152-ФЗ «О персональных данных». Для реализации прав направьте заявление
              на адрес: support@lanaaihelper.ru.
            </p>

            <h2>9. Возрастные ограничения</h2>
            <p>
              Сервис не предназначен для лиц младше 18 лет.
            </p>

            <h2>10. Диалоги с AI</h2>
            <p>
              10.1. Диалоги хранятся для обеспечения работы Сервиса.
            </p>
            <p>
              10.2. Загруженные файлы автоматически удаляются.
            </p>
            <p>
              10.3. Диалоги не анализируются в маркетинговых целях.
            </p>

            <h2>11. Изменение политики</h2>
            <p>
              Мы вправе изменять Политику. Новая редакция вступает в силу с момента публикации.
            </p>

            <h2>12. Контакты</h2>
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
              <p className="mb-1"><strong>Оператор персональных данных:</strong></p>
              <p className="mb-1">Живчин Александр Семенович</p>
              <p className="mb-1">ИНН: 263109568337</p>
              <p>Email: support@lanaaihelper.ru</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
