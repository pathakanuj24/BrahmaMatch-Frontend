
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import ProfileCard, { UserProfile } from "@/components/dashboard/ProfileCard";
import ProfileDetailPanel from "@/components/dashboard/ProfileDetailPanel";
import MyProfileSection from "@/components/dashboard/MyProfileSection";

/**
 * BrahmaMatch — Comprehensive Dashboard with Analytics
 * - Full-width dashboard with analytics and sidebar navigation
 * - Left sidebar with #851E3E, profile at bottom (full name)
 * - Analytics section with charts and metrics
 * - Center: responsive grid of profile cards with match score + quick actions
 * - Right: slide-over detail panel that opens when a card is clicked
 * - Gallery modal with full-screen preview
 * - Page background: #F7F5F3
 */

type Analytics = {
  totalMatches?: number;
  newMatchesToday?: number;
  messagesSent?: number;
  profileViews?: number;
  responseRate?: number;
  averageMatchScore?: number;
  weeklyMatches?: number[];
  ageDistribution?: { age: string; count: number }[];
  topInterests?: { interest: string; count: number }[];
};

export default function Dashboard() {
  const router = useRouter();

  // user (will be fetched)
  const [me, setMe] = useState<{ full_name?: string; email?: string } | null>(null);

  // profiles (fetched from API)
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  // analytics (fetched from API)
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selected, setSelected] = useState<UserProfile | null>(null);
  const [galleryOpen, setGalleryOpen] = useState<{ src: string } | null>(null);
  const [viewOnlyFavorites, setViewOnlyFavorites] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Always start collapsed
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    // fetch current user
    fetchCurrentUser();
    // fetch initial profiles
    fetchProfiles();
    // fetch analytics
    fetchAnalytics();
  }, []);

  async function fetchCurrentUser() {
    try {
      const token = getAuthToken();
      if (!token) {
        // optionally redirect to login if needed
        // router.replace("/login");
        return;
      }
      const res = await fetch("http://localhost:8000/user/myProfile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMe({ full_name: data.full_name, email: data.email });
      } else {
        console.warn("Failed to fetch current user:", res.status);
      }
    } catch (err) {
      console.error("fetchCurrentUser error:", err);
    }
  }

  async function fetchProfiles() {
    try {
      setLoadingProfiles(true);
      const token = getAuthToken();
      const res = await fetch("http://localhost:8000/user/profiles", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        // Expecting an array of profiles
        setProfiles(Array.isArray(data) ? data : []);
      } else {
        console.warn("Failed to fetch profiles:", res.status);
        setProfiles([]);
      }
    } catch (err) {
      console.error("fetchProfiles error:", err);
      setProfiles([]);
    } finally {
      setLoadingProfiles(false);
    }
  }

  async function fetchAnalytics() {
    try {
      setLoadingAnalytics(true);
      const token = getAuthToken();
      const res = await fetch("http://localhost:8000/user/analytics", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data || null);
      } else {
        console.warn("Failed to fetch analytics:", res.status);
        setAnalytics(null);
      }
    } catch (err) {
      console.error("fetchAnalytics error:", err);
      setAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  }

  function toggleFilter(f: string) {
    setActiveFilters((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("auth-token");
    router.replace("/login");
  }

  function handleNavigation(page: string) {
    setActiveTab(page);
    if (page === "home") {
      router.push("/");
    }
    // For dashboard tabs, just update the active tab state
  }

  function toggleSidebar() {
    // For mobile only - toggle the collapsed state
    setSidebarCollapsed(!sidebarCollapsed);
  }

  const isSidebarExpanded = !sidebarCollapsed || sidebarHovered;

  const filtered = profiles
    .filter((p) => (viewOnlyFavorites ? p.id % 2 === 0 : true))
    .filter((p) => (query ? p.full_name?.toLowerCase().includes(query.toLowerCase()) : true))
    .filter((p) => (activeFilters.length ? activeFilters.every((f) => p.interests?.includes(f)) : true));

  return (
    <div className="min-h-screen flex bg-[#F7F5F3] text-slate-900">
      <Sidebar
        me={me}
        activeTab={activeTab}
        sidebarCollapsed={sidebarCollapsed}
        sidebarHovered={sidebarHovered}
        onNavigation={handleNavigation}
        onToggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      />

      {/* MAIN */}
      <main className="flex-1 p-3 sm:p-4 lg:p-6 lg:ml-12 transition-all duration-300">
        {/* topbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          {/* Mobile menu button and search */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors" onClick={toggleSidebar} title="Toggle sidebar">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex-1">
              <div className="rounded-lg border bg-white p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="6" strokeWidth="2"/></svg>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search profiles..." className="w-full outline-none text-sm sm:text-base bg-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        {activeTab === "dashboard" && (
          <AnalyticsSection analytics={analytics} loading={loadingAnalytics} />
        )}

        {/* Tab Content */}
        {activeTab === "search" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <section className="lg:col-span-2">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6">Search Profiles</h2>

              {loadingProfiles ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#851E3E] mx-auto mb-3 sm:mb-4"></div>
                  <p className="text-slate-600 text-sm sm:text-base">Loading profiles...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {filtered.length > 0 ? filtered.map((p) => (
                    <ProfileCard key={p.id} profile={p} onOpen={() => setSelected(p)} />
                  )) : (
                    <p className="text-slate-500 col-span-full text-center py-8">No profiles found.</p>
                  )}
                </div>
              )}
            </section>

            <aside className="hidden lg:block">
              <div className="rounded-lg border bg-white p-4 mb-4">
                <div className="text-xs text-slate-500">Matches Today</div>
                <div className="text-2xl font-semibold mt-2">{analytics?.newMatchesToday ?? "-"}</div>
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
        )}

        {activeTab === "matches" && (
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6">Your Matches</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {filtered.filter(p => p.id % 2 === 0).map((p) => (
                <ProfileCard key={p.id} profile={p} onOpen={() => setSelected(p)} />
              ))}
              {filtered.filter(p => p.id % 2 === 0).length === 0 && <p className="text-slate-500 col-span-full text-center py-8">No matches yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6">Detailed Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white rounded-lg border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Match Success Rate</h3>
                <div className="text-2xl sm:text-3xl font-bold text-[#851E3E] mb-2">{analytics?.responseRate ?? "-" }%</div>
                <p className="text-xs sm:text-sm text-slate-600">Higher than average</p>
              </div>
              <div className="bg-white rounded-lg border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Active Conversations</h3>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">—</div>
                <p className="text-xs sm:text-sm text-slate-600">Ongoing chats</p>
              </div>
              <div className="bg-white rounded-lg border p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Profile Completion</h3>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">—</div>
                <p className="text-xs sm:text-sm text-slate-600">Almost complete</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Settings</h2>
            <div className="bg-white rounded-lg border p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Profile Visibility</label>
                  <select className="w-full p-3 border rounded-lg text-sm">
                    <option>Public</option>
                    <option>Private</option>
                    <option>Friends Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notification Preferences</label>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      New matches
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      Messages
                    </label>
                    <label className="flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      Profile views
                    </label>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-4 py-2 bg-[#851E3E] text-white rounded-lg text-sm font-medium">Save Settings</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "myProfile" && (
          <MyProfileSection />
        )}

        <footer className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-500 text-center sm:text-left">Pro-tip: Click a profile to view full details and gallery.</footer>
      </main>

      {/* Detail Slide-over */}
      <ProfileDetailPanel 
        selected={selected} 
        onClose={() => setSelected(null)} 
        onGalleryOpen={(src) => setGalleryOpen({ src })} 
      />

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

// Helper function to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem("authToken") || localStorage.getItem("auth-token") || null;
}


