import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map(ext => {
    return ext;
  }),
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
