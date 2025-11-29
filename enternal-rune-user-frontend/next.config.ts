import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cellphones.com.vn',
      },
       {
        protocol: 'https',
        hostname: 'cdn2.cellphones.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'skiesandscopes.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-media.sforum.vn',
      },
      {
        protocol: 'https',
        hostname: 'hienlaptop.com',
      },
      {
        protocol: 'https',
        hostname: 'crystalpng.com',
      },
      {
        protocol: 'https',
        hostname: 'www.vivosmartphone.vn',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
