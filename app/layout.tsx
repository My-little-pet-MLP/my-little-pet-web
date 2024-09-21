import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from '@clerk/localizations';
import { ProviderReactQuery } from "@/utils/provider-react-query";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      
        <html lang="pt-br">
          <body className={`${inter.className}`}>
            <ProviderReactQuery>
            {children}
            </ProviderReactQuery>
          </body>
        </html>
      
    </ClerkProvider>
  );
}
