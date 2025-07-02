/** @type {import('next').NextConfig} */
const nextConfig = {
  // Locale detection'ı tamamen kapat
  i18n: null,
  
  // Automatic locale detection'ı devre dışı bırak
  trailingSlash: false,
  
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Redirect'leri önle
  async redirects() {
    return []
  },
  
  // Headers'ta locale detection'ı önle
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Accept-Language',
            value: 'en-US,en;q=0.9',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 