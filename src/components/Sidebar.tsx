import React from 'react';
import { TabType } from '../types';
import {
  Activity,
  UserCheck,
  LayoutGrid,
  GitFork,
  Archive,
  Download,
  HelpCircle,
  Terminal,
  Cpu,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onExportReport: () => void;
  onOpenHelp: () => void;
  onOpenLogs: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onExportReport,
  onOpenHelp,
  onOpenLogs,
}) => {
  const menuItems: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'simulation', label: '시뮬레이션', icon: Activity },
    { id: 'learner', label: '학습자 프로필', icon: UserCheck },
    { id: 'cohort', label: '학급관리', icon: LayoutGrid },
    { id: 'curriculum', label: '학습경로', icon: GitFork },
    { id: 'archive', label: '아카이브', icon: Archive },
  ];

  return (
    <aside className="w-60 bg-[#0B1120] border-r border-[#1E293B] flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      {/* Top Section */}
      <div>
        {/* Core Engine Badge */}
        <div className="p-4 border-b border-[#1E293B]/60">
          <div className="flex items-center gap-3 bg-[#111A2E]/80 border border-[#1E293B] rounded-xl p-3 shadow-inner">
            <div className="w-10 h-10 rounded-lg bg-[#00E599]/10 border border-[#00E599]/30 flex items-center justify-center text-[#00E599] shadow-[0_0_12px_rgba(0,229,153,0.2)]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                Core Engine
              </div>
              <div className="text-[11px] font-mono text-[#00E599] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-ping" />
                V2.4 Active
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#132338]/90 text-[#00E599] shadow-[inset_0_0_12px_rgba(0,229,153,0.08)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2E]/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#00E599]' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00E599] rounded-l-full shadow-[0_0_8px_#00E599]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-3 border-t border-[#1E293B]/60">
        {/* Export Report Button */}
        <button
          onClick={onExportReport}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#131C30] hover:bg-[#18233C] text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-[#1E293B] hover:border-slate-600 transition-all shadow-sm group"
        >
          <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00E599] transition-colors" />
          <span>리포트 내보내기</span>
        </button>

        {/* Links */}
        <div className="pt-2 space-y-1 text-xs text-slate-400">
          <button
            onClick={onOpenHelp}
            className="w-full flex items-center gap-2 py-1.5 px-2 hover:text-slate-200 rounded transition-colors text-left"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>고객 지원</span>
          </button>
          <button
            onClick={onOpenLogs}
            className="w-full flex items-center gap-2 py-1.5 px-2 hover:text-slate-200 rounded transition-colors text-left"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>시스템 로그</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
