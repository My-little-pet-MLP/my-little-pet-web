"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Flame, Home, LogOut, Package, PanelBottom, Settings, ShoppingBag } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { DialogEditProfile } from "./dialog-edit-profile";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // hook para obter a rota atual
import { useClerk } from "@clerk/nextjs";

export function SideBarDashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // Obtém a rota atual
    const { signOut } = useClerk();
    // Fechar o Sheet ao mudar a rota
    useEffect(() => {
        setIsOpen(false); // Fecha o sheet toda vez que a rota muda
    }, [pathname]); // Monitora mudanças na rota



    return (
        <div className="flex w-full flex-col bg-muted/40">
            {/* Sidebar para telas maiores */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
                <nav className="flex flex-col items-center gap-4 px-2 py-5">
                    <TooltipProvider>
                        <DialogEditProfile />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/dashboard" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Home className="h-5 w-5" />
                                    <span className="sr-only">Dashboard</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Dashboard</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/dashboard/pedidos" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <ShoppingBag className="h-5 w-5" />
                                    <span className="sr-only">Pedidos</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Pedidos</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/dashboard/anuncios" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Flame className="h-5 w-5" />
                                    <span className="sr-only">Anuncios</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Anuncios</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/dashboard/produtos" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Package className="h-5 w-5" />
                                    <span className="sr-only">Produtos</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Produtos</TooltipContent>
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
                            <TooltipContent side="right">Configurações</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => {
                                        // Fechar o sheet e realizar a ação de logout
                                        setIsOpen(false);
                                        signOut();
                                    }}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <LogOut className="h-5 w-5 text-red-500" />
                                    <span className="sr-only">Sair</span>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Sair</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>
            {/* Sidebar para telas menores */}
            <div className="flex flex-col sm:hidden">
                <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline">
                                <PanelBottom className="w-5 h-5" />
                                <span className="sr-only">Abrir / Fechar menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <nav className="grid gap-6 text-lg font-normal">
                                <DialogEditProfile />
                                <Link href="/dashboard" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
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
                                <Link href="/dashboard/produtos" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                    <Package className="h-5 w-5 transition-all" />
                                    Produtos
                                </Link>
                                <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                    <Settings className="h-5 w-5 transition-all" />
                                    Configurações
                                </Link>
                                <button
                                    onClick={() => {
                                        // Fechar o sheet e realizar a ação de logout
                                        setIsOpen(false);
                                        signOut();
                                    }}
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground text-red-500"
                                >
                                    <LogOut className="h-5 w-5 transition-all" />
                                    Sair
                                </button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>
            </div>
        </div>
    );
}
