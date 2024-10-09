import { RegisterAdd } from "@/hooks/adds/register-add";
import { useMutation } from "@tanstack/react-query";

export const useRegisterAdd = () => {
    return useMutation({
        mutationFn: ({ title, description, external_link, limit_date, credit, image_url }:
            { title: string, description: string, external_link: string, limit_date: string, credit: number, image_url: string }) =>
            RegisterAdd({ title, description, external_link, limit_date, credit, image_url }),

        onSuccess: () => {
            console.log("anuncio registrada com sucesso!");
        },
        onError: (error) => {
            console.error("Erro ao registrar o anuncio:", error);
        },
    });
}