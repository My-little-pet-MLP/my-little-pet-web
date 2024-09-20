import { axiosInstance } from "@/lib/axios";

export async function RegisterStore(data: { title: string, description: string, cnpj: string, user_id: string, image_url: string }) {
    try {
      const response = await axiosInstance.post("/store/",
        {
          title: data.title,
          description: data.description,
          cnpj: data.cnpj,
          user_id: data.user_id,
          image_url: "https://img.freepik.com/vetores-premium/design-de-logotipo-de-cachorrinho-fofo-de-pet-shop_680355-30.jpg"
        });
      return JSON.parse(JSON.stringify(response));
    }
    catch (error: any) {
      console.error('Erro ao registrar a loja', error.message || error);
      throw new Error(error.response?.data?.message || 'Erro inesperado ao criar a loja.')
    }
  }