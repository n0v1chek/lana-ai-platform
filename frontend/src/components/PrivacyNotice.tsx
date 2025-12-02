'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Lock, BarChart3, Megaphone } from 'lucide-react';

export default function PrivacyNotice() {
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('privacy-accepted-v2');
    if (!accepted) {
      setShowPrivacyNotice(true);
    }
  }, []);

  const acceptPrivacy = () => {
    localStorage.setItem('privacy-accepted-v2', 'true');
    setShowPrivacyNotice(false);
  };

  if (!showPrivacyNotice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-lana-100 dark:bg-lana-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-lana-600" />
          </div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Использование сайта
          </h3>
        </div>
        
        <div className="space-y-3 mb-5 text-sm text-slate-600 dark:text-slate-400">
          <p className="text-slate-700 dark:text-slate-300">
            Продолжая, вы соглашаетесь с:
          </p>
          
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-lana-500 mt-0.5 flex-shrink-0" />
            <span><strong>Сбор данных для авторизации</strong> — логин, email и пароль</span>
          </div>
          
          <div className="flex items-start gap-2">
            <BarChart3 className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Веб-аналитика</strong> — Яндекс.Метрика и Google Analytics</span>
          </div>
          
          <div className="flex items-start gap-2">
            <Megaphone className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Рекламные cookies</strong> — для показа релевантной рекламы</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg mb-4 text-xs text-slate-600 dark:text-slate-400">
          <p className="font-medium mb-2">Ознакомьтесь с документами:</p>
          <div className="flex flex-wrap gap-2">
            <a 
              href="/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lana-500 hover:underline"
            >
              Оферта ↗
            </a>
            <span>•</span>
            <a 
              href="/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lana-500 hover:underline"
            >
              Конфиденциальность ↗
            </a>
            <span>•</span>
            <a 
              href="/cookies" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lana-500 hover:underline"
            >
              Cookies ↗
            </a>
          </div>
        </div>

        <button
          onClick={acceptPrivacy}
          className="w-full px-4 py-3 bg-gradient-to-r from-lana-500 to-purple-500 text-white font-medium rounded-xl hover:from-lana-600 hover:to-purple-600 transition-all"
        >
          Принимаю и продолжаю
        </button>
        
        <p className="mt-3 text-xs text-slate-500 text-center">
          Отозвать согласие можно в настройках браузера
        </p>
      </div>
    </div>
  );
}
