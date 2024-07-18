import CategoryPieChart from "@/components/CategoryPieChart";
import MontlyExpenseBarGraph from "@/components/MontlyExpenseBarGraph";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="p-2  grid grid-cols-2 gap-2">
      <MontlyExpenseBarGraph />
      <CategoryPieChart />
    </div>
  );
}
