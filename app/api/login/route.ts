import { NextResponse } from "next/server";

const PASSWORD = (process.env.SITE_PASSWORD || "ScrapTracking").trim();

export async function POST(request: Request) {
  const body = await request.json();

  if (body.password === PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("site-auth", PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
