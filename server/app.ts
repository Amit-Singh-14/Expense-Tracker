import { Hono } from "hono";
import { logger } from "hono/logger";
import { expresesRoute } from "./routes/expenses";
import { serveStatic } from "hono/bun";
const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/expenses", expresesRoute);

app.use("*", serveStatic({ root: "./frontend/dist" }));
app.use("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
//rpc for typesafetly for api end point url and return types
// only exporting the type of api
export type ApiRoute = typeof apiRoutes;
