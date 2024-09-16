"use client";
import { ProductComponent } from "@/components/product-component";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getStoreByUserId, listProductsByStoreId } from "@/lib/axios";
import LoadingPageProduct from "./loading";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Usar useRouter em vez de redirect diretamente

import { DialogFormNewProduct } from "@/components/dialog-form-new-product";

export interface ProductProps {
    id: string;
    title: string;
    imageUrl: string;
    priceInCents: number;
    stock: number;
}

export default function ProdutosPage() {
    const { user, isLoaded, isSignedIn } = useUser(); // Verificar estado de autenticação e carregamento
    const router = useRouter();
    const [products, setProducts] = useState<ProductProps[]>([]);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!isLoaded) return; // Aguarda até que o estado de carregamento do usuário esteja completo

            if (!isSignedIn || !user) {
                setError("Usuário não autenticado.");
                setLoading(false);
                router.push("/"); // Redireciona para a home se o usuário não estiver autenticado
                return;
            }

            try {
                const userId = user.id;
                const storeData = await getStoreByUserId(userId);
                const storeId = storeData?.id;

                if (!storeId) {
                    setError("Não tem loja cadastrada.");
                    setLoading(false);
                    router.push("/register-store"); // Redireciona para registro de loja
                    return;
                }

                setStoreId(storeId);

                const productsData = await listProductsByStoreId(storeId, 1, 8);
                setProducts(productsData);

            } catch (error) {
                setError("Erro ao carregar produtos.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isLoaded, isSignedIn, user, router]);

    if (loading) {
        return <LoadingPageProduct />;
    }

    return (
        <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-4">
            <section>
                <Card className="w-full p-6">
                    <CardTitle className="text-2xl">Produtos</CardTitle>
                    <CardDescription className="text-base font-normal">Gerencie sua vitrine</CardDescription>
                </Card>
            </section>

            <section className="w-full h-96">
                {loading ? (
                    <Card className="p-6 h-80 flex items-center justify-center">
                        <p>Carregando...</p>
                    </Card>
                ) : error ? (
                    <Card className="p-6 h-80 flex items-center justify-center">
                        <p>{error}</p>
                    </Card>
                ) : products.length === 0 ? (
                    <Card className="p-6 h-80">
                        <div className="grid grid-cols-2">
                            <div>
                                <CardTitle className="text-2xl">Listagem de produtos</CardTitle>
                                <CardDescription>todos seus produtos</CardDescription>
                            </div>
                            <div className="col-span-1 flex justify-end">

                            </div>
                        </div>
                        <CardContent className="w-full h-full flex items-center justify-center">
                            <p>Você ainda não tem nenhum produto cadastrado</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="p-6">
                        <div className="grid grid-cols-2">
                            <div className="col-span-1">
                                <CardTitle className="text-base sm:text-2xl">Listagem de produtos</CardTitle>
                                <CardDescription className="text-xs sm:text-base">todos seus produtos</CardDescription>
                            </div>
                            <div className="col-span-1 flex justify-end">
                               <DialogFormNewProduct/>
                            </div>
                        </div>
                        <div className="w-full h-full p-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <ProductComponent
                                    id={product.id}
                                    imageUrl={product.imageUrl}
                                    title={product.title}
                                    priceInCents={product.priceInCents}
                                    stock={product.stock}
                                    key={product.id}
                                />
                            ))}
                        </div>
                    </Card>
                )}
            </section>
        </main>
    );
}
