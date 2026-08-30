// Stage 1, Tier 1: Database entity types and interfaces for SQLite models.

export type AccountType = "cash" | "bank" | "card" | "upi";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  is_active: number; // 1 = active, 0 = hidden
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name string
  color: string; // Hex color from theme
  is_default: number; // 1 = system default, 0 = custom user category
  created_at: string;
}

export type TransactionType = "expense" | "income" | "transfer";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category_id: string;
  account_id: string;
  note: string | null;
  date: string; // ISO 8601 string (YYYY-MM-DDTHH:mm:ss.sssZ)
  is_recurring: number; // 1 = generated from recurring rule
  created_at: string;
}

export interface Budget {
  id: string;
  category_id: string;
  monthly_limit: number;
  created_at: string;
}

export interface RecurringRule {
  id: string;
  category_id: string;
  account_id: string;
  amount: number;
  note: string | null;
  frequency: "monthly" | "weekly";
  day_of_month: number; // 1-31
  is_active: number;
  last_run: string | null;
}
