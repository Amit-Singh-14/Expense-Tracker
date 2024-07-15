import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

//@ts-ignore
import { createExpenseSchema } from "../sharedTypes";
//@ts-ignore
import { getUser } from "../kinde";
//@ts-ignore
import { db } from "../db";
//@ts-ignore
import { expense as expenseTable, insertExpenseSchema } from "../db/schema/expenses";
import { and, desc, eq, sum } from "drizzle-orm";

// type Expense = {
//   id: number;
//   title: string;
//   amount: number;
// };
// type Expense = z.infer<typeof expenseSchema>;

// const fakeExpenses: Expense[] = [
//   { id: 1, title: "asdasda", amount: "232" },
//   { id: 2, title: "xcvxcv", amount: "22" },
// ];

export const expresesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;

    //dp select from drizzle orm
    const expense = await db
      .select()
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .orderBy(desc(expenseTable.createdAt))
      .limit(20);

    return c.json({ expenses: expense });
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const user = c.var.user;
    const expense = c.req.valid("json");

    const result = await db
      .insert(expenseTable)
      .values({
        ...expense,
        userId: user.id,
      })
      .returning();

    // console.log(fakeExpenses);
    c.status(201);
    return c.json(result);
  })
  .get("/total-spent", getUser, async (c) => {
    const user = c.var.user;

    const result = await db
      .select({ total: sum(expenseTable.amount) })
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .limit(1)
      // return array of object but for safltey
      .then((res) => res[0]);

    // const total = fakeExpenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
    return c.json(result);
  })

  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const user = c.var.user;

    const expense = await db
      .select()
      .from(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .then((res) => res[0]);

    // const exp = fakeExpenses.find((e) => e.id === id);
    if (!expense) return c.notFound();
    return c.json({ expense });
  })

  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const deleteExp = await db
      .delete(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .returning()
      .then((res) => res[0]);

    // const index = fakeExpenses.findIndex((e) => e.id === id);
    // if (index === -1) return c.notFound();

    //splice return an array of deleted item getting the first only
    // const deleteExp = fakeExpenses.splice(index, 1)[0];

    if (!deleteExp) return c.notFound();

    return c.json({ deleteExp });
  });

// export const expresesRoute = new Hono()
//   .post("/", async (c) => {
//     // get data from the user req.body()
//        in node here req.json()
//     // only give error for complie time not runtime
//     // that why using zod
//     const data = await c.req.json();
//     const expense = createPostSchema.parse(data);
//     console.log(expense);

//     return c.json({ expense });
//   });
