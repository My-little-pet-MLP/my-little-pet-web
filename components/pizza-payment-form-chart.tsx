"use client"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription, CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { pform: "pix", paymentforms: 275, fill: "#37b4aa" },
  { pform: "cartaodecredito", paymentforms: 200, fill: "#D8F172" },
  { pform: "cartaodedebito", paymentforms: 287, fill: "#7FC014" },
  { pform: "boleto", paymentforms: 173, fill: "#D034A5" },
]
const chartConfig = {
  paymentforms: {
    label: "payment forms",
  },
  pix: {
    label: "Pix",
    color: "#37b4aa",
  },
  cartaodecredito: {
    label: "Cartão de credito",
    color: "#D8F172",
  },
  cartaodedebito: {
    label: "Cartão de debito",
    color: "#7FC014",
  },
  boleto: {
    label: "boleto",
    color: "#D034A5",
  },

} satisfies ChartConfig
export function PizzaPaymentFormChart() {
  const totalpaymentforms = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.paymentforms, 0)
  }, [])
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Formas de pagamentos mais usadas</CardTitle>
        <CardDescription>Janeiro - Hoje 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="paymentforms"
              nameKey="pform"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalpaymentforms.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          pagamentos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
