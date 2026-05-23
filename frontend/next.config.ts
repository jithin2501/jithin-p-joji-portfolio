import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.simpleicons.org' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
    ],
  },
  async rewrites() {
    // Only rewrite to local backend during local development.
    // In Vercel production, vercel.json handles routing of /api/ to the python backend directly.
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;
