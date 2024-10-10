import { getProductInOrderById } from "@/hooks/product-in-orders/get-product-in-order-by-id"
import { listProductInOrdersByOrderId } from "@/hooks/product-in-orders/list-all-product-in-orders-by-order-id"
import { useQuery } from "@tanstack/react-query"
import { QUERYKEYS } from "./query-is"



export const useGetProductInOrderById = (id: string) => {
    return useQuery({
        queryKey: [QUERYKEYS.getProductInOrderById],
        queryFn: () => getProductInOrderById(id),
        enabled: !!id,
    })
}

export const useListAllProductInOrdersById = (orderId: string) => {
    return useQuery({
        queryKey: [QUERYKEYS.listProductInOrdersByOrderId],
        queryFn: () => listProductInOrdersByOrderId(orderId),
        enabled: !!orderId,
    })
}