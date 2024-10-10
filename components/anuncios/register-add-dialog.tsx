"use client"
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { addRegisterSchema, AddRegisterSchemaSchemaType } from "@/lib/schemas";
import { useState } from "react";
import { uploadBanner } from "@/lib/supabase";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRegisterAdd } from "@/lib/react-query/add-queries-and-mutations";

export function RegisterAddDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const { mutateAsync: registerAdd, isPending, isSuccess } = useRegisterAdd();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AddRegisterSchemaSchemaType>({
        resolver: zodResolver(addRegisterSchema),
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    async function RegisterAddFunction(data: AddRegisterSchemaSchemaType) {
        let imageUrl = "";

        if (selectedImage) {
            const uploadResult = await uploadBanner(selectedImage, "my-little-pet-banners");
            if (uploadResult.error) {
                setUploadError(uploadResult.error.message);
                return;
            } else {
                imageUrl = uploadResult.publicUrl || "";
            }
        }

        await registerAdd({
            image_url: imageUrl,
            title: data.title,
            description: data.description,
            credit: data.credit,
            external_link: data.externalLink,
            limit_date: data.limiteDate
        });

        if (isSuccess) {
            reset();
            setSelectedImage(null);
            setIsOpen(false);
        }
    }
    const formatCurrency = (value: any) => {
        // Remove tudo que não é número
        let num = value.replace(/[^\d]/g, '');
        // Converte para float e formata para reais
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(num / 100);
    };
    const handlePriceInput = (event: any) => {
        const value = event.target.value;
        // Remove tudo que não é número
        const num = value.replace(/[^\d]/g, '');
    
        // Atualiza o valor do input para a moeda formatada
        event.target.value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(num / 100);
    };
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setUploadError(null); // Limpa erros anteriores
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    Novo Anúncio
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Cadastre um novo anúncio
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(RegisterAddFunction)}>
                    <div className="flex flex-col gap-2">
                        <div className="gap-2 flex flex-col">
                            <Label>Título</Label>
                            <Input
                                type="text"
                                {...register("title")}
                                disabled={isPending}
                            />
                            {errors.title && <span className="font-normal text-sm text-red-500">{errors.title.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Descrição</Label>
                            <Input
                                type="text"
                                {...register("description")}
                                disabled={isPending}
                            />
                            {errors.description && <span className="font-normal text-sm text-red-500">{errors.description.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Link Externo</Label>
                            <Input
                                type="text"
                                {...register("externalLink")}
                                disabled={isPending}
                            />
                            {errors.externalLink && <span className="font-normal text-sm text-red-500">{errors.externalLink.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Data Limite</Label>
                            <Input
                                className="justify-end"
                                type="date"
                                {...register("limiteDate")} // Aqui você registra o campo de data
                                disabled={isPending}
                                max="2050-12-31"
                            />
                            {errors.limiteDate && <span className="font-normal text-sm text-red-500">{errors.limiteDate.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Credito R$</Label>
                            <Input
                                type="text"
                                {...register("credit")}
                                onInput={handlePriceInput} // Formatação da moeda
                                className="text-right no-spinners"
                                disabled={isPending}
                            />
                            {errors.credit && (
                                <span className="font-normal text-sm text-red-500">
                                    {errors.credit.message}
                                </span>
                            )}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Imagem</Label>
                            <Input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/svg"
                                onChange={handleFileChange}
                                disabled={isPending}
                            />
                            {uploadError && <span className="font-normal text-sm text-red-500">{uploadError}</span>}
                        </div>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Enviando..." : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
