import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const publicRoutes = ['/', '/sign-in(.*)', '/sign-up(.*)'];
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware((auth, request) => {
    const { userId } = auth();
  
    // Se o usuário estiver autenticado e tentar acessar uma rota pública, redirecione para o /dashboard
    if (userId && isPublicRoute(request)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  
    // Caso contrário, retorne undefined para permitir que o próximo middleware ou rota seja executado
    return undefined;
})

export const config = {
  matcher: [
 
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    '/(api|trpc)(.*)',
  ],
}