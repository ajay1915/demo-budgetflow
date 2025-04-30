
'use client';

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent, ChartLegendContent } from '@/components/ui/chart'; // Import ChartLegendContent
import type { Category, Transaction } from '@/types';
// import { mockCategories } from '@/data/mockData'; // Not needed if categories are passed as props

interface SpendingChartProps {
  transactions: Transaction[];
  categories: Category[];
}

// Keep using HSL for programmatic color generation, ensures distinctiveness
const generateChartColors = (numColors: number): string[] => {
    const colors = [];
    // Use a base hue and step through, varying lightness and saturation slightly
    const baseHue = 195; // Start near primary teal
    const hueStep = 360 / (numColors || 1); // Avoid division by zero

    for (let i = 0; i < numColors; i++) {
        const currentHue = (baseHue + i * hueStep) % 360;
        // Cycle saturation/lightness within a pleasant range
        const saturation = 60 + (i * 5) % 25; // 60% to 85%
        const lightness = 50 + (i * 7) % 25; // 50% to 75%
        colors.push(`hsl(${currentHue}, ${saturation}%, ${lightness}%)`);
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
    .map(([name, value]) => ({ name, value, fill: '' })) // Add fill placeholder initially
    .sort((a, b) => b.value - a.value); // Sort for better visualization

  const chartColors = React.useMemo(() => generateChartColors(chartData.length), [chartData.length]);

  // Assign generated colors to chartData and create chartConfig
  const chartConfig = chartData.reduce((config, item, index) => {
    const color = chartColors[index % chartColors.length];
    item.fill = `var(--color-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')})`; // Use CSS variable for fill
    config[item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')] = { // Use sanitized name for key
      label: item.name,
      color: color, // Store the HSL color
    };
    return config;
  }, {} as ChartConfig);


  if (chartData.length === 0) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>No expense data available for this period.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60 min-h-[250px]"> {/* Ensure minimum height */}
          <p className="text-muted-foreground">No expenses yet.</p>
        </CardContent>
      </Card>
    );
   }


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"> {/* Use flex column */}
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Distribution across categories this month.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0"> {/* Allow content to grow, remove bottom padding */}
         {/* Set a fixed height or aspect ratio for the container */}
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[280px]"> {/* Slightly smaller max height */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={true} // Enable cursor
                content={<ChartTooltipContent
                            hideLabel // Hide the default label row
                            formatter={(value, name) => (
                                <div className="flex flex-col">
                                    <span className="font-medium text-foreground">{name}</span>
                                    <span className="text-muted-foreground">${(value as number).toFixed(2)}</span>
                                </div>
                            )}
                         />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="50%" // Adjust inner radius
                outerRadius="80%" // Adjust outer radius
                strokeWidth={2} // Thinner stroke
                cy="50%"
                cx="50%"
                paddingAngle={1} // Add small padding angle
              >
                {/* Cells are implicitly handled by ChartContainer config now */}
              </Pie>
              {/* Use ChartLegendContent for better styling */}
              {/* <Legend content={<ChartLegendContent nameKey="name" />} /> */}
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      {/* Render legend outside ChartContainer for better layout control */}
       <div className="flex items-center justify-center p-4 text-xs text-muted-foreground border-t border-border mt-4"> {/* Custom legend area */}
         <ChartLegendContent payload={chartData.map(item => ({
            value: item.name, // Use name as value for legend
            type: 'rect', // Specify legend item type
            id: item.name,
            color: chartConfig[item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')].color // Get color from config
         }))} nameKey="value" className="flex-wrap gap-x-4 gap-y-1" /> {/* Allow wrapping, adjust gap */}
       </div>
    </Card>
  );
};

export default SpendingChart;
