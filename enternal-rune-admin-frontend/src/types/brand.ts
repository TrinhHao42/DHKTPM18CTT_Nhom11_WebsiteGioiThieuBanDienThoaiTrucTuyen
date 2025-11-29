// Brand Types & Interfaces

export interface BrandResponse {
  brandId: number;
  brandName: string;
}

export interface BrandDashboardListResponse {
  brandId?: number;
  brandLogoUrl: string;
  brandName: string;
  productCount: number;
  brandStatus: string;
}

export interface BrandRequest {
  brandName: string;
  brandLogoUrl: string;
  brandDescription: string;
  brandStatus: string;
}

export interface BrandFormData {
  brandId?: number;
  brandName: string;
  brandLogoUrl: string;
  brandDescription: string;
  brandStatus: string;
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
