import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { ServiceItem } from "@/types";

export async function GET() {
  try {
    const services = await repository.getServices();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
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
    const body: ServiceItem = await request.json();
    if (!body.title || !body.shortDescription) {
      return NextResponse.json(
        { error: "Title and short description are required" },
        { status: 400 }
      );
    }

    const newService: ServiceItem = {
      ...body,
      id: body.id || `service-${Date.now()}`,
      slug:
        body.slug ||
        body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      highlights: body.highlights || [],
    };

    const saved = await repository.saveService(newService);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create service" },
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
    const body: ServiceItem = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }
    const saved = await repository.saveService(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update service" },
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
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const success = await repository.deleteService(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
