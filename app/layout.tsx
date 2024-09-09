import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My little pet",
  description: "O app que cuida do seu pet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="pt-br">
      <body
        className={`${inter.className}`}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
