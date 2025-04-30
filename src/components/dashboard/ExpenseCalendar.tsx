
'use client';

import * as React from 'react';
import { format, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Transaction } from '@/types';
import { cn } from '@/lib/utils';

interface ExpenseCalendarProps {
  transactions: Transaction[];
}

const EXPENSE_THRESHOLD = 100; // Threshold for highlighting a day in red

const ExpenseCalendar: React.FC<ExpenseCalendarProps> = ({ transactions }) => {
  const [month, setMonth] = React.useState<Date>(new Date());

  const dailyExpenses = React.useMemo(() => {
    const expensesMap = new Map<string, number>();
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const dayKey = format(startOfDay(t.date), 'yyyy-MM-dd');
        expensesMap.set(dayKey, (expensesMap.get(dayKey) || 0) + t.amount);
      });
    return expensesMap;
  }, [transactions]);

  const modifiers = React.useMemo(() => {
     const highExpenseDays: Date[] = [];
     dailyExpenses.forEach((amount, dayKey) => {
         if (amount >= EXPENSE_THRESHOLD) {
             highExpenseDays.push(startOfDay(new Date(dayKey + 'T00:00:00'))); // Ensure correct date object
         }
     });
     return { highExpense: highExpenseDays };
  }, [dailyExpenses]);


  const modifiersStyles = {
    highExpense: {
      backgroundColor: 'hsl(var(--destructive))', // Use destructive color from theme
      color: 'hsl(var(--destructive-foreground))', // Use destructive foreground for text
      borderRadius: '50%', // Make it a circle
    },
  };

  // Tooltip content rendering
  const renderDayWithTooltip = (day: Date) => {
    const dayKey = format(startOfDay(day), 'yyyy-MM-dd');
    const expenseAmount = dailyExpenses.get(dayKey);

    if (!expenseAmount) {
      return format(day, 'd'); // Just render the day number if no expense
    }

    const isHighExpense = expenseAmount >= EXPENSE_THRESHOLD;

    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
             {/* The div ensures the trigger area covers the day */}
             <div className={cn(
                 "relative flex items-center justify-center h-full w-full",
                 isHighExpense ? "rounded-full" : "" // Apply rounding only if high expense
             )}>
                 {format(day, 'd')}
             </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Spent: ${expenseAmount.toFixed(2)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Expense Calendar</CardTitle>
        <CardDescription>
          Daily spending overview. Dates with total expenses over ${EXPENSE_THRESHOLD} are highlighted.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single" // Keep single mode but use modifiers for styling
          month={month}
          onMonthChange={setMonth}
          selected={undefined} // No single date selection needed
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
              DayContent: ({ date }) => renderDayWithTooltip(date) // Use DayContent for custom rendering
          }}
          className="p-0" // Remove default padding if needed
        />
      </CardContent>
    </Card>
  );
};

export default ExpenseCalendar;
