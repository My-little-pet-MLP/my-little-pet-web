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



export function DialogFormNewProduct() {
    const [isOpen, setIsOpen] = useState(false);
    const { userId } = useAuth();
    const { mutateAsync: createProduct, isPending, isSuccess } = usePostProduct();

    const { data: storeId } = useGetStoreByUserId(userId ?? "");

    const { data: categories, isLoading: isLoadingCategories } = useListCategories();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterProductType>({
        resolver: zodResolver(RegisterProductSchema),
    });


    async function RegisterProductFunction(data: RegisterProductType) {
        console.log("Dados recebidos do formulário:", data); // Verifica os dados do formulário
        
        console.log(storeId?.id)

        if (!storeId?.id) {
            console.error("Store ID não disponível");
            return; 
        }

        console.log("Store ID:", storeId.id); // Verifica o Store ID
        console.log("Preparando para registrar produto:", {
            image_url: "https://jfwzshiyyvxklcuuzueu.supabase.co/storage/v1/object/public/my-little-pet-products/product1.png",
            title: data.title,
            description: data.description,
            stock: data.stock,
            price_in_cents: data.price_in_cents,
            store_id: storeId.id, // Usar o Store ID correto
            category_id: data.category_id,
        });

        await createProduct({
            image_url: "https://jfwzshiyyvxklcuuzueu.supabase.co/storage/v1/object/public/my-little-pet-products/product1.png",
            title: data.title,
            description: data.description,
            stock: data.stock,
            price_in_cents: data.price_in_cents,
            store_id: storeId.id,
            category_id: data.category_id,
        });
        if (isSuccess) {
            setIsOpen(false);
        }
    }


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
                                type="number"
                                {...register("price_in_cents", { valueAsNumber: true })}
                                className="text-right"

                                disabled={isPending}
                            />
                            {errors.price_in_cents && <span className="font-normal text-sm text-red-500">{errors.price_in_cents.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Estoque</Label>
                            <Input
                                type="number"
                                {...register("stock", { valueAsNumber: true })}
                                className="text-right"
                                disabled={isPending}
                            />
                            {errors.stock && <span className="font-normal text-sm text-red-500">{errors.stock.message}</span>}
                        </div>
                        <div>
                            <Select
                                onValueChange={(value) => {
                                    console.log("Categoria selecionada:", value); // Verifica a categoria selecionada
                                    setValue("category_id", value);
                                }}
                                disabled={isPending || isLoadingCategories}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="selecione uma categoria" />
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
                dasa
            </DialogClose>
        </Dialog>
    );
}
