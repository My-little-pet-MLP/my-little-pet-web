"use client";
import { ProductComponent } from "@/components/product-component";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import LoadingPageProduct from "./loading";
import { useAuth } from "@clerk/nextjs";
import { DialogFormNewProduct } from "@/components/dialog-form-new-product";
import { useFetchProductByStoreId } from "@/lib/react-query/products-queries-and-mutations";
import { useGetStoreByUserId } from "@/lib/react-query/store-queries-and-mutations";

export interface ProductProps {
    id: string;
    title: string;
    imageUrl: string;
    priceInCents: number;
    stock: number;
}

export default function ProdutosPage() {
    const { userId } = useAuth();

    
    const { data: storeId, isLoading: isLoadingStore, error: errorStore } = useGetStoreByUserId(userId ?? "");

    // Fetch the products of the store
    const { data: products, isLoading: isLoadingProducts, error: errorProducts } = useFetchProductByStoreId(storeId.id)
    console.log("ProductList: ",products)

    if (isLoadingStore || isLoadingProducts) {
        return <LoadingPageProduct />;
    }
    if (errorStore) {
        return (
            <Card className="p-6 h-80 flex items-center justify-center">
                <p>Erro ao carregar a loja: {errorStore.message}</p>
            </Card>
        );
    }
    if (errorProducts) {
        console.log(errorProducts)
        return (
            <Card className="p-6 h-80 flex items-center justify-center">
                <p>Erro ao carregar os produtos: {errorProducts.message}</p>
            </Card>
        );
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
                {products?.length === 0 ? (
                    <Card className="p-6 h-80">
                       <div className="grid grid-cols-2">
                            <div className="col-span-1">
                                <CardTitle className="text-base sm:text-2xl">Listagem de produtos</CardTitle>
                                <CardDescription className="text-xs sm:text-base">Todos os seus produtos</CardDescription>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <DialogFormNewProduct />
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
                                <CardDescription className="text-xs sm:text-base">Todos os seus produtos</CardDescription>
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <DialogFormNewProduct />
                            </div>
                        </div>
                        <div className="w-full h-full p-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
                            {products?.map((product: ProductProps) => (
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
