import { axiosInstance } from "@/lib/axios";

export interface ProductInOrder {
    id: string;
    name: string;
    image: string;
    price: number; // Preço do produto
    quantity: number; // Quantidade no pedido
    productInOrderId: string; // ID do produto no pedido
}

export async function listProductsInOrder(orderId: string): Promise<ProductInOrder[]> {
    if (!orderId) {
        throw new Error("O ID do pedido é obrigatório.");
    }

    try {
        const response = await axiosInstance.get(`/product-in-orders/listallbyorder/${orderId}`);
        if (response.status !== 200 || !response.data) {
            throw new Error("Falha ao listar os produtos do pedido.");
        }
        return response.data;
    } catch (error: any) {
        console.error("Erro ao listar produtos no pedido:", error);
        throw new Error(error.response?.data?.message || "Erro inesperado ao buscar produtos.");
    }
}
