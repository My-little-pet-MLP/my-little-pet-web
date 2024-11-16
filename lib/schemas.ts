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

// mudar o priceincents para string e validar com regex depois
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
  externalLink: z.string().min(1, "Link é obrigatório"),
  limiteDate: z
    .string()
    .refine(
      (date) => /^\d{4}-\d{2}-\d{2}$/.test(date), // Verifica se a data está no formato YYYY-MM-DD
      {
        message: "A data deve estar no formato YYYY-MM-DD e conter 4 dígitos no ano",
      }
    )
    .refine(
      (date) => new Date(date) > new Date(), // Verifica se a data limite é maior que a data de hoje
      {
        message: "A data limite deve ser uma data futura",
      }
    )
    .refine(
      (date) => new Date(date) <= new Date('2050-12-31'), // Limita a data até 31/12/2050
      {
        message: "A data limite não pode ser maior que 31/12/2050",
      }
    ),
    credit: z.string().transform((value) => {
      // Remove qualquer coisa que não seja um número (incluindo R$ e vírgulas)
      const parsedValue = value.replace(/[^\d]/g, '');
      const numericValue = Number(parsedValue);
  
      // Verifica se o valor convertido é um número válido
      if (isNaN(numericValue) || numericValue <= 0) {
          throw new Error("O valor deve ser um número inteiro positivo!");
      }
  
      return numericValue;
  }),
});

export type AddRegisterSchemaSchemaType = z.infer<typeof addRegisterSchema>

export const couponSchema = z.object({
  description: z.string().min(1, "Por favor, insira uma descrição válida para o cupom"),
  percentage: z
    .coerce.number()
    .min(1, "A porcentagem deve ser no mínimo 1")
    .max(100, "A porcentagem deve ser no máximo 100")
    .refine((val) => !isNaN(val), "Valor inválido para porcentagem"),
  validateAt: z
    .string()
    .nonempty("Por favor, insira uma data de validade para o cupom")
    .refine((date) => !isNaN(Date.parse(date)), "Formato de data inválido"),
  quantity: z
    .coerce.number()
    .int("A quantidade deve ser um número inteiro")
    .positive("A quantidade deve ser maior que 0"),
  store_id: z.string().nonempty("ID da loja é obrigatório"),
});


export type CouponFormData = z.infer<typeof couponSchema>;
