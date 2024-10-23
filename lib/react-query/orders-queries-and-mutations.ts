import { getOrderById } from "@/hooks/orders/get-order-by-id"
import { listOrdersByStoreId } from "@/hooks/orders/list-orders-by-store-id"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { QUERYKEYS } from "./query-is"
import { getTotalBillingMonthSomeResponse, Order,useSomeTotalSalesInMonthResponse } from "@/@types/orders";
import { getTotalBillingMonthSome } from "@/hooks/orders/get-total-billing-month-some";
import { number } from "zod";
import { someTotalSalesInMonth } from "@/hooks/orders/some-total-sales-in-month";

export const useGetOrderById = (id: string): UseQueryResult<Order> => {
    return useQuery<Order>({
        queryKey: [QUERYKEYS.getProductInOrderById],
        queryFn: () => getOrderById(id),
        enabled: !!id,
    });
};

export const useListOrdersByStoreId = (
    storeId: string,
    page: number,
    size: number
): UseQueryResult<Order[]> => {
    return useQuery<Order[]>({
        queryKey: [QUERYKEYS.listOrdersByStoreId],
        queryFn: () => listOrdersByStoreId(storeId, page, size),
        enabled: !!storeId,
    });
};

export const useGetTotalBillingMonthSome = (storeId: string): UseQueryResult<getTotalBillingMonthSomeResponse> => {
    return useQuery<getTotalBillingMonthSomeResponse>({
        queryKey: [QUERYKEYS.getTotalBillingMonthSome],
        queryFn: () => getTotalBillingMonthSome(storeId),
        enabled: !!storeId
    })
}
export const useSomeTotalSalesInMonth = (storeId: string): UseQueryResult<useSomeTotalSalesInMonthResponse> => {
    return useQuery<useSomeTotalSalesInMonthResponse>({
        queryKey: [QUERYKEYS.someTotalSalesInMonth],
        queryFn: () => someTotalSalesInMonth(storeId),
        enabled: !!storeId
    })
}