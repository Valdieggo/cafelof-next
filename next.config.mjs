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
        // Aplica los encabezados a todas las rutas
        source: "/(.*)",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // Protección contra envío de referencias
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Permite mostrar contenido en iframes solo desde el mismo origen
          },
        ],
      },
    ];
  },
};

export default nextConfig;
