'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CatLogo } from '@/components/CatLogo';
import { Lock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import api from '@/lib/api';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false);
        return;
      }
      
      try {
        await api.post('/auth/validate-reset-token', { token });
        setIsValidToken(true);
      } catch (err) {
        setIsValidToken(false);
      } finally {
        setIsValidating(false);
      }
    };
    
    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await api.post('/auth/reset-password', {
        token,
        new_password: password
      });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-xl border-slate-200 dark:border-slate-700">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-lana-500 dark:text-lana-400 animate-spin" />
            <p className="text-slate-500 dark:text-slate-400">Проверка ссылки...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Invalid token
  if (!token || !isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-xl border-slate-200 dark:border-slate-700 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ссылка недействительна</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Эта ссылка истекла или уже была использована</p>
          <Link href="/forgot-password">
            <Button className="w-full bg-gradient-to-r from-lana-500 to-purple-500">
              Запросить новую ссылку
            </Button>
          </Link>
          <Link href="/login" className="block mt-4 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">
            Вернуться к входу
          </Link>
        </Card>
      </div>
    );
  }

  // Success
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-xl border-slate-200 dark:border-slate-700 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Пароль изменён!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Перенаправляем на страницу входа...</p>
          <Link href="/login">
            <Button className="w-full bg-gradient-to-r from-lana-500 to-purple-500">
              Войти сейчас
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-xl border-slate-200 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CatLogo size={64} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Новый пароль</h1>
          <p className="text-slate-500 dark:text-slate-400">Введите новый пароль для аккаунта</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Новый пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Подтвердите пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="password"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-lana-500 to-purple-500 hover:from-purple-500 hover:to-violet-500"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Сохранение...
              </div>
            ) : (
              'Сохранить пароль'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="w-8 h-8 text-lana-500 dark:text-lana-400 animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
