
'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge'; // Badge not currently used
import type { Transaction, Category } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import LucideIcon from '@/components/icons/LucideIcon'; // Import the new dynamic icon component

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  limit?: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories, limit = 10 }) => {
  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort descending by date
    .slice(0, limit);

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  if(recentTransactions.length === 0) {
     return (
       <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
         <CardHeader>
           <CardTitle>Recent Transactions</CardTitle>
           <CardDescription>Your latest income and expenses.</CardDescription>
         </CardHeader>
         <CardContent className="flex items-center justify-center h-40">
           <p className="text-muted-foreground">No transactions yet.</p>
         </CardContent>
       </Card>
     );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest income and expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4"> {/* Added padding-right to avoid scrollbar overlap */}
          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              const category = getCategoryInfo(transaction.categoryId);
              // const Icon = category?.icon; // Old way
              const isIncome = transaction.type === 'income';

              return (
                <div key={transaction.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-150"> {/* Increased padding and slightly muted hover */}
                  <Avatar className="h-10 w-10 flex-shrink-0"> {/* Increased size */}
                    {/* Render icon dynamically using LucideIcon component */}
                    {category?.iconName && <LucideIcon name={category.iconName} className="h-5 w-5 m-auto text-muted-foreground" />}
                    {!category?.iconName && <AvatarFallback>{category?.name?.charAt(0)?.toUpperCase() ?? '?'}</AvatarFallback>} {/* Uppercase fallback */}
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0"> {/* Added min-w-0 for ellipsis */}
                    <p className="text-sm font-medium leading-none truncate"> {/* Added truncate */}
                      {category?.name ?? 'Uncategorized'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate"> {/* Added truncate */}
                      {transaction.description || format(transaction.date, 'PPP')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2"> {/* Prevent shrinking, add margin */}
                    <div className={cn(
                      "text-sm font-semibold",
                      // Using theme colors: chart color for positive income, default foreground for expense
                      isIncome ? "text-[hsl(var(--chart-2))]" : "text-foreground"
                    )}>
                      {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                     <div className="text-xs text-muted-foreground mt-0.5"> {/* Small top margin */}
                      {format(transaction.date, 'MMM d')}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
