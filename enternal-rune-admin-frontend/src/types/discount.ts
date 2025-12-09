export type TargetType = 'ORDER'|'PRODUCT'|'EVENT'
export type ValueType = 'PERCENT'|'FIXED'
export interface DiscountRequest {
    discountName: string;
    discountCode: string;
    discountTargetType: TargetType;
    discountValueType: ValueType;
    discountValue: number;
    discountMaxAmount: number;
    discountStartDate: Date;
    discountEndDate: Date;
    discountQuantityLimit: number;
    discountActive: boolean;
}
export interface DiscountResponse {
    discountId: number;
    discountName: string;
    discountCode: string;
    discountTargetType: TargetType;
    discountValueType: ValueType;
    discountValue: number;
    discountMaxAmount: number;
    discountStartDate: Date;
    discountEndDate: Date;
    discountQuantityLimit: number;
    usedQuantity: number;
    discountActive: boolean;
    usedPercent: number; // used/limit * 100
}
export interface DiscountPageResponse {
  content: DiscountResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
export interface DiscountStatisticResponse {
    totalDiscounts:number;
    activeDiscounts:number;
    usedCount:number;
    totalDiscountAmount:number;
}