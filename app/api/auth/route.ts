import { NextResponse } from "next/server";

import {
  createSessionToken,
  getSessionCookieName,
  readAdminSession,
  verifyAdminPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function GET() {
  const session = await readAdminSession();

  return NextResponse.json({ authenticated: Boolean(session) });
}

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const valid = await verifyAdminPassword(body.password);

    if (!valid) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ authenticated: true });
    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to log in." },
      { status: 400 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.delete(getSessionCookieName());
  return response;
}
