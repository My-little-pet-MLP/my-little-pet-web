import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coupon } from "@/hooks/coupon/list-all-by-stored-id";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    coupon: Coupon;
}

export default function CouponDetailsDialog({ isOpen, onClose, coupon }: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalhes do Cupom</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p><strong>Descrição:</strong> {coupon.description}</p>
                    <p><strong>Porcentagem:</strong> {coupon.percentage}%</p>
                    <p><strong>Quantidade Total:</strong> {coupon.totalQuantity}</p>
                    <p><strong>Disponíveis:</strong> {coupon.available}</p>
                    <p><strong>Entregues:</strong> {coupon.delivered}</p>
                </div>
                <DialogFooter>
                    <button onClick={onClose}>Fechar</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
