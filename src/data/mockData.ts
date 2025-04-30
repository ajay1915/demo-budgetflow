import type { Category, Transaction, BudgetGoal } from '@/types';
// Remove direct lucide icon imports here as they are no longer stored in the data structure
// import { ShoppingBasket, Home, Car, Ticket, Utensils, Zap, TrendingUp, Tag } from 'lucide-react';

export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Groceries', iconName: 'ShoppingBasket' },
  { id: 'cat2', name: 'Rent/Mortgage', iconName: 'Home' },
  { id: 'cat3', name: 'Transportation', iconName: 'Car' },
  { id: 'cat4', name: 'Entertainment', iconName: 'Ticket' },
  { id: 'cat5', name: 'Dining Out', iconName: 'Utensils' },
  { id: 'cat6', name: 'Utilities', iconName: 'Zap' },
  { id: 'cat7', name: 'Salary', iconName: 'TrendingUp' }, // Example Income Category
  { id: 'cat8', name: 'Miscellaneous', iconName: 'Tag', isCustom: true },
];

export const mockTransactions: Transaction[] = [
  // Income
  { id: 'txn1', type: 'income', categoryId: 'cat7', amount: 3000, date: new Date(2024, 6, 1), description: 'Monthly Salary' }, // July 1st

  // Expenses
  { id: 'txn2', type: 'expense', categoryId: 'cat2', amount: 1200, date: new Date(2024, 6, 1), description: 'Rent' },
  { id: 'txn3', type: 'expense', categoryId: 'cat1', amount: 85.50, date: new Date(2024, 6, 3), description: 'Weekly Groceries' },
  { id: 'txn4', type: 'expense', categoryId: 'cat5', amount: 45.00, date: new Date(2024, 6, 5), description: 'Dinner with friends' },
  { id: 'txn5', type: 'expense', categoryId: 'cat3', amount: 50.00, date: new Date(2024, 6, 7), description: 'Gasoline' },
  { id: 'txn6', type: 'expense', categoryId: 'cat6', amount: 75.20, date: new Date(2024, 6, 10), description: 'Electricity Bill' },
  { id: 'txn7', type: 'expense', categoryId: 'cat4', amount: 30.00, date: new Date(2024, 6, 12), description: 'Movie Tickets' },
  { id: 'txn8', type: 'expense', categoryId: 'cat1', amount: 60.75, date: new Date(2024, 6, 17), description: 'Groceries' },
  { id: 'txn9', type: 'expense', categoryId: 'cat5', amount: 22.50, date: new Date(2024, 6, 19), description: 'Lunch' },
  { id: 'txn10', type: 'expense', categoryId: 'cat3', amount: 25.00, date: new Date(2024, 6, 21), description: 'Bus Fare' },
  { id: 'txn11', type: 'expense', categoryId: 'cat8', amount: 150.00, date: new Date(2024, 6, 25), description: 'New Gadget', },
  { id: 'txn12', type: 'expense', categoryId: 'cat1', amount: 95.00, date: new Date(2024, 6, 28), description: 'Large grocery run' },
];

export const mockBudgetGoals: BudgetGoal[] = [
  { id: 'goal1', categoryId: 'cat1', amount: 400, month: 6, year: 2024 }, // July Goal for Groceries
  { id: 'goal2', categoryId: 'cat5', amount: 150, month: 6, year: 2024 }, // July Goal for Dining Out
  { id: 'goal3', categoryId: 'cat4', amount: 100, month: 6, year: 2024 }, // July Goal for Entertainment
  { id: 'goal4', categoryId: 'cat3', amount: 100, month: 6, year: 2024 }, // July Goal for Transportation
  { id: 'goal5', categoryId: 'cat8', amount: 200, month: 6, year: 2024 }, // July Goal for Miscellaneous
  // Add more goals as needed
];

// Helper function to get current month's data (example for July 2024)
const getCurrentMonthData = (year: number, month: number) => {
  const transactions = mockTransactions.filter(t => t.date.getFullYear() === year && t.date.getMonth() === month);
  const goals = mockBudgetGoals.filter(g => g.year === year && g.month === month);
  return { transactions, goals };
};

export const currentMonthData = getCurrentMonthData(2024, 6); // July
