import { NextRequest, NextResponse } from "next/server";
import { verifySuperAdminKey, AdminUser } from "@/lib/auth";
import { GitHubRepository } from "@/lib/repository/github-repository";

const repo = new GitHubRepository();

function authGuard(request: NextRequest): boolean {
  const key = request.headers.get("x-super-admin-key") ?? "";
  return verifySuperAdminKey(key);
}

/** PUT /api/super-admin/admins/[id] — update an admin */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authGuard(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const admins = await repo.getAdmins();
    const idx = admins.findIndex((a) => a.id === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Admin not found." }, { status: 404 });
    }

    const updated: AdminUser = {
      ...admins[idx],
      ...(body.displayName !== undefined && { displayName: body.displayName }),
      ...(body.password !== undefined && { passwordHash: body.password }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    };

    const newList = admins.map((a, i) => (i === idx ? updated : a));
    await repo.saveAdmins(newList);

    const { passwordHash: _, ...safe } = updated;
    return NextResponse.json(safe);
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}

/** DELETE /api/super-admin/admins/[id] — delete an admin */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authGuard(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const admins = await repo.getAdmins();

    // Prevent deleting the last active admin
    const activeCount = admins.filter((a) => a.isActive).length;
    const target = admins.find((a) => a.id === id);
    if (target?.isActive && activeCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last active admin." },
        { status: 400 }
      );
    }

    const filtered = admins.filter((a) => a.id !== id);
    if (filtered.length === admins.length) {
      return NextResponse.json({ error: "Admin not found." }, { status: 404 });
    }

    await repo.saveAdmins(filtered);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
