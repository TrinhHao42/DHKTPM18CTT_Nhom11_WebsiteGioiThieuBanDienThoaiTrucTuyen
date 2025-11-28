// Brand Types & Interfaces

export interface BrandResponse {
  brandId: number;
  brandName: string;
}

export interface BrandDashboardListResponse {
  brandId: number;
  brandName: string;
  productCount: number;
}

export interface BrandRequest {
  brandName: string;
}

export interface BrandPageResponse {
  content: BrandDashboardListResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
