"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerStore } from "@/lib/axios"; // Função para registrar loja
import { useUser } from "@clerk/nextjs";
import { Card, CardTitle } from "@/components/ui/card"; // Importe o Card e CardTitle

// Validação do formulário usando Zod
const storeSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  cnpj: z.string().length(14, "CNPJ deve ter 14 caracteres"), // Mantém a validação para 14 caracteres
});

// Tipo de dados do formulário, incluindo user_id
type StoreFormData = {
  title: string;
  description: string;
  cnpj: string;
  user_id: string;
};

export default function RegisterStorePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Hook para redirecionar

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      title: "",
      description: "",
      cnpj: "",
      user_id: "", // Adicione user_id aos valores padrão
    },
  });

  const onSubmit = async (data: StoreFormData) => {
    if (!user?.id) {
      alert("Usuário não está autenticado.");
      return;
    }

    setLoading(true);
    try {
      await registerStore({ ...data, user_id: user.id });
      alert("Loja registrada com sucesso!");
      router.push('/dashboard'); // Redireciona para o dashboard após o sucesso
    } catch (error) {
      alert("Erro ao registrar a loja.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      form.setValue("user_id", user.id); // Adicionar `user_id` aos dados do formulário
    }
  }, [isLoaded, isSignedIn, user, form]);

  if (!isLoaded || !isSignedIn) {
    return <p>Carregando...</p>;
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
              <Button type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Loja"}
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
