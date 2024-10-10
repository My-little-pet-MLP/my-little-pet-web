import { RegisterProduct } from "@/hooks/products/register-product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERYKEYS } from "./query-is";
import { listProductsByStoreId } from "@/hooks/products/list-products-by-store-id";
import { UpdateProductById } from "@/hooks/products/update-product-by-id";
import { getProductById } from "@/hooks/products/get-products-by-id";
import { DeleteProductById } from "@/hooks/products/delete-product-by-id";
import { ProductsData,ProductProps, ProductComplete } from "@/@types/products";


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
                image_url }: {
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
        enabled: !!storeId,
    });
};

export const useGetProductById = (id: string) => {
    return useQuery<ProductComplete>({
        queryKey: [QUERYKEYS.getProductById, id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
};
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();


    return useMutation({
        mutationFn: (
            { id,
                title,
                description,
                price_in_cents,
                stock,
                category_id,
                image_url }: {
                    id: string;
                    title: string;
                    description: string;
                    price_in_cents: number;
                    stock: number;
                    category_id: string;
                    image_url: string;
                }) => UpdateProductById(id, { title, description, price_in_cents, stock, category_id, image_url }),
        onSuccess: () => {
            console.log("Produto Atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: [QUERYKEYS.listProductsByStoreId] });
        },
        onError: (error) => {
            console.error("Erro a atualizar o produto:", error);
        },
    });
}
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (
            { id }: { id: string; }) => DeleteProductById(id),
        onSuccess: () => {
            console.log("Produto Deletado com sucesso!");
            queryClient.invalidateQueries({ queryKey: [QUERYKEYS.listProductsByStoreId] });
        },
        onError: (error) => {
            console.error("Erro ao deletadar o produto:", error);
        },
    });
}