"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { TransactionCategory } from "@/services/types"

const chartConfig = {
    spent: {
        label: "Spent",
    }
} satisfies ChartConfig

TransactionCategory
const chartData = [
    { category: "food", spent: 4500, fill: "hsl(var(--chart-1))" },
    { category: "work", spent: 3000, fill: "hsl(var(--chart-2))" },
    { category: "SHOPPING", spent: 2000, fill: "hsl(var(--chart-3))" },
    { category: "ENTERTAINMENT", spent: 1000, fill: "hsl(var(--chart-4))" },
    { category: "other", spent: 1000, fill: "hsl(var(--chart-5))" },
]





export function ExpensesPieChart(props: {
    currency: string
    accountId: string
}) {
    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.spent, 0)
    }, [])


    const fetchExpenses = async () => {
        const response = await fetch(`/api/bankaccount/transactions/pastweek/${props.accountId}`)

        if (!response.ok) {
            return
        }

        const data = await response.json()

        const expenses = data.expenses as {
            category: TransactionCategory
            spent: number
        }[]
    }




    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Expenses in the past week</CardTitle>
                <CardDescription>
                    A breakdown of expenses in the past week
                </CardDescription>
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
                            dataKey="spent"
                            nameKey="category"
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
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    {props.currency} spent
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
