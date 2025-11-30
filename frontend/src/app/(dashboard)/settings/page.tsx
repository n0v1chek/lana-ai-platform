'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CatLogo } from '@/components/CatLogo';
import {
  ArrowLeft,
  User,
  Lock,
  Mail,
  Shield,
  Trash2,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api';
import { Button, Input, Card } from '@/components/ui';

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Введите текущий пароль'),
  newPassword: z.string().min(8, 'Минимум 8 символов'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, fetchUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handlePasswordChange = async (data: PasswordForm) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await authApi.changePassword(data.oldPassword, data.newPassword);
      setSuccess('Пароль успешно изменён');
      reset();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Не удалось изменить пароль');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailUpdate = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await authApi.updateProfile({ email });
      setSuccess('Email успешно обновлён');
      fetchUser();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Не удалось обновить email');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо!')) return;
    if (!confirm('Все ваши данные будут удалены. Продолжить?')) return;

    try {
      alert('Функция удаления аккаунта скоро будет доступна. Обратитесь в поддержку.');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <CatLogo size={28} />
          <p className="text-slate-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={18} />}>
                Назад
              </Button>
            </Link>
            <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Настройки
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300">
            {success}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lana-500 to-purple-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Профиль
              </h2>
              <p className="text-sm text-slate-500">Основная информация</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Имя пользователя
              </label>
              <Input
                value={user?.username || ''}
                disabled
                leftIcon={<User size={18} />}
              />
              <p className="text-xs text-slate-500 mt-1">Имя пользователя нельзя изменить</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email (опционально)
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  leftIcon={<Mail size={18} />}
                  className="flex-1"
                />
                <Button
                  onClick={handleEmailUpdate}
                  isLoading={saving}
                  leftIcon={<Save size={18} />}
                >
                  Сохранить
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Password Card */}
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Безопасность
              </h2>
              <p className="text-sm text-slate-500">Смена пароля</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
            <Input
              type="password"
              label="Текущий пароль"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={errors.oldPassword?.message}
              {...register('oldPassword')}
            />

            <Input
              type="password"
              label="Новый пароль"
              placeholder="••••••••"
              leftIcon={<Shield size={18} />}
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />

            <Input
              type="password"
              label="Подтвердите пароль"
              placeholder="••••••••"
              leftIcon={<Shield size={18} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button type="submit" isLoading={saving}>
              Изменить пароль
            </Button>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card padding="lg" className="border-red-200 dark:border-red-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Опасная зона
              </h2>
              <p className="text-sm text-slate-500">Необратимые действия</p>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Удаление аккаунта приведёт к безвозвратной потере всех ваших данных, включая историю диалогов и баланс.
          </p>

          <Button
            variant="secondary"
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            leftIcon={<Trash2 size={18} />}
            onClick={handleDeleteAccount}
          >
            Удалить аккаунт
          </Button>
        </Card>
      </main>
    </div>
  );
}
