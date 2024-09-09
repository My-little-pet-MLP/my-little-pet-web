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
import { Package } from "lucide-react"

export function DialogEditProfile() {
    return (
        <Dialog>
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
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nome
                        </Label>
                        <Input id="name" value="My little pet" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Telefone
                        </Label>
                        <Input id="phone" value="(00) 00000-0000" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Salvar alterações</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
