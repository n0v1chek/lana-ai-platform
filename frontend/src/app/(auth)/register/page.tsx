'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CatLogo } from '@/components/CatLogo';
import { User, Lock, Mail, ArrowRight, Info } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Только латиница, цифры и _'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Нужна хотя бы одна заглавная буква')
    .regex(/[0-9]/, 'Нужна хотя бы одна цифра'),
  confirmPassword: z.string(),
  email: z.string().email('Неверный формат email').optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !success) {
      router.push('/chat');
    }
  }, [router, success]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    clearError();
    try {
      await registerUser({ username: data.username, password: data.password, email: data.email || undefined });
      setSuccess(true);
      setTimeout(() => {
        router.push('/chat');
      }, 2000);
    } catch (err) {
      // Ошибка обрабатывается в store
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-xl border-slate-200 dark:border-slate-700 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Регистрация успешна!</h2>
          <p className="text-slate-500 dark:text-slate-400">Перенаправляем в чат...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md p-8 bg-white dark:bg-slate-800 shadow-xl border-slate-200 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CatLogo size={64} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Создать аккаунт</h1>
          <p className="text-slate-500 dark:text-slate-400">Присоединяйтесь к LANA AI Helper</p>
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email <span className="text-slate-400 font-normal">(необязательно)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                {...register('email')}
                type="email"
                placeholder="example@mail.ru"
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            <div className="flex gap-2 mt-2 p-2.5 bg-lana-50 dark:bg-lana-900/20 border border-lana-200 dark:border-lana-500/20 rounded-lg">
              <Info className="w-4 h-4 text-lana-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-lana-600 dark:text-lana-300 leading-relaxed">
                Email нужен только для восстановления доступа если забудете логин или пароль.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                {...register('password')}
                type="password"
                placeholder="Минимум 8 символов"
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Подтвердите пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                {...register('confirmPassword')}
                type="password"
                placeholder="Повторите пароль"
                className="pl-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-lana-500 to-purple-500 hover:from-lana-600 hover:to-purple-600"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Регистрация...
              </div>
            ) : (
              <span className="flex items-center gap-2">
                Создать аккаунт
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-lana-500 hover:text-lana-600 font-medium">
              Войти
            </Link>
          </p>
        </div>

        <p className="mt-4 text-xs text-slate-400 text-center">
          Регистрируясь, вы соглашаетесь с{' '}
          <Link href="/terms" className="text-lana-500 hover:underline">
            условиями использования
          </Link>
        </p>
      </Card>
    </div>
  );
}
