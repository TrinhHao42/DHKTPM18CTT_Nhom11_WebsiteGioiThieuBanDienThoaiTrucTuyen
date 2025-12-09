// Product Types & Interfaces

export interface BrandResponse {
  brandId: number;
  brandName: string;
}

export interface ImageResponse {
  imageId: number;
  imageName: string;
  imageData: string;
}

export interface ProductPriceResponse {
  ppId: number;
  ppPrice: number;
  ppPriceStatus: string | null;
  ppStartDate: string;
  ppEndDate: string;
  discountId: number | null;
  discountName: string | null;
}

export interface ProductSpecificationsResponse {
  screenSize: string;
  displayTech: string;
  rearCamera: string;
  frontCamera: string;
  chipset: string;
  nfcTech: string;
  ram: string;
  storage: string;
  battery: string;
  th_sim: string;
  os: string;
  resolution: string;
  displayFeatures: string;
  cpuType: string;
}

export interface ProductResponse {
  prodId: number;
  prodName: string;
  prodModel: string;
  productStatus: string | null;
  prodVersion: string[];
  prodColor: string[];
  prodDescription: string;
  prodRating: number;
  prodBrand: BrandResponse | null;
  images: ImageResponse[];
  productPrices: ProductPriceResponse[];
  prodSpecs: ProductSpecificationsResponse | null;
}

export interface ProductDashboardListResponse {
  productId: number;
  productName: string;
  model: string;
  category: string;
  price: number;
  status: string;
  imageUrl: string;
}

export interface ProductDashboardResponse {
  totalProducts: number;
  totalCategories: number;
  availableProducts: number;
  outOfStockProducts: number;
}

export type ProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "REMOVED";

export interface ProductPriceRequest {
  ppPrice: number;
}

export interface ImageRequest {
  imageName: string;
  imageData: string;
}

export interface ProductRequest {
  productName: string;
  productModel: string;
  productStatus: ProductStatus;
  productVersion: string[];
  productColor: string[];
  productDescription: string;
  brandId: number;
  images: ImageRequest[];
  productPrices: ProductPriceRequest[];
}

// Interface cho form UI
export interface ProductFormData {
  productId?: number;
  productName: string;
  productModel: string;
  productStatus: ProductStatus;
  productVersion: string[];
  productColor: string[];
  productDescription: string;
  brandId: number;
  price: number;
  images?: File[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ProductFilterParams {
  page?: number;
  size?: number;
  keyword?: string;
  brand?: string;
  status?: ProductStatus;
}
