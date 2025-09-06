// src/app/api/auth/verify/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { phone, otp } or { phone, code } depending on your external API
    const res = await fetch("http://localhost:8000/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || "OTP verification failed" }, { status: res.status });
    }

    // expected: external service returns a token or user payload
    // e.g. { token: "..." } or { accessToken: "...", user: {...} }
    const token = data.token ?? data.accessToken ?? null;

    if (token) {
      const c = cookies();
      c.set({
        name: "auth-token",
        value: token,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      // if no token sent, you can still set a cookie with user id or flag depending on API
      // c.set('auth-token', 'ok', { httpOnly: true, maxAge: 60*60*24*7 })
    }

    return NextResponse.json({ ok: true, user: data.user ?? null });
  } catch (err) {
    return NextResponse.json({ error: "Server error verifying OTP" }, { status: 500 });
  }
}
