import client, {
  deleteExpense,
  getAllExpnensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash, Utensils, House, Car, Video, Hospital, ClipboardPenLine } from "lucide-react";
import { Category } from "../../../../server/sharedTypes";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

function Expenses() {
  const { isPending, data, error } = useQuery(getAllExpnensesQueryOptions);
  const { data: loadingCreateExpense } = useQuery(loadingCreateExpenseQueryOptions);

  if (error) return "" + error.message;

  const setIcon = (item: Category) => {
    const categoryIcons = {
      Food: <Utensils />,
      Transportation: <Car />,
      Housing: <House />,
      Entertainment: <Video />,
      Health: <Hospital />,
      Other: <ClipboardPenLine />,
    };

    return categoryIcons[item];
  };

  return (
    <div className="p-2 max-w-3xl m-auto">
      <Table>
        <TableCaption>A list of all the expenses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>

        {isPending ? (
          <TableBody>
            {Array(5)
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
                  <TableCell>
                    <Skeleton className="h-4 " />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        ) : (
          <TableBody>
            {loadingCreateExpense?.expense && (
              <TableRow>
                <TableCell className="font-medium">
                  <Skeleton className="h-4 " />
                </TableCell>
                <TableCell>{loadingCreateExpense.expense.title}</TableCell>
                <TableCell>{loadingCreateExpense.expense.amount}</TableCell>
                <TableCell>{loadingCreateExpense.expense.date.split("T")[0]}</TableCell>
                <TableCell>{loadingCreateExpense.expense.category}</TableCell>
                <TableCell>
                  <Skeleton className="h-4 " />
                </TableCell>
              </TableRow>
            )}
            {data?.expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell>{expense.amount}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{setIcon(expense.category)}</TableCell>
                <TableCell>
                  <ExpenseDeleteButton id={expense.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
}

function ExpenseDeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast("Error", {
        description: `Failed to delete expense: ${id}`,
      });
    },
    onSuccess: () => {
      toast("Expense Deleted", {
        description: `Successfully deleted espense: ${id}`,
      });
      queryClient.setQueryData(getAllExpnensesQueryOptions.queryKey, (existingExpenses) => ({
        ...existingExpenses,
        expenses: existingExpenses!.expenses.filter((ex) => ex.id !== id),
      }));
    },
  });

  return (
    <Button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ id })}
      variant="outline"
      size="icon"
    >
      {mutation.isPending ? "..." : <Trash className="h-4 w-4" />}
    </Button>
  );
}
