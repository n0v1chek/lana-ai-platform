'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CatLogo } from '@/components/CatLogo';
import { User, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Минимум 3 символа')
    .max(20, 'Максимум 20 символов')
    .regex(/^[a-zA-Z0-9_]+$/, 'Только латиница, цифры и _'),
  email: z.string().min(1, 'Email обязателен').email('Неверный формат email'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Нужна хотя бы одна заглавная буква')
    .regex(/[0-9]/, 'Нужна хотя бы одна цифра'),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'Необходимо принять условия',
  }),
  agreeAge: z.boolean().refine(val => val === true, {
    message: 'Необходимо подтвердить возраст',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const [utmData, setUtmData] = useState<{
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer?: string;
  }>({});

  useEffect(() => {
    // Собираем UTM-метки из URL
    const utm_source = searchParams.get('utm_source') || undefined;
    const utm_medium = searchParams.get('utm_medium') || undefined;
    const utm_campaign = searchParams.get('utm_campaign') || undefined;
    
    // Получаем referrer
    const referrer = document.referrer || undefined;
    
    setUtmData({ utm_source, utm_medium, utm_campaign, referrer });
    
    // Сохраняем в localStorage на случай если пользователь уйдёт и вернётся
    if (utm_source || utm_medium || utm_campaign || referrer) {
      localStorage.setItem('registration_utm', JSON.stringify({ utm_source, utm_medium, utm_campaign, referrer }));
    }
  }, [searchParams]);

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
    if (token && !success) {
      router.push('/chat');
    }
    
    // Восстанавливаем UTM из localStorage если есть
    const savedUtm = localStorage.getItem('registration_utm');
    if (savedUtm && !utmData.utm_source && !utmData.referrer) {
      try {
        setUtmData(JSON.parse(savedUtm));
      } catch (e) {
        // ignore
      }
    }
  }, [router, success]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeTerms: false,
      agreeAge: false,
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    clearError();
    try {
      await registerUser({ 
        username: data.username, 
        password: data.password, 
        email: data.email,
        // Передаём UTM-метки
        utm_source: utmData.utm_source,
        utm_medium: utmData.utm_medium,
        utm_campaign: utmData.utm_campaign,
        referrer: utmData.referrer
      });
      // Очищаем сохранённые UTM после успешной регистрации
      localStorage.removeItem('registration_utm');
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
          <p className="text-slate-600 dark:text-slate-300">Перенаправляем в чат...</p>
        </Card>
      </div>
    );
  }

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
            <CatLogo size={192} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Создать аккаунт</h1>
          <p className="text-slate-600 dark:text-slate-300">Присоединяйтесь к LANA AI Helper</p>
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
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

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register('agreeTerms')}
                id="agreeTerms"
                className="mt-1 w-4 h-4 text-lana-500 border-slate-300 rounded focus:ring-lana-500"
              />
              <label htmlFor="agreeTerms" className="text-sm text-slate-600 dark:text-slate-300">
                Я согласен с{' '}
                <Link href="/terms" className="text-lana-500 hover:underline">Офертой</Link>,{' '}
                <Link href="/privacy" className="text-lana-500 hover:underline">Политикой конфиденциальности</Link>{' '}
                и{' '}
                <Link href="/cookies" className="text-lana-500 hover:underline">Политикой cookies</Link>
              </label>
            </div>
            {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>}

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                {...register('agreeAge')}
                id="agreeAge"
                className="mt-1 w-4 h-4 text-lana-500 border-slate-300 rounded focus:ring-lana-500"
              />
              <label htmlFor="agreeAge" className="text-sm text-slate-600 dark:text-slate-300">
                Мне исполнилось 18 лет
              </label>
            </div>
            {errors.agreeAge && <p className="text-red-500 text-sm">{errors.agreeAge.message}</p>}
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
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-lana-500 hover:text-lana-600 font-medium">
              Войти
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="w-8 h-8 border-4 border-lana-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
