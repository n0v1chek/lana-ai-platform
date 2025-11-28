'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CatLogo } from '@/components/CatLogo';
import { Mail, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Введите корректный email');
      return;
    }

    setIsLoading(true);

    try {
      // Отправляем запрос на восстановление (бэкенд сам определит что отправить)
      await api.post('/auth/forgot-password', { email });
      setSuccess('Если email зарегистрирован, мы отправили данные для восстановления на почту. Проверьте входящие!');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-xl border-slate-200 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-lana-100 to-purple-100 dark:from-lana-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-lana-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Забыли логин или пароль?</h1>
          <p className="text-slate-500 dark:text-slate-400">Введите email, указанный при регистрации</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:border-lana-500 focus:ring-lana-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !!success}
            className="w-full bg-gradient-to-r from-lana-500 to-purple-500 hover:from-lana-600 hover:to-purple-600 text-white font-medium py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Отправка...
              </div>
            ) : (
              'Восстановить доступ'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-lana-500 dark:hover:text-lana-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться к входу
          </Link>
        </div>

      </Card>
    </div>
  );
}
