"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getStoreByUserId } from "@/lib/axios";
import { ChartMounths } from "../../components/chart-mounths";
import { CardDashboardFaturamento, CardDashboardVendas } from "../../components/card-dashboard";
import { PizzaPaymentFormChart } from "../../components/pizza-payment-form-chart";

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStore = async () => {
      if (isLoaded && isSignedIn && user?.id) {
        console.log("User ID:", user.id);
        try {
          const storeData = await getStoreByUserId(user.id);
          console.log("Store Data:", storeData);

          // Verificar se o objeto storeData tem a propriedade store e se é um objeto não vazio
          if (!storeData || !storeData.id || !storeData.title || !storeData.description) {
            console.log("Loja não encontrada ou dados incompletos, redirecionando para /register-store");
            router.push("/register-store");
          } else {
            setLoading(false); // Loja existe, não precisa redirecionar
          }
        } catch (error) {
          console.error("Erro ao verificar a loja:", error);
          setError("Erro ao verificar a loja.");
          setLoading(false);
        }
      } else {
        console.log("Usuário não carregado ou não autenticado");
        setLoading(false); // Se o usuário não estiver autenticado, não mostra carregando
      }
    };
    checkStore();
  }, [isLoaded, isSignedIn, user, router]);

  if (loading) {
    return (
      <main className="sm:ml-14 pt-6">
        <p>Carregando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="sm:ml-14 pt-6">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="sm:ml-14 pt-6">
      <section className="container grid grid-cols-2 gap-4">
        <CardDashboardVendas title="Vendas do mês" description="Parabéns, você vendeu" content="65 vendas/mês" />
        <CardDashboardFaturamento title="Faturamento" description="Faturamento do mês" content="R$ 9.000,00" />
      </section>
      <section className="container w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <ChartMounths />
        <PizzaPaymentFormChart />
      </section>
    </main>
  );
}
