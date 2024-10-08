"use client"
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStoreByUserId } from "@/hooks/store/get-store-by-user-id";
import { useReactiveStoreById } from "@/lib/react-query/store-queries-and-mutations";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation"


export default function WelcomeBack() {
    const { user, isLoaded, isSignedIn } = useUser()
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)
   

    // Verifica se o componente foi montado (para evitar execução no lado do servidor)
    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Redireciona para a página de login se o usuário não estiver logado
    React.useEffect(() => {
        if (isLoaded && (!isSignedIn || !user)) {
            router.push("/sign-in")
        }
    }, [isLoaded, isSignedIn, user, router])

    // Definir a consulta para obter dados da loja do usuário
    const { data: storeData, isLoading, error, refetch } = useQuery({
        queryKey: ["getStoreByUserId", user?.id],
        queryFn: () => getStoreByUserId(user?.id as string),
        enabled: isLoaded && isSignedIn && Boolean(user?.id), // Habilita a query somente quando o usuário está logado e carregado
        staleTime: 1000 * 60 * 5, // Evitar consultas frequentes
    })

    const { mutateAsync: reactivestore, isPending } = useReactiveStoreById()

    // Função para reativar a loja
    async function handlerDeleteStore() {
        if (!storeData?.id) return

        try {
            await reactivestore({ id: storeData.id })
            router.push("/dashboard")
        } catch (err) {
            console.error("Erro ao reativar a loja:", err)
        } finally {
            refetch()
        }
    }

    // Se o componente não foi montado ou ainda está carregando os dados
    if (!mounted || isLoading) {
        return <div>Carregando...</div> // Placeholder para carregar
    }

    if (error) {
        return <div>Erro ao carregar dados da loja.</div>
    }

    return (
        <main className="sm:ml-14 pt-6 flex items-center justify-center min-h-screen">
            <Card className="flex flex-col justify-center">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Bem-vindo de volta ao My little pet &#129395; &#129395; &#129395;
                    </CardTitle>
                    <CardContent className="flex items-center justify-center h-72">
                        <Button
                            onClick={() => handlerDeleteStore()}
                            variant="default"
                            className="text-lg font-bold p-4 lg:p-8"
                            disabled={isPending} // Desabilita o botão durante a reativação
                        >
                            {isPending ? 'Restaurando...' : 'Restaurar minha loja'}
                        </Button>
                    </CardContent>
                </CardHeader>
            </Card>
        </main>
    )
}
