'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { Category, Transaction } from '@/types';
import { mockCategories } from '@/data/mockData'; // Use mockCategories to get names

interface SpendingChartProps {
  transactions: Transaction[];
  categories: Category[];
}

// Function to generate distinct colors for chart slices
const generateChartColors = (numColors: number): string[] => {
    const colors = [];
    const hueStep = 360 / numColors;
    for (let i = 0; i < numColors; i++) {
        // Vary saturation and lightness slightly for better distinction
        const saturation = 60 + (i % 3) * 10; // 60%, 70%, 80%
        const lightness = 55 + (i % 4) * 5;  // 55%, 60%, 65%, 70%
        colors.push(`hsl(${i * hueStep}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
};


const SpendingChart: React.FC<SpendingChartProps> = ({ transactions, categories }) => {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const spendingByCategory = expenseTransactions.reduce((acc, transaction) => {
    const categoryName = categories.find(c => c.id === transaction.categoryId)?.name || 'Unknown';
    acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = Object.entries(spendingByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Sort for better visualization

  const chartColors = React.useMemo(() => generateChartColors(chartData.length), [chartData.length]);

  const chartConfig = chartData.reduce((config, item, index) => {
    config[item.name] = {
      label: item.name,
      color: chartColors[index % chartColors.length], // Use generated colors
    };
    return config;
  }, {} as ChartConfig);


  if (chartData.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>No expense data available for this period.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60">
          <p className="text-muted-foreground">No expenses yet.</p>
        </CardContent>
      </Card>
    );
   }


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Spending distribution across categories for the current month.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="name" />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                cy="50%" // Center vertically
                cx="50%" // Center horizontally
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
