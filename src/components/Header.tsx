import React from 'react';
import { TabType } from '../types';
import { Search, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  onOpenNotifications,
  notificationCount,
}) => {
  const navTabs: { id: TabType; label: string }[] = [
    { id: 'simulation', label: '시뮬레이션' },
    { id: 'learner', label: '학습자 프로필' },
    { id: 'cohort', label: '학급관리' },
    { id: 'curriculum', label: '학습경로' },
  ];

  return (
    <header className="h-16 bg-[#0B1120] border-b border-[#1E293B] px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Brand */}
      <div className="flex items-center gap-8">
        <button
          onClick={() => onTabChange('simulation')}
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <span className="text-xl font-bold tracking-tight text-[#00E599] font-sans drop-shadow-[0_0_12px_rgba(0,229,153,0.35)]">
            TwinEngine AI
          </span>
        </button>

        {/* Center-Left: Primary Tabs */}
        <nav className="flex items-center gap-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-4 py-4 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[#00E599] font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00E599] shadow-[0_0_8px_#00E599]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Center Search (Visible in Learner or everywhere) */}
      <div className="flex-1 max-w-xs mx-6 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Data Streams..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#101828] border border-[#1E293B] text-xs text-slate-200 rounded-full pl-9 pr-4 py-2 placeholder:text-slate-500 focus:outline-none focus:border-[#00E599]/60 focus:ring-1 focus:ring-[#00E599]/40 transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          aria-label="알림"
          className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/50 rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00E599] rounded-full shadow-[0_0_6px_#00E599]" />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          aria-label="설정"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]/50 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="relative flex items-center pl-2 border-l border-[#1E293B]">
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#00E599]/40 cursor-pointer group">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User profile"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00E599] rounded-full ring-2 ring-[#0B1120]" />
        </div>
      </div>
    </header>
  );
};
