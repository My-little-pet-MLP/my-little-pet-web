import { Store } from "@/@types/store";
import { axiosInstance } from "@/lib/axios";

export async function getStoreByUserId(user_id: string): Promise<Store> {
    try {
      const response = await axiosInstance.get(`/store/getbyuser/${user_id}`);
      const storeData: Store = response.data;
      return JSON.parse(JSON.stringify(storeData)); // Apenas para garantir a consistência dos dados
    } catch (error: any) {
      console.error('Erro ao buscar loja pelo ID do usuário:', error.message || error);
      throw new Error(error.response?.data?.message || 'Erro inesperado ao buscar a loja.');
    }
  }