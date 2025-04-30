
'use client'; // Add 'use client' because we are using useState

import type React from 'react';
import { useState } from 'react'; // Import useState
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryCard from "@/components/dashboard/CategoryCard";
import SpendingChart from "@/components/dashboard/SpendingChart";
import BudgetGoalsOverview from "@/components/dashboard/BudgetGoalsOverview";
import TransactionList from "@/components/dashboard/TransactionList";
import ExpenseCalendar from '@/components/dashboard/ExpenseCalendar'; // Import ExpenseCalendar
import AddExpenseDialog from '@/components/dashboard/AddExpenseDialog'; // Import AddExpenseDialog
import AddIncomeDialog from '@/components/dashboard/AddIncomeDialog'; // Import AddIncomeDialog
import { mockCategories, mockTransactions, mockBudgetGoals } from "@/data/mockData";
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { Category, Transaction, BudgetGoal } from '@/types';
import { Button } from '@/components/ui/button'; // Import Button
import { PlusCircle } from 'lucide-react'; // Import PlusCircle for the button

export default function DashboardPage() {
  // --- State Management for Demo ---
  // Manage transactions locally to show updates without a real backend
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [categories, setCategories] = useState<Category[]>(mockCategories); // Assuming categories might be dynamic later
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>(mockBudgetGoals); // Assuming goals might be dynamic

  // Recalculate current month data based on the state
  const currentMonth = new Date().getMonth(); // Use actual current month
  const currentYear = new Date().getFullYear(); // Use actual current year

  const currentTransactions = transactions.filter(t =>
    t.date.getFullYear() === currentYear && t.date.getMonth() === currentMonth
  );
  const currentGoals = budgetGoals.filter(g => g.year === currentYear && g.month === currentMonth);
  // --- End State Management ---


  // Calculate current month's income and expenses from state
  const currentIncome = currentTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const currentExpenses = currentTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const netFlow = currentIncome - currentExpenses;

  // Filter categories that have expenses in the current month or have goals
  const relevantCategoryIds = new Set([
      ...currentTransactions.filter(t => t.type === 'expense').map(t => t.categoryId),
      ...currentGoals.map(g => g.categoryId)
  ]);
  const relevantCategories = categories.filter(c => relevantCategoryIds.has(c.id) && c.name !== 'Salary' && c.name !== 'Trading Profits'); // Exclude income category from cards


  // Handler to add a new transaction to the state (for demo)
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transactionWithId = {
      ...newTransaction,
      id: `txn_${Date.now()}_${Math.random().toString(16).slice(2)}` // Simple unique ID generation
    };
    setTransactions(prevTransactions => [...prevTransactions, transactionWithId].sort((a, b) => b.date.getTime() - a.date.getTime()));
    // In a real app, you'd likely refetch data or update cache after a successful server action
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <h1 className="text-xl font-semibold">BudgetFlow Dashboard</h1>
         <div className="flex items-center gap-2">
           <AddIncomeDialog categories={categories} onTransactionAdded={handleAddTransaction} />
           <AddExpenseDialog categories={categories} onTransactionAdded={handleAddTransaction} />
         </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Key Insights Row */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* Income is already dynamic based on transactions state */}
              <div className="text-2xl font-bold text-green-600">+${currentIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netFlow >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                {netFlow >= 0 ? `+$${netFlow.toFixed(2)}` : `-$${Math.abs(netFlow).toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">Income - Expenses this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area with Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[350px]"> {/* Adjusted grid columns and width */}
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            {/* Removed Calendar Tab Trigger */}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="lg:col-span-4 space-y-4">
                 <BudgetGoalsOverview
                    goals={currentGoals}
                    transactions={currentTransactions}
                    categories={categories} // Use state
                 />
                 <TransactionList
                    transactions={transactions} // Show all transactions from state
                    categories={categories} // Use state
                    limit={8}
                  />
                 {/* Moved ExpenseCalendar here */}
                 <ExpenseCalendar transactions={transactions} />
              </div>
              <div className="lg:col-span-3">
                  <SpendingChart
                     transactions={currentTransactions}
                     categories={categories} // Use state
                   />
              </div>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-4">
             <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Category Spending & Budgets</CardTitle>
                    <CardDescription>Detailed view of spending per category against budget goals.</CardDescription>
                </CardHeader>
                 <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {relevantCategories.map((category: Category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      transactions={currentTransactions} // Pass current month's filtered transactions
                      budgetGoal={currentGoals.find(goal => goal.categoryId === category.id)}
                    />
                  ))}
                   {/* Display categories with goals but no spending yet */}
                  {currentGoals
                    .filter(goal => {
                       const category = categories.find(c => c.id === goal.categoryId);
                       // Only show goal-only cards for expense categories
                       if (!category || category.name === 'Salary' || category.name === 'Trading Profits') return false;
                       const hasSpending = currentTransactions.some(t => t.categoryId === goal.categoryId && t.type === 'expense');
                       return !hasSpending;
                     })
                    .map(goal => {
                       const category = categories.find(c => c.id === goal.categoryId);
                       return category ? (
                          <CategoryCard
                              key={`goalonly-${category.id}`}
                              category={category}
                              transactions={[]} // No spending in this category yet
                              budgetGoal={goal}
                          />
                       ) : null;
                   })}
                 </CardContent>
             </Card>
          </TabsContent>

           {/* Removed Calendar Tab Content */}

        </Tabs>
      </main>
    </div>
  );
}

