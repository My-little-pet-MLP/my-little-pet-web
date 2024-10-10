import { axiosInstance } from "@/lib/axios";

export async function getOrderById(id: string) {
    try {
        if (!id) {
            throw new Error("ID é obrigatorio");
        }
        const response = await axiosInstance.get(`/orders/${id}`)

        if (response.status !== 200 || !response.data) {
            throw new Error('Falha ao buscar o pedido.');
        }
        return response.data;
    } catch (error: any) {

        console.error('Erro ao buscar o pedido:', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado ao buscar o pedido.');
    }
}