import { axiosInstance } from "@/lib/axios";

export async function DeleteStoreById(id: string) {
    try {
        const response = await axiosInstance.delete(`/store/${id}`)
        const dataresponse = response.data
        return JSON.parse(JSON.stringify(dataresponse))
    } catch (error: any) {
        console.error('Erro ao deletar a loja', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado ao deletar a loja.');
    }
}