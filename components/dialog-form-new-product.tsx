import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { useEffect, useState } from "react";
import { CategoryModel, getStoreByUserId, listCategories, registerProduct } from "@/lib/axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AxiosError } from 'axios';

const RegisterProductSchema = z.object({
    title: z.string().min(1, "Campo Obrigatório!"),
    image_url: z.string().url("Url inválida!").optional(), // Tornar opcional se não for sempre obrigatório
    description: z.string().min(1, "Campo Obrigatório!"),
    price_in_cents: z.coerce.number().min(0, "O valor deve ser positivo!"),
    stock: z.coerce.number().min(0, "Estoque não pode ser negativo!"),
    category_id: z.string(),
    store_id: z.string(),
})

type RegisterProduct = z.infer<typeof RegisterProductSchema>

export function DialogFormNewProduct() {
    const { user } = useUser();
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [store, setStore] = useState<any>();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<RegisterProduct>({
        resolver: zodResolver(RegisterProductSchema)
    });

    async function fetchCategories() {
        try {
            const data = await listCategories();
            setCategories(data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    }

    function isAxiosError(error: any): error is AxiosError {
        return error.isAxiosError;
    }

    async function VerifyStoreId(userId: string) {
        try {
            const data = await getStoreByUserId(userId);
            setStore(data);
            setValue("store_id", data.id);
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 404) {
                router.push("/register-store");
            } else {
                console.error("Erro ao buscar Store:", error);
            }
        }
    }

    useEffect(() => {
        if (user?.id) {
            VerifyStoreId(user.id);
        } else {
            router.push("/register-store");
        }

        fetchCategories();
    }, [user, router]);

    async function RegisterProductFunction(data: RegisterProduct) {
        console.log("Form submitted with data:", data);
        try {
            await registerProduct({
                image_url: "https://jfwzshiyyvxklcuuzueu.supabase.co/storage/v1/object/public/my-little-pet-products/product1.png",
                title: data.title,
                description: data.description,
                stock:data.stock,
                price_in_cents: data.price_in_cents,
                store_id: data.store_id,
                category_id: data.category_id
            });
            
        } catch (error) {
            console.error("Erro ao registrar produto:", error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusIcon /><p className="hidden sm:flex"> Novo Produto</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Novo Produto</DialogTitle>
                <form onSubmit={handleSubmit(RegisterProductFunction)}>
                    <div className="flex flex-col gap-2">
                        <div className="gap-2 flex flex-col">
                            <Label>Titulo</Label>
                            <Input 
                                type="text" 
                                {...register("title")} 
                                disabled={isSubmitting} 
                            />
                            {errors.title && <span className="font-normal text-sm text-red-500">{errors.title.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Descrição</Label>
                            <Input 
                                type="text" 
                                {...register("description")} 
                                disabled={isSubmitting} 
                            />
                            {errors.description && <span className="font-normal text-sm text-red-500">{errors.description.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Preço R$</Label>
                            <Input 
                                type="number" 
                                {...register("price_in_cents")} 
                                className="text-right" 
                                disabled={isSubmitting} 
                            />
                            {errors.price_in_cents && <span className="font-normal text-sm text-red-500">{errors.price_in_cents.message}</span>}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Estoque</Label>
                            <Input 
                                type="number" 
                                {...register("stock")} 
                                className="text-right" 
                                disabled={isSubmitting} 
                            />
                            {errors.stock && <span className="font-normal text-sm text-red-500">{errors.stock.message}</span>}
                        </div>
                        <div>
                            <Select 
                                onValueChange={(value) => setValue("category_id", value)} 
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Categorias</SelectLabel>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.title}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.category_id && <span className="font-normal text-sm text-red-500">{errors.category_id.message}</span>}
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                        >
                            Registrar Produto
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
