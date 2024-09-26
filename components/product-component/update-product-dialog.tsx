import { UpdateProductSchema, UpdateProductSchemaType } from "@/lib/schemas";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { uploadProductImage } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ProductProps, useDeleteProduct, useGetProductById, useUpdateProduct } from "@/lib/react-query/products-queries-and-mutations";
import { useListCategories } from "@/lib/react-query/categories-queries-and-mutation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import { CheckIcon,StopIcon,Cross1Icon } from "@radix-ui/react-icons";

export function UpdateProductDialog(product: ProductProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [priceValue, setPriceValue] = useState<string>("");
    const { toast } = useToast();
    const { mutateAsync: updateProduct, isPending, isSuccess } = useUpdateProduct();
    const { data: categories, isLoading: isLoadingCategories } = useListCategories();
    const { data: productCompleteData, isLoading: isLoadingProductComplete } = useGetProductById(product.id);
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<UpdateProductSchemaType>({
        resolver: zodResolver(UpdateProductSchema),
    });
    const { mutateAsync: deleteProduct, isPending: isPendingDeleteProduct, isSuccess: isSuccessDeleteProduct, reset: resetDeleteProduct } = useDeleteProduct();

    useEffect(() => {
        if (productCompleteData) {
            setValue("id", productCompleteData.id);
            setValue("title", productCompleteData.title);
            setValue("stock", productCompleteData.stock);
            setValue("price_in_cents", productCompleteData.priceInCents);
            setValue("description", productCompleteData.description);
            setValue("category_id", productCompleteData.categoryId);
            setValue("image_url", productCompleteData.imageUrl);
            setPriceValue(formatCurrency(productCompleteData.priceInCents)); // Formata o valor inicial
        }
    }, [productCompleteData, setValue]);

    const formatCurrency = (valueInCents: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valueInCents / 100);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setUploadError(null);
        }
    };

    const handlePriceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/[^\d]/g, ''); // Remove tudo exceto números
        setPriceValue(rawValue);
        setValue("price_in_cents", parseInt(rawValue) || 0); // Atualiza o valor em centavos
    };

    async function RegisterProductFunction(data: UpdateProductSchemaType) {
        let imageUrl = "";

        if (selectedImage) {
            const uploadResult = await uploadProductImage(selectedImage, "my-little-pet-products");
            if (uploadResult.error) {
                setUploadError(uploadResult.error.message);
                return;
            } else {
                imageUrl = uploadResult.publicUrl || "";
            }
        }

        await updateProduct({
            id: data.id,
            image_url: imageUrl || data.image_url,
            title: data.title,
            description: data.description,
            stock: data.stock,
            price_in_cents: data.price_in_cents,
            category_id: data.category_id,
        });

        if (isSuccess) {
            toast({
                title: "Produto atualizado com sucesso!",
            });
            reset();
            setSelectedImage(null);
            setIsOpen(false);
        }
    }

    async function DeleteProductHandler() {
        const confirmed = confirm("Você tem certeza que deseja excluir este produto?");
        if (confirmed) {
            await deleteProduct({ id: productCompleteData?.id ?? "" });

            if (isSuccessDeleteProduct) {
                toast({
                    title: "Produto deletado com sucesso!",
                });
                resetDeleteProduct();
                setSelectedImage(null);
                setIsOpen(false);
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full text-xs">Editar</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product.title}</DialogTitle>
                    <div>{productCompleteData?.isActive ?<div className="flex flex-row items-center gap-2"> <CheckIcon fontSize={32} className="text-primary"/> <p className="text-primary">Produto Ativo</p></div> : <div className="flex flex-row items-center gap-2"> <Cross1Icon fontSize={32} className="text-destructive"/> <p className="text-destructive">Produto Inativo</p></div>}</div>
                </DialogHeader>

                <DialogDescription>Atualize as informações do produto</DialogDescription>
                <form onSubmit={handleSubmit(RegisterProductFunction)}>
                    <div className="flex flex-col gap-2">
                        <div className="gap-2 flex flex-col">
                            <Label>Título</Label>
                            <Input type="text" {...register("title")} disabled={isPending} />
                            {errors.title && <span className="font-normal text-sm text-red-500">{errors.title.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Descrição</Label>
                            <Input type="text" {...register("description")} disabled={isPending} />
                            {errors.description && <span className="font-normal text-sm text-red-500">{errors.description.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Preço R$</Label>
                            <Input
                                type="text"
                                value={priceValue}
                                onInput={handlePriceInput}
                                className="text-right no-spinners"
                                disabled={isPending}
                            />
                            {errors.price_in_cents && <span className="font-normal text-sm text-red-500">{errors.price_in_cents.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Estoque</Label>
                            <Input type="number" {...register("stock", { valueAsNumber: true })} className="text-right no-spinners" disabled={isPending} />
                            {errors.stock && <span className="font-normal text-sm text-red-500">{errors.stock.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Categoria</Label>
                            <Select
                                onValueChange={(value) => setValue("category_id", value)}
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
                            {errors.category_id && <span className="font-normal text-sm text-red-500">{errors.category_id.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Imagem do Produto</Label>
                            <Input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/svg"
                                onChange={handleFileChange}
                                disabled={isPending}
                            />
                            {uploadError && <span className="font-normal text-sm text-red-500">{uploadError}</span>}
                        </div>
                        <DialogFooter>
                            <Button variant="destructive" onClick={DeleteProductHandler}>
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
