"use client";

import React from "react";

export interface UserProfile {
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
}

interface ProfileCardProps {
  profile: UserProfile;
  onOpen: () => void;
}

export default function ProfileCard({ profile, onOpen }: ProfileCardProps) {
  return (
    <div className="rounded-lg overflow-hidden bg-white border shadow-sm hover:shadow-md transition">
      <div className="relative">
        <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.profile_image || '/c1.png'} alt={profile.full_name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white/80 text-xs">{profile.age ?? "-" } yrs</div>
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white/80 text-xs">—%</div>
      </div>

      <div className="p-2 sm:p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm sm:text-base truncate">{profile.full_name}</div>
            <div className="text-xs text-slate-500 truncate">{profile.job_designation} • {profile.job_location}</div>
          </div>
          <div className="flex flex-col items-end gap-1 sm:gap-2 ml-2">
            <button onClick={onOpen} className="px-2 sm:px-3 py-1 rounded bg-[#851E3E] text-white text-xs touch-target">View</button>
            <button className="px-1.5 sm:px-2 py-1 rounded border text-xs touch-target">♡</button>
          </div>
        </div>

        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-600 line-clamp-2">{profile.about_me}</div>

        <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
          {(profile.interests || []).slice(0,3).map((it, idx) => <span key={idx} className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded-full border">{it}</span>)}
        </div>
      </div>
    </div>
  );
}
