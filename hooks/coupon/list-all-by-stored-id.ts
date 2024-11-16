import { axiosInstance } from "@/lib/axios";
export interface Coupon {
    description: string; // Descrição do cupom
    percentage: number;  // Porcentagem de desconto
    storeId: string;     // ID da loja
    available: number;   // Quantidade disponível
    delivered: number;   // Quantidade entregue
    totalQuantity: number; // Quantidade total criada
}
export async function listCouponsByStoreId(storeId: string): Promise<Coupon[]> {
    if (!storeId) {
        throw new Error("O ID da loja é obrigatório.");
    }

    try {
        const response = await axiosInstance.get(`/cupom/list-all-by-store-id/${storeId}`);
        if (response.status !== 200 || !response.data) {
            throw new Error("Falha ao listar os cupons da loja.");
        }

        // Mapeia a resposta para o formato esperado por Coupon
        return response.data.map((item: any) => ({
            description: item.cupons.description,
            percentage: item.cupons.porcentagem,
            storeId: storeId,
            available: item.available,
            delivered: item.delivered,
            totalQuantity: item.totalQuantity,
        }));
    } catch (error: any) {
        console.error("Erro ao listar cupons da loja:", error);
        throw new Error(error.response?.data?.message || "Erro inesperado ao buscar cupons.");
    }
}