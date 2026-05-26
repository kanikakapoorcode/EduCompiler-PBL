import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/login(.*)",
  "/signup(.*)",
]);

const isProtectedRoute = createRouteMatcher([
  "/workspace(.*)",
  "/dashboard(.*)",
  "/history(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return;
  }

  if (isPublicRoute(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Narrow matcher — fewer routes = less dev memory churn
  matcher: ["/workspace(.*)", "/dashboard(.*)", "/history(.*)", "/sign-in(.*)", "/sign-up(.*)"],
};
