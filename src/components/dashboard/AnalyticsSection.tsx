"use client";

import React from "react";

interface Analytics {
  totalMatches?: number;
  newMatchesToday?: number;
  messagesSent?: number;
  profileViews?: number;
  responseRate?: number;
  averageMatchScore?: number;
  weeklyMatches?: number[];
  ageDistribution?: { age: string; count: number }[];
  topInterests?: { interest: string; count: number }[];
}

interface AnalyticsSectionProps {
  analytics: Analytics | null;
  loading: boolean;
}

export default function AnalyticsSection({ analytics, loading }: AnalyticsSectionProps) {
  if (loading) {
    return (
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Dashboard Analytics</h2>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#851E3E] mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 lg:mb-6">Dashboard Analytics</h2>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <AnalyticsCard title="Total Matches" value={analytics?.totalMatches ?? 0} change="+0%" icon="💕" color="text-pink-600" />
        <AnalyticsCard title="New Today" value={analytics?.newMatchesToday ?? 0} change="+0" icon="✨" color="text-green-600" />
        <AnalyticsCard title="Profile Views" value={analytics?.profileViews ?? 0} change="+0%" icon="👁️" color="text-purple-600" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <div className="bg-white rounded-lg border p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Weekly Matches</h3>
          <div className="h-24 sm:h-32 lg:h-48 flex items-end justify-between gap-1 sm:gap-2">
            {(analytics?.weeklyMatches ?? Array(7).fill(0)).map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-[#851E3E] rounded-t w-full transition-all duration-300 hover:bg-[#6b1a32]"
                  style={{ height: `${(value / Math.max(...(analytics?.weeklyMatches ?? [1]))) * 120 || 8}px` }}
                ></div>
                <span className="text-xs text-slate-500 mt-1 sm:mt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Age Distribution</h3>
          <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
            {(analytics?.ageDistribution ?? []).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-slate-600">{item.age}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 sm:w-24 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-[#851E3E] h-2 rounded-full"
                      style={{ width: `${(item.count / Math.max(...(analytics?.ageDistribution?.map(d => d.count) ?? [1]))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
            {(!analytics?.ageDistribution || analytics.ageDistribution.length === 0) && (
              <p className="text-sm text-slate-500">No age distribution data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white rounded-lg border p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Top Interests</h3>
          <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
            {(analytics?.topInterests ?? []).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-slate-600">{item.interest}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 sm:w-24 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(item.count / Math.max(...(analytics?.topInterests?.map(d => d.count) ?? [1]))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
            {(!analytics?.topInterests || analytics.topInterests.length === 0) && (
              <p className="text-sm text-slate-500">No interests data available.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-3 sm:p-4 lg:p-6">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Performance Metrics</h3>
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-slate-600">Response Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-16 sm:w-20 bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analytics?.responseRate ?? 0}%` }}></div>
                </div>
                <span className="text-xs sm:text-sm font-medium">{analytics?.responseRate ?? 0}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-slate-600">Avg Match Score</span>
              <div className="flex items-center gap-2">
                <div className="w-16 sm:w-20 bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analytics?.averageMatchScore ?? 0}%` }}></div>
                </div>
                <span className="text-xs sm:text-sm font-medium">{analytics?.averageMatchScore ?? 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ 
  title, 
  value = 0, 
  change = "0", 
  icon, 
  color 
}: { 
  title: string; 
  value?: number; 
  change?: string; 
  icon: string; 
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`text-xl sm:text-2xl ${color}`}>{icon}</div>
        <div className={`text-xs sm:text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-xs sm:text-sm text-slate-600">{title}</div>
    </div>
  );
}
