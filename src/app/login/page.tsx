// src/app/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(""); // Fixed: using 'otp' consistently
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const next = useSearchParams().get("next") || "/Dashboard";

  async function sendOtp() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:8000/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        // FastAPI returns errors in 'detail' field, not 'error'
        throw new Error(data?.detail || data?.message || "Failed to send OTP");
      }
      setOtpSent(true);
      setMessage("OTP sent. Please check your phone.");
      // optional: if external API returns dev OTP in body (for dev), show here for testing
      if (data.devOtp) setMessage((m) => `${m} (dev OTP: ${data.devOtp})`);
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("http://localhost:8000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Fixed: sending 'code' as expected by backend, using 'otp' state variable
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        // FastAPI returns errors in 'detail' field, not 'error'
        throw new Error(data?.detail || data?.message || "Verification failed");
      }
      
      // If verification is successful, you might want to store the token
      if (data.token) {
        // Store token in localStorage or handle it as needed
        localStorage.setItem('auth-token', data.token);
      }
      
      // success — redirect to protected next
      router.replace(next);
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background py-12">
      <div className="w-full max-w-md mx-auto p-6 bg-surface rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-[#121212] text-center">Sign in</h1>
        <p className="text-sm text-[#121212]/80 text-center mt-2">Sign in with your phone number</p>

        {!otpSent ? (
          <>
            <label className="block mt-6 text-sm font-semibold text-[#121212]">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98xxxxxxx"
              className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white"
            />
            {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
            <button
              onClick={sendOtp}
              disabled={!phone || loading}
              className="mt-6 w-full rounded-full bg-[#851E3E] hover:bg-[#6d172f] text-white py-3 font-medium disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <label className="block mt-6 text-sm font-semibold text-[#121212]">Enter OTP</label>
            <input
              type="text"
              value={otp} // Fixed: using 'otp' state variable instead of undefined 'code'
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              maxLength={6} // Added maxLength for better UX
              className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white"
            />
            {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
            <button
              onClick={verifyOtp}
              disabled={!otp || loading}
              className="mt-6 w-full rounded-full bg-[#851E3E] hover:bg-[#6d172f] text-white py-3 font-medium disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setOtp(""); // Clear OTP when going back
                setMessage(null); // Clear any error messages
              }}
              className="mt-3 w-full text-sm text-[#121212]/80 underline"
            >
              Change phone number
            </button>
          </>
        )}
      </div>
    </main>
  );
}