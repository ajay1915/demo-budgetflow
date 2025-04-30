
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
         <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
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

  // Calculate progress, capping at 100% visually even if overspent
  const overallProgressValue = totalBudgeted > 0 ? Math.min((totalSpentInBudgetedCategories / totalBudgeted) * 100, 100) : 0;
  const isOverallOverBudget = totalBudgeted > 0 && totalSpentInBudgetedCategories > totalBudgeted;

  const goalsMet = goals.filter(goal => {
    const categorySpending = transactions
      .filter(t => t.categoryId === goal.categoryId && t.type === 'expense')
      .reduce((catSum, t) => catSum + t.amount, 0);
    return categorySpending <= goal.amount;
  }).length;

  const goalsOver = goals.length - goalsMet;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Budget Goals Overview</CardTitle>
        <CardDescription>Summary of your budget performance this month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-4"> {/* Increased spacing and added padding-top */}
        <div>
          <div className="flex justify-between items-center mb-2"> {/* Increased bottom margin */}
            <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
            <span className={cn("text-sm font-semibold", isOverallOverBudget ? "text-destructive" : "text-foreground")}>
              ${totalSpentInBudgetedCategories.toFixed(2)} / ${totalBudgeted.toFixed(2)}
            </span>
          </div>
          {/* Apply destructive background color directly to the indicator div */}
          <Progress value={overallProgressValue} aria-label="Overall budget progress" className={cn(isOverallOverBudget ? "[&>div]:bg-destructive" : "")} />
          {isOverallOverBudget && (
              <p className="text-xs text-destructive mt-1.5"> {/* Increased top margin */}
                Overall over budget by ${(totalSpentInBudgetedCategories - totalBudgeted).toFixed(2)}
              </p>
            )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center border-t border-border pt-6"> {/* Added border-top and padding-top */}
          <div>
            <DollarSign className="w-5 h-5 mx-auto text-muted-foreground mb-1.5" /> {/* Slightly larger icon */}
            <p className="text-lg font-semibold">${totalBudgeted.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Budgeted</p> {/* Uppercase label */}
          </div>
          <div>
             {/* Using theme color for success */}
             <CheckCircle className="w-5 h-5 mx-auto text-[hsl(var(--chart-2))] mb-1.5" />
             <p className="text-lg font-semibold">{goalsMet}</p>
             <p className="text-xs text-muted-foreground uppercase tracking-wider">On Track</p>
          </div>
           <div>
             {/* Using theme color for warning/destructive */}
             <AlertTriangle className="w-5 h-5 mx-auto text-destructive mb-1.5" />
             <p className="text-lg font-semibold">{goalsOver}</p>
             <p className="text-xs text-muted-foreground uppercase tracking-wider">Over Budget</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetGoalsOverview;
