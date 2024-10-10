import { getOrderById } from "@/hooks/orders/get-order-by-id"
import { listOrdersByStoreId } from "@/hooks/orders/list-orders-by-store-id"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { QUERYKEYS } from "./query-is"
import { Order } from "@/@types/orders";

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