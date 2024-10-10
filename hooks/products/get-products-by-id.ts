import { axiosInstance } from "@/lib/axios";

export async function getProductById(id:string) {
    try {
      if (!id) {
        throw new Error('ID é obrigatório');
      }
  
      const response = await axiosInstance.get(`/product/${id}`);
  
  
      if (response.status !== 200 || !response.data) {
        throw new Error('Falha ao buscar os produto.');
      }
  
      return response.data;
    } catch (error: any) {
  
      console.error('Erro ao buscar produto:', error.message || error);
      throw new Error(error.response?.data?.message || 'Erro inesperado ao buscar produto.');
    }
  }
  