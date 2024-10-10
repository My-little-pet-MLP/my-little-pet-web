import { axiosInstance } from "@/lib/axios";

export async function listProductInOrdersByOrderId(orderId: string) {
    try {
        if (!orderId) {
            throw new Error('ID do pedido é obrigatório para listar os produtos do pedido.');
        }

        const response = await axiosInstance.get(`/product-in-orders/listallbyorder/${orderId}`);


        if (response.status !== 200 || !response.data) {
            throw new Error('Falha ao listar os produtos do pedido.');
        }

        return response.data;
    } catch (error: any) {

        console.error('Erro ao listar produtos do pedido:', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado ao listar produtos do pedido.');
    }
}
