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
    amount: {
        label: "Spent",
    },
    OTHER: {
        label: "Other",
        color: "hsl(var(--chart-1))",
    }
} satisfies ChartConfig

export function ExpensesPieChart(props: {
    currency: string
    accountId: string
}) {

    const [transactions, setTransactions] = React.useState<any[]>([])

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/bankaccount/transactions/pastweek/${props.accountId}`, {
                method: "GET",
            });

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setTransactions(data);
            } else {
                console.error("Failed to fetch transactions");
            }
        } catch (error) {
            console.error("An error occurred while fetching transactions");
        }
    }

    React.useEffect(() => {
        fetchTransactions();
    }, [props.accountId])

    // Function to generate a random hex color
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Group transactions by category and sum amounts
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        const found = acc.find((item: any) => item.category === transaction.category);
        if (found) {
            found.amount += transaction.amount;
        } else {
            acc.push({
                category: transaction.category,
                amount: transaction.amount,
                fill: getRandomColor()
            });
        }
        return acc;
    }, []);

    const totalAmount = groupedTransactions.reduce((total: number, transaction: any) => total + transaction.amount, 0);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Expenses in the past week</CardTitle>
                <CardDescription>
                    A breakdown of expenses in the past week
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {groupedTransactions.length > 0 ? (
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
                                data={groupedTransactions}
                                dataKey="amount"
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
                                                        {totalAmount}
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
                ) : (
                    <div className="flex justify-center items-center h-full py-16">
                        <p className="text-muted-foreground">No expenses in the past week</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
