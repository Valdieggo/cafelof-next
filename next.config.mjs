/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true,
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return [];
    }
    return [
      {
        source: "/(.*)", // Apply to all routes, including _next/static
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' https://images.dog.ceo https://lh3.googleusercontent.com;
              font-src 'self';
              connect-src 'self';
              frame-src 'self' https://apis.google.com;
            `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
