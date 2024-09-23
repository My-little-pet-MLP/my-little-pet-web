import { getStoreByUserId } from "@/hooks/store/get-store-by-user-id";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERYKEYS } from "./query-is";
import { RegisterStore } from "@/hooks/store/register-store";
import { UpdateStore } from "@/hooks/store/update-store";
import { getStoreById } from "@/hooks/store/get-store-by-id";

// Definindo o tipo Store
export interface Store {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  cnpj: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
