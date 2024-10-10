import { getStoreByUserId } from "@/hooks/store/get-store-by-user-id";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERYKEYS } from "./query-is";
import { RegisterStore } from "@/hooks/store/register-store";
import { UpdateStore } from "@/hooks/store/update-store";
import { getStoreById } from "@/hooks/store/get-store-by-id";
import { DeleteStoreById } from "@/hooks/store/delete-store-by-id";
import { ReactivateStoreById } from "@/hooks/store/reactive-store-by-id";
import { Store } from "@/@types/store";


// Hook para obter a loja pelo userId
export const useGetStoreByUserId = (userId: string) => {
  return useQuery<Store>({
    queryKey: [QUERYKEYS.getStoreByUserId],
    queryFn: () => getStoreByUserId(userId!),
    enabled: !!userId,
  });
}
export const useGetStoreById = (id: string) => {
  return useQuery<Store>({
    queryKey: [QUERYKEYS.getStoreById],
    queryFn: () => getStoreById(id!),
    enabled: !!id,
  });
}

// Hook para registrar uma loja
export const useRegisterStore = () => {
  return useMutation({
    mutationFn: ({ title, description, cnpj, user_id, image_url }:
      { title: string, description: string, cnpj: string, user_id: string, image_url: string }) =>
      RegisterStore({ title, description, cnpj, user_id, image_url }),

    onSuccess: () => {
      console.log("Loja registrada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao registrar a loja:", error);
    },
  });
}
export const useUpdateStore = () => {
  return useMutation({
    mutationFn: ({ id, cnpj, description, image_url, title }: { id: string, title: string, description: string, cnpj: string, image_url: string }) => UpdateStore({ id, title, description, cnpj, image_url }),
    onSuccess: () => {
      console.log("Loja atualizada com sucess");
    },
    onError: (error) => {
      console.error("Erro ao atualizar a loja: " + error);
    }
  });
}


export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: (
          { id }: {id: string;}) => DeleteStoreById(id),
      onSuccess: () => {
          console.log("Loja Deletado com sucesso!");
          queryClient.invalidateQueries({ queryKey: [QUERYKEYS.getStoreById,QUERYKEYS.getStoreByUserId] });
      },
      onError: (error) => {
          console.error("Erro ao deletadar a loja:", error);
      },
  });
}

export const useReactiveStoreById = () => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: (
          { id }: {id: string;}) => ReactivateStoreById(id),
      onSuccess: () => {
          console.log("Loja reativada com sucesso!");
          queryClient.invalidateQueries({ queryKey: [QUERYKEYS.getStoreById,QUERYKEYS.getStoreByUserId,QUERYKEYS.listProductsByStoreId] });
      },
      onError: (error) => {
          console.error("Erro ao reativar a loja:", error);
      },
  });
}