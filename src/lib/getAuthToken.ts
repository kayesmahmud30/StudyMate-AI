/**
 * Fetches the current JWT token from the better-auth /api/auth/token endpoint.
 * Used by client components to get a Bearer token for authenticating requests
 * to the Express API. The JWT plugin exposes this at GET /api/auth/token.
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000"}/api/auth/token`,
      { credentials: "include" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.token ?? null;
  } catch {
    return null;
  }
}
