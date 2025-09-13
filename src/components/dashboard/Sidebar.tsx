"use client";

import React from "react";

interface SidebarProps {
  me: { full_name?: string; email?: string } | null;
  activeTab: string;
  sidebarCollapsed: boolean;
  sidebarHovered: boolean;
  onNavigation: (page: string) => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function Sidebar({
  me,
  activeTab,
  sidebarCollapsed,
  sidebarHovered,
  onNavigation,
  onToggleSidebar,
  onLogout,
  onMouseEnter,
  onMouseLeave,
}: SidebarProps) {
  const isSidebarExpanded = !sidebarCollapsed || sidebarHovered;

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => onToggleSidebar()}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`lg:hidden flex flex-col min-h-screen fixed top-0 left-0 w-72 sm:w-80 transition-all duration-300 z-40 ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`} 
        style={{ background: "#851E3E" }}
      >
        {/* Mobile Header */}
        <div className="p-3 sm:p-4 text-white border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">BM</div>
              <div>
                <div className="font-bold text-sm">BrahmaMatch</div>
                <div className="text-xs opacity-80">Find meaningful matches</div>
              </div>
            </div>
            <button 
              onClick={() => onToggleSidebar()}
              className="p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 p-3 sm:p-4">
          <nav className="space-y-1 sm:space-y-2">
            <SidebarNavItem label="Dashboard" active={activeTab === "dashboard"} onClick={() => { onNavigation("dashboard"); onToggleSidebar(); }} icon="📊" collapsed={false} />
            <SidebarNavItem label="Search" active={activeTab === "search"} onClick={() => { onNavigation("search"); onToggleSidebar(); }} icon="🔍" collapsed={false} />
            <SidebarNavItem label="Matches" active={activeTab === "matches"} onClick={() => { onNavigation("matches"); onToggleSidebar(); }} icon="💕" collapsed={false} />
            <SidebarNavItem label="Analytics" active={activeTab === "analytics"} onClick={() => { onNavigation("analytics"); onToggleSidebar(); }} icon="📈" collapsed={false} />
            <SidebarNavItem label="Settings" active={activeTab === "settings"} onClick={() => { onNavigation("settings"); onToggleSidebar(); }} icon="⚙️" collapsed={false} />
            <SidebarNavItem label="My Profile" active={activeTab === "myProfile"} onClick={() => { onNavigation("myProfile"); onToggleSidebar(); }} icon="👤" collapsed={false} />
            
            <div className="border-t border-white/10 my-3 sm:my-4"></div>
            
            <SidebarNavItem label="Home" active={false} onClick={() => { onNavigation("home"); onToggleSidebar(); }} icon="🏠" collapsed={false} />
          </nav>
        </div>

        {/* Mobile User Profile Section */}
        <div className="p-3 sm:p-4 border-t border-white/10 text-white">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-[#851E3E] font-semibold text-xs sm:text-sm">
              {(me?.full_name ? getInitials(me.full_name) : "JD")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-xs sm:text-sm truncate">{me?.full_name || "Guest"}</div>
              <div className="text-xs opacity-80 truncate">{me?.email || ""}</div>
            </div>
            <button onClick={onLogout} className="px-2 py-1 rounded bg-white text-[#851E3E] text-xs font-semibold hover:bg-gray-100 transition-colors">Logout</button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar - Fixed with hover */}
      <aside 
        className={`hidden lg:flex flex-col min-h-screen fixed top-0 left-0 transition-all duration-300 z-50 ${isSidebarExpanded ? 'w-80' : 'w-12'}`} 
        style={{ background: "#851E3E" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Header */}
        <div className="p-3 text-white border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`rounded-full bg-white/10 flex items-center justify-center font-bold ${isSidebarExpanded ? 'w-8 h-8 text-sm' : 'w-6 h-6 text-xs'}`}>BM</div>
            {isSidebarExpanded && (
              <div>
                <div className="font-bold text-sm">BrahmaMatch</div>
                <div className="text-xs opacity-80">Find meaningful matches</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className={`flex-1 ${isSidebarExpanded ? 'p-4' : 'p-2'}`}>
          <nav className="space-y-2">
            <SidebarNavItem label="Dashboard" active={activeTab === "dashboard"} onClick={() => onNavigation("dashboard")} icon="📊" collapsed={!isSidebarExpanded} />
            <SidebarNavItem label="Search" active={activeTab === "search"} onClick={() => onNavigation("search")} icon="🔍" collapsed={!isSidebarExpanded} />
            <SidebarNavItem label="Matches" active={activeTab === "matches"} onClick={() => onNavigation("matches")} icon="💕" collapsed={!isSidebarExpanded} />
            <SidebarNavItem label="Analytics" active={activeTab === "analytics"} onClick={() => onNavigation("analytics")} icon="📈" collapsed={!isSidebarExpanded} />
            <SidebarNavItem label="Settings" active={activeTab === "settings"} onClick={() => onNavigation("settings")} icon="⚙️" collapsed={!isSidebarExpanded} />
            <SidebarNavItem label="My Profile" active={activeTab === "myProfile"} onClick={() => onNavigation("myProfile")} icon="👤" collapsed={!isSidebarExpanded} />
            
            {isSidebarExpanded && <div className="border-t border-white/10 my-4"></div>}
            
            <SidebarNavItem label="Home" active={false} onClick={() => onNavigation("home")} icon="🏠" collapsed={!isSidebarExpanded} />
          </nav>
        </div>

        {/* User Profile Section */}
        <div className={`border-t border-white/10 text-white ${isSidebarExpanded ? 'p-4' : 'p-2'}`}>
          {isSidebarExpanded ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#851E3E] font-semibold text-sm">{me?.full_name ? getInitials(me.full_name) : "JD"}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{me?.full_name || "Guest"}</div>
                <div className="text-xs opacity-80 truncate">{me?.email || ""}</div>
              </div>
              <button onClick={onLogout} className="px-2 py-1 rounded bg-white text-[#851E3E] text-xs font-semibold hover:bg-gray-100 transition-colors" title="Logout">Logout</button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#851E3E] font-semibold text-xs">{me?.full_name ? getInitials(me.full_name) : "JD"}</div>
              <button onClick={onLogout} className="p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors" title="Logout">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarNavItem({ 
  label, 
  active = false, 
  onClick, 
  icon,
  collapsed = false
}: { 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
  icon?: string;
  collapsed?: boolean;
}) {
  return (
    <div 
      className={`rounded-md flex items-center cursor-pointer transition-all duration-200 group relative ${collapsed ? 'p-1.5 justify-center w-10 h-10 mx-auto' : 'p-3 gap-3'} ${active ? 'bg-white/10' : 'hover:bg-white/5'}`}
      onClick={onClick}
      title={collapsed ? label : undefined}
    >
      <div className={`rounded-md bg-white/10 flex items-center justify-center ${collapsed ? 'w-7 h-7 text-sm' : 'w-9 h-9 text-lg'}`}>
        {icon || label[0]}
      </div>
      
      {!collapsed && (
        <div className="text-sm text-white whitespace-nowrap">{label}</div>
      )}
      
      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  );
}

// Helper to get initials
function getInitials(name: string) {
  return name.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
}
