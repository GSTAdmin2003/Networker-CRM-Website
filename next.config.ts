import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted via Docker (see Dockerfile) -- standalone output bundles
  // only the files each page actually needs into .next/standalone,
  // instead of shipping the full node_modules tree into the runtime
  // image. Has no effect on the Vercel deployment path if one is ever
  // used again.
  output: 'standalone',
  // Form endpoints are not content: keep them out of every index even if a
  // crawler ignores robots.txt and reaches one directly.
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
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
