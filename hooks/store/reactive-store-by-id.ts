import { axiosInstance } from "@/lib/axios";

export async function ReactivateStoreById(id: string) {
    try {
        const response = await axiosInstance.put(`/store/reactivate/${id}`)
        const dataresponse = response.data
        return JSON.parse(JSON.stringify(dataresponse))
    } catch (error: any) {
        console.error('Erro ao reativar a loja', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado ao reativar a loja.');
    }
}