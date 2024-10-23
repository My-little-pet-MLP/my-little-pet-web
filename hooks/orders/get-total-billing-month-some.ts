import { axiosInstance } from "@/lib/axios";

export async function getTotalBillingMonthSome(storeId: string) {
    try {
        if (!storeId) {
            throw new Error("ID é obrigatorio");
        }
        const response = await axiosInstance.get(`/orders/get-total-billing-month-some/${storeId}`)

        if (response.status !== 200 || !response.data) {
            throw new Error('Falha ao buscar o faturamento total.');
        }
        return response.data;
    } catch (error: any) {

        console.error('Erro ao buscar o faturamento total:', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado o faturamento total.');
    }
}