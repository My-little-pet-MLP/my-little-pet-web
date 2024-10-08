"use client"
import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useDeleteStore } from "@/lib/react-query/store-queries-and-mutations"
import { useClerk, useUser } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query"
import { getStoreByUserId } from "@/hooks/store/get-store-by-user-id"

export default function Settings() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const { signOut } = useClerk();
  // Evitar problemas de hidratação definindo o estado montado
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Redirecionamento para login se o usuário não estiver logado
  React.useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn || !user) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, user, router])

  // Definir a consulta para obter dados da loja do usuário
  const { data: storeData, isLoading, error, refetch } = useQuery({
    queryKey: ["getStoreByUserId", user?.id],
    queryFn: () => getStoreByUserId(user?.id as string),
    enabled: isLoaded && isSignedIn && Boolean(user?.id), // Habilita a query somente quando o usuário está logado e carregado
    staleTime: 1000 * 60 * 5, // Opcional: 5 minutos de "freshness" para evitar consultas frequentes
  })

  const { theme, resolvedTheme, setTheme } = useTheme()

  // Define qual tema será mostrado: 'theme' se não for 'system', senão 'resolvedTheme'.
  const activeTheme = theme === "system" ? resolvedTheme : theme

  const { mutateAsync: deleteStore, isPending } = useDeleteStore()

  async function handlerDeleteStore() {
    if (!storeData?.id) 
      return

    try {
      await deleteStore({ id: storeData.id })
      setIsDialogOpen(false) // Fecha o diálogo antes do redirecionamento
      await signOut()
      router.push("/") // Redirecionar após deletar a loja
    } catch (err) {
      console.error("Erro ao deletar a loja:", err)
    } finally {
      refetch() // Refetch store data após a exclusão (apenas para garantir)
    }
  }

  // Renderizar apenas quando o componente estiver montado para evitar erros de hidratação
  if (!mounted) {
    return null
  }

  return (
    <main className="sm:ml-14 p-6 sm:p-12 flex flex-col gap-4">
      {/* Card para Alterar Tema */}
      <section className="w-full">
        <Card className="w-full h-full flex flex-row justify-between lg:p-6 p-3">
          <CardHeader>
            <CardTitle>Alterar tema</CardTitle>
            <CardDescription>Personalize o app para seu conforto</CardDescription>
          </CardHeader>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <div className="flex flex-row gap-2 items-center justify-center">
                  {/* Renderização condicional para Light Theme */}
                  {activeTheme === "light" && (
                    <>
                      <SunIcon className="h-[1.2rem] w-[1.2rem]" />
                      <p>Light</p>
                    </>
                  )}

                  {/* Renderização condicional para Dark Theme */}
                  {activeTheme === "dark" && (
                    <>
                      <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
                      <p>Dark</p>
                    </>
                  )}
                </div>
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      </section>

      {/* Card para Deletar Loja */}
      <section className="w-full">
        <Card className="w-full h-full flex flex-row justify-between lg:p-6 p-3">
          <CardHeader>
            <CardTitle>Deletar Loja</CardTitle>
            <CardDescription>Se você não deseja mais exibir sua loja para seus clientes em nosso app</CardDescription>
          </CardHeader>
          <div className="min-h-full flex items-center justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">Deletar minha Loja</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deseja mesmo deletar sua loja?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={isPending}
                    onClick={handlerDeleteStore}
                  >
                    {isPending ? "Deletando..." : "Deletar Loja"}
                  </Button>
                  <Button type="button" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </section>
    </main>
  )
}
