// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbar";

// /**
//  * Onboarding page (client)
//  * - Uses absolute backend URLs (no Next rewrites)
//  * - Uploads files to http://localhost:8000/user/profile/upload-image?image_type=...
//  * - Posts profile metadata to http://localhost:8000/user/createProfile
//  */

// const BACKEND_BASE = "http://localhost:8000"; // <- change if your backend runs elsewhere
// const UPLOAD_ENDPOINT = `${BACKEND_BASE}/user/profile/upload-image`;
// const CREATE_PROFILE_ENDPOINT = `${BACKEND_BASE}/user/createProfile`;

// const LOCAL_SAVE_KEY = "onboarding:draft";
// const LEGACY_KEYS_TO_CLEAR = ["profileComplete", "userProfile"];

// const SALARY_OPTIONS = [
//   { label: "Below 1 LPA", value: "below_1l" },
//   { label: "1 - 2 LPA", value: "1_2l" },
//   { label: "2 - 3 LPA", value: "2_3l" },
//   { label: "3 - 5 LPA", value: "3_5l" },
//   { label: "5 - 7 LPA", value: "5_7l" },
//   { label: "7 - 10 LPA", value: "7_10l" },
//   { label: "10 - 15 LPA", value: "10_15l" },
//   { label: "15 - 25 LPA", value: "15_25l" },
//   { label: "Above 25 LPA", value: "above_25l" },
// ];

// const ALL_INTERESTS = ["Sports", "Tech", "Music", "Travel", "Cooking", "Reading"];

// export default function Onboarding() {
//   const router = useRouter();

//   const [step, setStep] = useState<number>(1);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);

//   // form state (generic)
//   const [fullName, setFullName] = useState<string>("");
//   const [dob, setDob] = useState<string>("");
//   const [age, setAge] = useState<number | "">("");
//   const [email, setEmail] = useState<string>("");

//   const [fathersName, setFathersName] = useState<string>("");
//   const [mothersName, setMothersName] = useState<string>("");

//   const [gender, setGender] = useState<string>("");
//   const [maritalStatus, setMaritalStatus] = useState<string>("");
//   const [motherTongue, setMotherTongue] = useState<string>("");

//   const [interests, setInterests] = useState<string[]>([]);
//   const [bio, setBio] = useState<string>("");

//   const [birthPlace, setBirthPlace] = useState<string>("");
//   const [homeTown, setHomeTown] = useState<string>("");
//   const [gotra, setGotra] = useState<string>("");
//   const [mamaPariwar, setMamaPariwar] = useState<string>("");
//   const [manglik, setManglik] = useState<boolean | null>(null);
//   const [education, setEducation] = useState<string>("");
//   const [jobEmployer, setJobEmployer] = useState<string>("");
//   const [jobDesignation, setJobDesignation] = useState<string>("");
//   const [jobLocation, setJobLocation] = useState<string>("");
//   const [salaryRange, setSalaryRange] = useState<string>("");
//   const [height, setHeight] = useState<number | "">("");

//   // profile + gallery files & previews
//   const [profileFile, setProfileFile] = useState<File | null>(null);
//   const [profilePreview, setProfilePreview] = useState<string | null>(null);
//   const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
//   const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

//   useEffect(() => {
//     // clear legacy flags but keep drafts by default (you can change)
//     try {
//       LEGACY_KEYS_TO_CLEAR.forEach((k) => localStorage.removeItem(k));
//     } catch (e) { /* ignore */ }

//     const d = localStorage.getItem(LOCAL_SAVE_KEY);
//     if (d) {
//       try {
//         const parsed = JSON.parse(d);
//         if (parsed.fullName) setFullName(parsed.fullName);
//         if (parsed.dob) setDob(parsed.dob);
//         if (parsed.age !== undefined) setAge(parsed.age);
//         if (parsed.email) setEmail(parsed.email);
//         if (parsed.fathersName) setFathersName(parsed.fathersName);
//         if (parsed.mothersName) setMothersName(parsed.mothersName);
//         if (parsed.gender) setGender(parsed.gender);
//         if (parsed.interests) setInterests(parsed.interests);
//         if (parsed.bio) setBio(parsed.bio);
//         if (parsed.education) setEducation(parsed.education);
//         if (parsed.jobEmployer) setJobEmployer(parsed.jobEmployer);
//         if (parsed.jobDesignation) setJobDesignation(parsed.jobDesignation);
//         if (parsed.jobLocation) setJobLocation(parsed.jobLocation);
//         if (parsed.salaryRange) setSalaryRange(parsed.salaryRange);
//         if (parsed.height !== undefined) setHeight(parsed.height);
//       } catch (err) {
//         console.warn("Failed to parse draft", err);
//       }
//     }
//     // do not auto-redirect here (we want to let login happen first)
//   }, []);

//   // compute age automatically if dob set
//   useEffect(() => {
//     if (!dob) return;
//     const y = computeAgeFromDOB(dob);
//     if (!Number.isNaN(y)) setAge(y);
//   }, [dob]);

//   // cleanup object URLs to avoid memory leak
//   useEffect(() => {
//     return () => {
//       if (profilePreview) URL.revokeObjectURL(profilePreview);
//       galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
//     };
//   }, [profilePreview, galleryPreviews]);

//   function saveDraft() {
//     const d = {
//       fullName,
//       dob,
//       age,
//       email,
//       fathersName,
//       mothersName,
//       gender,
//       interests,
//       bio,
//       education,
//       jobEmployer,
//       jobDesignation,
//       jobLocation,
//       salaryRange,
//       height,
//     };
//     try {
//       localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(d));
//     } catch (e) {
//       console.warn("Could not save draft", e);
//     }
//   }

//   function clearDraft() {
//     try {
//       localStorage.removeItem(LOCAL_SAVE_KEY);
//     } catch {}
//   }

//   function toggleInterest(tag: string) {
//     setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
//   }

//   function validateStep() {
//     if (step === 1) {
//       if (!fullName.trim()) {
//         setMessage("Please enter your full name.");
//         return false;
//       }
//     }
//     if (step === 2) {
//       if (!gender) {
//         setMessage("Please select your gender.");
//         return false;
//       }
//       if (interests.length === 0) {
//         setMessage("Pick at least one interest.");
//         return false;
//       }
//     }
//     setMessage(null);
//     return true;
//   }

//   async function nextStep() {
//     if (!validateStep()) return;
//     saveDraft();
//     setLoading(true);
//     await new Promise((r) => setTimeout(r, 200));
//     setLoading(false);
//     setStep((s) => Math.min(3, s + 1));
//   }

//   function prevStep() {
//     setMessage(null);
//     setStep((s) => Math.max(1, s - 1));
//   }

//   function handleProfileFile(e: React.ChangeEvent<HTMLInputElement>) {
//     const f = e.target.files?.[0] ?? null;
//     if (!f) return;
//     if (profilePreview) URL.revokeObjectURL(profilePreview);
//     setProfileFile(f);
//     setProfilePreview(URL.createObjectURL(f));
//   }

//   function handleGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
//     const files = e.target.files ? Array.from(e.target.files) : [];
//     if (!files.length) return;
//     const merged = [...galleryFiles, ...files].slice(0, 12); // cap 12 images
//     galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
//     setGalleryFiles(merged);
//     setGalleryPreviews(merged.map((f) => URL.createObjectURL(f)));
//   }

//   function removeGalleryImage(index: number) {
//     const newFiles = galleryFiles.filter((_, i) => i !== index);
//     const removedPreview = galleryPreviews[index];
//     if (removedPreview) URL.revokeObjectURL(removedPreview);
//     galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
//     setGalleryFiles(newFiles);
//     setGalleryPreviews(newFiles.map((f) => URL.createObjectURL(f)));
//   }

//   function computeAgeFromDOB(dobStr: string) {
//     try {
//       const d = new Date(dobStr);
//       const diff = Date.now() - d.getTime();
//       const ageDt = new Date(diff);
//       return Math.abs(ageDt.getUTCFullYear() - 1970);
//     } catch {
//       return NaN;
//     }
//   }

//   // read token from either key (compat)
//   function getAuthToken(): string | null {
//     return localStorage.getItem("authToken") || localStorage.getItem("auth-token") || null;
//   }

//   async function uploadImageToBackend(file: File, image_type: "profile" | "gallery") {
//     const token = getAuthToken();
//     if (!token) throw new Error("Not authenticated");
//     const fd = new FormData();
//     fd.append("file", file);
//     // backend expects query param image_type
//     const url = `${UPLOAD_ENDPOINT}?image_type=${encodeURIComponent(image_type)}`;
//     const res = await fetch(url, {
//       method: "POST",
//       body: fd,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       } as Record<string, string>,
//     });

//     if (res.status === 401 || res.status === 403) {
//       throw new Error("unauthenticated");
//     }
//     if (!res.ok) {
//       const txt = await res.text().catch(() => "");
//       throw new Error(`Upload failed (${res.status}): ${txt}`);
//     }
//     return await res.json();
//   }

//   async function finishOnboarding() {
//     if (!validateStep()) return;
//     setLoading(true);
//     setMessage(null);

//     try {
//       const token = getAuthToken();
//       if (!token) {
//         saveDraft();
//         setMessage("You must verify your phone or login to continue.");
//         router.replace("/login");
//         setLoading(false);
//         return;
//       }

//       // upload profile image if provided
//       if (profileFile) {
//         try {
//           console.log("Uploading profile image...");
//           await uploadImageToBackend(profileFile, "profile");
//           console.log("Profile image uploaded");
//         } catch (err: any) {
//           if (err?.message === "unauthenticated") {
//             localStorage.removeItem("authToken");
//             saveDraft();
//             router.replace("/login");
//             setLoading(false);
//             return;
//           }
//           throw err;
//         }
//       }

//       // upload gallery images (sequentially - ensures DB order)
//       for (const f of galleryFiles) {
//         try {
//           console.log("Uploading gallery image...", f.name);
//           await uploadImageToBackend(f, "gallery");
//         } catch (err: any) {
//           if (err?.message === "unauthenticated") {
//             localStorage.removeItem("authToken");
//             saveDraft();
//             router.replace("/login");
//             setLoading(false);
//             return;
//           }
//           throw err;
//         }
//       }

//       // create profile metadata (backend will associate images by user token)
//       const payload: any = {
//         full_name: fullName || undefined,
//         email: email || undefined,
//         fathers_name: fathersName || undefined,
//         mothers_name: mothersName || undefined,
//         gender: gender ? gender.toLowerCase() : undefined,
//         marital_status: maritalStatus || undefined,
//         mother_tongue: motherTongue || undefined,
//         interests: interests.length ? interests : undefined,
//         about_me: bio || undefined,
//         date_of_birth: dob || undefined,
//         age: typeof age === "number" ? age : undefined,
//         birth_place: birthPlace || undefined,
//         home_town: homeTown || undefined,
//         gotra: gotra || undefined,
//         mama_pariwar: mamaPariwar || undefined,
//         manglik: manglik === null ? undefined : manglik,
//         education: education || undefined,
//         job_employer: jobEmployer || undefined,
//         job_designation: jobDesignation || undefined,
//         job_location: jobLocation || undefined,
//         salary_range: salaryRange || undefined,
//         height: typeof height === "number" ? height : undefined,
//       };

//       const createRes = await fetch(CREATE_PROFILE_ENDPOINT, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       console.log("createProfile status:", createRes.status);
//       const ct = createRes.headers.get("content-type") || "";
//       if (ct.includes("application/json")) {
//         const j = await createRes.json().catch(() => null);
//         console.log("createProfile response json:", j);
//       } else {
//         const txt = await createRes.text().catch(() => "");
//         console.log("createProfile response text (first 400 chars):", txt.slice(0, 400));
//       }

//       if (createRes.status === 401 || createRes.status === 403) {
//         localStorage.removeItem("authToken");
//         saveDraft();
//         setMessage("Session expired. Please login again.");
//         router.replace("/login");
//         setLoading(false);
//         return;
//       }

//       if (!createRes.ok) {
//         const txt = await createRes.text().catch(() => "");
//         console.error("createProfile error:", createRes.status, txt);
//         setMessage("Failed to save profile. Server responded with an error.");
//         setLoading(false);
//         return;
//       }

//       // success
//       clearDraft();
//       try {
//         localStorage.setItem("profileComplete", "true");
//         localStorage.setItem("userProfile", JSON.stringify(payload));
//       } catch {}
//       router.replace("/Dashboard");
//     } catch (err: any) {
//       console.error("finishOnboarding err:", err);
//       setMessage(err.message || "Unexpected error while saving profile.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // UI
//   return (
//     <>
//       <Navbar />
//       <main className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6">
//         <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-surface rounded-2xl shadow-lg">
//           <div className="flex items-start justify-between mb-4">
//             <div>
//               <h1 className="text-xl font-bold text-[#121212]">Complete your profile</h1>
//               <p className="text-sm text-[#121212]/70 mt-1">3 quick steps — make your profile discoverable and get matched.</p>
//               <ul className="mt-3 text-xs text-[#121212]/70 space-y-1">
//                 <li>• Create a searchable profile — visible to compatible matches</li>
//                 <li>• Upload a clear profile photo and a few gallery shots</li>
//                 <li>• Keep sensitive info private — share only what you want</li>
//               </ul>
//             </div>
//             <div className="text-sm text-[#121212]/60">Step {step} of 3</div>
//           </div>

//           <div className="mt-4">
//             {/* Step 1 */}
//             {step === 1 && (
//               <section>
//                 <label className="block text-sm font-semibold text-[#121212]">Full name</label>
//                 <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />

//                 <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-[#121212]">Date of birth</label>
//                     <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-[#121212]">Age</label>
//                     <input type="number" value={age as any} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Age" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-semibold text-[#121212]">Profile photo</label>
//                   <div className="mt-2 flex items-center gap-3">
//                     <label className="flex items-center gap-3 cursor-pointer">
//                       <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
//                         {profilePreview ? <img src={profilePreview} alt="preview" className="w-full h-full object-cover" /> : <span className="text-xs text-[#121212]/60">Upload</span>}
//                       </div>
//                       <input type="file" accept="image/*" onChange={handleProfileFile} className="hidden" />
//                     </label>
//                     <div className="text-xs text-[#121212]/70">Recommended: clear headshot.</div>
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* Step 2 */}
//             {step === 2 && (
//               <section>
//                 <label className="block text-sm font-semibold text-[#121212]">Gender</label>
//                 <div className="mt-2 flex gap-3">
//                   {["Male", "Female", "Other"].map((g) => (
//                     <button key={g} onClick={() => setGender(g)} className={`px-3 py-2 rounded-lg border ${gender === g ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"} text-sm`}>
//                       {g}
//                     </button>
//                   ))}
//                 </div>

//                 <label className="block mt-4 text-sm font-semibold text-[#121212]">Interests</label>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {ALL_INTERESTS.map((tag) => (
//                     <button key={tag} onClick={() => toggleInterest(tag)} className={`px-3 py-2 rounded-full border ${interests.includes(tag) ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"} text-sm`}>
//                       {tag}
//                     </button>
//                   ))}
//                 </div>

//                 <label className="block mt-4 text-sm font-semibold text-[#121212]">Short bio</label>
//                 <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Tell us a little about yourself" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
//               </section>
//             )}

//             {/* Step 3 */}
//             {step === 3 && (
//               <section>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-[#121212]">Education</label>
//                     <input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="e.g. B.Tech" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-[#121212]">Employer</label>
//                     <input value={jobEmployer} onChange={(e) => setJobEmployer(e.target.value)} placeholder="Company" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-[#121212]">Designation</label>
//                     <input value={jobDesignation} onChange={(e) => setJobDesignation(e.target.value)} placeholder="Job title" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-[#121212]">Job location</label>
//                     <input value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} placeholder="City, State" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-[#121212]">Salary range</label>
//                     <select value={salaryRange ?? ""} onChange={(e) => setSalaryRange(e.target.value)} className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white">
//                       <option value="">Select</option>
//                       {SALARY_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-[#121212]">Height (cm)</label>
//                     <input type="number" value={height ?? ""} onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))} className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-[#121212]">Manglik</label>
//                     <div className="mt-2 flex gap-2">
//                       <button onClick={() => setManglik(true)} className={`px-3 py-2 rounded-lg border ${manglik === true ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"}`}>Yes</button>
//                       <button onClick={() => setManglik(false)} className={`px-3 py-2 rounded-lg border ${manglik === false ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"}`}>No</button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-semibold text-[#121212]">Gallery images (optional)</label>
//                   <input type="file" accept="image/*" multiple onChange={handleGalleryFiles} className="mt-2" />
//                   <div className="mt-3 grid grid-cols-3 gap-3">
//                     {galleryPreviews.map((src, i) => (
//                       <div key={i} className="relative rounded-lg overflow-hidden border">
//                         <img src={src} className="w-full h-28 object-cover" />
//                         <button onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs">Remove</button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </section>
//             )}

//             {message && <p className="mt-3 text-sm text-red-600">{message}</p>}

//             <div className="mt-6 flex items-center justify-between gap-2">
//               <button onClick={prevStep} disabled={step === 1 || loading} className="flex-1 rounded-full border border-black/10 py-2 text-sm disabled:opacity-50">Back</button>

//               {step < 3 ? (
//                 <button onClick={nextStep} disabled={loading} className="flex-1 rounded-full bg-[#851E3E] hover:bg-[#6d172f] text-white py-2 text-sm">{loading ? "Please wait..." : "Next"}</button>
//               ) : (
//                 <button onClick={finishOnboarding} disabled={loading} className="flex-1 rounded-full bg-[#851E3E] hover:bg-[#6d172f] text-white py-2 text-sm">{loading ? "Saving..." : "Finish & Go to Dashboard"}</button>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

/**
 * Onboarding page (client)
 * - Uses absolute backend URLs (no Next rewrites)
 * - Uploads files to http://localhost:8000/user/profile/upload-image?image_type=...
 * - Posts profile metadata to http://localhost:8000/user/createProfile
 */

const BACKEND_BASE = "http://localhost:8000"; // <- change if your backend runs elsewhere
const UPLOAD_ENDPOINT = `${BACKEND_BASE}/user/profile/upload-image`;
const CREATE_PROFILE_ENDPOINT = `${BACKEND_BASE}/user/createProfile`;
const PROFILE_CHECK_ENDPOINT = `${BACKEND_BASE}/user/myProfile`; // Add endpoint to check if profile exists

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

const ALL_INTERESTS = ["Sports", "Tech", "Music", "Travel", "Cooking", "Reading"];

export default function Onboarding() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true); // Add initialization state

  // form state (generic)
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [email, setEmail] = useState<string>("");

  const [fathersName, setFathersName] = useState<string>("");
  const [mothersName, setMothersName] = useState<string>("");

  const [gender, setGender] = useState<string>("");
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [motherTongue, setMotherTongue] = useState<string>("");

  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState<string>("");

  const [birthPlace, setBirthPlace] = useState<string>("");
  const [homeTown, setHomeTown] = useState<string>("");
  const [gotra, setGotra] = useState<string>("");
  const [mamaPariwar, setMamaPariwar] = useState<string>("");
  const [manglik, setManglik] = useState<boolean | null>(null);
  const [education, setEducation] = useState<string>("");
  const [jobEmployer, setJobEmployer] = useState<string>("");
  const [jobDesignation, setJobDesignation] = useState<string>("");
  const [jobLocation, setJobLocation] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<string>("");
  const [height, setHeight] = useState<number | "">("");

  // profile + gallery files & previews
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // read token from either key (compat)
  function getAuthToken(): string | null {
    return localStorage.getItem("authToken") || localStorage.getItem("auth-token") || null;
  }

  // Check if user already has a profile
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
        const profileData = await response.json();
        // If profile exists and has essential data, redirect to dashboard
        if (profileData && profileData.full_name) {
          console.log("Profile already exists, redirecting to dashboard");
          localStorage.setItem("profileComplete", "true");
          localStorage.setItem("userProfile", JSON.stringify(profileData));
          router.replace("/Dashboard");
          return;
        }
      }

      // Profile doesn't exist or is incomplete, proceed with onboarding
      setInitializing(false);
    } catch (error) {
      console.error("Error checking existing profile:", error);
      // On error, proceed with onboarding (could be network issue)
      setInitializing(false);
    }
  }

  useEffect(() => {
    // First check if profile is already complete (from localStorage)
    const profileComplete = localStorage.getItem("profileComplete");
    if (profileComplete === "true") {
      router.replace("/Dashboard");
      return;
    }

    // Then check with backend
    checkExistingProfile();

    // clear legacy flags but keep drafts by default (you can change)
    try {
      LEGACY_KEYS_TO_CLEAR.forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* ignore */ }

    const d = localStorage.getItem(LOCAL_SAVE_KEY);
    if (d) {
      try {
        const parsed = JSON.parse(d);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.dob) setDob(parsed.dob);
        if (parsed.age !== undefined) setAge(parsed.age);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.fathersName) setFathersName(parsed.fathersName);
        if (parsed.mothersName) setMothersName(parsed.mothersName);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.interests) setInterests(parsed.interests);
        if (parsed.bio) setBio(parsed.bio);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.jobEmployer) setJobEmployer(parsed.jobEmployer);
        if (parsed.jobDesignation) setJobDesignation(parsed.jobDesignation);
        if (parsed.jobLocation) setJobLocation(parsed.jobLocation);
        if (parsed.salaryRange) setSalaryRange(parsed.salaryRange);
        if (parsed.height !== undefined) setHeight(parsed.height);
      } catch (err) {
        console.warn("Failed to parse draft", err);
      }
    }
  }, [router]);

  // compute age automatically if dob set
  useEffect(() => {
    if (!dob) return;
    const y = computeAgeFromDOB(dob);
    if (!Number.isNaN(y)) setAge(y);
  }, [dob]);

  // cleanup object URLs to avoid memory leak
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
    } catch {}
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
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (profilePreview) URL.revokeObjectURL(profilePreview);
    setProfileFile(f);
    setProfilePreview(URL.createObjectURL(f));
  }

  function handleGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    const merged = [...galleryFiles, ...files].slice(0, 12); // cap 12 images
    galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    setGalleryFiles(merged);
    setGalleryPreviews(merged.map((f) => URL.createObjectURL(f)));
  }

  function removeGalleryImage(index: number) {
    const newFiles = galleryFiles.filter((_, i) => i !== index);
    const removedPreview = galleryPreviews[index];
    if (removedPreview) URL.revokeObjectURL(removedPreview);
    galleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    setGalleryFiles(newFiles);
    setGalleryPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  }

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

  async function uploadImageToBackend(file: File, image_type: "profile" | "gallery") {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated");
    const fd = new FormData();
    fd.append("file", file);
    // backend expects query param image_type
    const url = `${UPLOAD_ENDPOINT}?image_type=${encodeURIComponent(image_type)}`;
    const res = await fetch(url, {
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

      // upload profile image if provided
      if (profileFile) {
        try {
          console.log("Uploading profile image...");
          await uploadImageToBackend(profileFile, "profile");
          console.log("Profile image uploaded");
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

      // upload gallery images (sequentially - ensures DB order)
      for (const f of galleryFiles) {
        try {
          console.log("Uploading gallery image...", f.name);
          await uploadImageToBackend(f, "gallery");
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

      // create profile metadata (backend will associate images by user token)
      const payload: any = {
        full_name: fullName || undefined,
        email: email || undefined,
        fathers_name: fathersName || undefined,
        mothers_name: mothersName || undefined,
        gender: gender ? gender.toLowerCase() : undefined,
        marital_status: maritalStatus || undefined,
        mother_tongue: motherTongue || undefined,
        interests: interests.length ? interests : undefined,
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

      const createRes = await fetch(CREATE_PROFILE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("createProfile status:", createRes.status);
      const ct = createRes.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const j = await createRes.json().catch(() => null);
        console.log("createProfile response json:", j);
      } else {
        const txt = await createRes.text().catch(() => "");
        console.log("createProfile response text (first 400 chars):", txt.slice(0, 400));
      }

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
      setMessage(err.message || "Unexpected error while saving profile.");
    } finally {
      setLoading(false);
    }
  }

  // Show loading while initializing
  if (initializing) {
    return (
      <>
     
        <main className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6">
          <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-surface rounded-2xl shadow-lg">
            <div className="flex items-center justify-center">
              <div className="text-lg text-[#121212]">Checking profile status...</div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // UI
  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6">
        <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-surface rounded-2xl shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-[#121212]">Complete your profile</h1>
              <p className="text-sm text-[#121212]/70 mt-1">3 quick steps — make your profile discoverable and get matched.</p>
              <ul className="mt-3 text-xs text-[#121212]/70 space-y-1">
                <li>• Create a searchable profile — visible to compatible matches</li>
                <li>• Upload a clear profile photo and a few gallery shots</li>
                <li>• Keep sensitive info private — share only what you want</li>
              </ul>
            </div>
            <div className="text-sm text-[#121212]/60">Step {step} of 3</div>
          </div>

          <div className="mt-4">
            {/* Step 1 */}
            {step === 1 && (
              <section>
                <label className="block text-sm font-semibold text-[#121212]">Full name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Date of birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#121212]">Age</label>
                    <input type="number" value={age as any} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Age" className="mt-2 w-full rounded-md border border-black/10 px-3 py-3 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-[#121212]">Profile photo</label>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
                        {profilePreview ? <img src={profilePreview} alt="preview" className="w-full h-full object-cover" /> : <span className="text-xs text-[#121212]/60">Upload</span>}
                      </div>
                      <input type="file" accept="image/*" onChange={handleProfileFile} className="hidden" />
                    </label>
                    <div className="text-xs text-[#121212]/70">Recommended: clear headshot.</div>
                  </div>
                </div>
              </section>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <section>
                <label className="block text-sm font-semibold text-[#121212]">Gender</label>
                <div className="mt-2 flex gap-3">
                  {["Male", "Female", "Other"].map((g) => (
                    <button key={g} onClick={() => setGender(g)} className={`px-3 py-2 rounded-lg border ${gender === g ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"} text-sm`}>
                      {g}
                    </button>
                  ))}
                </div>

                <label className="block mt-4 text-sm font-semibold text-[#121212]">Interests</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL_INTERESTS.map((tag) => (
                    <button key={tag} onClick={() => toggleInterest(tag)} className={`px-3 py-2 rounded-full border ${interests.includes(tag) ? "border-[#851E3E] bg-[#fff5f7]" : "border-black/10"} text-sm`}>
                      {tag}
                    </button>
                  ))}
                </div>

                <label className="block mt-4 text-sm font-semibold text-[#121212]">Short bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Tell us a little about yourself" className="mt-2 w-full rounded-md border border-black/10 px-3 py-2 focus:ring-2 focus:ring-[#851E3E] outline-none bg-white" />
              </section>
            )}

            {/* Step 3 */}
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
                      <option value="">Select</option>
                      {SALARY_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
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