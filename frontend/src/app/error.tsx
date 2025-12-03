'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    console.error('Global error:', error)
  }, [error])

  if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Обновление...</p>
        </div>
      </div>
    )
  }

  return (
    <html>
      <body className="bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Что-то пошло не так</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error.message}</p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
