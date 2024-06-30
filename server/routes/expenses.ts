import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// type Expense = {
//   id: number;
//   title: string;
//   amount: number;
// };

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

const createPostSchema = expenseSchema.omit({ id: true });

type Expense = z.infer<typeof expenseSchema>;

const fakeExpenses: Expense[] = [
  { id: 1, title: "asdasda", amount: 232 },
  { id: 2, title: "xcvxcv", amount: 22 },
];

export const expresesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .post("/", zValidator("json", createPostSchema), (c) => {
    const expense = c.req.valid("json");
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    console.log(fakeExpenses);

    return c.json({ expense });
  })
  .get("/total-spent", (c) => {
    const total = fakeExpenses.reduce((acc, exp) => acc + exp.amount, 0);
    return c.json({ total });
  })

  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const exp = fakeExpenses.find((e) => e.id === id);
    if (!exp) return c.notFound();
    return c.json({ exp });
  })

  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));

    const index = fakeExpenses.findIndex((e) => e.id === id);
    if (index === -1) return c.notFound();

    //splice return an array of deleted item getting the first only
    const deleteExp = fakeExpenses.splice(index, 1)[0];

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
