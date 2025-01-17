import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import client, {
  createNewExpense,
  getAllExpnensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Calendar } from "@/components/ui/calendar";

import { createExpenseSchema } from "../../../../server/sharedTypes";
import { useQueryClient } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
      category: "Other",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      const existingExpenses = await queryClient.ensureQueryData(getAllExpnensesQueryOptions);

      navigate({ to: "/expenses" });

      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, { expense: value });

      try {
        const newExpense = await createNewExpense(value);

        queryClient.setQueryData(getAllExpnensesQueryOptions.queryKey, {
          ...existingExpenses,
          expenses: [newExpense, ...existingExpenses.expenses],
        });
        toast("Expense created", {
          description: `Successfully created new expense: ${newExpense.id}`,
        });
      } catch (error) {
        toast("error", {
          description: "Failed to create new expense",
        });
      } finally {
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {});
      }

      console.log(value);
    },
  });

  return (
    <div className="p-2">
      <h2>Create Expense</h2>

      <form
        className="max-w-2xl flex flex-col gap-y-4 m-auto"
        onSubmit={(e) => {
          e.preventDefault(), e.stopPropagation(), form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Title:</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? <em>{field.state.meta.touchedErrors}</em> : null}
            </div>
          )}
        />

        <form.Field
          name="amount"
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>amount:</Label>
              <Input
                type="number"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? <em>{field.state.meta.touchedErrors}</em> : null}
            </div>
          )}
        />
        <form.Field
          name="category"
          validators={{
            onChange: createExpenseSchema.shape.category,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.category}>category:</Label>
              <RadioGroup
                defaultValue="Other"
                id={field.category}
                name={field.category}
                value={field.state.value}
                onValueChange={(e) => field.handleChange(e)}
                className="flex justify-center"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Food" id="Food" />
                  <Label htmlFor="Food">Food</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Transportation" id="Transportation" />
                  <Label htmlFor="Transportation">Transportation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Housing" id="Housing" />
                  <Label htmlFor="Housing">Housing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Entertainment" id="Entertainment" />
                  <Label htmlFor="Entertainment">Entertainment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Health" id="Health" />
                  <Label htmlFor="Health">Health</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Other" id="Other" />
                  <Label htmlFor="Other">Other</Label>
                </div>
              </RadioGroup>
              {field.state.meta.touchedErrors ? <em>{field.state.meta.touchedErrors}</em> : null}
            </div>
          )}
        />
        <form.Field
          name="date"
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
          children={(field) => (
            <div className="self-center">
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) => field.handleChange((date ?? new Date()).toISOString())}
                className="rounded-md border"
              />
              {field.state.meta.touchedErrors ? <em>{field.state.meta.touchedErrors}</em> : null}
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className="mt-4" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Create Expense"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
