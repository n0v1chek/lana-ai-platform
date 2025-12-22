'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CatLogo } from '@/components/CatLogo';
import {
  Video,
  Sparkles,
  Download,
  Coins,
  ArrowLeft,
  Loader2,
  AlertCircle,
  X,
  Clock,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui';
import { videosApi, VideoModel, VideoGenerateResponse } from '@/lib/api';

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9', desc: 'Широкий' },
  { value: '9:16', label: '9:16', desc: 'Вертикальный' },
  { value: '1:1', label: '1:1', desc: 'Квадрат' },
];

const DURATIONS = [
  { value: 3, label: '3 сек' },
  { value: 5, label: '5 сек' },
  { value: 8, label: '8 сек' },
  { value: 10, label: '10 сек' },
];

export default function VideosPage() {
  const router = useRouter();
  const { user, isAuthenticated, isInitialized, fetchUser } = useAuthStore();

  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState(5);
  const [selectedModel, setSelectedModel] = useState('wan-video/wan-2.5-t2v-fast');
  const [models, setModels] = useState<VideoModel[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<VideoGenerateResponse | null>(null);
  const [lastCoinsSpent, setLastCoinsSpent] = useState<number | null>(null);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const data = await videosApi.getModels();
      setModels(data.models);
      if (data.models.length > 0) {
        setSelectedModel(data.models[0].model_id);
      }
    } catch (e) {
      console.error('Failed to load video models:', e);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Введите описание видео');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setLastCoinsSpent(null);
    setGeneratedVideo(null);

    try {
      const result = await videosApi.generate({
        prompt: prompt.trim(),
        model: selectedModel,
        aspect_ratio: aspectRatio,
        duration: duration,
      });

      setGeneratedVideo(result);
      setLastCoinsSpent(result.coins_spent);
      fetchUser();
    } catch (e: any) {
      const errorDetail = e.response?.data?.detail;
      if (typeof errorDetail === 'object' && errorDetail.error) {
        setError(errorDetail.error);
      } else if (typeof errorDetail === 'string') {
        setError(errorDetail);
      } else {
        setError('Ошибка генерации видео. Попробуйте позже.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (url: string, filename: string | null) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename || 'generated-video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  const balance = user?.balance || 0;
  const selectedModelInfo = models.find(m => m.model_id === selectedModel);
  const estimatedCost = selectedModelInfo
    ? Math.ceil(selectedModelInfo.coins_per_5sec * (duration / 5))
    : 2000;

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <CatLogo size={80} />
          <p className="text-slate-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-4">
          <Link href="/chat" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 icon-btn">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Video size={18} className="text-white" />
            </div>
            <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white">Генерация видео</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastCoinsSpent && (
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg font-medium">
              -{lastCoinsSpent}
            </span>
          )}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <span className="text-sm font-bold text-slate-900 dark:text-white">{balance.toLocaleString()}</span>
            <Coins size={18} className="text-amber-500" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-sm text-red-700 dark:text-red-400 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 icon-btn">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Описание видео
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Опишите видео, которое хотите создать... Например: Кот играет с мячиком на зеленой траве, солнечный день"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-lana-500"
              rows={4}
            />
          </div>

          {/* Model Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Модель
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {models.map((model) => (
                <button
                  key={model.model_id}
                  onClick={() => setSelectedModel(model.model_id)}
                  className={`text-left px-4 py-3 rounded-xl border transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
                    selectedModel === model.model_id
                      ? 'border-lana-500 bg-lana-50 dark:bg-lana-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{model.name}</p>
                      <p className="text-xs text-slate-500">{model.desc}</p>
                    </div>
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      ~{model.coins_per_5sec}/5сек
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Длительность
            </label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  disabled={selectedModelInfo && d.value > selectedModelInfo.max_duration}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
                    duration === d.value
                      ? 'bg-lana-500 text-white shadow-md'
                      : selectedModelInfo && d.value > selectedModelInfo.max_duration
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:-translate-y-0.5 hover:shadow-sm'
                  }`}
                >
                  <Clock size={14} className="inline mr-1" />
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Соотношение сторон
            </label>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => setAspectRatio(ratio.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 ${
                    aspectRatio === ratio.value
                      ? 'bg-lana-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:-translate-y-0.5 hover:shadow-sm'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || balance < estimatedCost}
            className="w-full"
            size="lg"
            leftIcon={isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          >
            {isGenerating ? 'Генерация видео...' : `Создать видео (~${estimatedCost} коинов)`}
          </Button>

          {balance < estimatedCost && (
            <p className="text-center text-sm text-amber-600 dark:text-amber-400 mt-3">
              Недостаточно коинов. <Link href="/pricing" className="underline">Пополнить</Link>
            </p>
          )}

          {isGenerating && (
            <p className="text-center text-sm text-slate-500 mt-3">
              Генерация видео может занять 1-3 минуты...
            </p>
          )}
        </div>

        {/* Generated Video */}
        {generatedVideo && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
              Результат
            </h2>
            <div className="relative group">
              <video
                src={generatedVideo.video_url.startsWith('/api') ? (process.env.NEXT_PUBLIC_API_URL || '') + generatedVideo.video_url : generatedVideo.video_url}
                controls
                autoPlay
                loop
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700"
              />
              <button
                onClick={() => handleDownload(
                  generatedVideo.video_url.startsWith('/api') ? (process.env.NEXT_PUBLIC_API_URL || '') + generatedVideo.video_url : generatedVideo.video_url,
                  generatedVideo.filename
                )}
                className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Download size={18} className="text-slate-700 dark:text-slate-300" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-3 text-center">
              Длительность: {generatedVideo.duration} сек | Потрачено: {generatedVideo.coins_spent} коинов
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Советы для лучших результатов:</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>- Описывайте действие: что происходит, кто участвует</li>
            <li>- Указывайте окружение: место, время суток, погода</li>
            <li>- Добавляйте стиль: реалистичный, мультяшный, кинематографичный</li>
            <li>- Короткие видео (3-5 сек) генерируются быстрее</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
