"use client";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import LoadingPageProduct from "@/components/loading";
import { useGetOrderById, useUpdateOrder } from "@/lib/react-query/orders-queries-and-mutations";
import { Button } from "@/components/ui/button";
import { useListAllProductsInOrderByOrderId } from "@/lib/react-query/product-in-orders-queries.and.mutations";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

export default function OrderScreen({ params }: { params: { orderid: string } }) {
    const { toast } = useToast();
    const orderId = params.orderid;

    // State para controlar o AlertDialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<"processing" | "shipped" | null>(null);

    // Hook para buscar os dados do pedido
    const { data: orderData, isLoading: isLoadingOrder, error: orderError } = useGetOrderById(orderId);

    // Hook para listar os produtos do pedido
    const { data: products, isLoading: isLoadingProducts, error: productsError } =
        useListAllProductsInOrderByOrderId(orderId);

    // Hook para atualizar o status do pedido
    const updateOrderMutation = useUpdateOrder();

    const handleUpdateOrder = async () => {
        if (orderData?.id && newStatus) {
            updateOrderMutation.mutate(
                { id: orderData.id, status: newStatus, fullPriceOrderInCents: orderData.fullPriceOrderInCents },
                {
                    onSuccess: () => {
                        toast({
                            title: "Sucesso",
                            description: `O pedido foi atualizado para '${translateStatus(newStatus)}'.`,
                        });
                        setIsDialogOpen(false);
                    },
                    onError: (error: any) => {
                        toast({
                            title: "Erro",
                            description: error?.message || "Erro ao atualizar o pedido.",
                            variant: "destructive",
                        });
                    },
                }
            );
        }
    };

    if (isLoadingOrder || isLoadingProducts) {
        return <LoadingPageProduct />;
    }

    if (orderError) {
        return (
            <Card className="p-6 h-80 flex items-center justify-center bg-red-100">
                <p className="text-red-600 font-medium">Erro ao carregar o pedido.</p>
            </Card>
        );
    }

    if (productsError) {
        return (
            <Card className="p-6 h-80 flex items-center justify-center bg-red-100">
                <p className="text-red-600 font-medium">Erro ao carregar os produtos do pedido.</p>
            </Card>
        );
    }

    if (!orderData) {
        return (
            <Card className="p-6 h-80 flex items-center justify-center bg-gray-100">
                <p className="text-gray-600 font-medium">Pedido não encontrado.</p>
            </Card>
        );
    }

    return (
        <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-8 bg-gray-50">
            {/* Detalhes do Pedido */}
            <section>
                <Card className="w-full p-6 shadow-md">
                    <CardTitle className="text-3xl font-semibold text-gray-800 mb-2">Detalhes do Pedido</CardTitle>
                    <CardDescription className="text-lg font-normal text-gray-600">
                        Informações gerais sobre o pedido
                    </CardDescription>
                </Card>
            </section>

            <section className="w-full">
                <Card className="p-6 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <CardTitle className="text-lg font-medium text-gray-700">ID do Pedido</CardTitle>
                            <CardDescription>{orderData.id}</CardDescription>
                        </div>
                        <div>
                            <CardTitle className="text-lg font-medium text-gray-700">Status</CardTitle>
                            <CardDescription>{translateStatus(orderData.status)}</CardDescription>
                        </div>
                        <div>
                            <CardTitle className="text-lg font-medium text-gray-700">Valor Total</CardTitle>
                            <CardDescription className="text-green-600 font-semibold">
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(orderData.fullPriceOrderInCents / 100)}
                            </CardDescription>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Produtos no Pedido */}
            <section className="w-full">
                <Card className="p-6 shadow-md">
                    <CardTitle className="text-3xl font-semibold text-gray-800 mb-4">Produtos no Pedido</CardTitle>
                    {!products || products.length === 0 ? (
                        <CardContent className="flex items-center justify-center h-40">
                            <p className="text-gray-600">Nenhum produto encontrado neste pedido.</p>
                        </CardContent>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {products.map((product) => (
                                <Card key={product.id} className="p-4 border border-gray-200 shadow-sm">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-32 w-full object-cover rounded-md mb-4"
                                    />
                                    <CardTitle className="text-lg font-semibold text-gray-700">
                                        {product.name}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-500">
                                        Quantidade: {product.quantity}
                                    </CardDescription>
                                    <CardDescription className="text-sm text-gray-500">
                                        Preço:{" "}
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(product.price / 100)}
                                    </CardDescription>
                                </Card>
                            ))}
                        </div>
                    )}
                </Card>
            </section>

            {/* Botões */}
            <section className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    
                >
                    Voltar
                </Button>

                {orderData.status === "payment_confirmed" && (
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="default">Confirmar Pedido</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Pedido</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza de que deseja atualizar o status deste pedido para{" "}
                                    <strong>{translateStatus("processing")}</strong>?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        setNewStatus("processing");
                                        handleUpdateOrder();
                                    }}
                                    disabled={updateOrderMutation.isPending}
                                >
                                    {updateOrderMutation.isPending ? "Confirmando..." : "Confirmar"}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                {orderData.status === "processing" && (
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="default">Confirmar Envio</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Envio</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tem certeza de que deseja atualizar o status deste pedido para{" "}
                                    <strong>{translateStatus("shipped")}</strong>?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        setNewStatus("shipped");
                                        handleUpdateOrder();
                                    }}
                                    disabled={updateOrderMutation.isPending}
                                >
                                    {updateOrderMutation.isPending ? "Confirmando..." : "Confirmar"}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                {orderData.status === "shipped" && (
                    <Button variant="default" disabled>
                        Já Enviado
                    </Button>
                )}
            </section>
        </main>
    );
}
