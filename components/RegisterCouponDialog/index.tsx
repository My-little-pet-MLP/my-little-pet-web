import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { usePostCoupon } from "@/lib/react-query/coupon-queries-and-mutations";
import { CouponFormData, couponSchema } from "@/lib/schemas";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useGetStoreByUserId } from "@/lib/react-query/store-queries-and-mutations";

export function RegisterCouponDialog() {
    
    const [isOpen, setIsOpen] = useState(false);
    const { userId } = useAuth();
    const { data: storeData, isLoading: isLoadingStore, error: errorStore } = useGetStoreByUserId(userId ?? "");
    const storeId = storeData?.id;
    const { mutateAsync: createCoupon, isPending } = usePostCoupon();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CouponFormData>({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            store_id: storeData?.id ?? "",
        },
    });

    const handleFormSubmit = async (data: CouponFormData) => {
        console.log("Dados do formulário enviados:", data);
        try {
            if (!userId) {
                throw new Error("O ID da loja não está disponível.");
            }

            const transformedData = {
                ...data,
                validateAt: `${data.validateAt}T23:59:59Z`, // Adiciona horário padrão à data
                store_id:  storeData?.id ?? "",
            };

            await createCoupon(transformedData); // Envia os dados do cupom
            reset(); // Reseta os campos do formulário
            setIsOpen(false); // Fecha o diálogo
        } catch (error) {
            console.error("Erro ao registrar cupom:", error);
        }
    };

    if (!userId) {
        console.error("O ID do usuário não está disponível.");
        return null; // Evita renderizar se o ID do usuário não estiver disponível
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusIcon />
                    <p className="hidden sm:flex"> Novo Cupom</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Novo Cupom</DialogTitle>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="flex flex-col gap-2">
                        <div className="gap-2 flex flex-col">
                            <Label>Descrição</Label>
                            <Input
                                type="text"
                                {...register("description")}
                                disabled={isPending}
                            />
                            {errors.description && (
                                <span className="font-normal text-sm text-red-500">
                                    {errors.description.message}
                                </span>
                            )}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Porcentagem</Label>
                            <Input
                                type="number"
                                {...register("percentage")}
                                className="text-right no-spinners"
                                disabled={isPending}
                            />
                            {errors.percentage && (
                                <span className="font-normal text-sm text-red-500">
                                    {errors.percentage.message}
                                </span>
                            )}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Validade</Label>
                            <Input
                                type="date"
                                {...register("validateAt")}
                                disabled={isPending}
                            />
                            {errors.validateAt && (
                                <span className="font-normal text-sm text-red-500">
                                    {errors.validateAt.message}
                                </span>
                            )}
                        </div>
                        <div className="gap-2 flex flex-col">
                            <Label>Quantidade</Label>
                            <Input
                                type="number"
                                {...register("quantity", { valueAsNumber: true })}
                                className="text-right no-spinners"
                                disabled={isPending}
                            />
                            {errors.quantity && (
                                <span className="font-normal text-sm text-red-500">
                                    {errors.quantity.message}
                                </span>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="mt-4"
                            disabled={isPending}
                        >
                            {isPending ? "Registrando..." : "Registrar Cupom"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
            <DialogClose className="sr-only">Fechar</DialogClose>
        </Dialog>
    );
}
