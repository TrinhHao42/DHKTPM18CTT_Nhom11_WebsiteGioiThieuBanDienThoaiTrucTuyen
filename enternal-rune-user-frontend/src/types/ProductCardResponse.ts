// Enhanced ProductCard response type matching backend ProductCardResponse
export interface ProductCardResponse {
  prodId: number;
  prodName: string;
  prodModel?: string;
  prodDescription?: string;
  prodRating: number;
  brandName: string;
  currentPrice: number;
  originalPrice?: number;
  discountLabel?: string;
  imageUrl?: string;
  totalComments: number;
  averageRating: number;
  availableColors?: string; // Comma-separated string
}