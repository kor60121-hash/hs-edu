import React, { useState } from 'react';
import { X, Users, Search, ChevronRight, UserCheck } from 'lucide-react';
import { SCATTER_STUDENTS_COHORT_A } from '../data/mockData';

interface RosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (studentId: string) => void;
}

export const RosterModal: React.FC<RosterModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filtered = SCATTER_STUDENTS_COHORT_A.filter(
    (st) =>
      st.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      st.id.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00E599]/15 flex items-center justify-center text-[#00E599]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                코호트 학습자 전체 명단 (Cohort A)
              </h3>
              <p className="text-[11px] text-slate-400">
                총 142명 중 등록된 핵심 궤적 인스턴스
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="학생 이름 또는 ID 검색..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-[#080D18] border border-[#1E293B] text-xs text-slate-200 rounded-xl pl-9 pr-4 py-2.5 placeholder:text-slate-500 focus:outline-none focus:border-[#00E599]"
          />
        </div>

        {/* Roster List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {filtered.map((st) => (
            <div
              key={st.id}
              onClick={() => {
                onSelectStudent(st.id);
                onClose();
              }}
              className="p-3 bg-[#131C30]/80 hover:bg-[#182642] border border-[#1E293B] hover:border-[#00E599]/50 rounded-xl flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: st.color }}
                />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-[#00E599] transition-colors">
                    {st.name} ({st.id})
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    기초 성취도: {st.baselineAchievement}% | 속도: {st.growthVelocity}Δ
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`font-mono text-xs font-bold ${
                    st.type === 'star'
                      ? 'text-[#00E599]'
                      : st.type === 'atRisk'
                      ? 'text-[#F59E0B]'
                      : 'text-slate-400'
                  }`}
                >
                  {st.zScore}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#00E599] transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
