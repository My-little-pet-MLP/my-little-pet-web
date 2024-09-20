import { axiosInstance } from "@/lib/axios";
interface CategoryList{
    id: string,
    title: string,
    slug: string
  }
export async function ListCategories(): Promise<CategoryList[]> {
    try {
      const response = await axiosInstance.get("/category"); // Use seu axiosInstance
  
      // Retorna os dados já convertidos e tipados
      return JSON.parse(JSON.stringify(response.data)) as CategoryList[];
    } catch (error: any) {
      console.error('Erro ao listar as categorias', error.message || error);
      throw new Error(error.response?.data?.message || 'Erro inesperado ao listar as categorias.');
    }
  }
  