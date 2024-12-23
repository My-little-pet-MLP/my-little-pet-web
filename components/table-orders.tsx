"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { useListOrdersByStoreId } from "@/lib/react-query/orders-queries-and-mutations";
import { useAuth } from "@clerk/nextjs";
import { useGetStoreByUserId } from "@/lib/react-query/store-queries-and-mutations";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {} from "@radix-ui/react-icons"

export type OrderStatus =
    | "pending"
    | "awaiting_payment"
    | "payment_confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "canceled"
    | "returned";

// Função para traduzir os status
const translateStatus = (status: string): string => {
    const translations: Record<OrderStatus, string> = {
        pending: "Pendente",
        awaiting_payment: "Aguardando Pagamento",
        payment_confirmed: "Pagamento Confirmado",
        processing: "Em Processamento",
        shipped: "Enviado",
        delivered: "Entregue",
        canceled: "Cancelado",
        returned: "Devolvido",
    };
    return translations[status as OrderStatus] || "Status desconhecido";
};

export function TableOrders() {
    const { userId } = useAuth();

    // State para controlar a página atual
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // Número de itens por página

    // Fetch store data by user ID
    const { data: storeData, isLoading: isLoadingStore, error: errorStore } = useGetStoreByUserId(userId ?? "");
    const storeId = storeData?.id;

    // Fetch orders by store ID
    const {
        data,
        isLoading: isLoadingOrders,
        error: errorOrders,
    } = useListOrdersByStoreId(storeId ?? "", currentPage, pageSize);

    // Extração segura das propriedades
    const orders = data?.orders || [];
    const totalPages = data?.totalPages || 1;

    if (isLoadingStore || isLoadingOrders) {
        return (
            <Card className="w-full p-6">
                <CardTitle className="text-2xl">Ultimas vendas</CardTitle>
                <Skeleton className="h-10 w-full" />
            </Card>
        );
    }

    if (errorStore || errorOrders) {
        return (
            <Card className="w-full p-6">
                <CardTitle className="text-2xl">Ultimas vendas</CardTitle>
                <p className="text-red-500">Erro ao carregar dados.</p>
            </Card>
        );
    }

    return (
        <Card className="w-full p-6">
            <CardTitle className="text-2xl">Últimas Vendas</CardTitle>
            {orders.length === 0 ? (
                <div className="flex flex-col justify-center items-center text-center text-muted-foreground h-72">
                    <p>Não há pedidos registrados ainda.</p>
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                             
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead>Saiba Mais</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                 
                                    <TableCell>{translateStatus(order.status)}</TableCell>
                                    <TableCell className="text-right">
                                        {new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        }).format(order.fullPriceOrderInCents / 100)}
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/dashboard/pedidos/${order.id}`}
                                            className="text-foreground hover:text-primary font-semibold"
                                        >
                                            Saiba Mais
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <CardFooter className="flex items-center justify-between space-x-2 pt-6">
                        <div className="text-sm text-muted-foreground">
                            Página {currentPage} de {totalPages}
                        </div>
                        <div className="space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            >
                                Próxima
                            </Button>
                        </div>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}
