// "use client";
// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function LoginPage() {
//   const [phone, setPhone] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const router = useRouter();
//   const next = useSearchParams().get("next") || "/Onboarding";

//   const phoneRegex = /^\+?[1-9]\d{9,14}$/; // E.164 international format

//   async function sendOtp() {
//     if (!phoneRegex.test(phone)) {
//       setMessage("Please enter a valid phone number (e.g., +919876543210)");
//       return;
//     }

//     setLoading(true);
//     setMessage(null);
//     try {
//       const res = await fetch("http://localhost:8000/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data?.detail || data?.message || "Failed to send OTP");
//       }
//       setOtpSent(true);
//       setMessage("OTP sent. Please check your phone.");
//       if (data.devOtp) setMessage((m) => `${m} (dev OTP: ${data.devOtp})`);
//     } catch (e: any) {
//       setMessage(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function verifyOtp() {
//     if (otp.length !== 6) {
//       setMessage("Please enter a valid 6-digit OTP");
//       return;
//     }

//     setLoading(true);
//     setMessage(null);
//     try {
//       const res = await fetch("http://localhost:8000/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone, code: otp }),
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data?.detail || data?.message || "Verification failed");
//       }
//       if (data.token) localStorage.setItem("auth-token", data.token);
//       router.replace(next);
//     } catch (e: any) {
//       setMessage(e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-[#F7F5F3]  py-12 px-4 sm:px-6">
//       <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-surface rounded-2xl shadow-lg">
//         <h1 className="text-xl sm:text-2xl font-bold text-[#121212] text-center">Login</h1>
//         <p className="text-xs sm:text-sm text-[#121212]/80 text-center mt-1">Login with your phone number</p>

//         {!otpSent ? (
//           <>
//             <label className="block mt-6 text-sm sm:text-base font-semibold text-[#121212]">Phone Number</label>
//             <input
//               type="tel"
//               inputMode="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder="+91 98xxxxxxx"
//               aria-label="Phone number"
//               className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#851E3E] outline-none bg-white"
//             />
//             {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
//             <button
//               onClick={sendOtp}
//               disabled={!phone || loading}
//               className="mt-6 w-full rounded-full bg-[#851E3E] hover:bg-[#6d172f] text-white py-3 font-medium disabled:opacity-60"
//             >
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         ) : (
//           <>
//             <label className="block mt-6 text-sm sm:text-base font-semibold text-[#121212]">Enter OTP</label>
//             <input
//               type="text"
//               inputMode="numeric"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
//               placeholder="6-digit code"
//               maxLength={6}
//               aria-label="OTP code"
//               className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#851E3E] outline-none bg-white tracking-widest text-center"
//             />
//             {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
//             <button
//               onClick={verifyOtp}
//               disabled={!otp || loading}
//               className="mt-6 w-full rounded-full bg-[#851E3E] hover:bg-[#6d172f] text-white py-3 font-medium disabled:opacity-60"
//             >
//               {loading ? "Verifying..." : "Verify & Continue"}
//             </button>

//             <button
//               onClick={() => {
//                 setOtpSent(false);
//                 setOtp("");
//                 setMessage(null);
//               }}
//               className="mt-3 w-full text-sm text-[#121212]/80 underline"
//             >
//               Change phone number
//             </button>
//           </>
//         )}

//         <div className="mt-4 text-center text-[11px] text-[#121212]/60">By continuing you agree to our Terms & Privacy.</div>
//       </div>
//     </main>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const next = nextParam && nextParam.trim() !== "" ? nextParam : "/Onboarding";

  // use env var if provided; fallback to localhost:8000 for dev
  const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000").replace(/\/$/, "");

  // Accept E.164-ish phone numbers (with optional +). Adjust as needed.
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;

  // clear legacy keys on mount so stale state won't redirect user
  useEffect(() => {
    try {
      localStorage.removeItem("profileComplete");
      localStorage.removeItem("userProfile");
      // keep onboarding:draft behavior, but you can also clear if you want a fresh start:
      // localStorage.removeItem("onboarding:draft");
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  async function sendOtp() {
    if (!phoneRegex.test(phone.trim())) {
      setMessage("Please enter a valid phone number (e.g., +919876543210)");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.detail || data?.message || "Failed to send OTP");
      }

      setOtpSent(true);
      // show the OTP for dev flows if server returns it (devOtp)
      if (data?.devOtp) {
        setMessage(`OTP sent. (dev OTP: ${data.devOtp})`);
      } else {
        setMessage("OTP sent. Please check your phone.");
      }
    } catch (e: any) {
      console.error("sendOtp error", e);
      setMessage(e?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (otp.replace(/\D/g, "").length !== 6) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: otp.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.detail || data?.message || "Verification failed");
      }

      // handle many possible shapes: { token, user_id }, {access_token, user}, etc.
      const token = data?.token || data?.access_token || data?.authToken;
      const userId =
        data?.user_id ||
        data?.userId ||
        data?.user?.id ||
        data?.user?._id ||
        data?.user?.user_id ||
        data?.id;

      if (!token) {
        console.warn("verifyOtp: no token returned by server", data);
        // still navigate if server doesn't require token for onboarding, but warn
        router.replace(next);
        return;
      }

      // Save token & userId in localStorage (frontend usage)
      try {
        localStorage.setItem("authToken", token);
        if (userId) localStorage.setItem("userId", String(userId));
      } catch (e) {
        console.warn("failed to write authToken to localStorage", e);
      }

      // DEV helper: set a non-HttpOnly cookie so server-side middleware can read it during dev.
      // IMPORTANT: For production set this cookie server-side with HttpOnly + Secure flags.
      try {
        document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24}; samesite=Lax`;
      } catch (e) {
        // ignore cookie setting issues
      }

      console.log("verifyOtp: success, stored token and userId", { userId });
      router.replace(next);
    } catch (e: any) {
      console.error("verifyOtp error", e);
      setMessage(e?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F7F5F3]  py-12 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-surface rounded-2xl shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold text-[#121212] text-center">Login</h1>
        <p className="text-xs sm:text-sm text-[#121212]/80 text-center mt-1">Login with your phone number</p>

        {!otpSent ? (
          <>
            <label className="block mt-6 text-sm sm:text-base font-semibold text-[#121212]">Phone Number</label>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98xxxxxxx"
              aria-label="Phone number"
              className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#851E3E] outline-none bg-white"
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
            <label className="block mt-6 text-sm sm:text-base font-semibold text-[#121212]">Enter OTP</label>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              placeholder="6-digit code"
              maxLength={6}
              aria-label="OTP code"
              className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#851E3E] outline-none bg-white tracking-widest text-center"
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
                setOtp("");
                setMessage(null);
              }}
              className="mt-3 w-full text-sm text-[#121212]/80 underline"
            >
              Change phone number
            </button>
          </>
        )}

        <div className="mt-4 text-center text-[11px] text-[#121212]/60">By continuing you agree to our Terms & Privacy.</div>
      </div>
    </main>
  );
}
