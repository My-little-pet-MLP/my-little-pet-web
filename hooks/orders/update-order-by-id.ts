import { axiosInstance } from "@/lib/axios";

export interface UpdateOrderStatusRequest {
    id: string; // ID do pedido a ser atualizado
    status: OrderStatus; // Novo status do pedido
    fullPriceOrderInCents: number; // Preço total em centavos (opcional)
}

export type OrderStatus =
    | "pending"
    | "awaiting_payment"
    | "payment_confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "canceled"
    | "returned";

export interface UpdateOrderStatusResponse {
    order: {
        id: string;
        fullPriceOrderInCents: number;
        storeId: string;
        status: OrderStatus; // Tipagem do status
        customerId: string;
        created_at: string;
        updated_at: string;
    };
}

/**
 * Atualiza o status de um pedido.
 *
 * @param data - Dados para a atualização do status do pedido.
 * @returns O pedido atualizado.
 */
export async function updateOrderStatus(
    data: UpdateOrderStatusRequest
): Promise<UpdateOrderStatusResponse> {
    try {
        const response = await axiosInstance.put(`/orders/`, data); // Rota sem ID na URL
        if (response.status !== 200 || !response.data) {
            throw new Error("Falha ao atualizar o status do pedido.");
        }
        return response.data;
    } catch (error: any) {
        console.error("Erro ao atualizar o status do pedido:", error.message || error);
        throw new Error(
            error.response?.data?.message || "Erro inesperado ao atualizar o pedido."
        );
    }
}
