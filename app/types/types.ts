export type Page = 'dashboard' | 'transactions' | 'upload' | 'verify';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  subDescription?: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}
