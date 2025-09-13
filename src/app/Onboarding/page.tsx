"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

/**
 * Full onboarding page with all fields matching ProfileIn Pydantic schema.
 * - Uploads profile/gallery images to explicit endpoints and captures returned hosted URLs.
 * - Uses hosted URLs in createProfile payload (profile_image, gallery_images).
 * - Shows previews using object-contain to avoid cropping.
 */

/* --------------------------- Configuration --------------------------- */
const BACKEND_BASE = "http://localhost:8000";
const UPLOAD_PROFILE_ENDPOINT = `${BACKEND_BASE}/user/profile/upload-profile-image`;
const UPLOAD_GALLERY_ENDPOINT = `${BACKEND_BASE}/user/profile/upload-gallery-image`;
const CREATE_PROFILE_ENDPOINT = `${BACKEND_BASE}/user/createProfile`;
const PROFILE_CHECK_ENDPOINT = `${BACKEND_BASE}/user/myProfile`;

const LOCAL_SAVE_KEY = "onboarding:draft";
const LEGACY_KEYS_TO_CLEAR = ["profileComplete", "userProfile"];

const SALARY_OPTIONS = [
  { label: "Below 1 LPA", value: "below_1l" },
  { label: "1 - 2 LPA", value: "1_2l" },
  { label: "2 - 3 LPA", value: "2_3l" },
  { label: "3 - 5 LPA", value: "3_5l" },
  { label: "5 - 7 LPA", value: "5_7l" },
  { label: "7 - 10 LPA", value: "7_10l" },
  { label: "10 - 15 LPA", value: "10_15l" },
  { label: "15 - 25 LPA", value: "15_25l" },
  { label: "Above 25 LPA", value: "above_25l" },
];

const ALL_INTERESTS = ["Sports", "Tech", "Music", "Travel", "Cooking", "Reading", "Photography", "Fitness", "Art"];

/* ----------------------------- Helpers ------------------------------- */
function getAuthToken(): string | null {
  return localStorage.getItem("authToken") || localStorage.getItem("auth-token") || null;
}

function makeAbsoluteUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) return pathOrUrl;
  try {
    // if it's already absolute, URL constructor won't throw
    new URL(pathOrUrl);
    return pathOrUrl;
  } catch {
    // prefix with backend base
    return `${BACKEND_BASE}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
  }
}

function extractUrlFromUploadResponse(obj: any): string | undefined {
  if (!obj) return undefined;
  return obj.full_url || obj.url || obj.path || obj.location || obj.data?.url || obj.data?.full_url;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

/* --------------------------- Component ------------------------------- */
export default function Onboarding() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // --- Fields (matching ProfileIn) ---
  const [fullName, setFullName] = useState<string>("");
  const [fathersName, setFathersName] = useState<string>("");
  const [mothersName, setMothersName] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [dob, setDob] = useState<string>(""); // date string yyyy-mm-dd
  const [birthPlace, setBirthPlace] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [homeTown, setHomeTown] = useState<string>("");
  const [mamaPariwar, setMamaPariwar] = useState<string>("");
  const [manglik, setManglik] = useState<boolean | null>(null);
  const [height, setHeight] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");
  const [gotra, setGotra] = useState<string>("");
  const [aboutMe, setAboutMe] = useState<string>("");
  const [jobEmployer, setJobEmployer] = useState<string>("");
  const [jobDesignation, setJobDesignation] = useState<string>("");
  const [jobLocation, setJobLocation] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<string>("");

  // contact / optional
  const [email, setEmail] = useState<string>("");

  // profile + gallery local files & previews
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null); // can be local blob or hosted url
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]); // local blobs or hosted urls

  // server-hosted URLs after upload
  const [serverProfileUrl, setServerProfileUrl] = useState<string | null>(null);
  const [serverGalleryUrls, setServerGalleryUrls] = useState<string[]>([]);

  /* ------------------------- Initialization -------------------------- */
  async function checkExistingProfile() {
    const token = getAuthToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const response = await fetch(PROFILE_CHECK_ENDPOINT, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("auth-token");
        router.replace("/login");
        return;
      }

      if (response.ok) {
        const profileData = await response.json().catch(() => null);
        if (profileData && profileData.full_name) {
          localStorage.setItem("profileComplete", "true");
          localStorage.setItem("userProfile", JSON.stringify(profileData));
          router.replace("/Dashboard");
          return;
        }
      }

      setInitializing(false);
    } catch (err) {
      console.error("Error checking existing profile:", err);
      setInitializing(false);
    }
  }

  useEffect(() => {
    // quick local redirect if already completed
    const profileComplete = localStorage.getItem("profileComplete");
    if (profileComplete === "true") {
      router.replace("/Dashboard");
      return;
    }

    checkExistingProfile();

    // clear legacy keys
    try {
      LEGACY_KEYS_TO_CLEAR.forEach((k) => localStorage.removeItem(k));
    } catch {}

    // load draft
    const d = localStorage.getItem(LOCAL_SAVE_KEY);
    if (d) {
      try {
        const parsed = JSON.parse(d);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.fathersName) setFathersName(parsed.fathersName);
        if (parsed.mothersName) setMothersName(parsed.mothersName);
        if (parsed.interests) setInterests(parsed.interests);
        if (parsed.dob) setDob(parsed.dob);
        if (parsed.birthPlace) setBirthPlace(parsed.birthPlace);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.homeTown) setHomeTown(parsed.homeTown);
        if (parsed.mamaPariwar) setMamaPariwar(parsed.mamaPariwar);
        if (parsed.manglik !== undefined) setManglik(parsed.manglik);
        if (parsed.height !== undefined) setHeight(parsed.height);
        if (parsed.age !== undefined) setAge(parsed.age);
        if (parsed.gotra) setGotra(parsed.gotra);
        if (parsed.aboutMe) setAboutMe(parsed.aboutMe);
        if (parsed.jobEmployer) setJobEmployer(parsed.jobEmployer);
        if (parsed.jobDesignation) setJobDesignation(parsed.jobDesignation);
        if (parsed.jobLocation) setJobLocation(parsed.jobLocation);
        if (parsed.salaryRange) setSalaryRange(parsed.salaryRange);
        if (parsed.email) setEmail(parsed.email);
      } catch (e) {
        console.warn("Failed to parse draft", e);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!dob) return;
    const y = computeAgeFromDOB(dob);
    if (!Number.isNaN(y) && typeof y === "number") setAge(y);
  }, [dob]);

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [profilePreview, galleryPreviews]);

  function computeAgeFromDOB(dobStr: string) {
    try {
      const d = new Date(dobStr);
      const diff = Date.now() - d.getTime();
      const ageDt = new Date(diff);
      return Math.abs(ageDt.getUTCFullYear() - 1970);
    } catch {
      return NaN;
    }
  }

  function saveDraft() {
    const d = {
      fullName,
      fathersName,
      mothersName,
      interests,
      dob,
      birthPlace,
      education,
      homeTown,
      mamaPariwar,
      manglik,
      height,
      age,
      gotra,
      aboutMe,
      jobEmployer,
      jobDesignation,
      jobLocation,
      salaryRange,
      email,
    };
    try {
      localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(d));
    } catch (e) {
      console.warn("Could not save draft", e);
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(LOCAL_SAVE_KEY);
    } catch {}
  }

  function toggleInterest(tag: string) {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  /* ------------------------- File handlers --------------------------- */
  function handleProfileFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfileFile(f);
    setProfilePreview(URL.createObjectURL(f));
    setServerProfileUrl(null); // reset server url if new file chosen
  }

  function handleGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    const merged = [...galleryFiles, ...files].slice(0, 12); // cap 12
    galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    setGalleryFiles(merged);
    setGalleryPreviews(merged.map((f) => URL.createObjectURL(f)));
    setServerGalleryUrls([]); // reset server urls if new selection
  }

  function removeGalleryImage(index: number) {
    const newFiles = galleryFiles.filter((_, i) => i !== index);
    const removedPreview = galleryPreviews[index];
    if (removedPreview) URL.revokeObjectURL(removedPreview);
    galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    setGalleryFiles(newFiles);
    setGalleryPreviews(newFiles.map((f) => URL.createObjectURL(f)));
    setServerGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  }

  /* ------------------------ Upload helpers -------------------------- */
  async function uploadFileToEndpoint(file: File, endpoint: string) {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(endpoint, {
      method: "POST",
      body: fd,
      headers: {
        Authorization: `Bearer ${token}`,
      } as Record<string, string>,
    });

    if (res.status === 401 || res.status === 403) {
      throw new Error("unauthenticated");
    }
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Upload failed (${res.status}): ${txt}`);
    }
    return await res.json();
  }

  /* ------------------------- Validation ----------------------------- */
  function validateStep() {
    if (step === 1) {
      if (!fullName.trim()) {
        setMessage("Please enter your full name.");
        return false;
      }
      if (!dob && !age) {
        setMessage("Please provide date of birth or age.");
        return false;
      }
    }
    if (step === 2) {
      if (interests.length === 0) {
        setMessage("Pick at least one interest.");
        return false;
      }
    }
    // further step validations can be added
    setMessage(null);
    return true;
  }

  async function nextStep() {
    if (!validateStep()) return;
    saveDraft();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    setLoading(false);
    setStep((s) => Math.min(4, s + 1));
  }

  function prevStep() {
    setMessage(null);
    setStep((s) => Math.max(1, s - 1));
  }

  /* --------------------- Finish & create profile -------------------- */
  async function finishOnboarding() {
    if (!validateStep()) return;
    setLoading(true);
    setMessage(null);

    try {
      const token = getAuthToken();
      if (!token) {
        saveDraft();
        setMessage("You must verify your phone or login to continue.");
        router.replace("/login");
        setLoading(false);
        return;
      }

      // 1) Upload profile file (if provided)
      let hostedProfileUrl: string | undefined = serverProfileUrl ?? undefined;
      if (profileFile && !hostedProfileUrl) {
        try {
          const j = await uploadFileToEndpoint(profileFile, UPLOAD_PROFILE_ENDPOINT);
          const u = extractUrlFromUploadResponse(j);
          if (u) {
            const absoluteUrl = makeAbsoluteUrl(u);
            if (absoluteUrl) {
              hostedProfileUrl = absoluteUrl;
              setServerProfileUrl(absoluteUrl);
              setProfilePreview(absoluteUrl);
            }
          }
        } catch (err: any) {
          if (err?.message === "unauthenticated") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("auth-token");
            saveDraft();
            router.replace("/login");
            setLoading(false);
            return;
          }
          throw err;
        }
      }

      // 2) Upload gallery files sequentially and collect URLs
      const hostedGallery: string[] = [...serverGalleryUrls]; // start with any already-hosted ones
      for (const f of galleryFiles) {
        // skip files that are already uploaded: we can't know easily so we always upload new selection
        try {
          const j = await uploadFileToEndpoint(f, UPLOAD_GALLERY_ENDPOINT);
          const u = extractUrlFromUploadResponse(j);
          if (u) {
            const absoluteUrl = makeAbsoluteUrl(u);
            if (absoluteUrl) hostedGallery.push(absoluteUrl);
          }
        } catch (err: any) {
          if (err?.message === "unauthenticated") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("auth-token");
            saveDraft();
            router.replace("/login");
            setLoading(false);
            return;
          }
          throw err;
        }
      }
      setServerGalleryUrls(hostedGallery);

      // 3) Build payload for createProfile: use server-hosted URLs for images
      const payload: any = {
        full_name: fullName || undefined,
        fathers_name: fathersName || undefined,
        mothers_name: mothersName || undefined,
        interests: interests.length ? interests : undefined,
        date_of_birth: dob || undefined,
        birth_place: birthPlace || undefined,
        education: education || undefined,
        home_town: homeTown || undefined,
        mama_pariwar: mamaPariwar || undefined,
        manglik: manglik === null ? undefined : manglik,
        height: typeof height === "number" ? height : undefined,
        age: typeof age === "number" ? age : undefined,
        gotra: gotra || undefined,
        profile_image: hostedProfileUrl || undefined, // server URL
        gallery_images: hostedGallery.length ? hostedGallery : undefined,
        job_employer: jobEmployer || undefined,
        job_designation: jobDesignation || undefined,
        job_location: jobLocation || undefined,
        salary_range: salaryRange || undefined,
        about_me: aboutMe || undefined,
        email: email || undefined,
      };

      // 4) POST createProfile
      const createRes = await fetch(CREATE_PROFILE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("createProfile status:", createRes.status);
      if (createRes.status === 401 || createRes.status === 403) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("auth-token");
        saveDraft();
        setMessage("Session expired. Please login again.");
        router.replace("/login");
        setLoading(false);
        return;
      }

      if (!createRes.ok) {
        const txt = await createRes.text().catch(() => "");
        console.error("createProfile error:", createRes.status, txt);
        setMessage("Failed to save profile. Server responded with an error.");
        setLoading(false);
        return;
      }

      // success
      clearDraft();
      try {
        localStorage.setItem("profileComplete", "true");
        localStorage.setItem("userProfile", JSON.stringify(payload));
      } catch {}
      router.replace("/Dashboard");
    } catch (err: any) {
      console.error("finishOnboarding err:", err);
      setMessage(err?.message || "Unexpected error while saving profile.");
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------- UI render ----------------------------- */
  if (initializing) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background py-8 px-4 sm:py-12 sm:px-6">
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-surface rounded-xl sm:rounded-2xl shadow-lg">
          <div className="flex items-center justify-center">
            <div className="text-base sm:text-lg text-[#121212]">Checking profile status...</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-background py-4 px-4 sm:py-8 sm:px-6">
        <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 lg:p-6 bg-surface rounded-xl sm:rounded-2xl shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-2 sm:gap-3">
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-[#121212]">Complete your profile</h1>
              <p className="text-xs sm:text-sm text-[#121212]/70 mt-1">Make your profile discoverable — provide details, upload images.</p>
            </div>
            <div className="text-xs sm:text-sm text-[#121212]/60 self-start sm:self-auto">Step {step} of 4</div>
          </div>

          <div>
            {/* Step 1: Basic & Photo */}
            {step === 1 && (
              <section>
                <label className="block text-sm font-semibold text-[#121212]">Full name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm sm:text-base" />

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Date of birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm sm:text-base" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Age</label>
                    <input type="number" value={age as any} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Age" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm sm:text-base" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Father's name</label>
                    <input value={fathersName} onChange={(e) => setFathersName(e.target.value)} className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm sm:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Mother's name</label>
                    <input value={mothersName} onChange={(e) => setMothersName(e.target.value)} className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm sm:text-base" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#121212]">Profile photo</label>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                        {profilePreview ? (
                          <img src={profilePreview} alt="preview" className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-xs text-[#121212]/60">Upload</span>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleProfileFile} className="hidden" />
                    </label>
                    <div className="text-xs text-[#121212]/70">Recommended: clear headshot (face visible).</div>
                  </div>
                </div>
              </section>
            )}

            {/* Step 2: Identity & Interests */}
            {step === 2 && (
              <section>
                <label className="block text-sm font-semibold text-[#121212]">Gotra</label>
                <input value={gotra} onChange={(e) => setGotra(e.target.value)} placeholder="Gotra / clan name" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm sm:text-base" />

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#121212]">Birth place</label>
                  <input value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="City, State" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm sm:text-base" />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#121212]">Home town</label>
                  <input value={homeTown} onChange={(e) => setHomeTown(e.target.value)} placeholder="City, State" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm sm:text-base" />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#121212]">Mama Pariwar</label>
                  <input value={mamaPariwar} onChange={(e) => setMamaPariwar(e.target.value)} placeholder="Family info" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm sm:text-base" />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#121212]">Manglik</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={() => setManglik(true)} className={`px-3 py-2 rounded-lg border ${manglik === true ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"} text-sm flex-1 sm:flex-none min-w-0`}>Yes</button>
                    <button onClick={() => setManglik(false)} className={`px-3 py-2 rounded-lg border ${manglik === false ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"} text-sm flex-1 sm:flex-none min-w-0`}>No</button>
                    <button onClick={() => setManglik(null)} className={`px-3 py-2 rounded-lg border ${manglik === null ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"} text-sm flex-1 sm:flex-none min-w-0`}>Prefer not to say</button>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#121212]">Interests</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ALL_INTERESTS.map((tag) => (
                      <button key={tag} onClick={() => toggleInterest(tag)} className={`px-3 py-1.5 rounded-full border ${interests.includes(tag) ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"} text-xs sm:text-sm`}>{tag}</button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#121212]">Short bio / About me</label>
                  <textarea value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} rows={3} placeholder="Tell us about yourself" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm resize-none" />
                </div>
              </section>
            )}

            {/* Step 3: Education & Work */}
            {step === 3 && (
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Education</label>
                    <input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. B.Tech, MBA" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Employer</label>
                    <input value={jobEmployer} onChange={(e) => setJobEmployer(e.target.value)} placeholder="Company" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Designation</label>
                    <input value={jobDesignation} onChange={(e) => setJobDesignation(e.target.value)} placeholder="Job title" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Job location</label>
                    <input value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} placeholder="City, State" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Salary range</label>
                    <select value={salaryRange ?? ""} onChange={(e) => setSalaryRange(e.target.value)} className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm">
                      <option value="">Select</option>
                      {SALARY_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Height (cm)</label>
                    <input type="number" value={height ?? ""} onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))} className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Contact email (optional)</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2.5 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white text-sm" />
                  </div>
                </div>
              </section>
            )}

            {/* Step 4: Gallery + Review */}
            {step === 4 && (
              <section>
                <div className="mt-2">
                  <label className="block text-sm font-semibold text-[#121212]">Gallery images (optional)</label>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryFiles} className="mt-2 w-full text-xs sm:text-sm" />
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {galleryPreviews.map((src, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border p-1 bg-white">
                        <img src={src} className="w-full h-24 sm:h-28 object-contain" alt={`gallery-${i}`} />
                        <button onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs hover:bg-white">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <h3 className="text-sm font-semibold">Preview & review</h3>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-[#121212]/70">Name</div>
                      <div className="font-medium">{fullName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#121212]/70">DOB / Age</div>
                      <div className="font-medium">{dob || (age ? `${age} years` : "—")}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#121212]/70">Education</div>
                      <div className="font-medium">{education || "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#121212]/70">Employer</div>
                      <div className="font-medium">{jobEmployer ? `${jobEmployer} • ${jobDesignation || ""}` : "—"}</div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {message && <p className="mt-3 text-xs sm:text-sm text-red-600">{message}</p>}

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-2">
              <button onClick={prevStep} disabled={step === 1 || loading} className="w-full sm:flex-1 rounded-full border border-black/10 py-3 sm:py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors touch-target">Back</button>

              {step < 4 ? (
                <button onClick={nextStep} disabled={loading} className="w-full sm:flex-1 rounded-full bg-[#851E3E] hover:bg-[#6d172f] text-white py-3 sm:py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target">{loading ? "Please wait..." : "Next"}</button>
              ) : (
                <button onClick={finishOnboarding} disabled={loading} className="w-full sm:flex-1 rounded-full bg-[#851E3E] hover:bg-[#6d172f] text-white py-3 sm:py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target">{loading ? "Saving..." : "Finish & Go to Dashboard"}</button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
