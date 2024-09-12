import { PlusIcon } from "lucide-react";
import {
  Sheet, SheetClose, SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryModel, getStoreByUserId, listCategories, registerProduct } from "@/lib/axios";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { uploadProductImage } from "@/lib/supabase"; // Importe a função de upload

export function SheetFormRegisterProduct() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();
  const { userId } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("Usuário não autenticado.");
      setLoading(false);
      router.push("/");
      return;
    }

    async function verifyData() {
      if (userId) {
        try {
          const storeData = await getStoreByUserId(userId);
          const storeId = storeData.id;
          const categories = await listCategories();
          if (!categories) {
            setError("Erro ao buscar as categorias");
          } else {
            setCategories(categories);
          }
          if (!storeId) {
            setError("Não tem loja cadastrada");
            router.push("/register-store");
          } else {
            setStoreId(storeId);
          }
        } catch (error) {
          setError("Erro ao carregar dados.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }

    verifyData();
  }, [userId, router]);

  const formSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    price_in_cents: z.coerce.number().int().positive("Preço deve ser positivo"),
    stock: z.coerce.number().int().min(0, "O estoque não pode ser negativo"),
    category_id: z.string().min(1, "Categoria é obrigatória"),
    store_id: z.string().nonempty(),
    image_url: z.string().url().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price_in_cents: 0,
      stock: 0,
      category_id: "",
      store_id: storeId || "",
      image_url: ""
    },
  });

  useEffect(() => {
    if (storeId) {
      form.setValue("store_id", storeId);
    }
  }, [storeId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedImage) {
      try {
        const { publicUrl, error } = await uploadProductImage(selectedImage, 'product-images');
        if (error) {
          setError("Erro ao fazer upload da imagem.");
          return;
        }
        values.image_url = publicUrl || undefined; // Atualize o campo image_url com a URL pública ou undefined
      } catch (error) {
        setError("Erro ao fazer upload da imagem.");
        return;
      }
    } else {
      values.image_url = undefined; // Defina como `undefined` se nenhum arquivo for selecionado
    }

    try {
      await registerProduct(values);
      router.push("/products"); // Redirecione para a página de produtos ou onde desejar
    } catch (error) {
      setError("Erro ao registrar o produto.");
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <PlusIcon /><p className="hidden sm:flex"> Novo Produto</p>
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Novo Produto</SheetTitle>
        </SheetHeader>
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="ração my little pet" {...field} />
                    </FormControl>
                    <FormDescription>Dê um título ao seu produto</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="descrição" {...field} />
                    </FormControl>
                    <FormDescription>Descreva seu produto para seus clientes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_in_cents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço R$</FormLabel>
                    <FormControl>
                      <Input placeholder="R$ 00,00" type="number" {...field} className="text-right" />
                    </FormControl>
                    <FormDescription>Por quanto você quer vender?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque</FormLabel>
                    <FormControl>
                      <Input placeholder="0" type="number" {...field} className="text-right" />
                    </FormControl>
                    <FormDescription>Quantos desse produto você quer anunciar</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={(value) => form.setValue("category_id", value)} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Qual Categoria de nosso app seu produto se encaixa?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Imagem</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
                    className="text-right"
                  />
                </FormControl>
                <FormDescription>Coloque uma foto do seu produto</FormDescription>
                <FormMessage />
              </FormItem>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="destructive">Cancelar</Button>
                </SheetClose>
                <Button type="submit">Registrar</Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
