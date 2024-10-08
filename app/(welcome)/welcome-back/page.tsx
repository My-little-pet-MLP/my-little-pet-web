import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WelcomeBack() {
    return (
        <main className="sm:ml-14 pt-6 flex items-center justify-center min-h-screen">
            <Card className="flex flex-col justify-center">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Bem vindo de volta ao My little pet &#129395; &#129395; &#129395;
                    </CardTitle>
                    <CardContent className="flex items-center justify-center h-72">
                        <Button variant="default" className="text-lg font-bold p-4 lg:p-8">Restaurar minha loja</Button>
                    </CardContent>
                </CardHeader>
            </Card>
        </main>
    )
}