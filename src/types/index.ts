import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>; // Allow Lucide icons or custom SVGs
  isCustom?: boolean;
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
