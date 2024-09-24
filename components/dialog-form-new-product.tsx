import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "@clerk/nextjs";
import { usePostProduct } from "@/lib/react-query/products-queries-and-mutations";
import { RegisterProductSchema, RegisterProductType } from "@/lib/schemas";
import { useState } from "react";
import { useGetStoreByUserId } from "@/lib/react-query/store-queries-and-mutations";
import { useListCategories } from "@/lib/react-query/categories-queries-and-mutation";
import { uploadProductImage } from "@/lib/supabase";


export function DialogFormNewProduct() {
    const [isOpen, setIsOpen] = useState(false);
    const { userId } = useAuth();
    const { mutateAsync: createProduct, isPending, isSuccess } = usePostProduct();

    const { data: storeId } = useGetStoreByUserId(userId ?? "");

    const { data: categories, isLoading: isLoadingCategories } = useListCategories();

    const { register, handleSubmit, formState: { errors }, setValue,reset  } = useForm<RegisterProductType>({
        resolver: zodResolver(RegisterProductSchema),
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    async function RegisterProductFunction(data: RegisterProductType) {
        console.log("Dados recebidos do formulário:", data); // Verifica os dados do formulário

        if (!storeId?.id) {
            console.error("Store ID não disponível");
            return;
        }

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

        await createProduct({
            image_url: imageUrl,
            title: data.title,
            description: data.description,
            stock: data.stock,
            price_in_cents: data.price_in_cents,
            store_id: storeId.id,
            category_id: data.category_id,
        });

        if (isSuccess) {
            reset();
            setSelectedImage(null);
            setIsOpen(false);
        }
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setUploadError(null); // Limpa erros anteriores
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
        event.target.value = formatCurrency(event.target.value);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusIcon /><p className="hidden sm:flex"> Novo Produto</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Novo Produto</DialogTitle>
                <DialogDescription></DialogDescription>
                <form onSubmit={handleSubmit(RegisterProductFunction)}>
                    <div className="flex flex-col gap-2">
                        <div className="gap-2 flex flex-col">
                            <Label>Titulo</Label>
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
                            <Label>Preço R$</Label>
                            <Input
                                type="text"
                                {...register("price_in_cents")}
                                onInput={handlePriceInput}
                                className="text-right no-spinners"
                                disabled={isPending}
                            />
                            {errors.price_in_cents && <span className="font-normal text-sm text-red-500">{errors.price_in_cents.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Estoque</Label>
                            <Input
                                type="number"
                                {...register("stock", { valueAsNumber: true })}
                                className="text-right no-spinners"
                                disabled={isPending}
                            />
                            {errors.stock && <span className="font-normal text-sm text-red-500">{errors.stock.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Categoria</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("category_id", value);
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
                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? 'Registrando...' : 'Registrar Produto'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
            <DialogClose className="sr-only">
                Fechar
            </DialogClose>
        </Dialog>
    );
}
