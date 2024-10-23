export type Order = {
  id: string;
  productId: string;
  quantity: number;
  orderId: string;
  created_at: string;
  updated_at: string;
};

export type getTotalBillingMonthSomeResponse =  {
  totalBillingMonth: number
}
export type useSomeTotalSalesInMonthResponse =  {
  totalSalesInMonth: number
}