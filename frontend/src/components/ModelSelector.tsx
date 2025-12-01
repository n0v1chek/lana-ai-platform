// components/ModelSelector.tsx
// Компонент выбора модели в профиле пользователя

'use client';

import { useState, useEffect } from 'react';
import { Check, Zap, Star, Gem, Crown, Info, TrendingUp } from 'lucide-react';

interface Model {
  model_id: string;
  model_name: string;
  category: 'cheap' | 'medium' | 'premium' | 'ultra';
  cost_per_1m_tokens: number;
  is_premium: boolean;
  is_available: boolean;
  limit_info?: string | null;
}

interface ModelSelectorProps {
  currentModel?: string;
  onModelChange?: (modelId: string) => void;
}

export default function ModelSelector({ currentModel, onModelChange }: ModelSelectorProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | undefined>(currentModel);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tier, setTier] = useState('');
  const [usage, setUsage] = useState<{ total_tokens_used: number; tokens_limit: number; premium_tokens_used: number } | null>(null);

  useEffect(() => {
    fetchAvailableModels();
  }, []);

  const fetchAvailableModels = async () => {
    try {
      const response = await fetch('/api/profile/models', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch models');

      const data = await response.json();
      setModels(data.models);
      setTier(data.tier);
      setUsage(data.usage);
      setSelectedModel(data.current_preferred_model);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching models:', error);
      setLoading(false);
    }
  };

  const handleModelSelect = async (modelId: string) => {
    if (saving) return;

    setSaving(true);
    try {
      const response = await fetch('/api/profile/preferred-model', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ preferred_model: modelId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail?.error || 'Failed to update model');
      }

      const data = await response.json();
      setSelectedModel(modelId);
      
      if (onModelChange) {
        onModelChange(modelId);
      }

      // Показываем уведомление
      alert(`✅ Модель успешно изменена на ${data.model_name}`);
    } catch (error: unknown) {
      console.error('Error updating model:', error);
      alert(`❌ Ошибка: ${(error as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cheap':
        return <Zap className="w-5 h-5 text-green-500" />;
      case 'medium':
        return <Star className="w-5 h-5 text-blue-500" />;
      case 'premium':
        return <Gem className="w-5 h-5 text-purple-500" />;
      case 'ultra':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cheap':
        return 'Быстрая';
      case 'medium':
        return 'Качественная';
      case 'premium':
        return 'Премиум';
      case 'ultra':
        return 'Ультра';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cheap':
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      case 'medium':
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
      case 'premium':
        return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
      case 'ultra':
        return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Информация о тарифе и использовании */}
      {usage && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Тариф: {tier}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Использовано: {usage.total_tokens_used.toLocaleString()} 
              </p>
              {usage.premium_tokens_used > 0 && (
                <p className="text-sm text-purple-600 mt-1">
                  Премиум модели: {usage.premium_tokens_used.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {((usage.total_tokens_used / usage.tokens_limit) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((usage.total_tokens_used / usage.tokens_limit) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Заголовок */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Выберите модель</h2>
        <p className="text-gray-600">
          Выберите модель для использования по умолчанию в чате. Вы всегда можете изменить её позже.
        </p>
      </div>

      {/* Сетка моделей */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <button
            key={model.model_id}
            onClick={() => model.is_available && handleModelSelect(model.model_id)}
            disabled={!model.is_available || saving}
            className={`
              relative p-4 rounded-lg border-2 transition-all text-left
              ${selectedModel === model.model_id ? 'border-purple-600 ring-2 ring-purple-600 ring-offset-2' : 'border-gray-200'}
              ${model.is_available ? getCategoryColor(model.category) : 'bg-gray-100 opacity-50 cursor-not-allowed'}
              ${saving ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            {/* Индикатор выбранной модели */}
            {selectedModel === model.model_id && (
              <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Иконка категории */}
            <div className="flex items-center gap-2 mb-2">
              {getCategoryIcon(model.category)}
              <span className="text-xs font-semibold text-gray-600 uppercase">
                {getCategoryLabel(model.category)}
              </span>
            </div>

            {/* Название модели */}
            <h3 className="font-bold text-gray-900 mb-1">
              {model.model_name}
            </h3>

            {/* Стоимость */}
            <p className="text-sm text-gray-600 mb-2">
              ~{Math.round(model.cost_per_1m_tokens / 20)}₽/ответ
            </p>

            {/* Информация о лимитах */}
            {model.limit_info && model.is_available && (
              <div className="flex items-start gap-1 mt-2 p-2 bg-white bg-opacity-60 rounded text-xs text-gray-700">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{model.limit_info}</span>
              </div>
            )}

            {/* Недоступно */}
            {!model.is_available && (
              <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Доступно с тарифа PRO
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Подсказка */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Совет по выбору модели:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li><strong>Gemini Flash</strong> - отлично для простых задач, самая быстрая</li>
              <li><strong>GPT-4o Mini</strong> - хороша для программирования</li>
              <li><strong>GPT-4o</strong> - универсальная модель для всех задач</li>
              <li><strong>Claude Sonnet</strong> - лучшая для творческих и сложных задач</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
