import { TableOrders } from "@/components/table-orders";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function Pedidos() {
    return (
        <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-4">
            <section>
                <Card className="w-full p-6">
                    <CardTitle className="text-2xl">Pedidos</CardTitle>
                    <CardDescription className="text-base font-normal">Gerencie seus pedidos</CardDescription>
                </Card>
            </section>
            <section>

            </section>
            <section>
                <TableOrders />
            </section>
        </main>
    )
}