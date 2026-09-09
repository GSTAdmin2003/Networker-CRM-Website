import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted via Docker (see Dockerfile) -- standalone output bundles
  // only the files each page actually needs into .next/standalone,
  // instead of shipping the full node_modules tree into the runtime
  // image. Has no effect on the Vercel deployment path if one is ever
  // used again.
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
