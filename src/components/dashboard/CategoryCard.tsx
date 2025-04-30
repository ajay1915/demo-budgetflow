
'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Category, Transaction, BudgetGoal } from '@/types';
import LucideIcon from '@/components/icons/LucideIcon'; // Import the new dynamic icon component

interface CategoryCardProps {
  category: Category;
  transactions: Transaction[];
  budgetGoal?: BudgetGoal;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, transactions, budgetGoal }) => {
  const totalSpent = transactions
    .filter(t => t.categoryId === category.id && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetAmount = budgetGoal?.amount ?? 0;
  // Calculate progress, capping at 100% visually
  const progressValue = budgetAmount > 0 ? Math.min((totalSpent / budgetAmount) * 100, 100) : 0;
  const isOverBudget = budgetAmount > 0 && totalSpent > budgetAmount;

  // Use the LucideIcon component with the iconName from the category prop
  // const Icon = category.icon; // Old way

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full"> {/* Ensure card takes full height if needed */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2"> {/* Align items start */}
        <div className="flex items-center gap-2">
            {/* Render icon dynamically using LucideIcon component */}
            <LucideIcon name={category.iconName} className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium"> {/* Removed flex items-center gap-2 from here */}
              {category.name}
            </CardTitle>
        </div>
        <span className={cn("text-sm font-semibold pl-2", isOverBudget ? "text-destructive" : "text-foreground")}> {/* Added left padding */}
          ${totalSpent.toFixed(2)}
        </span>
      </CardHeader>
      <CardContent className="pt-2 flex-grow flex flex-col justify-end"> {/* Added padding-top, flex-grow, and justify-end */}
        {budgetGoal ? (
          <>
            <div className="text-xs text-muted-foreground mb-1.5"> {/* Increased bottom margin */}
              Budget: ${budgetAmount.toFixed(2)}
            </div>
            {/* Apply destructive background directly to the indicator div */}
            <Progress value={progressValue} aria-label={`${category.name} budget progress`} className={cn("h-2", isOverBudget ? "[&>div]:bg-destructive" : "")} /> {/* Reduced height */}
            {isOverBudget && (
              <p className="text-xs text-destructive mt-1.5"> {/* Increased top margin */}
                Over by ${(totalSpent - budgetAmount).toFixed(2)}
              </p>
            )}
            {!isOverBudget && budgetAmount > 0 && (
               <p className="text-xs text-muted-foreground mt-1.5">
                 ${(budgetAmount - totalSpent).toFixed(2)} remaining
               </p>
            )}
          </>
        ) : (
          <p className="text-xs text-muted-foreground mt-1.5">No budget set</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
