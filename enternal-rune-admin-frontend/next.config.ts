module.exports = {
  typescript: {
    // Temporarily ignore build errors for Docker build
    ignoreBuildErrors: true,
  },
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./public/**', './.next/static/**'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn2.cellphones.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  output: 'standalone',
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};
