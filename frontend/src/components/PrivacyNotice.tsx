'use client';
import { useState, useEffect } from 'react';
import { Shield, Lock, BarChart3, X } from 'lucide-react';

export default function PrivacyNotice() {
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('privacy-accepted-v5');
    if (!accepted) {
      setShowPrivacyNotice(true);
    }
  }, []);

  // При переходе обратно на главную показываем плашку снова
  useEffect(() => {
    if (showPrivacyNotice && !isTemporarilyHidden) {
      const handleFocus = () => {
        const accepted = localStorage.getItem('privacy-accepted-v5');
        if (!accepted && window.location.pathname === '/') {
          setIsTemporarilyHidden(false);
        }
      };
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [showPrivacyNotice, isTemporarilyHidden]);

  const acceptPrivacy = () => {
    localStorage.setItem('privacy-accepted-v5', 'true');
    setShowPrivacyNotice(false);
  };

  const handleLinkClick = () => {
    // Временно скрываем плашку чтобы можно было прочитать политику
    setIsTemporarilyHidden(true);
  };

  const handleClose = () => {
    setIsTemporarilyHidden(true);
  };

  if (!showPrivacyNotice || isTemporarilyHidden) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title="Закрыть (можно прочитать политики)"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-lana-100 dark:bg-lana-900/30 flex items-center justify-center">
            <Shield className="w-6 h-6 text-lana-600" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Ваша приватность защищена
          </h3>
        </div>

        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Продолжая, вы соглашаетесь с условиями использования:
        </p>

        <div className="space-y-3 mb-5">
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Ваши диалоги приватны</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Мы не читаем и не анализируем переписку</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Минимум данных</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Только логин, email и пароль для входа</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Улучшаем сервис</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Яндекс.Метрика и Google Analytics для аналитики</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg mb-4 text-xs text-slate-600 dark:text-slate-400">
          <p>Ознакомьтесь: 
            <a href="/terms" onClick={handleLinkClick} className="text-lana-500 hover:underline mx-1">Оферта</a>•
            <a href="/privacy" onClick={handleLinkClick} className="text-lana-500 hover:underline mx-1">Конфиденциальность</a>•
            <a href="/cookies" onClick={handleLinkClick} className="text-lana-500 hover:underline mx-1">Cookies</a>
          </p>
        </div>

        <button
          onClick={acceptPrivacy}
          className="w-full px-4 py-3 bg-gradient-to-r from-lana-500 to-purple-500 text-white font-medium rounded-xl hover:from-lana-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
        >
          Понятно, продолжить
        </button>
      </div>
    </div>
  );
}
