"use client"
import { ProductComponent } from "@/components/product-component";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SheetFormRegisterProduct } from "@/components/sheet-form-register-product";

export interface ProductProps {
    id: string;
    title: string;
    image_url: string;
    priceInCents: number;
    stock: number;
}

export default function Produtos() {
    const [products, setProducts] = useState<ProductProps[]>([
        {
            id: "1",
            image_url: "https://jfwzshiyyvxklcuuzueu.supabase.co/storage/v1/object/sign/my-little-pet-products/product1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJteS1saXR0bGUtcGV0LXByb2R1Y3RzL3Byb2R1Y3QxLnBuZyIsImlhdCI6MTcyNTc0NTY4MiwiZXhwIjoxNzU3MjgxNjgyfQ.y3CwPk2g8gBLz2Tam7zhgVqU9wz84jU25O76fZ20zJY&t=2024-09-07T21%3A48%3A08.306Z",
            priceInCents: 2000,
            stock: 20,
            title: "ração 1kg pedigree"
        },
        {
            id: "2",
            image_url: "https://jfwzshiyyvxklcuuzueu.supabase.co/storage/v1/object/sign/my-little-pet-products/product1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJteS1saXR0bGUtcGV0LXByb2R1Y3RzL3Byb2R1Y3QxLnBuZyIsImlhdCI6MTcyNTc0NTY4MiwiZXhwIjoxNzU3MjgxNjgyfQ.y3CwPk2g8gBLz2Tam7zhgVqU9wz84jU25O76fZ20zJY&t=2024-09-07T21%3A48%3A08.306Z",
            priceInCents: 2000,
            stock: 20,
            title: "ração 1kg pedigree"
        }
    ]);

    return (
        <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-4">
            <section>
                <Card className="w-full p-6">
                    <CardTitle className="text-2xl">Produtos</CardTitle>
                    <CardDescription className="text-base font-normal">Gerencie sua vitrine</CardDescription>
                </Card>
            </section>
            <section className="w-full h-96">
                {products.length === 0 ? (
                    <Card className="w-full h-full p-6">
                        <CardTitle className="text-2xl">
                            Listagem de produtos
                        </CardTitle>
                        <CardDescription>
                            todos seus produtos
                        </CardDescription>
                        <CardContent className=" w-full h-full flex items-center justify-center">
                            <p>Você ainda não tem nenhum produto cadastrado</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="p-6">
                        <div className="grid grid-cols-2">
                            <div>
                                <CardTitle className="text-2xl">
                                    Listagem de produtos
                                </CardTitle>
                                <CardDescription>
                                    todos seus produtos
                                </CardDescription>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <SheetFormRegisterProduct/>
                            </div>
                        </div>
                        <div className="w-full h-full p-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <ProductComponent id={product.id} image_url={product.image_url} title={product.title} priceInCents={product.priceInCents} stock={product.stock} key={product.id} />
                            ))}
                        </div>
                    </Card>
                )}
            </section>
        </main>
    );
}
