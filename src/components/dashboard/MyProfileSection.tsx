"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Helper function to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem("authToken") || localStorage.getItem("auth-token") || null;
}

export default function MyProfileSection() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch('http://localhost:8000/user/myProfile', {
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

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        setProfileData(null);
        return;
      }
      
      if (response.ok) {
        if (result && (result.full_name || result.data)) {
          setProfileData(result);
        } else {
          setProfileData(result);
        }
      } else {
        console.error('Failed to fetch profile:', result?.error || result?.message || 'Unknown error');
        setProfileData(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#851E3E] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No profile data available</p>
        <p className="text-sm text-slate-500 mt-2">Please complete your profile in the onboarding section</p>
        <button onClick={fetchProfileData} className="mt-4 px-4 py-2 bg-[#851E3E] text-white rounded-lg hover:bg-[#6b1a32] transition-colors">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">My Profile</h2>
        <button onClick={() => setEditing(!editing)} className="px-4 py-2 bg-[#851E3E] text-white rounded-lg text-sm font-medium hover:bg-[#6b1a32] transition-colors">
          {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Header Section */}
      <div className="bg-white rounded-lg border shadow-sm mb-6 overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-[#851E3E] to-[#a0284a] relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-end gap-4">
              {/* Profile Picture */}
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden">
                <img src={profileData.profile_image || '/c1.png'} alt={profileData.full_name} className="w-full h-full object-cover" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{profileData.full_name || 'Name not provided'}</h1>
                <p className="text-lg opacity-90">
                  {profileData.job_designation || 'Job title not provided'}
                  {profileData.job_employer && ` at ${profileData.job_employer}`}
                </p>
                <p className="text-sm opacity-80">
                  {profileData.job_location && `${profileData.job_location}`}
                  {profileData.age && ` • ${profileData.age} years old`}
                </p>
              </div>
            </div>
            <div className="text-right text-white">
              <div className="text-sm opacity-80">Profile Completion</div>
              <div className="text-2xl font-bold">{profileData.profile_stats?.profile_completion ?? 95}%</div>
            </div>
          </div>
        </div>

        {/* Profile Stats - Only show if data exists */}
        {(profileData.profile_stats || profileData.verified !== undefined) && (
          <div className="p-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profileData.profile_stats?.profile_views !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#851E3E]">{profileData.profile_stats.profile_views}</div>
                  <div className="text-sm text-slate-600">Profile Views</div>
                </div>
              )}
              {profileData.profile_stats?.matches !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#851E3E]">{profileData.profile_stats.matches}</div>
                  <div className="text-sm text-slate-600">Matches</div>
                </div>
              )}
              {profileData.profile_stats?.likes_received !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#851E3E]">{profileData.profile_stats.likes_received}</div>
                  <div className="text-sm text-slate-600">Likes Received</div>
                </div>
              )}
              {profileData.verified !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#851E3E]">{profileData.verified ? '✓' : '✗'}</div>
                  <div className="text-sm text-slate-600">Verified</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <ProfileSection title="About" icon="👤" content={
            <div>
              <p className="text-slate-700 leading-relaxed">{profileData.about_me || 'No description provided'}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-600">Height:</span> {profileData.height ? `${profileData.height} cm` : 'Not provided'}
                </div>
                <div>
                  <span className="font-medium text-slate-600">Age:</span> {profileData.age ? `${profileData.age} years` : 'Not provided'}
                </div>
                <div>
                  <span className="font-medium text-slate-600">Birth Place:</span> {profileData.birth_place || 'Not provided'}
                </div>
                <div>
                  <span className="font-medium text-slate-600">Home Town:</span> {profileData.home_town || 'Not provided'}
                </div>
                <div>
                  <span className="font-medium text-slate-600">Gotra:</span> {profileData.gotra || 'Not provided'}
                </div>
                <div>
                  <span className="font-medium text-slate-600">Manglik:</span> {profileData.manglik !== undefined ? (profileData.manglik ? 'Yes' : 'No') : 'Not specified'}
                </div>
              </div>
            </div>
          }/>

          {/* Work Experience */}
          <ProfileSection title="Work Experience" icon="💼" content={
            <div className="space-y-4">
              {profileData.job_designation ? (
                <div className="border-l-2 border-[#851E3E] pl-4">
                  <h4 className="font-semibold text-slate-900">{profileData.job_designation}</h4>
                  <p className="text-[#851E3E] font-medium">{profileData.job_employer}</p>
                  <p className="text-sm text-slate-600">{profileData.job_location}</p>
                  {profileData.salary_range && (
                    <p className="text-sm text-slate-700 mt-2">Salary: {profileData.salary_range}</p>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 italic">No work experience information available</p>
              )}
            </div>
          }/>

          {/* Education */}
          <ProfileSection title="Education" icon="🎓" content={
            <div className="space-y-4">
              {profileData.education ? (
                <div className="border-l-2 border-[#851E3E] pl-4">
                  <h4 className="font-semibold text-slate-900">{profileData.education}</h4>
                </div>
              ) : (
                <p className="text-slate-500 italic">No education information available</p>
              )}
            </div>
          }/>

          {/* Interests */}
          <ProfileSection title="Interests" icon="🎯" content={
            <div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(profileData.interests) && profileData.interests.length > 0 ? (
                  profileData.interests.map((interest: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-[#851E3E]/10 text-[#851E3E] rounded-full text-sm">{interest}</span>
                  ))
                ) : (
                  <p className="text-slate-500 italic text-sm">No interests specified</p>
                )}
              </div>
            </div>
          }/>

          {/* Gallery */}
          <ProfileSection title="Photo Gallery" icon="📸" content={
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.isArray(profileData.gallery_images) && profileData.gallery_images.length > 0 ? (
                profileData.gallery_images.map((image: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={image} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                  </div>
                ))
              ) : profileData.profile_image ? (
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={profileData.profile_image} alt="Profile" className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                </div>
              ) : (
                <p className="text-slate-500 italic col-span-full text-center py-8">No photos available</p>
              )}
            </div>
          }/>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contact Information */}
          <ProfileSection title="Contact Information" icon="📞" content={
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-slate-600">Job Location:</span>
                <p className="text-slate-700">{profileData.job_location || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Home Town:</span>
                <p className="text-slate-700">{profileData.home_town || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Birth Place:</span>
                <p className="text-slate-700">{profileData.birth_place || 'Not provided'}</p>
              </div>
            </div>
          }/>

          {/* Family Information */}
          <ProfileSection title="Family Information" icon="👨‍👩‍👧‍👦" content={
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-slate-600">Father's Name:</span>
                <p className="text-slate-700">{profileData.fathers_name || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Mother's Name:</span>
                <p className="text-slate-700">{profileData.mothers_name || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Mama Pariwar:</span>
                <p className="text-slate-700">{profileData.mama_pariwar || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Gotra:</span>
                <p className="text-slate-700">{profileData.gotra || 'Not provided'}</p>
              </div>
            </div>
          }/>

          {/* Profile Details */}
          <ProfileSection title="Profile Details" icon="📋" content={
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-slate-600">Created:</span>
                <p className="text-slate-700">{profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'Not available'}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Last Updated:</span>
                <p className="text-slate-700">{profileData.updated_at ? new Date(profileData.updated_at).toLocaleDateString() : 'Not available'}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Salary Range:</span>
                <p className="text-slate-700">{profileData.salary_range || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-slate-600">Manglik Status:</span>
                <p className="text-slate-700">{profileData.manglik !== undefined ? (profileData.manglik ? 'Yes' : 'No') : 'Not specified'}</p>
              </div>
            </div>
          }/>
        </div>
      </div>
    </div>
  );
}

// Reusable Profile Section Component
function ProfileSection({ title, icon, content }: { title: string; icon: string; content: React.ReactNode; }) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">{icon}</div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      {content}
    </div>
  );
}
