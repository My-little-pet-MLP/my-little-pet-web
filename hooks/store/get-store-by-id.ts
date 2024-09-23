import { axiosInstance } from "@/lib/axios";

export async function getStoreById(id: string) {
    try {
        const response = await axiosInstance.get(`/store/${id}`);
        const storeData = response.data;
        return JSON.parse(JSON.stringify(storeData));
    } catch (error: any) {
        console.error('Erro ao buscar loja pelo ID:', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado ao buscar a loja.');
    }
}

