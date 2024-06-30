import app from "./app";

//   port: 8080, // defaults to $BUN_PORT, $PORT, $NODE_PORT otherwise 3000
//   hostname: "mydomain.com", // defaults to "0.0.0.0"
const server = Bun.serve({
  fetch: app.fetch,
});

console.log(`server running on port ${server.port}`);
