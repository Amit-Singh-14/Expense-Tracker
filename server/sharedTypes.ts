//@ts-ignore
import { z } from "zod";
import { insertExpenseSchema } from "./db/schema/expenses";

export const createExpenseSchema = insertExpenseSchema.omit({
  userId: true,
  createdAt: true,
  id: true,
});

export const categories = [
  "Food",
  "Transportation",
  "Housing",
  "Entertainment",
  "Health",
  "Other",
] as const;

export type Category = (typeof categories)[number];

export type CreateExpense = z.infer<typeof createExpenseSchema>;
