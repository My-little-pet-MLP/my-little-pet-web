"use client";
import { ProductComponent } from "@/components/product-component";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SheetFormRegisterProduct } from "@/components/sheet-form-register-product";
import { getStoreByUserId } from "@/lib/axios"; // Importando a função para buscar a loja
import { listProductsByStoreId } from "@/lib/axios"; // Importando a função para listar produtos

export interface ProductProps {
    id: string;
    title: string;
    imageUrl: string;
    priceInCents: number;
    stock: number;
}

export default function Produtos() {
    const [products, setProducts] = useState<ProductProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Substitua "user_id" pelo ID do usuário real que você deseja consultar
                const userId = "cm0wqok4q0000ztitbjyd1eq7"


                // Usando a função listProductsByStoreId para buscar os produtos
                const productsData = await listProductsByStoreId(userId, 1, 8);
                console.log(productsData);
                setProducts(productsData);

            } catch (error) {
                setError("Erro ao carregar produtos.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
                                <SheetFormRegisterProduct />
                            </div>
                        </div>
                        <CardContent className="w-full h-full flex items-center justify-center">
                            <p>Você ainda não tem nenhum produto cadastrado</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="p-6">
                        <div className="grid grid-cols-2">
                            <div>
                                <CardTitle className="text-2xl">Listagem de produtos</CardTitle>
                                <CardDescription>todos seus produtos</CardDescription>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <SheetFormRegisterProduct />
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
