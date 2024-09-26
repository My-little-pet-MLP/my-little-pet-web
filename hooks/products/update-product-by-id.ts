import { axiosInstance } from "@/lib/axios";

export async function UpdateProductById(id: string, data: { title: string, description: string, image_url: string, price_in_cents: number, stock: number, category_id: string }) {
    try {
        const response = await axiosInstance.put(`/product`, {
            id,
            title: data.title,
            image_url: data.image_url,
            description: data.description,
            price_in_cents: data.price_in_cents,
            stock: data.stock,
            category_id: data.category_id,
        })
        const dataresponse = response.data
        return JSON.parse(JSON.stringify(dataresponse))
    } catch (error: any) {
        console.error('Erro a atualizar o produto', error.message || error);
        throw new Error(error.response?.data?.message || 'Erro inesperado a atualizar o produto.');
    }
}