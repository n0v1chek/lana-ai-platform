'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CatLogo } from '@/components/CatLogo';
import { User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  username: z.string().min(1, 'Введите логин'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = (() => {
      const authStorage = sessionStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          return parsed?.state?.token;
        } catch {}
      }
      return null;
    })();
    if (token) {
      router.push('/chat');
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    clearError();
    try {
      await login({ username: data.username, password: data.password });
      router.push('/chat');
    } catch (err) {
      // Ошибка обрабатывается в store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-xl border-slate-200 dark:border-slate-700">
          <div className="flex justify-start mb-4">
            <Link href="/" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" />
              На главную
            </Link>
          </div>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CatLogo size={64} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Добро пожаловать!</h1>
          <p className="text-slate-500 dark:text-slate-400">Войдите в LANA AI Helper</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Логин</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                {...register('username')}
                placeholder="Введите логин"
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
              />
            </div>
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                {...register('password')}
                type="password"
                placeholder="Введите пароль"
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-lana-500 hover:text-lana-600 transition-colors">
              Забыли логин или пароль?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-lana-500 to-purple-500 hover:from-lana-600 hover:to-purple-600"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Вход...
              </div>
            ) : (
              <span className="flex items-center gap-2">
                Войти
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-lana-500 hover:text-lana-600 font-medium">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}