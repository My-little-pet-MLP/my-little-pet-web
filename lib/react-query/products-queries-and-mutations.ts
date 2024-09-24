import { RegisterProduct } from "@/hooks/products/register-product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERYKEYS } from "./query-is";
import { listProductsByStoreId } from "@/hooks/products/list-products-by-store-id";

export interface ProductProps {
    id: string;
    title: string;
    imageUrl: string;
    priceInCents: number;
    stock: number;
  }
export interface ProductsData {
    products: ProductProps[];
    totalPages: number;
    currentPage: number;
  }
export const usePostProduct = () => {
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: (
            { title,
                description,
                price_in_cents,
                stock,
                category_id,
                store_id,
                image_url }:{
                    title: string;
                    description: string;
                    price_in_cents: number;
                    stock: number;
                    category_id: string;
                    store_id: string;
                    image_url: string;
                }) => RegisterProduct({ title, description, price_in_cents, stock, category_id, store_id, image_url }),
        onSuccess: () => {
            console.log("Produto registrado com sucesso!");
            queryClient.invalidateQueries({ queryKey: [QUERYKEYS.listProductsByStoreId] });
        },
        onError: (error) => {
            console.error("Erro ao registrar produto:", error);
        },
    });
}

export const useFetchProductByStoreId = (storeId: string, page: number) => {
    return useQuery<ProductsData>({
      queryKey: [QUERYKEYS.listProductsByStoreId, storeId, page],
      queryFn: () => listProductsByStoreId(storeId, page),
      enabled: !!storeId, // Somente executa se o storeId estiver definido
    });
  };