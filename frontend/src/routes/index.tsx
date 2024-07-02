import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import client from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  async function getTotalSpent() {
    const res = await client.api.expenses["total-spent"].$get();
    if (!res.ok) throw new Error("server error");
    const data = await res.json();
    return data;
  }

  const { isPending, data, error } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if (isPending) return "loading";
  if (error) return "An error has occured: " + error.message;

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total spent</CardTitle>
          <CardDescription>The amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>{data.total}</CardContent>
      </Card>
    </>
  );
}
