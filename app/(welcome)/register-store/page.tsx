"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { RegisterStoreSchema, storeSchema } from "@/lib/schemas";
import { useRegisterStore } from "@/lib/react-query/store-queries-and-mutations";
import { useAuth } from "@clerk/nextjs";

export default function RegisterStorePage() {
  const { userId } = useAuth();

  const { mutate: RegisterStore ,isPending:isLoading} = useRegisterStore();
  const form = useForm<RegisterStoreSchema>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      title: "",
      description: "",
      cnpj: "",
    },
  });
  const onSubmit = async (data: RegisterStoreSchema) => {
    await RegisterStore({
      title: data.title,
      description: data.description,
      cnpj: data.cnpj,
      image_url: "",
      user_id: userId ?? ""
    })

  }
  return (
    <main className="flex-1 bg-blue-500 min-h-screen text-white p-6 flex flex-col gap-6">
      <section className="w-full">
        <Card className="p-6 bg-slate-100">
          <CardTitle className="font-sans font-bold text-lg">
            Registrar Nova Loja
          </CardTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da loja" {...field} />
                    </FormControl>
                    <FormDescription>
                      Informe o nome da sua loja.
                    </FormDescription>
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
                      <Input placeholder="Descrição da loja" {...field} />
                    </FormControl>
                    <FormDescription>
                      Uma breve descrição sobre a sua loja.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00.000.000/0000-00"
                        value={formatCNPJ(field.value)}
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      />
                    </FormControl>
                    <FormDescription>
                      O CNPJ da sua loja.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar Loja"}
              </Button>
            </form>
          </Form>
        </Card>
      </section>
    </main>
  );
}

// Função para formatar o CNPJ
const formatCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove tudo o que não é número
    .replace(/(\d{2})(\d)/, '$1.$2') // Adiciona o ponto
    .replace(/\.(\d{3})(\d)/, '.$1.$2') // Adiciona o ponto
    .replace(/\.(\d{3})(\d)/, '.$1/$2') // Adiciona a barra
    .replace(/(\d{4})(\d)/, '$1-$2') // Adiciona o hífen
    .substring(0, 18); // Limita o tamanho
};
