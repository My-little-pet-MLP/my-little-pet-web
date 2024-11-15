import { Order } from "@/@types/orders";
import { axiosInstance } from "@/lib/axios";

export async function getOrderById(id: string): Promise<Order> {
    if (!id) {
        throw new Error("ID é obrigatório");
    }

    try {
        const response = await axiosInstance.get(`/orders/${id}`);

        if (response.status !== 200 || !response.data) {
            throw new Error("Falha ao buscar o pedido.");
        }

        return response.data; // Retorna os dados do pedido
    } catch (error: any) {
        console.error("Erro ao buscar o pedido:", error);

        // Lança um erro mais detalhado
        throw new Error(
            error.response?.data?.message || "Erro inesperado ao buscar o pedido."
        );
    }
}