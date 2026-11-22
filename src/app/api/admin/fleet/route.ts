import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { Bus } from "@/types";

export async function GET() {
  try {
    const fleet = await repository.getFleet();
    return NextResponse.json(fleet);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch fleet" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: Bus = await request.json();
    if (!body.name || !body.seatingCapacity) {
      return NextResponse.json(
        { error: "Bus name and seating capacity are required" },
        { status: 400 }
      );
    }

    const newBus: Bus = {
      ...body,
      id: body.id || `bus-${Date.now()}`,
      isActive: body.isActive ?? true,
      driverIncluded: body.driverIncluded ?? true,
    };

    const saved = await repository.saveBus(newBus);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create bus" },
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
    const body: Bus = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "Bus ID is required" },
        { status: 400 }
      );
    }
    const saved = await repository.saveBus(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update bus" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Bus ID is required" },
        { status: 400 }
      );
    }

    const success = await repository.deleteBus(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete bus" },
      { status: 500 }
    );
  }
}
