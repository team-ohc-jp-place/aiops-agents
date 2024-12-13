/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // この設定を追加
    webServerConfig: {
      hostname: '0.0.0.0',
      port: 3000
    }
  }

  module.exports = nextConfig