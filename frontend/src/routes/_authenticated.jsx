import { Outlet, createFileRoute } from "@tanstack/react-router";
import { userQueryOptions } from "../../@/lib/api";

const Login = () => {
  return (
    <div>
      <a href="/api/login">Login</a>
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
