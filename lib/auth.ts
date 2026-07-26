import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "binge_admin_session";
const encoder = new TextEncoder();

type SessionPayload = {
  role: "admin";
};

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET is not configured.");
  }

  return encoder.encode(secret);
}

export async function verifyAdminPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!hash) {
    throw new Error("ADMIN_PASSWORD_HASH is not configured.");
  }

  return bcrypt.compare(password, hash);
}

export async function createSessionToken() {
  return new SignJWT({ role: "admin" as SessionPayload["role"] })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function readAdminSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await readAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}
