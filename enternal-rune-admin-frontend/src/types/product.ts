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
  prodVersion: string;
  prodColor: string;
  prodDescription: string;
  prodRating: number;
  brand: BrandResponse | null;
  images: ImageResponse[];
  productPrices: ProductPriceResponse[];
  specifications: ProductSpecificationsResponse | null;
}

export interface ProductDashboardListResponse {
  prodId: number;
  prodName: string;
  prodModel: string;
  brandName: string;
  prodColor: string;
  prodVersion: string;
  productStatus: string;
  currentPrice: number;
  prodRating: number;
  imageUrl: string;
}

export interface ProductDashboardResponse {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStockProducts: number;
  averageRating: number;
  totalBrands: number;
}

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";

export interface ProductRequest {
  prodName: string;
  prodModel: string;
  productStatus: ProductStatus;
  prodVersion: string;
  prodColor: string;
  prodDescription: string;
  prodRating?: number;
  brandId: number;
  images?: Array<{
    imageName: string;
    imageData: string;
  }>;
  productPrices?: Array<{
    ppPrice: number;
    ppPriceStatus: "ACTIVE" | "INACTIVE";
    ppStartDate: string;
    ppEndDate: string;
    discountId?: number;
  }>;
  specifications?: {
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
  };
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
