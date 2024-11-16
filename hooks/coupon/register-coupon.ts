import { axiosInstance } from "@/lib/axios";

// Tipagem do payload e da resposta
export interface RegisterCouponPayload {
  store_id: string;
  description: string;
  percentage: number;
  validateAt: string;
  quantity: number;
}

export interface RegisterCouponResponse {
  cupomInfo: {
    storeId: string;
    description: string;
    porcentagem: number;
    isValid: boolean;
    ValidateAt: string;
  };
  quantityCreated: number;
}

// Função para registrar um cupom
export const registerCoupon = async (
  data: RegisterCouponPayload
): Promise<RegisterCouponResponse> => {
  try {
    const response = await axiosInstance.post<RegisterCouponResponse>('/cupom', data);
    const dataResponse = response.data;
    return JSON.parse(JSON.stringify(dataResponse)); // Garantir uma cópia limpa do objeto
  } catch (error: any) {
    console.error('Erro ao registrar um cupom:', error.message || error);
    throw new Error(
      error.response?.data?.message || 'Erro inesperado ao registrar um cupom.'
    );
  }
};
