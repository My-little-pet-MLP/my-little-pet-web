"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ChartMounths } from "../../components/chart-mounths";
import { CardDashboardVendas } from "../../components/card-dashboard/card-dashboard-vendas";
import { PizzaPaymentFormChart } from "../../components/pizza-payment-form-chart";
import { useGetStoreByUserId } from "@/lib/react-query/store-queries-and-mutations";
import { CardDashboardFaturamento } from "@/components/card-dashboard/card-dashboard-faturamento";

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const { data: storeData, isLoading, error } = useGetStoreByUserId(user?.id ?? "");

  // Função para redirecionamento seguro após o carregamento
  useEffect(() => {
    if (!isUserLoaded || isLoading) return; // Aguarda o carregamento

    if (!user) {
      router.push("/sign-in");
    } else if (error || !storeData) {
      router.push("/register-store");
    } else if (!storeData?.isActive) {
      router.push("/welcome-back");
    }
  }, [isUserLoaded, isLoading, user, storeData, error, router]);

  // Exibe um loader enquanto os dados estão carregando
  if (!isUserLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Renderização principal após carregamento
  return (
    <main className="sm:ml-14 pt-6">
      <section className="container grid grid-cols-2 gap-4">
      {storeData && <CardDashboardVendas storeId={storeData.id} />}
        {storeData && <CardDashboardFaturamento storeId={storeData.id} />}
      </section>
      <section className="container w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <ChartMounths />
        <PizzaPaymentFormChart />
      </section>
    </main>
  );
}
