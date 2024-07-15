import client from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
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

function Expenses() {
  const { isPending, data, error } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpense,
  });

  if (error) return "" + error.message;

  return (
    <div className="p-2 max-w-3xl m-auto">
      <Table>
        <TableCaption>A list of all the expenses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">id</TableHead>
            <TableHead>title</TableHead>
            <TableHead>amount</TableHead>
            <TableHead>date</TableHead>
          </TableRow>
        </TableHeader>

        {isPending ? (
          <TableBody>
            {Array(4)
              .fill(0)
              .map((_, id) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 " />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 " />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 " />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 " />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        ) : (
          <TableBody>
            {data?.expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  );
}
