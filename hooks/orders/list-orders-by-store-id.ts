import { axiosInstance } from "@/lib/axios";

export async function listOrdersByStoreId(store_id: string, page: number, size: number = 8) {
    try {
      if (!store_id) {
        throw new Error('ID da loja é obrigatório para listar os produtos.');
      }
  
      const response = await axiosInstance.get(`/orders/listAllByStoreId?store_id=${store_id}&page=${page}&size=${size}`);
  
  
      if (response.status !== 200 || !response.data) {
        throw new Error('Falha ao listar os pedidos.');
      }
      console.log( response.data);
      return response.data;
    } catch (error: any) {
  
      console.error('Erro ao listar os pedidos:', error.message || error);
      throw new Error(error.response?.data?.message || 'Erro inesperado ao listar os pedidos.');
    }
  }
  