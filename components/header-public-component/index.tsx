"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { HomeIcon, InfoIcon, LayoutDashboard, LogIn, PanelBottom, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Hook do Clerk

export function HeaderPublicComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { isSignedIn } = useUser(); // Verifica se o usuário está logado

    // Fechar o Sheet ao concluir a navegação
    useEffect(() => {
        setIsOpen(false); // Fecha o sheet toda vez que a rota muda
    }, [pathname]);

    return (
        <header className="grid grid-cols-2 lg:grid-cols-3 h-24 px-6 lg:px-12 sticky top-0 z-30 bg-background">
            <div className="col-span-1 flex items-center flex-row">
                <h1>logo</h1>
            </div>
            {/* Nav bar para tamanhos acima de lg */}
            <nav className="col-span-2 lg:flex justify-end flex-row items-center hidden">
                <Link href="/" className="flex items-center gap-2 px-4 text-muted-foreground hover:text-foreground">
                    <HomeIcon className="h-5 w-5 transition-all" />
                    Home
                </Link>
                <Link href="/sobre-nos" className="flex items-center gap-2 px-4 text-muted-foreground hover:text-foreground">
                    <InfoIcon className="h-5 w-5 transition-all" />
                    Sobre nós
                </Link>
                {/* Exibir Dashboard se o usuário estiver logado */}
                {isSignedIn ? (
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 text-muted-foreground hover:text-foreground">
                        <LayoutDashboard className="h-5 w-5 transition-all" />
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link href="/sign-in" className="flex items-center gap-2 px-4 text-muted-foreground hover:text-foreground">
                            <LogIn className="h-5 w-5 transition-all" />
                            Sign-In
                        </Link>
                        <Link href="/sign-up" className="flex items-center gap-2 px-4 text-muted-foreground hover:text-foreground">
                            <UserPlus className="h-5 w-5 transition-all" />
                            Sign-Up
                        </Link>
                    </>
                )}
            </nav>

            {/* Sheet para tamanhos abaixo de lg */}
            <header className="flex flex-row justify-end col-span-1 items-center lg:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline">
                            <PanelBottom className="w-5 h-5" />
                            <span className="sr-only">Abrir / Fechar menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <SheetTitle>My little pet</SheetTitle>
                        <nav className="grid gap-6 text-lg font-normal mt-6">
                            <Link href="/" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                <HomeIcon className="h-5 w-5 transition-all" />
                                Home
                            </Link>
                            <Link href="/sobre-nos" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                <InfoIcon className="h-5 w-5 transition-all" />
                                Sobre nós
                            </Link>
                            {/* Exibir Dashboard se o usuário estiver logado */}
                            {isSignedIn ? (
                                <Link href="/dashboard" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                    <LayoutDashboard className="h-5 w-5 transition-all" />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/sign-in" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                        <LogIn className="h-5 w-5 transition-all" />
                                        Sign-In
                                    </Link>
                                    <Link href="/sign-up" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" prefetch={false}>
                                        <UserPlus className="h-5 w-5 transition-all" />
                                        Sign-Up
                                    </Link>
                                </>
                            )}
                        </nav>
                    </SheetContent>
                </Sheet>
            </header>
        </header>
    );
}
