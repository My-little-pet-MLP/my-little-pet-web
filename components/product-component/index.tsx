import Image from "next/image";
import { useRouter } from "next/navigation"; // Importar useRouter
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ProductProps } from "@/app/dashboard/produtos/page";

export function ProductComponent(product: ProductProps) {
  const router = useRouter(); // Usar o hook useRouter

  // Função para formatar o valor de centavos para reais
  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceInCents / 100);
  };

  // Função de navegação para a página de edição
  function onNavigationProductPage() {
    router.push(`/dashboard/produtos/${product.id}`); // Redirecionar para a página de edição com o ID do produto
  }

  return (
    <Card key={product.id} className="h-min py-4">
      <CardContent className="flex flex-col items-center gap-4 lg:gap-6">
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={144}
          height={144}
          className="object-contain w-36 h-36"
          priority
        />
        <CardTitle className="w-full text-center text-sm sm:text-base">{product.title}</CardTitle>
        <div className="grid grid-cols-1 w-full">
          <CardDescription className="col-span-1 text-right text-xs">{formatPrice(product.priceInCents)}</CardDescription>
          <CardDescription className="col-span-1 text-right text-xs sm:text-sm">Estoque: {product.stock}</CardDescription>
        </div>
        <div className="w-full">
          <Button className="w-full text-xs" onClick={onNavigationProductPage}>
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
