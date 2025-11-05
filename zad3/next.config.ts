import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wymagane, aby Next.js mógł optymalizować obrazy z zewnętrznych źródeł
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
