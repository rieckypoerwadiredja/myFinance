export type Page = "dashboard" | "transactions" | "upload" | "verify";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  subDescription?: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

export interface SheetTransaction {
  id: string;
  tanggal: string;
  kriteria: string;
  pengeluaran: string;
  note: string;
  pengeluaranNumber: number | null;
}

export type TransactionTrend = "up" | "down" | "flat";

export type TransactionsSummary = {
  totalVolume: number;
  percentChange: number | null;
  trend: TransactionTrend;
  validatedEntries: number;
};

export type TransactionsListResponse = {
  message: string;
  totalCount: number;
  page: number;
  limit: number;
  count: number;
  categories: string[];
  years: number[];
  summary: TransactionsSummary;
  data: SheetTransaction[];
};
