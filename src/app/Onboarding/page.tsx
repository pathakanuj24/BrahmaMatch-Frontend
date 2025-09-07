"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

/**
 * src/app/onboarding/page.tsx
 * - Full onboarding page
 * - Clears stale localStorage keys on first mount: profileComplete, userProfile, onboarding:draft
 * - Saves a fresh draft while user moves through steps
 * - Uploads images (with DataURL fallback) and posts profile with Authorization header
 */

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

const ALL_INTERESTS = ["Sports", "Tech", "Music", "Travel", "Cooking", "Reading"];
const LOCAL_SAVE_KEY = "onboarding:draft";
const LEGACY_KEYS_TO_CLEAR = ["profileComplete", "userProfile", "onboarding:draft"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // --- form state ---
  const [fullName, setFullName] = useState<string>("Anuj Pathak");
  const [dob, setDob] = useState<string>("");
  const [age, setAge] = useState<number | "">(27);
  const [email, setEmail] = useState<string>("");
  const [fathersName, setFathersName] = useState<string>("");
  const [mothersName, setMothersName] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("single");
  const [motherTongue, setMotherTongue] = useState<string>("Hindi");
  const [interests, setInterests] = useState<string[]>(["Tech"]);
  const [bio, setBio] = useState<string>("");

  // more details
  const [birthPlace, setBirthPlace] = useState<string>("");
  const [homeTown, setHomeTown] = useState<string>("");
  const [gotra, setGotra] = useState<string>("");
  const [mamaPariwar, setMamaPariwar] = useState<string>("");
  const [manglik, setManglik] = useState<boolean | null>(null);
  const [education, setEducation] = useState<string>("");
  const [jobEmployer, setJobEmployer] = useState<string>("");
  const [jobDesignation, setJobDesignation] = useState<string>("");
  const [jobLocation, setJobLocation] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<string>("7_10l");
  const [height, setHeight] = useState<number | "">(175);

  // profile + gallery files & previews
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // On first mount: clear legacy / stale keys, then try to load any (new) draft
  useEffect(() => {
    // remove legacy keys that might have been set incorrectly
    try {
      LEGACY_KEYS_TO_CLEAR.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      // ignore storage errors
    }

    // Load draft if present (fresh start after clearing legacy keys)
    const draft = localStorage.getItem(LOCAL_SAVE_KEY);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        if (data.fullName) setFullName(data.fullName);
        if (data.dob) setDob(data.dob);
        if (data.age !== undefined) setAge(data.age);
        if (data.email) setEmail(data.email);
        if (data.fathersName) setFathersName(data.fathersName);
        if (data.mothersName) setMothersName(data.mothersName);
        if (data.gender) setGender(data.gender);
        if (data.interests) setInterests(data.interests);
        if (data.bio) setBio(data.bio);
        if (data.education) setEducation(data.education);
        if (data.jobEmployer) setJobEmployer(data.jobEmployer);
        if (data.jobDesignation) setJobDesignation(data.jobDesignation);
        if (data.jobLocation) setJobLocation(data.jobLocation);
        if (data.salaryRange) setSalaryRange(data.salaryRange);
        if (data.height !== undefined) setHeight(data.height);
      } catch (e) {
        console.warn("Failed to parse draft", e);
      }
    }

    // do NOT auto-redirect here — we intentionally cleared profileComplete above
  }, []);

  useEffect(() => {
    if (dob) {
      const y = computeAgeFromDOB(dob);
      if (!isNaN(y)) setAge(y);
    }
  }, [dob]);

  // revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [profilePreview, galleryPreviews]);

  function saveDraft() {
    const d = {
      fullName,
      dob,
      age,
      email,
      fathersName,
      mothersName,
      gender,
      interests,
      bio,
      education,
      jobEmployer,
      jobDesignation,
      jobLocation,
      salaryRange,
      height,
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
    } catch (e) {
      /* ignore */
    }
  }

  function toggleInterest(tag: string) {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  function validateStep() {
    if (step === 1) {
      if (!fullName.trim()) {
        setMessage("Please enter your full name.");
        return false;
      }
    }
    if (step === 2) {
      if (!gender) {
        setMessage("Please select your gender.");
        return false;
      }
      if (interests.length === 0) {
        setMessage("Pick at least one interest.");
        return false;
      }
    }
    setMessage(null);
    return true;
  }

  async function nextStep() {
    if (!validateStep()) return;
    saveDraft();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    setLoading(false);
    setStep((s) => Math.min(3, s + 1));
  }

  function prevStep() {
    setMessage(null);
    setStep((s) => Math.max(1, s - 1));
  }

  function handleProfileFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfileFile(f);
    const url = URL.createObjectURL(f);
    setProfilePreview(url);
  }

  function handleGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    const merged = [...galleryFiles, ...files].slice(0, 12); // cap 12
    setGalleryFiles(merged);
    galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    const previews = merged.map((f) => URL.createObjectURL(f));
    setGalleryPreviews(previews);
  }

  function removeGalleryImage(index: number) {
    const newFiles = galleryFiles.filter((_, i) => i !== index);
    const removed = galleryPreviews[index];
    if (removed) URL.revokeObjectURL(removed);
    // revoke all old previews (they will be recreated)
    galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setGalleryFiles(newFiles);
    setGalleryPreviews(newPreviews);
  }

  function computeAgeFromDOB(dobStr: string) {
    try {
      const d = new Date(dobStr);
      const diff = Date.now() - d.getTime();
      const ageDt = new Date(diff);
      return Math.abs(ageDt.getUTCFullYear() - 1970);
    } catch (e) {
      return NaN;
    }
  }

  function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  async function tryUploadFile(file: File): Promise<string> {
    // Try upload with auth header if present. Fallback to DataURL.
    const uploadEndpoint = "/user/uploadImage";
    const authToken = localStorage.getItem("authToken");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(uploadEndpoint, {
        method: "POST",
        body: fd,
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      });
      if (res.ok) {
        const j = await res.json();
        if (j.url) return j.url;
        if (j.data?.url) return j.data.url;
        if (typeof j === "string") return j;
      } else {
        if (res.status === 401 || res.status === 403) {
          throw new Error("unauthenticated");
        }
      }
    } catch (e) {
      console.warn("upload endpoint failed; falling back to DataURL", e);
    }
    return await readFileAsDataURL(file);
  }

  async function finishOnboarding() {
    if (!validateStep()) return;
    setLoading(true);
    setMessage(null);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        // save draft and send user to login/verification
        saveDraft();
        setMessage("You must verify your phone or login to continue.");
        router.replace("/login");
        setLoading(false);
        return;
      }

      // upload profile image + gallery (if any)
      let profile_image_url: string | undefined;
      if (profileFile) {
        try {
          profile_image_url = await tryUploadFile(profileFile);
        } catch (err: any) {
          if (err?.message === "unauthenticated") {
            localStorage.removeItem("authToken");
            saveDraft();
            router.replace("/login");
            setLoading(false);
            return;
          }
          throw err;
        }
      }

      const gallery_urls: string[] = [];
      for (const f of galleryFiles) {
        try {
          const u = await tryUploadFile(f);
          gallery_urls.push(u);
        } catch (err: any) {
          if (err?.message === "unauthenticated") {
            localStorage.removeItem("authToken");
            saveDraft();
            router.replace("/login");
            setLoading(false);
            return;
          }
          throw err;
        }
      }

      // build payload matching your backend schema
      const payload: any = {
        user_id: localStorage.getItem("userId") || undefined,
        full_name: fullName,
        email: email || undefined,
        fathers_name: fathersName || undefined,
        mothers_name: mothersName || undefined,
        gender: gender?.toLowerCase() || undefined,
        marital_status: maritalStatus || undefined,
        mother_tongue: motherTongue || undefined,
        interests,
        about_me: bio || undefined,
        date_of_birth: dob || undefined,
        age: typeof age === "number" ? age : undefined,
        birth_place: birthPlace || undefined,
        home_town: homeTown || undefined,
        gotra: gotra || undefined,
        mama_pariwar: mamaPariwar || undefined,
        manglik: manglik === null ? undefined : manglik,
        education: education || undefined,
        job_employer: jobEmployer || undefined,
        job_designation: jobDesignation || undefined,
        job_location: jobLocation || undefined,
        salary_range: salaryRange || undefined,
        height: typeof height === "number" ? height : undefined,
      };

      if (profile_image_url) payload.profile_image_url = profile_image_url;
      if (gallery_urls.length) payload.gallery_images = gallery_urls;

      const res = await fetch("/user/createProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });

      // debugging logs
      console.log("createProfile status:", res.status);
      const resText = await res.text();
      console.log("createProfile body:", resText);

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("authToken");
        saveDraft();
        setMessage("Session expired. Please login again.");
        router.replace("/login");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setMessage("Failed to save profile. Server responded with error.");
        setLoading(false);
        return;
      }

      // success
      clearDraft();
      try {
        localStorage.setItem("profileComplete", "true");
        localStorage.setItem("userProfile", JSON.stringify(payload));
      } catch (e) {
        // ignore storage errors
      }
      console.log("createProfile succeeded — redirecting to /dashboard");
      router.replace("/dashboard");
    } catch (err: any) {
      console.error(err);
      setMessage("Unexpected error while saving profile. See console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6">
        <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-surface rounded-2xl shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-[#121212]">Welcome, {fullName || "friend"} 👋</h1>
              <p className="text-sm text-[#121212]/70 mt-1">Finish these 3 quick steps to complete your profile and get matched.</p>
              <ul className="mt-3 text-xs text-[#121212]/70 space-y-1">
                <li>• Create a searchable profile — visible to compatible matches</li>
                <li>• Upload a clear profile photo and a few gallery shots</li>
                <li>• Keep sensitive info private — share only what you want</li>
              </ul>
            </div>
            <div className="text-sm text-[#121212]/60">Step {step} of 3</div>
          </div>

          <div className="mt-4">
            {step === 1 && (
              <section>
                <label className="block text-sm font-semibold text-[#121212]">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white"
                />

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Date of birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Age</label>
                    <input
                      type="number"
                      value={age as any}
                      onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="Age"
                      className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#121212]">Profile photo</label>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                        {profilePreview ? (
                          <img src={profilePreview} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-[#121212]/60">Upload</span>
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleProfileFile} className="hidden" />
                    </label>
                    <div className="text-xs text-[#121212]/70">Upload a clear headshot (recommended).</div>
                  </div>
                </div>
              </section>
            )}

            {step === 2 && (
              <section>
                <label className="block text-sm font-semibold text-[#121212]">Gender</label>
                <div className="mt-2 flex gap-3">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`px-3 py-2 rounded-lg border ${gender === g ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"} text-sm`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <label className="block mt-4 text-sm font-semibold text-[#121212]">Interests</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL_INTERESTS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleInterest(tag)}
                      className={`px-3 py-2 rounded-full border ${interests.includes(tag) ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"} text-sm`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <label className="block mt-4 text-sm font-semibold text-[#121212]">Short bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell us a little about yourself"
                  className="mt-2 w-full rounded-md border border-black/10 px-3 py-2 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white"
                />
              </section>
            )}

            {step === 3 && (
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Education</label>
                    <input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. B.Tech" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Employer</label>
                    <input value={jobEmployer} onChange={(e) => setJobEmployer(e.target.value)} placeholder="Company" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Designation</label>
                    <input value={jobDesignation} onChange={(e) => setJobDesignation(e.target.value)} placeholder="Job title" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Job location</label>
                    <input value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} placeholder="City, State" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Salary range</label>
                    <select value={salaryRange ?? ""} onChange={(e) => setSalaryRange(e.target.value)} className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white">
                      {SALARY_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Height (cm)</label>
                    <input type="number" value={height ?? ""} onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))} className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Manglik</label>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => setManglik(true)} className={`px-3 py-2 rounded-lg border ${manglik === true ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"}`}>Yes</button>
                      <button onClick={() => setManglik(false)} className={`px-3 py-2 rounded-lg border ${manglik === false ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"}`}>No</button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#121212]">Gallery images (optional)</label>
                  <input type="file" accept="image/*" multiple onChange={handleGalleryFiles} className="mt-2" />
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {galleryPreviews.map((src, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border">
                        <img src={src} className="w-full h-28 object-cover" />
                        <button onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>

              </section>
            )}

            {message && <p className="mt-3 text-sm text-red-600">{message}</p>}

            <div className="mt-6 flex items-center justify-between gap-2">
              <button onClick={prevStep} disabled={step === 1 || loading} className="flex-1 rounded-full border border-black/10 py-2 text-sm disabled:opacity-50">Back</button>

              {step < 3 ? (
                <button onClick={nextStep} disabled={loading} className="flex-1 rounded-full bg-[#851E3E] hover:bg-[#6d172f] text-white py-2 text-sm">{loading ? "Please wait..." : "Next"}</button>
              ) : (
                <button onClick={finishOnboarding} disabled={loading} className="flex-1 rounded-full bg-[#851E3E] hover:bg-[#6d172f] text-white py-2 text-sm">{loading ? "Saving..." : "Finish & Go to Dashboard"}</button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
