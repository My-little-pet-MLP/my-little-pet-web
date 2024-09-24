"use client";

import { ProductComponent } from "@/components/product-component";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import LoadingPageProduct from "../../../../components/loading";
import { useAuth } from "@clerk/nextjs";
import { DialogFormNewProduct } from "@/components/dialog-form-new-product";
import { useFetchProductByStoreId } from "@/lib/react-query/products-queries-and-mutations";
import { useGetStoreByUserId } from "@/lib/react-query/store-queries-and-mutations";
import { Button } from "@/components/ui/button";

// Definindo as interfaces
export interface ProductProps {
  id: string;
  title: string;
  imageUrl: string;
  priceInCents: number;
  stock: number;
}

export interface ProductsData {
  products: ProductProps[];
  totalPages: number;
  currentPage: number;
}

export default function ProdutosPage({ params }: { params: { pageNumber: string } }) {
  const { userId } = useAuth();
  const { data: storeData, isLoading: isLoadingStore, error: errorStore } = useGetStoreByUserId(userId ?? "");
  const storeId = storeData?.id;

  const pageNumber = params.pageNumber;
  const page = parseInt(pageNumber, 10) || 1; // Definindo a página como um número ou 1 por padrão

  // Aqui estamos tipando productsData corretamente
  const { data: productsData, isLoading: isLoadingProducts, isFetching, error: errorProducts } = useFetchProductByStoreId(storeId ?? "", page);

  if (isLoadingStore || isLoadingProducts || isFetching) {
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
    console.log(errorProducts);
    return (
      <Card className="p-6 h-80 flex items-center justify-center">
        <p>Erro ao carregar os produtos: {errorProducts.message}</p>
      </Card>
    );
  }

  // Verificando se productsData não é undefined antes de acessar as propriedades
  if (!productsData) {
    return <LoadingPageProduct />; // Você pode tratar isso da forma que preferir, ou retornar um placeholder.
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
        {productsData?.products?.length === 0 ? (
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
            <div className="w-full h-full p-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
              {productsData?.products?.map((product: ProductProps) => (
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
            {/* Paginação */}
            <CardFooter className="mt-4  flex flex-row items-center justify-end gap-2">
              <span className="mx-4 text-secondary-foreground">
                Página {productsData.currentPage} de {productsData.totalPages}
              </span>
              <Button
                disabled={page <= 1}
                onClick={() => window.location.href = `/dashboard/produtos/${page - 1}`}
                className="px-4 py-2  rounded-md"
              >
                {page - 1}
              </Button>

              <Button
                disabled={page >= productsData.totalPages}
                onClick={() => window.location.href = `/dashboard/produtos/${page + 1}`}
                className="px-4 py-2  rounded-md"
              >
                {page + 1}
              </Button>

            </CardFooter>
          </Card>
        )}
      </section>


    </main>
  );
}
