import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardFooter, CardTitle } from "./ui/card";

const Orders = [
    {
        id: "8cdec09c-8bf6-4246-9feb-d6533263d93b",
        name: "Pedro Henrique Oliveira dos Santos",
        status: "Enviado",
        value: "R$ 97,00",
        frete: "R$ 17,00",
    },
    {
        id: "8cdec09c-8bf6-4246-9feb-d6533263d93b",
        name: "Pedro Henrique Oliveira dos Santos",
        status: "Enviado",
        value: "R$ 97,00",
        frete: "R$ 17,00",
    },
    {
        id: "8cdec09c-8bf6-4246-9feb-d6533263d93b",
        name: "Pedro Henrique Oliveira dos Santos",
        status: "Enviado",
        value: "R$ 97,00",
        frete: "R$ 17,00",
    },
    {
        id: "8cdec09c-8bf6-4246-9feb-d6533263d93b",
        name: "Pedro Henrique Oliveira dos Santos",
        status: "Enviado",
        value: "R$ 97,00",
        frete: "R$ 17,00",
    },
    {
        id: "8cdec09c-8bf6-4246-9feb-d6533263d93b",
        name: "Pedro Henrique Oliveira dos Santos",
        status: "Enviado",
        value: "R$ 97,00",
        frete: "R$ 17,00",
    },
    {
        id: "8cdec09c-8bf6-4246-9feb-d6533263d93b",
        name: "Pedro Henrique Oliveira dos Santos",
        status: "Enviado",
        value: "R$ 97,00",
        frete: "R$ 17,00",
    },
    {
        id: "8cdec09c-8bf6-4246-9feb-d6533263d93b",
        name: "Pedro Henrique Oliveira dos Santos",
        status: "Enviado",
        value: "R$ 97,00",
        frete: "R$ 17,00",
    },
    {
        id: "8cdec09c-8bf6-4246-9feb-d6533263d93b",
        name: "Pedro Henrique Oliveira dos Santos",
        status: "Enviado",
        value: "R$ 97,00",
        frete: "R$ 17,00",
    },
    // ...outros pedidos
];

export function TableOrders() {
    return (
        <Card className="w-full p-6">
            <CardTitle className="text-2xl">Ultimas vendas</CardTitle>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>id</TableHead>
                        <TableHead>cliente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">Frete</TableHead>
                        <TableHead>Saiba mais</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.name}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell className="text-right">{order.value}</TableCell>
                            <TableCell className="text-right">{order.frete}</TableCell>
                            <TableCell>
                                <Link href="#" className="text-foreground hover:text-primary font-semibold">
                                    Saiba Mais

                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <CardFooter className="flex items-center justify-end space-x-2 pt-6">

                <div className="flex-1 text-sm text-muted-foreground">
                    0 of 5 row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm">
                        Previous
                    </Button>
                    <Button variant="outline" size="sm">
                        Next
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
