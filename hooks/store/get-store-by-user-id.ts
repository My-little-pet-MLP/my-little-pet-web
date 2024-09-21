import { axiosInstance } from "@/lib/axios";

export async function getStoreByUserId(user_id: string) {
    try {
        const response = await axiosInstance.get(`/store/getbyuser/${user_id}`);
        const storeData = response.data;
        return JSON.parse(JSON.stringify(storeData));
    } catch (error: any) {
        console.error('Erro ao buscar loja pelo ID do usuário:', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado ao buscar a loja.');
    }
}

