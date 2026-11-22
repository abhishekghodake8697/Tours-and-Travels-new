import { cookies, headers } from "next/headers";
import { createTokenWeb, verifyTokenWeb } from "./token-utils";

export const ADMIN_COOKIE_NAME = "rw_admin_session";
export const DEFAULT_ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "admin123";

/**
 * Creates a signed session token
 */
export async function createSessionToken(): Promise<string> {
  const timestamp = Date.now().toString();
  return await createTokenWeb(timestamp);
}

/**
 * Validates session token
 */
export async function validateSessionToken(
  token: string | undefined | null
): Promise<boolean> {
  return await verifyTokenWeb(token);
}

/**
 * Verify given password against configured admin password
 */
export function verifyPassword(inputPassword: string): boolean {
  if (!inputPassword) return false;
  const expected = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return inputPassword.trim() === expected.trim();
}

/**
 * Check if current request is authenticated admin (for Server Components & Route Handlers)
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (sessionToken && (await validateSessionToken(sessionToken))) {
      return true;
    }

    const headerStore = await headers();
    const headerToken = headerStore.get("x-admin-token");
    if (headerToken && (await validateSessionToken(headerToken))) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
