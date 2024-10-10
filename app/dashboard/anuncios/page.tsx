import { TableAdds } from "@/components/anuncios/table-adds";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function Anuncios(){
    return(
        <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-4">
            <section>
                <Card className="w-full p-6">
                    <CardTitle className="text-2xl">Anúncios</CardTitle>
                    <CardDescription className="text-base font-normal">Gerencie seus anúncios</CardDescription>
                </Card>
            </section>
            <section>
                <TableAdds/>
            </section>
        </main>
    )
}