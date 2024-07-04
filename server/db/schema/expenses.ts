import { index, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const expense = pgTable(
  "expense",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  // indexing for performace
  (expense) => {
    return {
      userIdIndex: index("user_id").on(expense.userId),
    };
  }
);
