import { cookies, headers } from "next/headers";
import { createTokenWeb, verifyTokenWeb } from "./token-utils";
import { GitHubRepository } from "./repository/github-repository";

export const ADMIN_COOKIE_NAME = "rw_admin_session";

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  displayName: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

/**
 * Creates a signed session token containing the admin username
 */
export async function createSessionToken(username: string): Promise<string> {
  const payload = `${Date.now()}:${username}`;
  return await createTokenWeb(payload);
}

/**
 * Validates session token - returns username if valid, null otherwise
 */
export async function validateSessionToken(
  token: string | undefined | null
): Promise<string | null> {
  return await verifyTokenWeb(token);
}

/**
 * Verify username + password against stored admins
 * Returns the AdminUser on success, null on failure
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<AdminUser | null> {
  if (!username || !password) return null;

  try {
    const repo = new GitHubRepository();
    const admins = await repo.getAdmins();
    const admin = admins.find(
      (a) =>
        a.isActive &&
        a.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        a.passwordHash === password.trim()
    );
    return admin ?? null;
  } catch {
    return null;
  }
}

/**
 * Check if current request is authenticated admin
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

/** SUPER ADMIN key — stored in env, never in the repo */
export function getSuperAdminKey(): string {
  return process.env.SUPER_ADMIN_KEY ?? "super-secret-change-me";
}

export function verifySuperAdminKey(key: string): boolean {
  if (!key) return false;
  return key.trim() === getSuperAdminKey();
}
