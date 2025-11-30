
export const API_ROUTES = {
	PRODUCTS_TOP_BRAND: '/products/top-brand',
	PRODUCTS_LATEST: '/products/latest',
	BRANDS_NAMES: '/brands/names',
	PRODUCTS_FILTER: '/products/filter',
	PRODUCTS_BY_ID: (id: string | number) => `/products/${id}/active-price`,
	AI_SUPPORT_CHAT: '/api/ai/support',
	PRODUCT_COMMENTS: (productId: string | number) => `/api/products/${productId}/comments`,
	PRODUCT_RATING_DISTRIBUTION: (productId: string | number) => `/api/products/${productId}/rating-distribution`,
	PRODUCT_AVERAGE_RATING: (productId: string | number) => `/api/products/${productId}/average-rating`,
	PRODUCT_COMMENT_TEXT_ONLY: (productId: string | number) => `/api/products/${productId}/comments/text`
} as const

export default API_ROUTES
