import { axiosInstance } from "@/lib/axios";

export async function getProductInOrderById(id:string) {
    try {
      if (!id) {
        throw new Error('ID é obrigatório');
      }
  
      const response = await axiosInstance.get(`/product-in-orders/${id}`);
  
  
      if (response.status !== 200 || !response.data) {
        throw new Error('Falha ao buscar os produto do pedido.');
      }
  
      return response.data;
    } catch (error: any) {
  
      console.error('Erro ao buscar produto do pedido:', error.message || error);
      throw new Error(error.response?.data?.message || 'Erro inesperado ao buscar produto do pedido.');
    }
  }
  