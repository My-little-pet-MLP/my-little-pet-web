import { axiosInstance } from "@/lib/axios";

export async function listProductsByStoreId(store_id: string, page: number = 1, size: number = 8) {
    try {
      if (!store_id) {
        throw new Error('ID da loja é obrigatório para listar os produtos.');
      }
  
      const response = await axiosInstance.get(`https://product-microservice-mlp.onrender.com/product/listbystore?store_id=${store_id}&page=${page}&size=${size}`);
  
  
      if (response.status !== 200 || !response.data) {
        throw new Error('Falha ao listar os produtos.');
      }
  
      return response.data;
    } catch (error: any) {
  
      console.error('Erro ao listar produtos:', error.message || error);
      throw new Error(error.response?.data?.message || 'Erro inesperado ao listar produtos.');
    }
  }
  