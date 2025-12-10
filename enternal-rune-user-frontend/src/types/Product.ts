import { Brand } from "./Brand";
import { Image } from "./Image";
import { ProductPrice } from "./ProductPrice";

// Product specifications object (partial - flexible keys)
export type ProdSpecs = {
  [key: string]: string | number | boolean
}

// Define the Product interface based on the JSON structure and code usage
export type Product = {
  prodId: string | number, // Support both string and number for flexibility
  prodName: string
  prodModel?: string
  prodVersion?: string[]
  prodColor?: string[] // Made optional since backend may return availableColors string
  availableColors?: string // Comma-separated string from optimized API
  images?: Image[] // Made optional for backward compatibility
  imageUrl?: string // New field from optimized API responses
  primaryImageUrl?: string // New field from ProductListResponse API
  prodDescription?: string
  prodSpecs?: ProdSpecs
  productStatus?: string
  prodRating: number
  productPrices?: ProductPrice[]
  comments?: Comment[] // Made optional
  prodBrand?: Brand
  brandName?: string // Direct brand name from optimized API
  brandId?: number // Brand ID from optimized API
  // Enhanced pricing from optimized API
  currentPrice?: number
  originalPrice?: number
  activePrice?: number // New field from ProductListResponse API
  discountLabel?: string
  discountName?: string // New field from ProductListResponse API
  discountPrice?: number // New field from ProductListResponse API
  // New rating fields from backend
  totalComments?: number
  averageRating?: number
  ratingDistribution?: { [key: string]: number }
}