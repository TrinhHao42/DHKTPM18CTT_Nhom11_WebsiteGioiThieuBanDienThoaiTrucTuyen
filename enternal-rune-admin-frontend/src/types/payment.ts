// Types for Payment API responses
export interface PaymentMetrics {
  totalTransactions: number;
  totalRevenue: number;
  paidTransactions: number;
  pendingTransactions: number;
  transactionsTrend: number;
  revenueTrend: number;
  paidTrend: number;
  pendingTrend: number;
}

export interface Transaction {
  transId: number;
  transactionCode: string;
  orderId: number;
  orderInvoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentMethod: string;
  status: "completed" | "pending" | "failed" | "refunded" | "processing";
  createdAt: string;
  completedAt: string | null;
  gatewayRef: string;
  gatewayFee: number;
  netAmount: number;
  reconciled: boolean;
  cardNumber?: string;
  cardHolderName?: string;
  cardBrand?: string;
}

export interface TransactionListResponse {
  success: boolean;
  content: Transaction[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface TransactionFilters {
  status?: string;
  method?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}