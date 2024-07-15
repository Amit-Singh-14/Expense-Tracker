import { Outlet, createFileRoute } from "@tanstack/react-router";
import { userQueryOptions } from "../../@/lib/api";
import { Button } from "../../@/components/ui/button";
const Login = () => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <p>You have to login or register...</p>
      <Button asChild>
        <a href="/api/login">Login</a>
      </Button>
      <Button asChild>
        <a href="/api/register">Register</a>
      </Button>
    </div>
  );
};

const Component = () => {
  const { user } = Route.useRouteContext();

  if (!user) {
    return <Login />;
  }

  return <Outlet />;
};

// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    try {
      const queryClient = context.queryClient;
      const data = await queryClient.fetchQuery(userQueryOptions);
      return data;
    } catch (error) {
      return { user: null };
    }
  },
  component: Component,
});
