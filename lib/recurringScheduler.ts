// Stage 5, Tier 1: Background evaluation logic for scheduled/recurring expense generation.

import { RecurringRule } from "../types/database";
import { db } from "./db";

export function processDueRecurringTransactions(): number {
  try {
    const today = new Date();
    const currentYearMonth = today.toISOString().substring(0, 7); // e.g. "2026-08"
    const currentDay = today.getDate();

    const activeRules = db.getAllSync<RecurringRule>(
      "SELECT * FROM recurring_rules WHERE is_active = 1;",
    );

    let generatedCount = 0;

    for (const rule of activeRules) {
      // Check if due day has been reached this month
      const isDueDay = currentDay >= rule.day_of_month;
      // Check if already executed in the current calendar month
      const alreadyRanThisMonth =
        rule.last_run && rule.last_run.substring(0, 7) === currentYearMonth;

      if (isDueDay && !alreadyRanThisMonth) {
        const txId = `tx_rec_${rule.id}_${currentYearMonth}`;
        const scheduledDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          rule.day_of_month,
          9,
          0,
          0,
        ).toISOString();

        // 1. Insert auto-generated transaction
        db.runSync(
          `INSERT INTO transactions (id, amount, type, category_id, account_id, note, date, is_recurring)
           VALUES (?, ?, 'expense', ?, ?, ?, ?, 1);`,
          [
            txId,
            rule.amount,
            rule.category_id,
            rule.account_id,
            rule.note ? `[Recurring] ${rule.note}` : "[Recurring]",
            scheduledDate,
          ],
        );

        // 2. Update account balance
        db.runSync("UPDATE accounts SET balance = balance - ? WHERE id = ?;", [
          rule.amount,
          rule.account_id,
        ]);

        // 3. Mark rule as processed for this month
        db.runSync("UPDATE recurring_rules SET last_run = ? WHERE id = ?;", [
          today.toISOString(),
          rule.id,
        ]);

        generatedCount++;
      }
    }

    return generatedCount;
  } catch (error) {
    console.error("Failed to process recurring transactions:", error);
    return 0;
  }
}
