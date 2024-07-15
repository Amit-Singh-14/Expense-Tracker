import { hc } from "hono/client";
//ignore the error
//@ts-ignore
import { type ApiRoute } from "../../../server/app";
import { queryOptions } from "@tanstack/react-query";
import { type CreateExpense } from "../../../server/sharedTypes";

const client = hc<ApiRoute>("/");

export default client;

async function getUserProfile() {
  const res = await client.api.me.$get();
  if (!res.ok) {
    throw new Error("error at getting user Profile.");
  }
  const data = await res.json();
  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-user-profile"],
  queryFn: getUserProfile,
  staleTime: Infinity,
});

export const getAllExpnensesQueryOptions = queryOptions({
  queryKey: ["get-all-expenses"],
  queryFn: getAllExpense,
  staleTime: 1000 * 60 * 5,
});
async function getAllExpense() {
  // await new Promise((r) => setTimeout(r, 3000));
  const res = await client.api.expenses.$get();
  if (!res.ok) {
    throw new Error("get all expneses error");
  }
  const data = await res.json();
  return data;
}

export async function createNewExpense(value: CreateExpense) {
  await new Promise((r) => setTimeout(r, 3000));

  const res = await client.api.expenses.$post({ json: value });
  if (!res.ok) throw new Error("crating expnese error");
  const newExpense = await res.json();
  return newExpense;
}

export const loadingCreateExpenseQueryOptions = queryOptions<{
  expense?: CreateExpense;
}>({
  queryKey: ["loading-create-expense"],
  queryFn: async () => {
    return {};
  },
  staleTime: Infinity,
});

export async function deleteExpense({ id }: { id: number }) {
  const res = await client.api.expenses[":id{[0-9]+}"].$delete({ param: { id: id.toString() } });

  if (!res.ok) {
    throw new Error("server Erorr");
  }
}
