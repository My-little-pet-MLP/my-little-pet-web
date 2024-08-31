"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
    { month: "Janeiro", vendas: 80 },
    { month: "Fevereiro", vendas: 200 },
    { month: "Março", vendas: 120 },
    { month: "Abril", vendas: 190 },
    { month: "Maio", vendas: 130 },
    { month: "Junho", vendas: 140 },
    { month: "Julho", vendas: 120 },
    { month: "Agosto", vendas: 190 },
    { month: "Setembro", vendas: 130 },
    { month: "Outubro", vendas: 140 },
    { month: "Novembro", vendas: 190 },
    { month: "Dezembro", vendas: 128 },
]
const chartConfig = {
    vendas: {
        label: "Vendas",
        color: "#F7AB2A",
    },
} satisfies ChartConfig

export function ChartMounths(){
    return(
        <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Todas as vendas deste ano</CardTitle>
          <CardDescription>Janeiro - Hoje 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
  
            <Bar dataKey="vendas" fill="#F7AB2A" radius={4} />
        </BarChart>
    </ChartContainer>
    </CardContent>
    </Card>
    )
}