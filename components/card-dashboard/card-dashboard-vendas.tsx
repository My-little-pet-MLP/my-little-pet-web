import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { someTotalSalesInMonth } from "@/hooks/orders/some-total-sales-in-month";
import { useSomeTotalSalesInMonth } from "@/lib/react-query/orders-queries-and-mutations";
import { Package } from "lucide-react"
import { Skeleton } from "../ui/skeleton";
interface CardDashboardProps {
    storeId: string;
}
export function CardDashboardVendas({ storeId }: CardDashboardProps) {
    const { data, isLoading, error } = useSomeTotalSalesInMonth(storeId);

    // Verificação para evitar erros caso o valor seja nulo ou indefinido
    const totalSales = data?.totalSalesInMonth ?? 0;
    return (
        <Card className="flex pt-4 sm:pt-8 px-2 sm:px-4 flex-col gap-1">
            <CardTitle className="flex flex-row items-center gap-4">
                <Package className="text-oragetheme hidden sm:flex" />
                <span className="w-full text-center sm:text-start">Vendas do mês</span>
            </CardTitle>

            <CardDescription className="w-full text-center sm:text-start">
            Parabéns, você vendeu
            </CardDescription>

            <CardContent className="flex items-center justify-center h-24">
                {isLoading ? (
                    <Skeleton className="h-8 w-1/2 sm:w-1/3 rounded-md" />
                ) : error ? (
                    <span className="text-red-500">Erro ao carregar dados</span>
                ) : (
                    <span className="text-sm text-center sm:text-start sm:text-base">
                         {totalSales} vendas/mês
                    </span>
                )}
            </CardContent>
        </Card>
    )
}
