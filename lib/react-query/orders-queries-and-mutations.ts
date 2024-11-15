import { getOrderById } from "@/hooks/orders/get-order-by-id"
import { listOrdersByStoreId } from "@/hooks/orders/list-orders-by-store-id"
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { QUERYKEYS } from "./query-is"
import { getTotalBillingMonthSomeResponse, ListOrderByStoreIdResponse, Order, OrderInList, useSomeTotalSalesInMonthResponse } from "@/@types/orders";
import { getTotalBillingMonthSome } from "@/hooks/orders/get-total-billing-month-some";
import { number } from "zod";
import { someTotalSalesInMonth } from "@/hooks/orders/some-total-sales-in-month";
import { OrderStatus, updateOrderStatus } from "@/hooks/orders/update-order-by-id";


export const useGetOrderById = (id: string): UseQueryResult<Order> => {
    console.log("Buscando pedido com ID:", id); // Verifica se o ID está correto

    return useQuery<Order>({
        queryKey: [QUERYKEYS.getOrderById, id],
        queryFn: () => {
            console.log("Executando queryFn para ID:", id);
            return getOrderById(id);
        },
        enabled: !!id,
    });
};


export const useListOrdersByStoreId = (
    storeId: string,
    page: number,
    size: number
): UseQueryResult<ListOrderByStoreIdResponse> => {
    return useQuery<ListOrderByStoreIdResponse>({
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

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // Função de atualização (mutation)
        mutationFn: ({
            id,
            status,
            fullPriceOrderInCents
        }: {
            id: string;
            status: OrderStatus;
            fullPriceOrderInCents:number;
        }) =>
            updateOrderStatus({
                id,
                status,
                fullPriceOrderInCents
            }),

        // Callback em caso de sucesso
        onSuccess: () => {
            console.log("Status do pedido atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: [QUERYKEYS.listOrdersByStoreId] });
            queryClient.invalidateQueries({ queryKey: [QUERYKEYS.getTotalBillingMonthSome] });
            queryClient.invalidateQueries({ queryKey: [QUERYKEYS.getOrderById] });
            queryClient.invalidateQueries({ queryKey: [QUERYKEYS.someTotalSalesInMonth] });
            queryClient.invalidateQueries({ queryKey: [QUERYKEYS.listProductInOrdersByOrderId] });
        },

        // Callback em caso de erro
        onError: (error: any) => {
            console.error("Erro ao atualizar o status do pedido:", error.message || error);
        },
    });
};