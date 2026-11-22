import { NextResponse } from "next/server";
import { verifyPassword, createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { error: "Invalid admin password. Please try again." },
        { status: 401 }
      );
    }

    const token = await createSessionToken();
    const response = NextResponse.json({
      success: true,
      token,
      message: "Admin authentication successful",
    });

    const isHttps = request.url.startsWith("https://");

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
