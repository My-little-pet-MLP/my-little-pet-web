export interface Order {
  id: string;
  fullPriceOrderInCents: number;
  storeId: string;
  status: string;
  customerId: string;
  cupomId: string | null; // Pode ser null caso não exista cupom
  created_at: string; // ISO 8601 Date string
  updated_at: string; // ISO 8601 Date string
}

export type OrderInList = {
  id: string
  fullPriceOrderInCents: number
  storeId: string
  status: string,
  customerId: string
  created_at: string
  updated_at: string
}
export type getTotalBillingMonthSomeResponse = {
  totalBillingMonth: number
}
export type useSomeTotalSalesInMonthResponse = {
  totalSalesInMonth: number
}

export interface ListOrderByStoreIdResponse {
  orders: OrderInList[]
  currentPage: number
  totalPages: number
}