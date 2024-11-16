"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useListAllCouponsByStoreId } from "@/lib/react-query/coupon-queries-and-mutations";
import { useGetStoreByUserId } from "@/lib/react-query/store-queries-and-mutations";

import CouponDetailsDialog from "@/components/CouponDetailsDialog";
import { Coupon } from "@/hooks/coupon/list-all-by-stored-id";
import { Button } from "@/components/ui/button";
import { RegisterCouponDialog } from "@/components/RegisterCouponDialog";


export default function ManageCoupons() {
    const { userId } = useAuth();
    const { data: storeData, isLoading: isLoadingStore, error: errorStore } = useGetStoreByUserId(userId ?? "");
    const storeId = storeData?.id;

    const [dialogDetailsOpen, setDialogDetailsOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

    const { data: couponsData, isLoading: isLoadingCoupons, isError: isErrorCoupons } = useListAllCouponsByStoreId(storeId ?? "");
    const coupons = couponsData || [];



    if (isLoadingStore || isLoadingCoupons) {
        return (
            <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-4">
                <Card className="w-full p-6">
                    <CardTitle className="text-2xl flex justify-between items-center">
                        Cupons
                        <Skeleton className="h-10 w-32" />
                    </CardTitle>
                    <Skeleton className="h-10 w-full" />
                </Card>
            </main>
        );
    }

    if (errorStore || isErrorCoupons) {
        return (
            <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-4">
                <Card className="w-full p-6">
                    <CardTitle className="text-2xl flex justify-between items-center">
                        Cupons
                        <RegisterCouponDialog/>
                    </CardTitle>
                    <p className="text-red-500">Erro ao carregar dados.</p>
                </Card>
            </main>
        );
    }

    return (
        <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-4">
            <Card className="w-full p-6">
                <CardTitle className="text-2xl flex justify-between items-center">
                    Cupons
                    <RegisterCouponDialog/>
                </CardTitle>
                {coupons.length === 0 ? (
                    <div className="flex flex-col justify-center items-center text-center text-muted-foreground h-72">
                        <p>Não há cupons registrados ainda.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Porcentagem</TableHead>
                                <TableHead>Quantidade</TableHead>
                                <TableHead>Disponíveis</TableHead>
                                <TableHead>Saiba Mais</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.map((item) => (
                                <TableRow key={item.description}>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.percentage}%</TableCell>
                                    <TableCell>{item.totalQuantity}</TableCell>
                                    <TableCell>{item.available}</TableCell>
                                    <TableCell>
                                        <Button
                                        variant="link"
                                            onClick={() => {
                                                setSelectedCoupon(item);
                                                setDialogDetailsOpen(true);
                                            }}
                                        >
                                            Saiba Mais
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
              
                {selectedCoupon && (
                    <CouponDetailsDialog
                        isOpen={dialogDetailsOpen}
                        onClose={() => setDialogDetailsOpen(false)}
                        coupon={selectedCoupon}
                    />
                )}
            </Card>
        </main>
    );
}
