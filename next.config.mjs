/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.dog.ceo",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Aplica los encabezados a todas las rutas principales
        source: "/(.*)",
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
              script-src 'self' 'unsafe-inline' https://apis.google.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' https://images.dog.ceo https://lh3.googleusercontent.com;
              font-src 'self';
              connect-src 'self';
              frame-src 'self' https://apis.google.com;
            `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
      {
        // Aplica los encabezados a recursos estáticos en _next/static
        source: "/_next/static/(.*)",
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
              script-src 'self' 'unsafe-inline' https://apis.google.com;
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
