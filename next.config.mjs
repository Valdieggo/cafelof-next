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
          }
        ],
      },
};

export default nextConfig;
