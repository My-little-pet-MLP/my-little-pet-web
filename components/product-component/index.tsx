import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ProductProps } from "@/app/dashboard/produtos/[pageNumber]/page";

export function ProductComponent(product: ProductProps) {
  // Função para formatar o valor de centavos para reais
  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceInCents / 100);
  };

  // Função de navegação para a página de edição
  function onNavigationProductPage() {
    // Lógica de navegação aqui
  }

  // Função para limitar o tamanho do texto
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Card key={product.id} className="h-80 w-full max-w-xs flex flex-col justify-between shadow-md">
      <CardContent className="flex flex-col items-center gap-2 lg:gap-4 p-4">
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={144}
          height={144}
          className="object-contain w-36 h-36"
          priority
        />
        <CardTitle className="w-full text-center text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
          {truncateText(product.title, 25)} {/* Limitar o título a 25 caracteres */}
        </CardTitle>
        <div className="grid grid-cols-1 w-full text-center">
          <CardDescription className="text-sm font-semibold">{formatPrice(product.priceInCents)}</CardDescription>
          <CardDescription className="text-xs sm:text-sm">Estoque: {product.stock}</CardDescription>
        </div>
        <div className="w-full mt-auto">
          <Button className="w-full text-xs" onClick={onNavigationProductPage}>
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
