import { Hono } from "hono";
import { getUser, kindeClient, sessionManager } from "../kinde";

export const authRoute = new Hono()
  .get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    console.log(loginUrl);

    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })

  .get("/callback", async (c) => {
    // Handling OAuth Flow: This endpoint is crucial in the OAuth flow. When a user authenticates with Kinde, they are redirected back to this endpoint with an authorization code.
    // Processing Authorization Code: The handleRedirectToApp method processes this code, exchanges it for an access token, and establishes a user session.
    const url = new URL(c.req.url);
    await kindeClient.handleRedirectToApp(sessionManager(c), url);

    return c.redirect("/");
  })
  .get("/logout", async (c) => {
    const logoutURL = await kindeClient.logout(sessionManager(c));
    console.log(logoutURL);

    return c.redirect(logoutURL.toString());
  })
  .get("/me", getUser, async (c) => {
    const user = c.var.user;
    return c.json({ user });
  });
