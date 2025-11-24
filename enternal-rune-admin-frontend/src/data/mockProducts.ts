import {
  ProductDashboardResponse,
  ProductDashboardListResponse,
} from "@/types/product";

// Dữ liệu thống kê mẫu
export const mockStatistics: ProductDashboardResponse = {
  totalProducts: 48,
  activeProducts: 35,
  inactiveProducts: 8,
  outOfStockProducts: 5,
  averageRating: 4.3,
  totalBrands: 8,
};

// Dữ liệu sản phẩm mẫu
export const mockProducts: ProductDashboardListResponse[] = [
  {
    prodId: 1,
    prodName: "iPhone 15 Pro Max",
    prodModel: "A2894",
    brandName: "Apple",
    prodColor: "Titan tự nhiên",
    prodVersion: "256GB",
    productStatus: "ACTIVE",
    currentPrice: 34990000,
    prodRating: 4.8,
    imageUrl: "/images/product/product-01.jpg",
  },
  {
    prodId: 2,
    prodName: "Samsung Galaxy S24 Ultra",
    prodModel: "SM-S928",
    brandName: "Samsung",
    prodColor: "Titan xám",
    prodVersion: "512GB",
    productStatus: "ACTIVE",
    currentPrice: 33990000,
    prodRating: 4.7,
    imageUrl: "/images/product/product-02.jpg",
  },
  {
    prodId: 3,
    prodName: "iPhone 14 Pro",
    prodModel: "A2650",
    brandName: "Apple",
    prodColor: "Tím đậm",
    prodVersion: "128GB",
    productStatus: "ACTIVE",
    currentPrice: 25990000,
    prodRating: 4.6,
    imageUrl: "/images/product/product-03.jpg",
  },
  {
    prodId: 4,
    prodName: "Xiaomi 14 Ultra",
    prodModel: "2405CPX3DG",
    brandName: "Xiaomi",
    prodColor: "Đen",
    prodVersion: "512GB",
    productStatus: "ACTIVE",
    currentPrice: 29990000,
    prodRating: 4.5,
    imageUrl: "/images/product/product-04.jpg",
  },
  {
    prodId: 5,
    prodName: "OPPO Find X7 Ultra",
    prodModel: "PHZ110",
    brandName: "OPPO",
    prodColor: "Nâu da",
    prodVersion: "512GB",
    productStatus: "OUT_OF_STOCK",
    currentPrice: 27990000,
    prodRating: 4.4,
    imageUrl: "/images/product/product-05.jpg",
  },
  {
    prodId: 6,
    prodName: "Vivo X100 Pro",
    prodModel: "V2329",
    brandName: "Vivo",
    prodColor: "Xanh da trời",
    prodVersion: "256GB",
    productStatus: "ACTIVE",
    currentPrice: 24990000,
    prodRating: 4.5,
    imageUrl: "/images/product/product-01.jpg",
  },
  {
    prodId: 7,
    prodName: "iPhone 13",
    prodModel: "A2482",
    brandName: "Apple",
    prodColor: "Midnight",
    prodVersion: "128GB",
    productStatus: "INACTIVE",
    currentPrice: 15990000,
    prodRating: 4.5,
    imageUrl: "/images/product/product-02.jpg",
  },
  {
    prodId: 8,
    prodName: "Samsung Galaxy Z Fold5",
    prodModel: "SM-F946",
    brandName: "Samsung",
    prodColor: "Icy Blue",
    prodVersion: "512GB",
    productStatus: "ACTIVE",
    currentPrice: 40990000,
    prodRating: 4.6,
    imageUrl: "/images/product/product-03.jpg",
  },
];

// Function để tạo mock page response
export function createMockPageResponse(
  page: number = 0,
  size: number = 8
): {
  content: ProductDashboardListResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
} {
  const startIndex = page * size;
  const endIndex = Math.min(startIndex + size, mockProducts.length);
  const content = mockProducts.slice(startIndex, endIndex);

  return {
    content,
    totalElements: mockProducts.length,
    totalPages: Math.ceil(mockProducts.length / size),
    size,
    number: page,
    first: page === 0,
    last: endIndex >= mockProducts.length,
    empty: content.length === 0,
  };
}
