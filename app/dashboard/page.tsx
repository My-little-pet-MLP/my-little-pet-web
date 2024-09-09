import { ChartMounths } from "../../components/chart-mounths";
import { CardDashboardFaturamento, CardDashboardVendas } from "../../components/card-dashboard";
import { PizzaPaymentFormChart } from "../../components/pizza-payment-form-chart";


export default function Dashboard() {
    return (
        <main className="sm:ml-14 pt-6">
            <section className="container grid grid-cols-2 gap-4">
                <CardDashboardVendas title="Vendas do mês" description="Parabens, voçê vendeu" content="65 vendas/mês"/>
                <CardDashboardFaturamento title="Faturamento" description="faturamento do mês" content="R$ 9.000,00"/>
            </section>
            <section className="container w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
               <ChartMounths/>
               <PizzaPaymentFormChart/>
            </section>
        </main>
    )
}