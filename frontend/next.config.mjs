/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "api.edunest.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Profile Images
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub Avatars
      },
    ],
  },
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Optional: Add for better performance
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
