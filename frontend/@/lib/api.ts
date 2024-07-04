import { hc } from "hono/client";
//ignore the error
//@ts-ignore
import { type ApiRoute } from "../../../server/app";
import { queryOptions } from "@tanstack/react-query";

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
