import { Brand } from "./Brand";
import { Image } from "./Image";
import { ProductPrice } from "./ProductPrice";

// Product specifications object (partial - flexible keys)
export type ProdSpecs = {
  [key: string]: string | number | boolean
}

// Define the Product interface based on the JSON structure and code usage
export type Product = {
  prodId: string,
  prodName: string
  prodModel?: string
  prodVersion?: string[]
  prodColor: string[]
  images: Image[]
  prodDescription?: string
  prodSpecs?: ProdSpecs
  productStatus?: string
  prodRating: number
  productPrices?: ProductPrice[]
  comments: Comment[]
  prodBrand?: Brand
  // New rating fields from backend
  totalComments?: number
  averageRating?: number
  ratingDistribution?: { [key: string]: number }
}