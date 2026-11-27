import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { GitHubRepository } from "@/lib/repository/github-repository";

const repo = new GitHubRepository();

/** GET /api/admin/auth/check */
export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
