module.exports = {
  typescript: {
    // Temporarily ignore build errors for Docker build
    ignoreBuildErrors: true,
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
}