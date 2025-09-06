// src/app/api/auth/send/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // { phone }
    // forward to external service
    const res = await fetch("http://localhost:8000/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // pass through success / error
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || "Failed to send OTP" }, { status: res.status });
    }

    // return whatever the external API returns (usually success)
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    return NextResponse.json({ error: "Server error sending OTP" }, { status: 500 });
  }
}
