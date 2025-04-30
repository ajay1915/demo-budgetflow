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
  const progress = budgetAmount > 0 ? Math.min((totalSpent / budgetAmount) * 100, 100) : 0;
  const isOverBudget = budgetAmount > 0 && totalSpent > budgetAmount;

  // Use the LucideIcon component with the iconName from the category prop
  // const Icon = category.icon; // Old way

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {/* Render icon dynamically using LucideIcon component */}
          <LucideIcon name={category.iconName} className="w-4 h-4 text-muted-foreground" />
          {category.name}
        </CardTitle>
        <span className={cn("text-sm font-semibold", isOverBudget ? "text-destructive" : "text-foreground")}>
          ${totalSpent.toFixed(2)}
        </span>
      </CardHeader>
      <CardContent>
        {budgetGoal ? (
          <>
            <div className="text-xs text-muted-foreground mb-1">
              Budget: ${budgetAmount.toFixed(2)}
            </div>
            <Progress value={progress} aria-label={`${category.name} budget progress`} className={cn(isOverBudget ? "[&>div]:bg-destructive" : "")} />
            {isOverBudget && (
              <p className="text-xs text-destructive mt-1">
                Over budget by ${(totalSpent - budgetAmount).toFixed(2)}
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No budget set</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
