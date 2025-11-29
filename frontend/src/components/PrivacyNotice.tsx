'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock, UserX } from 'lucide-react';

export default function PrivacyNotice() {
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  useEffect(() => {
    const accepted = sessionStorage.getItem('privacy-accepted');
    if (!accepted) {
      setShowPrivacyNotice(true);
    }
  }, []);

  const acceptPrivacy = () => {
    sessionStorage.setItem('privacy-accepted', 'true');
    setShowPrivacyNotice(false);
  };

  if (!showPrivacyNotice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Ваша приватность защищена
          </h3>
        </div>
        <div className="space-y-3 mb-6 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Не собираем персональные данные</strong> — логин, email и пароль для безопасного доступа</span>
          </div>
          <div className="flex items-start gap-2">
            <UserX className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Не используем cookies для отслеживания</strong> — никакой рекламы и аналитики</span>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Не храним ваши диалоги</strong> — общение с AI остаётся приватным</span>
          </div>
        </div>
        <button
          onClick={acceptPrivacy}
          className="w-full px-4 py-3 bg-lana-500 text-white font-medium rounded-xl hover:bg-lana-600 transition-colors"
        >
          Понятно, продолжить
        </button>
        <p className="mt-3 text-xs text-slate-500 text-center">
          Продолжая, вы соглашаетесь с <Link href="/terms" className="text-lana-500 hover:underline">Офертой</Link>, <Link href="/privacy" className="text-lana-500 hover:underline">Политикой конфиденциальности</Link> и <Link href="/cookies" className="text-lana-500 hover:underline">Политикой cookies</Link>
        </p>
      </div>
    </div>
  );
}
