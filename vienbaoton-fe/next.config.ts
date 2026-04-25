import type { NextConfig } from "next";

const GHOST_API_URL = process.env.GHOST_API_URL || "http://localhost:2368";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "2368",
        pathname: "/content/images/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/content/images/:path*/",
        destination: `${GHOST_API_URL}/content/images/:path*/`,
      },
      {
        source: "/content/images/:path*",
        destination: `${GHOST_API_URL}/content/images/:path*`,
      },
    ];
  },
};

export default nextConfig;
