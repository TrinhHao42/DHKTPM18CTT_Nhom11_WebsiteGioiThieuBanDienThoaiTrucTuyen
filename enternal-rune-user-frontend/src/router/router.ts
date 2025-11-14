
// Centralized API route definitions used across the frontend
// Keep these in one place so endpoints are easy to change and search for.
export const API_ROUTES = {
	PRODUCTS_TOP_BRAND: '/products/top-brand',
	PRODUCTS_LATEST: '/products/latest',
	BRANDS_NAMES: '/brands/names',
	PRODUCTS_FILTER: '/products/filter',
	PRODUCTS_BY_ID: (id: string | number) => `/products/${id}/active-price`,
	AI_SUPPORT_CHAT: '/api/ai/support'
} as const

export default API_ROUTES
