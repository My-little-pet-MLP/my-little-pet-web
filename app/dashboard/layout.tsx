import { SideBarDashboard } from "@/components/side-bar";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "My little pet Dasboard",
  description: "conheça o app que cuida do seu pet",
};

export default function DasboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <SideBarDashboard/>
        {children}
        </body>
    </html>
  );
}
