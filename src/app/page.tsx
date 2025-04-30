import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryCard from "@/components/dashboard/CategoryCard";
import SpendingChart from "@/components/dashboard/SpendingChart";
import BudgetGoalsOverview from "@/components/dashboard/BudgetGoalsOverview";
import TransactionList from "@/components/dashboard/TransactionList";
import { mockCategories, mockTransactions, mockBudgetGoals, currentMonthData } from "@/data/mockData";
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { Category } from '@/types';

export default function DashboardPage() {
  // Calculate current month's income and expenses
  const { transactions: currentTransactions, goals: currentGoals } = currentMonthData;
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
  const relevantCategories = mockCategories.filter(c => relevantCategoryIds.has(c.id) && c.name !== 'Salary'); // Exclude income category from cards


  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <h1 className="text-xl font-semibold">BudgetFlow Dashboard</h1>
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
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="lg:col-span-4 space-y-4">
                 <BudgetGoalsOverview
                    goals={currentGoals}
                    transactions={currentTransactions}
                    categories={mockCategories}
                 />
                 <TransactionList
                    transactions={mockTransactions} // Show all transactions in the list for recency
                    categories={mockCategories}
                    limit={8}
                  />
              </div>
              <div className="lg:col-span-3">
                  <SpendingChart
                     transactions={currentTransactions}
                     categories={mockCategories}
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
                      transactions={currentTransactions}
                      budgetGoal={currentGoals.find(goal => goal.categoryId === category.id)}
                    />
                  ))}
                   {/* Display categories with goals but no spending yet */}
                  {currentGoals
                    .filter(goal => !relevantCategoryIds.has(goal.categoryId))
                    .map(goal => {
                       const category = mockCategories.find(c => c.id === goal.categoryId);
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
        </Tabs>
      </main>
    </div>
  );
}
