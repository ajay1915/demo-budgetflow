'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Transaction, Category } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
       <Card className="shadow-md">
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
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest income and expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              const category = getCategoryInfo(transaction.categoryId);
              const Icon = category?.icon;
              const isIncome = transaction.type === 'income';

              return (
                <div key={transaction.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-secondary transition-colors">
                  <Avatar className="h-9 w-9">
                    {Icon && <Icon className="h-5 w-5 m-auto text-muted-foreground" />}
                    {!Icon && <AvatarFallback>{category?.name?.charAt(0) ?? '?'}</AvatarFallback>}
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {category?.name ?? 'Uncategorized'}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {transaction.description || format(transaction.date, 'PPP')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-sm font-semibold",
                      isIncome ? "text-green-600" : "text-foreground"
                    )}>
                      {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                     <div className="text-xs text-muted-foreground">
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
