"use client";
import { PlusIcon, LoaderIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { supabase, supabaseUrl } from "@/lib/supabase";

// Esquema de validação do formulário
const formRegisterProductSchema = z.object({
  title: z.string().min(1, "Título é obrigatório!"),
  image: z.instanceof(FileList).refine((files) => files.length > 0, "Imagem é obrigatória!"),
  description: z.string().min(1, "Descrição é obrigatória!"),
  priceInCents: z.coerce.number().int().min(0, "Preço deve ser maior que 0"),
  stock: z.coerce.number().int().min(0, "Estoque deve ser maior que 0"),
  categoryId: z.string().min(1, "Categoria é obrigatória!"),
});

export function SheetFormRegisterProduct() {
  const { userId } = useAuth(); // Captura o userId do Clerk
  
  const form = useForm<z.infer<typeof formRegisterProductSchema>>({
    resolver: zodResolver(formRegisterProductSchema),
  });

  const [formattedPrice, setFormattedPrice] = useState("");
  const [categories, setCategories] = useState<
    { id: string; title: string; slug: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:3333/api/store/product/category"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Função para formatar o preço em moeda
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9]/g, "")) / 100;
    if (!isNaN(numericValue)) {
      return numericValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }
    return "";
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatCurrency(rawValue);

    form.setValue("priceInCents", Number(rawValue.replace(/[^0-9]/g, "")));
    setFormattedPrice(formatted);
  };

  // Função para submissão do formulário
  async function onSubmit(data: z.infer<typeof formRegisterProductSchema>) {
    setIsLoading(true); // Inicia o carregamento
    try {
      const imageFile = data.image[0]; // Pega o arquivo da imagem
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("my-little-pet-products")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return;
      }

      const imageUrl = `${supabaseUrl}/storage/v1/object/sign/my-little-pet-products/${fileName}`;

      const response = await axios.post("http://localhost:3333/api/store/product", {
        title: data.title,
        imageUrl: imageUrl,
        description: data.description,
        priceInCents: data.priceInCents,
        stock: data.stock,
        categoryId: data.categoryId,
        storeid: userId,
      });

      console.log("Product created:", response.data);
    } catch (error) {
      console.error("Error Register Product:", error);
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <PlusIcon /> Novo Produto
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Novo Produto</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome do produto"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
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
                    <Textarea
                      placeholder="Descreva o produto"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem do produto</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceInCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço R$</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={formattedPrice}
                      onChange={handlePriceChange}
                      placeholder="00,00"
                      className="text-right no-arrows"
                      disabled={isLoading}
                    />
                  </FormControl>
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
                    <Input
                      type="number"
                      placeholder="0"
                      className="text-right"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full gap-2 justify-end">
              <SheetClose asChild>
                <Button variant="destructive" disabled={isLoading}>
                  Cancelar
                </Button>
              </SheetClose>
              <Button type="submit" className="bg-green-700" disabled={isLoading}>
                {isLoading ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <>
                    <PlusIcon /> Criar Produto
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
