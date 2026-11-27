import { NextRequest, NextResponse } from "next/server";
import { verifySuperAdminKey, AdminUser } from "@/lib/auth";
import { GitHubRepository } from "@/lib/repository/github-repository";

const repo = new GitHubRepository();

function authGuard(request: NextRequest): boolean {
  const key = request.headers.get("x-super-admin-key") ?? "";
  return verifySuperAdminKey(key);
}

/** GET /api/super-admin/admins — list all admins */
export async function GET(request: NextRequest) {
  if (!authGuard(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admins = await repo.getAdmins();
  // Strip password before returning
  const safe = admins.map(({ passwordHash: _, ...rest }) => rest);
  return NextResponse.json(safe);
}

/** POST /api/super-admin/admins — create a new admin */
export async function POST(request: NextRequest) {
  if (!authGuard(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, password, displayName } = body;

    if (!username || !password || !displayName) {
      return NextResponse.json(
        { error: "username, password and displayName are required." },
        { status: 400 }
      );
    }

    const admins = await repo.getAdmins();
    if (admins.some((a) => a.username.toLowerCase() === username.toLowerCase())) {
      return NextResponse.json(
        { error: "Username already exists." },
        { status: 409 }
      );
    }

    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      username: username.trim(),
      passwordHash: password.trim(), // plain for now — upgrade to bcrypt if needed
      displayName: displayName.trim(),
      role: "admin",
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    await repo.saveAdmins([...admins, newAdmin]);
    const { passwordHash: _, ...safe } = newAdmin;
    return NextResponse.json(safe, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
