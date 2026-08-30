// Stage 1, Tier 1: SQLite database initialization, table creation, and seed data.

import * as SQLite from "expo-sqlite";
import { COLORS } from "../constants/theme";

export const db = SQLite.openDatabaseSync("expenses.db");

export function initDatabase(): void {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 0.0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL DEFAULT 'expense',
      category_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      note TEXT,
      date TEXT NOT NULL,
      is_recurring INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories (id),
      FOREIGN KEY (account_id) REFERENCES accounts (id)
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY NOT NULL,
      category_id TEXT UNIQUE NOT NULL,
      monthly_limit REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories (id)
    );

    CREATE TABLE IF NOT EXISTS recurring_rules (
      id TEXT PRIMARY KEY NOT NULL,
      category_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      amount REAL NOT NULL,
      note TEXT,
      frequency TEXT NOT NULL DEFAULT 'monthly',
      day_of_month INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      last_run TEXT,
      FOREIGN KEY (category_id) REFERENCES categories (id),
      FOREIGN KEY (account_id) REFERENCES accounts (id)
    );
  `);

  seedDefaults();
}

function seedDefaults(): void {
  const categoryCount = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM categories;",
  );

  if (!categoryCount || categoryCount.count === 0) {
    const defaultCategories = [
      {
        id: "cat_food",
        name: "Food & Dining",
        icon: "Utensils",
        color: COLORS.categories.food,
      },
      {
        id: "cat_transport",
        name: "Transport",
        icon: "Car",
        color: COLORS.categories.transport,
      },
      {
        id: "cat_bills",
        name: "Bills & Utilities",
        icon: "Zap",
        color: COLORS.categories.bills,
      },
      {
        id: "cat_rent",
        name: "Rent",
        icon: "Home",
        color: COLORS.categories.rent,
      },
      {
        id: "cat_emi",
        name: "EMI & Loans",
        icon: "CreditCard",
        color: COLORS.categories.emi,
      },
      {
        id: "cat_entertainment",
        name: "Entertainment",
        icon: "Film",
        color: COLORS.categories.entertainment,
      },
      {
        id: "cat_health",
        name: "Health & Medical",
        icon: "HeartPulse",
        color: COLORS.categories.health,
      },
      {
        id: "cat_shopping",
        name: "Shopping",
        icon: "ShoppingBag",
        color: COLORS.categories.shopping,
      },
      {
        id: "cat_subscriptions",
        name: "Subscriptions",
        icon: "Repeat",
        color: COLORS.categories.subscriptions,
      },
      {
        id: "cat_misc",
        name: "Miscellaneous",
        icon: "MoreHorizontal",
        color: COLORS.categories.misc,
      },
    ];

    for (const cat of defaultCategories) {
      db.runSync(
        "INSERT INTO categories (id, name, icon, color, is_default) VALUES (?, ?, ?, ?, 1);",
        [cat.id, cat.name, cat.icon, cat.color],
      );
    }
  }

  const accountCount = db.getFirstSync<{ count: number }>(
    "SELECT COUNT(*) as count FROM accounts;",
  );

  if (!accountCount || accountCount.count === 0) {
    const defaultAccounts = [
      { id: "acc_cash", name: "Cash", type: "cash", balance: 0 },
      { id: "acc_bank", name: "Primary Bank", type: "bank", balance: 0 },
      { id: "acc_upi", name: "UPI Account", type: "upi", balance: 0 },
    ];

    for (const acc of defaultAccounts) {
      db.runSync(
        "INSERT INTO accounts (id, name, type, balance, is_active) VALUES (?, ?, ?, ?, 1);",
        [acc.id, acc.name, acc.type, acc.balance],
      );
    }
  }
}
