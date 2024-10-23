import { axiosInstance } from "@/lib/axios";

export async function someTotalSalesInMonth(storeId: string) {
    try {
        if (!storeId) {
            throw new Error("ID é obrigatorio");
        }
        const response = await axiosInstance.get(`/orders/some-total-sales-in-month/${storeId}`)

        if (response.status !== 200 || !response.data) {
            throw new Error('Falha ao buscar total de  vendas do mes');
        }
        return response.data;
    } catch (error: any) {

        console.error('Erro ao buscar total de  vendas do mes:', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado ao buscar total de  vendas do mes');
    }
}