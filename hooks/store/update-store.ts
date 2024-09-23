import { axiosInstance } from "@/lib/axios";

export async function UpdateStore(data: { id: string, title: string, description: string, cnpj: string, image_url: string }) {
    try {
        const response = await axiosInstance.put(`/store`,
            {
                id: data.id,
                title: data.title,
                description: data.description,
                cnpj: data.cnpj,
                image_url: data.image_url

            });
        return JSON.parse(JSON.stringify(response));
    }
    catch (error: any) {
        console.error('Erro ao Atualizar a loja', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado ao atualizar a loja.')
    }
}