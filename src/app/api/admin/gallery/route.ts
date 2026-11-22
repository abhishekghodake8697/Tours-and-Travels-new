import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { GalleryItem } from "@/types";

export async function GET() {
  try {
    const gallery = await repository.getGallery();
    return NextResponse.json(gallery);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
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
    const body: GalleryItem = await request.json();
    if (!body.title || !body.destination || !body.image) {
      return NextResponse.json(
        { error: "Title, destination, and image are required" },
        { status: 400 }
      );
    }

    const newItem: GalleryItem = {
      ...body,
      id: body.id || `gal-${Date.now()}`,
    };

    const saved = await repository.saveGalleryItem(newItem);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create gallery item" },
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
    const body: GalleryItem = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }
    const saved = await repository.saveGalleryItem(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update gallery item" },
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
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const success = await repository.deleteGalleryItem(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}
