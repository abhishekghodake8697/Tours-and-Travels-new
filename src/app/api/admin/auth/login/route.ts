import { NextResponse } from "next/server";
import { verifyCredentials, createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const admin = await verifyCredentials(username, password);
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid username or password. Please try again." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(admin.username);
    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      displayName: admin.displayName,
    });

    const isHttps = request.url.startsWith("https://");

    // No maxAge → session cookie: cleared when browser closes
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
      // maxAge intentionally omitted → browser session cookie
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error", detail: String(error) },
      { status: 500 }
    );
  }
}
