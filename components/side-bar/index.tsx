import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Flame, Home, HomeIcon, LayoutDashboard, LayoutDashboardIcon, LogOut, LucideHome, Package, PanelBottom, Settings, ShoppingBag } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function SideBarDashboard() {
    return (
        <div className="flex w-full flex-col bg-muted/40 ">
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
                <nav className="flex flex-col items-center gap-4 px-2 py-5">
                    <TooltipProvider>
                        <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center text-primary-foreground rounded-full bg-primary">
                            <Package className="h-4 w-4" />
                            <span className="sr-only">Dashboard Avatar</span>
                        </Link>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Home className="h-5 w-5" />
                                    <span className="sr-only">Dashboard</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Dashboard
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/dashboard/pedidos" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <ShoppingBag className="h-5 w-5" />
                                    <span className="sr-only">Pedidos</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Pedidos
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/dashboard/anuncios" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Flame className="h-5 w-5" />
                                    <span className="sr-only">Anuncios</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Anuncios
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Package className="h-5 w-5" />
                                    <span className="sr-only">Produtos</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Produtos
                            </TooltipContent>
                        </Tooltip>

                    </TooltipProvider>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Settings className="h-5 w-5" />
                                    <span className="sr-only">Configurações</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Configurações
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <LogOut className="h-5 w-5 text-red-500" />
                                    <span className="sr-only">Sair</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Sair
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>
            <div className="flex flex-col sm:hidden">
                <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4">
                    <Sheet >
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline">
                                <PanelBottom className="w-5 h-5" />
                                <span className="sr-only">Abrir / Fechar menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <nav className="grid gap-6 text-lg font-normal">
                                <Link href="#" className="flex h-10 w-10 bg-primary gap-2 rounded-full items-center justify-center text-primary-foreground md:text-base" prefetch={false}>
                                    <Package className="h-5 w-5 transition-all" />
                                    <span className="sr-only">Logo do projeto</span>
                                </Link>
                                <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                    <Home className="h-5 w-5 transition-all" />
                                    Dashboard
                                </Link>
                                <Link href="/dashboard/pedidos" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                    <ShoppingBag className="h-5 w-5 transition-all" />
                                    Pedidos
                                </Link>
                                <Link href="/dashboard/anuncios" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                    <Flame className="h-5 w-5 transition-all" />
                                    Anuncios
                                </Link>
                                <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                    <Package className="h-5 w-5 transition-all" />
                                    Produtos
                                </Link>
                                <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                    <Settings className="h-5 w-5 transition-all" />
                                    Configurações
                                </Link>
                                <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground text-red-500" prefetch={false}>
                                    <LogOut className="h-5 w-5 transition-all " />
                                    Sair
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <h1></h1>
                </header>
            </div>
        </div>
    )
}