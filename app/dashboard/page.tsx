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
      // Verifica se o usuário está autenticado e carregado
      if (!isLoaded || !isSignedIn || !user?.id) {
        setLoading(false);
        router.push("/sign-in"); // Redireciona para página de login se o usuário não estiver autenticado
        return;
      }

      try {
        const storeData = await getStoreByUserId(user.id);
        console.log("Store Data:", storeData);

        // Verifica se os dados da loja são válidos
        if (!storeData?.id || !storeData?.title || !storeData?.description) {
          console.log("Loja não encontrada ou dados incompletos, redirecionando para /register-store");
          router.push("/register-store"); // Redireciona para página de cadastro de loja
          return;
        }

        setLoading(false); // Loja encontrada, parar o estado de carregamento
      } catch (error) {
        console.error("Erro ao verificar a loja:", error);
        setError("Erro ao verificar a loja.");
        setLoading(false);
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
        <button onClick={() => router.push("/")} className="mt-4 p-2 bg-green-500 text-white rounded">
          Voltar à página inicial
        </button>
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
