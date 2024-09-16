import { HeaderPublicComponent } from "@/components/header-public-component";

export default function LayoutPublic({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
    <html lang="pt-br">
      <body>
        <HeaderPublicComponent/>
        {children}
      </body>
    </html>
  );
}
