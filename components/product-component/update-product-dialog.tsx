import { UpdateProductSchema, UpdateProductSchemaType } from "@/lib/schemas";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { uploadProductImage } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {  useDeleteProduct, useGetProductById, useUpdateProduct } from "@/lib/react-query/products-queries-and-mutations";
import { useListCategories } from "@/lib/react-query/categories-queries-and-mutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { ProductProps } from "@/@types/products";

export function UpdateProductDialog(product: ProductProps) {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [priceValue, setPriceValue] = useState<string>(""); // Novo estado para o valor formatado do preço
    const [selectedCategory, setSelectedCategory] = useState<string>(""); // Novo estado para categoria selecionada
    const { toast } = useToast();
    const { mutateAsync: updateProduct, isPending, isSuccess } = useUpdateProduct();
    const { data: categories, isLoading: isLoadingCategories } = useListCategories();
    const { data: productCompleteData, isLoading: isLoadingProductComplete } = useGetProductById(product.id);
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<UpdateProductSchemaType>({
        resolver: zodResolver(UpdateProductSchema),
        values:{
            title:productCompleteData?.title ?? "",
            category_id: productCompleteData?.categoryId ?? "",
            description: productCompleteData?.description ?? "",
            id: productCompleteData?.id ?? "",
            image_url: productCompleteData?.imageUrl ?? "",
            price_in_cents: productCompleteData?.priceInCents ?? 0,
            stock: productCompleteData?.stock ?? 0
        }
    });
    console.log(productCompleteData)
    const { mutateAsync: deleteProduct, isPending: isPendingDeleteProduct, reset: resetDeleteProduct } = useDeleteProduct();

   
    // Função para formatar o valor como moeda
    const formatCurrency = (valueInCents: number) => {
        return (valueInCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Função para lidar com a entrada do preço e formatar como moeda
    const handlePriceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;

        // Remove todos os caracteres que não são números
        const rawValue = inputValue.replace(/\D/g, '');

        // Converte para centavos (R$ 1,00 = 100 centavos)
        const intValue = parseInt(rawValue, 10);

        // Formata o valor de volta para moeda
        setPriceValue(formatCurrency(intValue));

        // Atualiza o valor em centavos no formulário
        setValue("price_in_cents", intValue || 0); 
    };

    // Função para lidar com a seleção de arquivo (imagem)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setUploadError(null);
        }
    };

    const onSubmit = async (data: UpdateProductSchemaType) => {
        try {
            let imageUrl = data.image_url;

            // Se uma nova imagem for selecionada, faça o upload
            if (selectedImage) {
                const uploadResult = await uploadProductImage(selectedImage, "my-little-pet-products");
                if (uploadResult.error) {
                    setUploadError(uploadResult.error.message);
                    return;
                } else {
                    imageUrl = uploadResult.publicUrl || imageUrl;
                }
            }

            await updateProduct({
                id: data.id,
                image_url: imageUrl,
                title: data.title,
                description: data.description,
                stock: data.stock,
                price_in_cents: data.price_in_cents,
                category_id: data.category_id,
            });

            toast({
                title: "Produto atualizado com sucesso!",
            });
            reset(); // Reseta o formulário
            setSelectedImage(null);
        } catch (error) {
            toast({
                title: "Erro ao atualizar o produto",
                description: error instanceof Error ? error.message : "Erro desconhecido.",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async () => {
        const confirmed = confirm("Você tem certeza que deseja excluir este produto?");
        if (confirmed) {
            await deleteProduct({ id: productCompleteData?.id ?? "" });
            toast({
                title: "Produto deletado com sucesso!",
            });
            resetDeleteProduct();
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full text-xs">Editar</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product.title}</DialogTitle>
                    <div>
                        {productCompleteData?.isActive ? (
                            <div className="flex flex-row items-center gap-2">
                                <CheckIcon fontSize={32} className="text-primary" />
                                <p className="text-primary">Produto Ativo</p>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center gap-2">
                                <Cross1Icon fontSize={32} className="text-destructive" />
                                <p className="text-destructive">Produto Inativo</p>
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <DialogDescription>Atualize as informações do produto</DialogDescription>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2">
                        {/* Título */}
                        <div className="gap-2 flex flex-col">
                            <Label>Título</Label>
                            <Input type="text" {...register("title")} disabled={isPending} />
                            {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
                        </div>

                        {/* Descrição */}
                        <div className="gap-2 flex flex-col">
                            <Label>Descrição</Label>
                            <Input type="text" {...register("description")} disabled={isPending} />
                            {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
                        </div>

                        {/* Preço */}
                        <div className="gap-2 flex flex-col">
                            <Label>Preço R$</Label>
                            <Input
                                type="text"
                                {...register("price_in_cents")}
                                onChange={handlePriceInput} // Chama a função ao digitar
                                className="text-right"
                                disabled={isPending}
                            />
                            {errors.price_in_cents && <span className="font-normal text-sm text-red-500">{errors.price_in_cents.message}</span>}
                        </div>

                        {/* Estoque */}
                        <div className="gap-2 flex flex-col">
                            <Label>Estoque</Label>
                            <Input type="number" {...register("stock", { valueAsNumber: true })} className="text-right" disabled={isPending} />
                            {errors.stock && <span className="text-sm text-red-500">{errors.stock.message}</span>}
                        </div>

                        {/* Categoria */}
                        <div className="gap-2 flex flex-col">
                            <Label>Categoria</Label>
                            <Select
                                value={selectedCategory} // Define o valor do Select com a categoria selecionada
                                onValueChange={(value) => {
                                    setValue("category_id", value);
                                    setSelectedCategory(value);
                                }}
                                disabled={isPending || isLoadingCategories}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Categorias</SelectLabel>
                                        {isLoadingCategories ? (
                                            <p>Carregando categorias...</p>
                                        ) : (
                                            categories?.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.title}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.category_id && <span className="text-sm text-red-500">{errors.category_id.message}</span>}
                        </div>

                        {/* Imagem */}
                        <div className="gap-2 flex flex-col">
                            <Label>Imagem do Produto</Label>
                            <Input
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                                disabled={isPending}
                            />
                            {uploadError && <span className="text-sm text-red-500">{uploadError}</span>}
                        </div>

                        {/* Botões de Ação */}
                        <DialogFooter>
                            <Button variant="destructive" type="button" onClick={handleDelete}>
                                {isPendingDeleteProduct ? 'Deletando...' : 'Deletar Produto'}
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? 'Atualizando...' : 'Atualizar Produto'}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
            <Toaster />
        </Dialog>
    );
}
