import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Optimización de Headers para Caché y Seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate', // HTML y Datos: Siempre frescos
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' https://*.supabase.co https://*.supabase.in blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://*.supabase.in https://www.youtube.com https://youtube.com https://s.ytimg.com https://cdn.jsdelivr.net blob:", 
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https: https://img.youtube.com https://i.ytimg.com",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co wss://*.supabase.in https://mindicador.cl https://open.er-api.com https://api.exchangerate-api.com",
              "media-src 'self' blob: https://*.supabase.co https://*.supabase.in",
              "worker-src 'self' blob: https://cdn.jsdelivr.net",
              "child-src 'self' blob:",
              "frame-src 'self' https://www.youtube.com https://youtube.com",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // JS/CSS Estáticos: Cachear por 1 año (tienen hash)
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 año para imágenes optimizadas (Next.js Image)
          },
        ],
      },
    ];
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.enaco.cl' },
      { protocol: 'https', hostname: 'enaco.cl' },
      { protocol: 'https', hostname: 'cdn.enacoadmin.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
};

export default nextConfig;
