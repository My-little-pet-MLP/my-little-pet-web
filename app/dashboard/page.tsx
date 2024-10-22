"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { ChartMounths } from "../../components/chart-mounths";
import { CardDashboardFaturamento, CardDashboardVendas } from "../../components/card-dashboard";
import { PizzaPaymentFormChart } from "../../components/pizza-payment-form-chart";
import { useQuery } from "@tanstack/react-query";
import { getStoreByUserId } from "@/hooks/store/get-store-by-user-id";

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const userid = user?.id ?? ""
  const { data: storeData, isLoading, error } = useQuery({
    queryKey: ["getStoreByUserId"],
    queryFn: () => getStoreByUserId(userid),
    enabled: !!userid
  });

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  if (isLoading) {
    return (
      <main className="sm:ml-14 pt-6">
        <p>Carregando...</p>
      </main>
    );
  }
  if (error || !storeData) {
    router.push("/register-store");
    return null;
  }

  if (storeData.isActive != true) {
    router.push("/welcome-back")
    return null;
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
