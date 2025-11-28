'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Zap, Brain, Bot, Globe, Check, Coins, Search, Camera } from 'lucide-react';
import { chatApi } from '@/lib/api';

interface ModelInfo {
  model_id: string;
  price_per_1m_tokens: number;
  input_per_1m?: number;
  output_per_1m?: number;
}

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  disabled?: boolean;
}

const MODEL_CATEGORIES: Record<string, { name: string; icon: typeof Zap; color: string }> = {
  'openai': { name: 'OpenAI', icon: Brain, color: 'text-green-500' },
  'anthropic': { name: 'Anthropic', icon: Bot, color: 'text-orange-500' },
  'google': { name: 'Google', icon: Globe, color: 'text-blue-500' },
  'deepseek': { name: 'DeepSeek', icon: Zap, color: 'text-purple-500' },
  'mistralai': { name: 'Mistral', icon: Zap, color: 'text-amber-500' },
  'x-ai': { name: 'xAI', icon: Brain, color: 'text-gray-500' },
};

// Модели с поддержкой Vision (изображений)
const VISION_MODELS = new Set([
  'openai/gpt-4o',
  'openai/gpt-4o-mini',
  'anthropic/claude-3.5-sonnet',
  'anthropic/claude-sonnet-4',
  'anthropic/claude-opus-4',
  'anthropic/claude-3.5-haiku',
  'anthropic/claude-3.7-sonnet',
  'google/gemini-2.0-flash-001',
  'google/gemini-2.5-flash',
  'google/gemini-2.5-pro',
  'x-ai/grok-3',
]);

// Описания и рекомендации для моделей
const MODEL_DESCRIPTIONS: Record<string, string> = {
  // Экономичные
  'google/gemini-2.0-flash-001': 'Простые вопросы, чат',
  'google/gemini-2.5-flash': 'Повседневные задачи',
  'openai/gpt-4o-mini': 'Быстрые ответы, код',
  'deepseek/deepseek-chat': 'Общение, анализ',
  'deepseek/deepseek-r1': 'Логические задачи',
  
  // Стандартные
  'anthropic/claude-3.5-haiku': 'Код, анализ, Vision',
  'openai/o3-mini': 'Логика, математика',
  'mistralai/mistral-large-2411': 'Сложные тексты',
  
  // Премиум
  'openai/gpt-4o': '⭐ Универсальная, код, Vision',
  'google/gemini-2.5-pro': '⭐ Анализ, Vision, код',
  'anthropic/claude-sonnet-4': '⭐ Код, тексты, анализ',
  'anthropic/claude-3.5-sonnet': '⭐ Универсальная',
  'anthropic/claude-3.7-sonnet': '⭐ Рассуждения, код',
  'x-ai/grok-3': 'Креатив, юмор',
  'openai/gpt-4-turbo': 'Длинные документы',
  
  // Ультра
  'anthropic/claude-opus-4': '🏆 Сложнейшие задачи',
  'openai/o1': '🏆 Наука, математика',
  'openai/o1-pro': '🏆 Исследования',
};

function getModelDisplayName(modelId: string): string {
  const parts = modelId.split('/');
  if (parts.length > 1) {
    return parts[1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return modelId;
}

function getModelProvider(modelId: string): string {
  return modelId.split('/')[0] || 'other';
}

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + 'M';
  }
  if (price >= 1000) {
    return (price / 1000).toFixed(0) + 'k';
  }
  return price.toString();
}

export default function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        const data = await chatApi.getModels();
        setModels(data.models || []);
      } catch (error) {
        console.error('Failed to load models:', error);
        setModels([
          { model_id: 'google/gemini-2.0-flash-001', price_per_1m_tokens: 21000 },
          { model_id: 'openai/gpt-4o-mini', price_per_1m_tokens: 32000 },
          { model_id: 'openai/gpt-4o', price_per_1m_tokens: 540000 },
          { model_id: 'anthropic/claude-sonnet-4', price_per_1m_tokens: 770000 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedModel = models.find((m) => m.model_id === value);
  const displayName = selectedModel ? getModelDisplayName(selectedModel.model_id) : getModelDisplayName(value);
  const provider = getModelProvider(value);
  const ProviderIcon = MODEL_CATEGORIES[provider]?.icon || Zap;
  const selectedHasVision = VISION_MODELS.has(value);

  const filteredModels = models.filter(m =>
    m.model_id.toLowerCase().includes(search.toLowerCase()) ||
    getModelDisplayName(m.model_id).toLowerCase().includes(search.toLowerCase())
  );

  const cheapModels = filteredModels.filter(m => m.price_per_1m_tokens < 50000);
  const mediumModels = filteredModels.filter(m => m.price_per_1m_tokens >= 50000 && m.price_per_1m_tokens < 250000);
  const premiumModels = filteredModels.filter(m => m.price_per_1m_tokens >= 250000 && m.price_per_1m_tokens < 1000000);
  const ultraModels = filteredModels.filter(m => m.price_per_1m_tokens >= 1000000);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={'flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-lana-300 dark:hover:border-lana-700 transition-colors ' +
          (disabled ? 'opacity-50 cursor-not-allowed' : '')}
      >
        <ProviderIcon size={16} className={MODEL_CATEGORIES[provider]?.color || 'text-lana-500'} />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] sm:max-w-[150px] truncate">
          {displayName}
        </span>
        {selectedHasVision && <Camera size={14} className="text-blue-500" />}
        <ChevronDown
          size={14}
          className={'text-slate-400 transition-transform ' + (isOpen ? 'rotate-180' : '')}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-slide-down overflow-hidden">
          <div className="p-2 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск модели..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 rounded-lg border-0 focus:ring-2 focus:ring-lana-500 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate-500">Загрузка...</div>
            ) : (
              <>
                {cheapModels.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 sticky top-0">
                      💚 Экономичные — для простых задач
                    </div>
                    {cheapModels.map((model) => (
                      <ModelOption
                        key={model.model_id}
                        model={model}
                        selected={model.model_id === value}
                        onSelect={() => {
                          onChange(model.model_id);
                          setIsOpen(false);
                          setSearch('');
                        }}
                      />
                    ))}
                  </div>
                )}

                {mediumModels.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 sticky top-0">
                      💛 Стандартные — баланс цены и качества
                    </div>
                    {mediumModels.map((model) => (
                      <ModelOption
                        key={model.model_id}
                        model={model}
                        selected={model.model_id === value}
                        onSelect={() => {
                          onChange(model.model_id);
                          setIsOpen(false);
                          setSearch('');
                        }}
                      />
                    ))}
                  </div>
                )}

                {premiumModels.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 sticky top-0">
                      🧡 Премиум — для сложных задач
                    </div>
                    {premiumModels.map((model) => (
                      <ModelOption
                        key={model.model_id}
                        model={model}
                        selected={model.model_id === value}
                        onSelect={() => {
                          onChange(model.model_id);
                          setIsOpen(false);
                          setSearch('');
                        }}
                      />
                    ))}
                  </div>
                )}

                {ultraModels.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase bg-slate-50 dark:bg-slate-900/50 sticky top-0">
                      ❤️ Ультра — максимум возможностей
                    </div>
                    {ultraModels.map((model) => (
                      <ModelOption
                        key={model.model_id}
                        model={model}
                        selected={model.model_id === value}
                        onSelect={() => {
                          onChange(model.model_id);
                          setIsOpen(false);
                          setSearch('');
                        }}
                      />
                    ))}
                  </div>
                )}

                {filteredModels.length === 0 && (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    Модель не найдена
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ModelOption({ model, selected, onSelect }: {
  model: ModelInfo;
  selected: boolean;
  onSelect: () => void;
}) {
  const provider = getModelProvider(model.model_id);
  const Icon = MODEL_CATEGORIES[provider]?.icon || Zap;
  const iconColor = MODEL_CATEGORIES[provider]?.color || 'text-slate-500';
  const hasVision = VISION_MODELS.has(model.model_id);
  const desc = MODEL_DESCRIPTIONS[model.model_id];

  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-2 sm:gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
    >
      <Icon size={16} className={iconColor + ' flex-shrink-0'} />
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {getModelDisplayName(model.model_id)}
          </p>
          {hasVision && (
            <Camera size={12} className="text-blue-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-slate-500 truncate">
          {desc || model.model_id}
        </p>
      </div>
      <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 whitespace-nowrap flex-shrink-0">
        <Coins size={12} />
        {formatPrice(model.price_per_1m_tokens)}
      </div>
      {selected && (
        <Check size={16} className="text-lana-500 flex-shrink-0" />
      )}
    </button>
  );
}
