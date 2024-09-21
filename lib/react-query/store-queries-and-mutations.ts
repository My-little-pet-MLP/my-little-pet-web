import { useMutation, useQuery } from "@tanstack/react-query";
import { getStoreByUserId } from "../../hooks/store/get-store-by-user-id"
import { QUERYKEYS } from "./query-is";
import { RegisterStore } from "@/hooks/store/register-store";


export const useGetStoreByUserId = (userId: string) => {

    return useQuery({
        queryKey: [QUERYKEYS.getStoreByUserId],
        queryFn: () => getStoreByUserId(userId!),
        enabled: !!userId,
    });
}

export const useRegisterStore = () => {

    return useMutation({
        mutationFn: ({ title, description, cnpj, user_id, image_url }:
            { title: string, description: string, cnpj: string, user_id: string, image_url: string }) => RegisterStore({ title, description, cnpj, user_id, image_url }),

        onSuccess: () => {
            console.log("Loja registrado com sucesso!");
        },
        onError: (error) => {
            console.error("Erro ao registrar a loja:", error);
        },
    });
}
