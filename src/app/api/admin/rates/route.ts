import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { isAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const data = await repository.getRates();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch rates" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await repository.updateRates(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update rates" },
      { status: 500 }
    );
  }
}
