import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useGetStoreByUserId, useUpdateStore } from "@/lib/react-query/store-queries-and-mutations"
import { storeUpdateSchema, UpdateStoreSchemaType } from "@/lib/schemas"
import { uploadLogoImage } from "@/lib/supabase"
import { useAuth } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Package, Terminal } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"


export function DialogEditProfile() {
    const [isOpen, setIsOpen] = useState(false);
    const { userId } = useAuth();
    const [isDisabledForm, setIsDisabledForm] = useState(true);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const { mutateAsync: updateStore, isPending, isSuccess } = useUpdateStore();
    const { data: storeData, isLoading: isLoadingStore, error: errorStore } = useGetStoreByUserId(userId ?? "");
    const storeId = storeData?.id;
    const { toast } = useToast()
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<UpdateStoreSchemaType>({
        resolver: zodResolver(storeUpdateSchema),
    });

    // Move useEffect here to track isPending state and disable form
    useEffect(() => {
        setIsDisabledForm(isPending);
    }, [isPending]);

    useEffect(() => {
        if (storeData) {
            setValue("title", storeData.title);
            setValue("description", storeData.description);
            setValue("cnpj", storeData.cnpj);
        }
    }, [storeData, setValue]);

    async function UpdateStoreFunction(data: UpdateStoreSchemaType) {
        console.log("Dados recebidos do formulário:", data); // Verifica os dados do formulário

        if (!storeId) {
            console.error("Store ID não disponível");
            return;
        }
        let imageUrl = "";

        if (selectedImage) {
            const uploadResult = await uploadLogoImage(selectedImage, "my-little-pet-logo");
            if (uploadResult.error) {
                setUploadError(uploadResult.error.message);
                return;
            } else {
                imageUrl = uploadResult.publicUrl || "";
            }
        }

        await updateStore({
            id: storeId,
            title: data.title,
            description: data.description,
            cnpj: data.cnpj,
            image_url: imageUrl
        });

        if (isSuccess) {
           toast({
            title: "Atualizado com sucesso",
            description: "Parabens, informações de loja atualizadas!",
           })
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

    function handleActivateForm() {
        setIsDisabledForm(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center text-primary-foreground rounded-full bg-primary">
                    <Package className="h-4 w-4" />
                    <span className="sr-only">Dashboard Avatar</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar seu perfil</DialogTitle>
                    <DialogDescription>
                        Personalize seu perfil do seu jeito
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(UpdateStoreFunction)}>
                    <div className="grid gap-4 py-4">

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="">
                                titulo
                            </Label>
                            <Input id="title" placeholder="My little pet" className="col-span-3" {...register("title")} disabled={isPending} />
                            {errors.title && <span className="font-normal text-sm text-red-500">{errors.title.message}</span>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="">
                                Descrição
                            </Label>
                            <Input id="description" className="col-span-3"        {...register("description")} disabled={isPending} />
                            {errors.description && <span className="font-normal text-sm text-red-500">{errors.description.message}</span>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cnpj" className="">
                                cnpj
                            </Label>
                            <Input id="cnpj" className="col-span-3"  {...register("cnpj")} disabled={isPending} />
                            {errors.cnpj && <span className="font-normal text-sm text-red-500">{errors.cnpj.message}</span>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="">Logo</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/svg"
                                onChange={handleFileChange}
                                disabled={isPending}
                                className="col-span-3"
                            />
                            {uploadError && <span className="font-normal text-sm text-red-500">{uploadError}</span>}

                        </div>
                    </div>
                    <DialogFooter>
                        {isDisabledForm ? (

                            <Button
                                variant="default"
                                onClick={(event) => {
                                    event.preventDefault(); // Impede o submit
                                    handleActivateForm(); // Ativa o formulário
                                }}
                            >
                                Alterar
                            </Button>
                        ) : (

                            <>
                                <Button
                                    variant="destructive"
                                    onClick={(event) => {
                                        event.preventDefault(); // Impede o submit
                                        setIsDisabledForm(true); // Desativa o formulário
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    Salvar alterações
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
