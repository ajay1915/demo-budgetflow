
'use client';

import type React from 'react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Category, Transaction } from '@/types';

const formSchema = z.object({
  description: z.string().min(1, { message: 'Description is required.' }).max(100),
  amount: z.coerce // Use coerce to handle string input from number field
    .number({ invalid_type_error: 'Amount must be a number.' })
    .positive({ message: 'Amount must be positive.' }),
  categoryId: z.string().min(1, { message: 'Category is required.' }),
  date: z.date({ required_error: 'Date is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddIncomeDialogProps {
  categories: Category[];
  onTransactionAdded: (transaction: Omit<Transaction, 'id'>) => void; // Callback for client-side update
}

const AddIncomeDialog: React.FC<AddIncomeDialogProps> = ({ categories, onTransactionAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  // Filter for income categories (e.g., Salary, Trading Profits)
  const incomeCategories = categories.filter(c => c.name === 'Salary' || c.name === 'Trading Profits' || c.type === 'income'); // Added explicit type check

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: '' as unknown as number, // Initialize amount as empty string
      categoryId: '',
      date: new Date(),
    },
  });

  async function onSubmit(values: FormValues) {
    const newTransactionData: Omit<Transaction, 'id'> = {
      ...values,
      type: 'income', // Set type to 'income'
    };

    try {
      onTransactionAdded(newTransactionData);
      console.log('Simulated income added:', newTransactionData);

      form.reset();
      setIsOpen(false);

      toast({
        title: 'Income Added',
        description: `${values.description} of $${values.amount.toFixed(2)}`,
        className: "bg-green-100 border-green-300 text-green-800", // Optional: Success styling
      });
    } catch (error) {
      console.error('Error adding income:', error);
      toast({
        title: 'Error',
        description: 'Failed to add income. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"> {/* Maybe use outline for secondary action */}
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Income</DialogTitle>
          <DialogDescription>
            Enter the details of your income below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Daily Trading Profit, Salary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                     {/* Use type="number" but handle validation with zod coerce, ensure value is never undefined */}
                    <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an income category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {incomeCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
               <DialogClose asChild>
                 <Button type="button" variant="outline">Cancel</Button>
               </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Income'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncomeDialog;
