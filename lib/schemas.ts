import exp from "constants";
import { title } from "process";
import { TypeOf, z } from "zod";
const parsePriceToCents = (price: string) => {
    // Remove todos os caracteres não numéricos, exceto vírgula, e depois troca vírgula por ponto
    const numericPrice = price.replace(/[^\d,]/g, '').replace(',', '.');
    
    // Converte para número e multiplica por 100, depois arredonda para garantir a precisão
    const cents = Math.round(Number(numericPrice) * 100);
    
    // Verifica se a conversão é válida e retorna o valor em centavos
    if (isNaN(cents)) {
        throw new Error("Preço inválido");
    }
    
    return cents;
};
export const RegisterProductSchema = z.object({
    title: z.string().min(1, "Campo Obrigatório!"),
    description: z.string().min(1, "Campo Obrigatório!"),
    price_in_cents: z.string().transform((price) => {
        const cents = parsePriceToCents(price); // Função que converte o preço para centavos
        if (!Number.isInteger(cents) || cents < 0) {
            throw new Error("O valor deve ser um número inteiro positivo!");
        }
        return cents;
    }),
    stock: z.coerce.number().min(0, "Estoque não pode ser negativo!"),
    category_id: z.string(),
});



export type RegisterProductType = z.infer<typeof RegisterProductSchema>;


// Função para remover a formatação do CNPJ
export const removeCNPJFormatting = (cnpj: string) => {
    return cnpj.replace(/\D/g, ""); // Remove todos os caracteres que não são dígitos
  };
  
  // Esquema de validação com Zod
  export const storeRegisterSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    cnpj: z
      .string()
      .min(1, "CNPJ é obrigatório")
      .refine(
        (cnpj) => {
          const unformattedCNPJ = removeCNPJFormatting(cnpj);
          return unformattedCNPJ.length === 14;
        },
        { message: "CNPJ deve ter 14 caracteres numéricos" }
      ),
  });
  
  export type RegisterStoreSchema = z.infer<typeof storeRegisterSchema>;

export const storeUpdateSchema = z.object({
    title: z.string(),
    description: z.string(),
    cnpj: z.string().length(14, "CNPJ deve ter 14 caracteres"),
})

export type UpdateStoreSchemaType = z.infer<typeof storeUpdateSchema>

export const UpdateProductSchema = z.object({
    id: z.string().min(1, "id is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "description is required"),
    image_url: z.string().url().min(1, "image_url is required"),
    price_in_cents: z.number().int().min(0, "price_in_cents > 0"),
    stock: z.number().int().min(0, "stock > 0"),
    category_id: z.string()
})

export type UpdateProductSchemaType = z.infer<typeof UpdateProductSchema>



export const addRegisterSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  externalLink:z.string().min(1,"link é obrigatorio"),
  limiteDate: z.string().date(),
  credit: z.number().int().min(1,"valor minimo é R$1,00")
});

export type AddRegisterSchemaSchemaType = z.infer<typeof addRegisterSchema>