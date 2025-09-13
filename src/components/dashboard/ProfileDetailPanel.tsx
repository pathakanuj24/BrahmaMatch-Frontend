"use client";

import React from "react";
import { UserProfile } from "./ProfileCard";

interface ProfileDetailPanelProps {
  selected: UserProfile | null;
  onClose: () => void;
  onGalleryOpen: (src: string) => void;
}

export default function ProfileDetailPanel({ selected, onClose, onGalleryOpen }: ProfileDetailPanelProps) {
  if (!selected) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 overflow-auto">
      <div className="p-3 sm:p-4 border-b flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm sm:text-base truncate">{selected.full_name}</div>
          <div className="text-xs text-slate-500 truncate">{selected.job_designation} • {selected.job_location}</div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div className="text-xs sm:text-sm text-slate-600">Score <strong className="ml-1">—</strong></div>
          <button onClick={onClose} className="p-1.5 sm:p-2 rounded hover:bg-slate-100">✕</button>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {(selected.gallery || []).map((src, i) => (
            <div key={i} onClick={() => onGalleryOpen(src)} className="cursor-pointer rounded-lg overflow-hidden aspect-[4/3] bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`g-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="rounded-lg border p-2.5 sm:p-3 bg-[#F7F5F3]">
          <div className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">About</div>
          <div className="text-xs sm:text-sm text-slate-700">{selected.about_me}</div>
        </div>

        <div className="rounded-lg border p-2.5 sm:p-3 bg-[#F7F5F3]">
          <div className="font-semibold mb-1.5 sm:mb-2 text-sm sm:text-base">Interests</div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">{(selected.interests || []).map((it, idx) => <span key={idx} className="px-2 sm:px-3 py-1 rounded-full bg-white text-xs sm:text-sm">{it}</span>)}</div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 px-3 sm:px-4 py-2 rounded bg-[#851E3E] text-white text-sm font-medium">Connect</button>
          <button className="flex-1 px-3 sm:px-4 py-2 rounded border text-sm font-medium">Message</button>
        </div>
      </div>
    </div>
  );
}
