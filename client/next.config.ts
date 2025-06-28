import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: ['media.api-sports.io'],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.streamfutball.com',
          },
        ],
        destination: 'https://streamfutball.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
