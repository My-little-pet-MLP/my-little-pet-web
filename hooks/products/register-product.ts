import { axiosInstance } from "@/lib/axios";

export async function RegisterProduct(data: { title: string, description: string, price_in_cents: number, stock: number, category_id: string, store_id: string,image_url:string }) {
    try {
      const response = await axiosInstance.post(`/product`, {
        title: data.title,
        image_url: data.image_url,
        description: data.description,
        price_in_cents: data.price_in_cents,
        stock: data.stock,
        category_id: data.category_id,
        store_id: data.store_id,
      })
      const dataresponse = response.data
      return JSON.parse(JSON.stringify(dataresponse))
    } catch (error: any) {
      console.error('Erro ao criar um produto', error.message || error);
      throw new Error(error.response?.data?.message || 'Erro inesperado ao criar um produto.');
    }
  }