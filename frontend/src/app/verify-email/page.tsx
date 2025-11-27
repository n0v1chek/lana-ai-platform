'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import api from '@/lib/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Отсутствует токен верификации');
        return;
      }
      
      try {
        await api.post('/api/auth/verify-email', { token });
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.response?.data?.detail || 'Ссылка недействительна или истекла');
      }
    };
    
    verifyEmail();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4">
        <div className="w-full max-w-md p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <Mail className="w-8 h-8 text-purple-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              </div>
            </div>
            <p className="text-zinc-400">Подтверждаем email...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4">
        <div className="w-full max-w-md p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Email подтверждён!</h1>
          <p className="text-zinc-400 mb-6">Теперь вы сможете восстановить доступ через этот email.</p>
          <Link href="/chat" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-violet-500">
            Перейти в чат
          </Link>
          <Link href="/login" className="block mt-4 text-sm text-zinc-400 hover:text-white">
            или войти в аккаунт
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4">
      <div className="w-full max-w-md p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Не удалось подтвердить</h1>
        <p className="text-zinc-400 mb-6">{errorMessage}</p>
        <Link href="/login" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-violet-500">
          Войти в аккаунт
        </Link>
        <Link href="/register" className="block mt-4 text-sm text-zinc-400 hover:text-white">
          или создать новый аккаунт
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
