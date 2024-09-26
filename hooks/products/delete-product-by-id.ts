import { axiosInstance } from "@/lib/axios";

export async function DeleteProductById(id: string) {
    try {
        const response = await axiosInstance.delete(`/product/${id}`)
        const dataresponse = response.data
        return JSON.parse(JSON.stringify(dataresponse))
    } catch (error: any) {
        console.error('Erro ao deletar o produto', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado ao deletar o produto.');
    }
}