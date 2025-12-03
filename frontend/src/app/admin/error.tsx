'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // ChunkLoadError - автоматически перезагружаем страницу
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      console.log('ChunkLoadError detected, reloading page...')
      window.location.reload()
      return
    }
    console.error('Admin error:', error)
  }, [error])

  // Если это ChunkLoadError, показываем минимальный UI пока идёт перезагрузка
  if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Обновление страницы...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Произошла ошибка</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error.message}</p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Попробовать снова
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    </div>
  )
}
