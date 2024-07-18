import {
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const categories = ["Food", "Transportation", "Housing", "Entertainment", "Health", "Other"];
export const categoryEnum = pgEnum("category", categories);

export const expense = pgTable(
  "expense",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    date: date("date").notNull(),
    category: categoryEnum("category").notNull().default("Other"),
  },
  // indexing for performace
  (expense) => {
    return {
      userIdIndex: index("user_id").on(expense.userId),
    };
  }
);

export const insertExpenseSchema = createInsertSchema(expense, {
  title: z.string().min(3, { message: "Title must be atleast of 3 characters." }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: "Amount must be valid monetary value." }),
  category: z.enum(categories, {
    message: "can only select from the given options.",
  }),
});
export const selectExpenseSchema = createSelectSchema(expense);
