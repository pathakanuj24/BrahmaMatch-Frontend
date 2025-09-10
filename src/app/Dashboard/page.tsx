"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * BrahmaMatch — Polished Matching Dashboard (single-file React/Tailwind)
 * - Full-width dashboard suitable for matchmaking apps
 * - Left sidebar with #851E3E, profile at bottom (full name)
 * - Topbar with search + filter chips
 * - Center: responsive grid of profile cards with match score + quick actions
 * - Right: slide-over detail panel that opens when a card is clicked (shows gallery, info, connect)
 * - Gallery modal with full-screen preview
 * - Page background: #F7F5F3
 *
 * Drop into `src/app/dashboard/page.tsx`. Requires TailwindCSS.
 */

type UserProfile = {
  id: number;
  full_name: string;
  age?: number;
  education?: string;
  job_designation?: string;
  job_location?: string;
  interests?: string[];
  profile_image?: string | null;
  gallery?: string[];
  about_me?: string;
};

const SAMPLE_USER = {
  full_name: "John Doe",
  email: "john.doe@example.com",
};

const SAMPLE_PROFILES: UserProfile[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  full_name: ["Asha", "Rita", "Priya", "Meera", "Sara", "Nisha"][i % 6] + ` ${i + 1}`,
  age: 22 + (i % 8),
  education: ["B.Tech", "MBA", "M.Sc"][i % 3],
  job_designation: ["Engineer", "Manager", "Designer"][i % 3],
  job_location: ["Delhi", "Mumbai", "Bengaluru"][i % 3],
  interests: ["Travel", "Music", "Reading", "Tech"].slice(0, (i % 4) + 1),
  profile_image: null,
  gallery: [
    "/images/sample1.jpg",
    "/images/sample2.jpg",
    "/images/sample3.jpg",
  ],
  about_me: "Friendly, family oriented and career focused.",
}));

export default function Dashboard() {
  const router = useRouter();
  const [me] = useState(SAMPLE_USER);
  const [profiles, setProfiles] = useState<UserProfile[]>(SAMPLE_PROFILES);
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selected, setSelected] = useState<UserProfile | null>(null);
  const [galleryOpen, setGalleryOpen] = useState<{ src: string } | null>(null);
  const [viewOnlyFavorites, setViewOnlyFavorites] = useState(false);

  useEffect(() => {
    // placeholder: load profiles from API here
  }, []);

  function toggleFilter(f: string) {
    setActiveFilters((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    router.replace("/login");
  }

  const filtered = profiles
    .filter((p) => (viewOnlyFavorites ? p.id % 2 === 0 : true))
    .filter((p) => (query ? p.full_name.toLowerCase().includes(query.toLowerCase()) : true))
    .filter((p) => (activeFilters.length ? activeFilters.every((f) => p.interests?.includes(f)) : true));

  return (
    <div className="min-h-screen flex bg-[#F7F5F3] text-slate-900">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-80 min-h-screen sticky top-0" style={{ background: "#851E3E" }}>
        <div className="p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">BM</div>
            <div>
              <div className="font-bold">BrahmaMatch</div>
              <div className="text-xs opacity-80">Find meaningful matches</div>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarNavItem label="Dashboard" active />
            <SidebarNavItem label="Search" />
            <SidebarNavItem label="Matches" />
            <SidebarNavItem label="Messages" />
            <SidebarNavItem label="Settings" />
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-white/10 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#851E3E] font-semibold">JD</div>
            <div className="flex-1">
              <div className="font-medium">{me.full_name}</div>
              <div className="text-xs opacity-80">{(me as any).email}</div>
            </div>
            <button onClick={handleLogout} className="px-3 py-1 rounded bg-white text-[#851E3E] text-sm font-semibold">Logout</button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 lg:p-8">
        {/* topbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 pr-4">
            <div className="rounded-lg border bg-white p-3 flex items-center gap-3">
              <svg className="w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="6" strokeWidth="2"/></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search profiles by name" className="w-full outline-none text-sm bg-transparent" />
            </div>

            <div className="mt-3 flex items-center gap-3">
              {['Travel','Music','Tech','Reading'].map((f) => (
                <button key={f} onClick={() => toggleFilter(f)} className={`px-3 py-1 rounded-full border ${activeFilters.includes(f) ? 'bg-[#851E3E] text-white' : 'bg-white text-slate-700'}`}>{f}</button>
              ))}

              <button onClick={() => setViewOnlyFavorites(!viewOnlyFavorites)} className={`ml-3 px-3 py-1 rounded-full border ${viewOnlyFavorites ? 'bg-[#851E3E] text-white' : 'bg-white'}`}>Favorites</button>
            </div>
          </div>

          <div className="ml-4 flex items-center gap-3">
            <button className="px-3 py-2 rounded-lg border bg-white">New Match</button>
          </div>
        </div>

        {/* content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProfileCard key={p.id} p={p} onOpen={() => setSelected(p)} />
              ))}
            </div>
          </section>

          {/* Right column: mini stats + quick filters */}
          <aside className="hidden lg:block">
            <div className="rounded-lg border bg-white p-4 mb-4">
              <div className="text-xs text-slate-500">Matches Today</div>
              <div className="text-2xl font-semibold mt-2">{Math.floor(Math.random() * 20) + 3}</div>
              <div className="mt-3 text-sm text-slate-600">People who fit your preferences</div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="text-sm font-semibold mb-2">Quick Filters</div>
              <div className="flex flex-col gap-2">
                <button className="px-3 py-2 rounded text-sm border">Verified</button>
                <button className="px-3 py-2 rounded text-sm border">Within 50 km</button>
                <button className="px-3 py-2 rounded text-sm border">Age 23-30</button>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-8 text-xs text-slate-500">Pro-tip: Click a profile to view full details and gallery.</footer>
      </main>

      {/* Detail Slide-over */}
      {selected && (
        <div className="fixed right-0 top-0 h-full w-full lg:w-96 bg-white shadow-xl z-50 overflow-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <div className="font-semibold">{selected.full_name}</div>
              <div className="text-xs text-slate-500">{selected.job_designation} • {selected.job_location}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-600">Score <strong className="ml-1">{Math.floor(Math.random() * 100)}%</strong></div>
              <button onClick={() => setSelected(null)} className="p-2 rounded hover:bg-slate-100">✕</button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {(selected.gallery || []).map((src, i) => (
                <div key={i} onClick={() => setGalleryOpen({ src })} className="cursor-pointer rounded-lg overflow-hidden aspect-[4/3] bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`g-${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="rounded-lg border p-3 bg-[#F7F5F3]">
              <div className="font-semibold mb-2">About</div>
              <div className="text-sm text-slate-700">{selected.about_me}</div>
            </div>

            <div className="rounded-lg border p-3 bg-[#F7F5F3]">
              <div className="font-semibold mb-2">Interests</div>
              <div className="flex flex-wrap gap-2">{(selected.interests || []).map((it, idx) => <span key={idx} className="px-3 py-1 rounded-full bg-white text-sm">{it}</span>)}</div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 rounded bg-[#851E3E] text-white">Connect</button>
              <button className="flex-1 px-4 py-2 rounded border">Message</button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center" onClick={() => setGalleryOpen(null)}>
          <div className="max-w-3xl max-h-[90vh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={galleryOpen.src} alt="gallery" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ----- small presentational components ----- */
function SidebarNavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div className={`p-3 rounded-md flex items-center gap-3 cursor-pointer ${active ? 'bg-white/10' : 'hover:bg-white/5'}`}>
      <div className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center">{label[0]}</div>
      <div className="text-sm text-white">{label}</div>
    </div>
  );
}

function ProfileCard({ p, onOpen }: { p: UserProfile; onOpen: () => void }) {
  return (
    <div className="rounded-lg overflow-hidden bg-white border shadow-sm hover:shadow-md transition">
      <div className="relative">
        <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.profile_image || '/images/placeholder-profile.png'} alt={p.full_name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-white/80 text-xs">{p.age} yrs</div>
        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-white/80 text-xs">{Math.floor(Math.random()*100)}%</div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{p.full_name}</div>
            <div className="text-xs text-slate-500">{p.job_designation} • {p.job_location}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button onClick={onOpen} className="px-3 py-1 rounded bg-[#851E3E] text-white text-xs">View</button>
            <button className="px-2 py-1 rounded border text-xs">♡</button>
          </div>
        </div>

        <div className="mt-3 text-sm text-slate-600 line-clamp-2">{p.about_me}</div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(p.interests || []).slice(0,3).map((it, idx) => <span key={idx} className="px-2 py-1 text-xs rounded-full border">{it}</span>)}
        </div>
      </div>
    </div>
  );
}

