import exp from "constants";
import { z } from "zod";

export const RegisterProductSchema = z.object({
    title: z.string().min(1, "Campo Obrigatório!"),
    description: z.string().min(1, "Campo Obrigatório!"),
    price_in_cents: z.coerce.number().min(0, "O valor deve ser positivo!"),
    stock: z.coerce.number().min(0, "Estoque não pode ser negativo!"),
    category_id: z.string(),
});


export type RegisterProductType = z.infer<typeof RegisterProductSchema>;


export const storeSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    cnpj: z.string().length(14, "CNPJ deve ter 14 caracteres"), // Mantém a validação para 14 caracteres
});

export type RegisterStoreSchema = z.infer<typeof storeSchema>