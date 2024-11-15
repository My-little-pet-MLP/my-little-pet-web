import { getProductInOrderById } from "@/hooks/product-in-orders/get-product-in-order-by-id"
import {  listProductsInOrder, ProductInOrder } from "@/hooks/product-in-orders/list-all-product-in-orders-by-order-id"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { QUERYKEYS } from "./query-is"



export const useGetProductInOrderById = (id: string) => {
    return useQuery({
        queryKey: [QUERYKEYS.getProductInOrderById],
        queryFn: () => getProductInOrderById(id),
        enabled: !!id,
    })
}

export const useListAllProductsInOrderByOrderId = (
    orderId: string
): UseQueryResult<ProductInOrder[]> => {
    return useQuery<ProductInOrder[]>({
        queryKey: ["productsInOrder", orderId],
        queryFn: () => listProductsInOrder(orderId),
        enabled: !!orderId, // Apenas ativa a consulta se o ID do pedido existir
    });
};