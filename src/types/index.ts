
import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  // Store the icon name as a string instead of the component
  iconName: keyof typeof import('lucide-react');
  isCustom?: boolean;
  type?: 'income' | 'expense'; // Optional type for better filtering
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  categoryId: string;
  amount: number;
  date: Date;
  description?: string;
}

export interface BudgetGoal {
  id: string;
  categoryId: string;
  amount: number;
  month: number; // e.g., 0 for January, 11 for December
  year: number;
}
