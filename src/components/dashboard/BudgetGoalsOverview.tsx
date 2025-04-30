'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import type { BudgetGoal, Transaction, Category } from '@/types';
import { cn } from '@/lib/utils';

interface BudgetGoalsOverviewProps {
  goals: BudgetGoal[];
  transactions: Transaction[];
  categories: Category[];
}

const BudgetGoalsOverview: React.FC<BudgetGoalsOverviewProps> = ({ goals, transactions, categories }) => {
  if (goals.length === 0) {
      return (
         <Card className="shadow-md">
             <CardHeader>
                 <CardTitle>Budget Goals Overview</CardTitle>
                 <CardDescription>Summary of your budget performance.</CardDescription>
             </CardHeader>
             <CardContent className="flex items-center justify-center h-40">
                 <p className="text-muted-foreground">No budget goals set for this period.</p>
             </CardContent>
         </Card>
     );
  }

  const totalBudgeted = goals.reduce((sum, goal) => sum + goal.amount, 0);
  const totalSpentInBudgetedCategories = goals.reduce((sum, goal) => {
    const categorySpending = transactions
      .filter(t => t.categoryId === goal.categoryId && t.type === 'expense')
      .reduce((catSum, t) => catSum + t.amount, 0);
    return sum + categorySpending;
  }, 0);

  const overallProgress = totalBudgeted > 0 ? Math.min((totalSpentInBudgetedCategories / totalBudgeted) * 100, 100) : 0;
  const isOverallOverBudget = totalBudgeted > 0 && totalSpentInBudgetedCategories > totalBudgeted;

  const goalsMet = goals.filter(goal => {
    const categorySpending = transactions
      .filter(t => t.categoryId === goal.categoryId && t.type === 'expense')
      .reduce((catSum, t) => catSum + t.amount, 0);
    return categorySpending <= goal.amount;
  }).length;

  const goalsOver = goals.length - goalsMet;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Budget Goals Overview</CardTitle>
        <CardDescription>Summary of your budget performance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Overall Budget Progress</span>
            <span className={cn("text-sm font-semibold", isOverallOverBudget ? "text-destructive" : "text-foreground")}>
              ${totalSpentInBudgetedCategories.toFixed(2)} / ${totalBudgeted.toFixed(2)}
            </span>
          </div>
          <Progress value={overallProgress} aria-label="Overall budget progress" className={cn(isOverallOverBudget ? "[&>div]:bg-destructive" : "")} />
          {isOverallOverBudget && (
              <p className="text-xs text-destructive mt-1">
                Overall over budget by ${(totalSpentInBudgetedCategories - totalBudgeted).toFixed(2)}
              </p>
            )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <DollarSign className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
            <p className="text-lg font-semibold">${totalBudgeted.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Total Budgeted</p>
          </div>
          <div>
             <CheckCircle className="w-6 h-6 mx-auto text-green-500 mb-1" />
             <p className="text-lg font-semibold">{goalsMet}</p>
             <p className="text-xs text-muted-foreground">Goals Met</p>
          </div>
           <div>
             <AlertTriangle className="w-6 h-6 mx-auto text-destructive mb-1" />
             <p className="text-lg font-semibold">{goalsOver}</p>
             <p className="text-xs text-muted-foreground">Goals Over</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetGoalsOverview;
