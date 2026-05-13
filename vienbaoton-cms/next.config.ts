import type { NextConfig } from "next";

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
};

export default nextConfig;
