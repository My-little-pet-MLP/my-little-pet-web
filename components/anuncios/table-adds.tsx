import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { RegisterAddDialog } from "./register-add-dialog";

export function TableAdds() {
    const Orders = [
        {
            id: "8cdec09c-8bf6-4246-9feb-d6533263d93b",
            title: "Adote um amigo",
            status: "Ativo",
            credit: "R$100,00",
            datefinal: "25/09/2024",
        }
    ];

    return (
        <Card className="w-full p-6">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle className="text-2xl">Meus Anúncios</CardTitle>
                </div>
                <div>
                 <RegisterAddDialog/>
                </div>
            </CardHeader>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>id</TableHead>
                        <TableHead>título</TableHead>
                        <TableHead>status</TableHead>
                        <TableHead className="text-right">crédito</TableHead>
                        <TableHead className="text-right">prazo final</TableHead>
                        <TableHead>Saiba mais</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.title}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell className="text-right">{order.credit}</TableCell>
                            <TableCell className="text-right">{order.datefinal}</TableCell>
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
                    pagina 1 de 8
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm">
                        voltar
                    </Button>
                    <Button variant="default" size="sm">
                        proximo
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}