"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterStoreSchema, removeCNPJFormatting, storeRegisterSchema } from "@/lib/schemas";
import { useRegisterStore } from "@/lib/react-query/store-queries-and-mutations";
import { useAuth } from "@clerk/nextjs";
import { uploadLogoImage } from "@/lib/supabase"; // Presumindo que essa função exista para upload no Supabase
import { useRouter } from "next/navigation";

export default function RegisterStorePage() {
  const { userId } = useAuth();
  const router = useRouter()
  const { mutateAsync: registerStore, isPending: isLoading, isSuccess } =
    useRegisterStore();

  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RegisterStoreSchema>({
    resolver: zodResolver(storeRegisterSchema),
  });

  async function onSubmit(data: RegisterStoreSchema) {
    console.log("Dados recebidos do formulário:", data);

    // Remover a formatação do CNPJ antes de enviar os dados
    const cnpjSemFormatacao = removeCNPJFormatting(data.cnpj);

    let logoUrl = "";
    if (selectedLogo) {
      const uploadResult = await uploadLogoImage(selectedLogo, "my-little-pet-logo");
      if (uploadResult.error) {
        setUploadError(uploadResult.error.message);
        return;
      } else {
        logoUrl = uploadResult.publicUrl || "";
      }
    }

    await registerStore({
      title: data.title,
      description: data.description,
      cnpj: cnpjSemFormatacao,
      image_url: logoUrl,
      user_id: userId ?? "",
    });

    if (isSuccess) {
      reset(); // Limpa o formulário após o registro bem-sucedido
      setSelectedLogo(null); // Limpa a seleção da logo
      router.replace("/dashboard")
    }
  }

  // Função para formatar o CNPJ
  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove tudo o que não é número
      .replace(/(\d{2})(\d)/, "$1.$2") // Adiciona o ponto
      .replace(/\.(\d{3})(\d)/, ".$1.$2") // Adiciona o ponto
      .replace(/\.(\d{3})(\d)/, ".$1/$2") // Adiciona a barra
      .replace(/(\d{4})(\d)/, "$1-$2") // Adiciona o hífen
      .substring(0, 18); // Limita o tamanho
  };

  function handleInputChange(field: keyof RegisterStoreSchema) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

      // Aplica formatação específica para o campo de CNPJ
      if (field === "cnpj") {
        value = formatCNPJ(value);
      }

      setValue(field, value);
    };
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      setUploadError(null); // Limpa erros anteriores
    }
  }

  return (
    <main className="flex-1 bg-blue-500 min-h-screen text-white p-6 flex flex-col gap-6">
      <section className="w-full">
        <div className="p-6 bg-background rounded-md">
          <h2 className="font-sans font-bold text-lg mb-4 text-primary">
            Registrar Nova Loja
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="gap-2 flex flex-col">
              <Label className="text-primary font-bold">Nome da Loja</Label>
              <Input
                type="text"
                value={watch("title")}
                {...register("title")}
                onInput={handleInputChange("title")}
                disabled={isLoading}
                className="text-black"
              />
              {errors.title && (
                <span className="font-normal text-sm text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>
            <div className="gap-2 flex flex-col">
              <Label className="text-primary font-bold">Descrição da Loja</Label>
              <Input
                type="text"
                value={watch("description")}
                {...register("description")}
                onInput={handleInputChange("description")}
                disabled={isLoading}
                className="text-black"
              />
              {errors.description && (
                <span className="font-normal text-sm text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="gap-2 flex flex-col">
              <Label className="text-primary font-bold">CNPJ</Label>
              <Input
                type="text"
                value={watch("cnpj")}
                {...register("cnpj")}
                onInput={handleInputChange("cnpj")}
                disabled={isLoading}
                className="text-black"
              />
              {errors.cnpj && (
                <span className="font-normal text-sm text-red-500">
                  {errors.cnpj.message}
                </span>
              )}
            </div>
            <div className="gap-2 flex flex-col">
              <Label className="text-primary font-bold">Logo da Loja</Label>
              <Input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              {uploadError && (
                <span className="font-normal text-sm text-red-500">
                  {uploadError}
                </span>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar Loja"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}