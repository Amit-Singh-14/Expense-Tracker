import { hc } from "hono/client";
//ignore the error
import { type ApiRoute } from "../../../server/app";

const client = hc<ApiRoute>("/");

export default client;
