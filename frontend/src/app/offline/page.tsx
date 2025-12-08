'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center p-8">
        <div className="text-6xl mb-6">
          <span role="img" aria-label="offline">📡</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Нет подключения к интернету
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Проверьте подключение и попробуйте снова
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Обновить страницу
        </button>
      </div>
    </div>
  );
}
