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
  images: {
    // Danh sách các tên miền bên ngoài được phép tải hình ảnh
    domains: [
      'cdn2.cellphones.com.vn', 
      // Nếu bạn có các tên miền khác (ví dụ: cdn.example.com), bạn cũng nên thêm vào đây
    ],
  },
}