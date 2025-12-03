/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Генерируем уникальный buildId для каждого билда
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  // Отключаем строгий режим для избежания двойных рендеров
  reactStrictMode: false,
}
module.exports = nextConfig
