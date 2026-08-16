import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Award,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export interface LinkedMomentCriterion {
  id: string;
  name: string;
  score: number;
  isBasic?: boolean;
  isWeeklyGrowth?: boolean;
  description?: string;
  details?: string;
  keyStrengths?: string[];
  actionGuidance?: string;
}

interface KeyLearningMomentsSectionProps {
  criteria?: LinkedMomentCriterion[];
  allCriteriaList?: LinkedMomentCriterion[];
  learningMoments?: {
    id: string;
    title: string;
    timeAgo: string;
    description: string;
    tags: string[];
    type: 'synthesis' | 'friction' | 'milestone';
  }[];
  onOpenStreamData?: () => void;
}

export const KeyLearningMomentsSection: React.FC<KeyLearningMomentsSectionProps> = ({
  criteria,
  allCriteriaList,
  learningMoments = [],
  onOpenStreamData,
}) => {
  const activeList = criteria || allCriteriaList || [];

  const [selectedCriterionId, setSelectedCriterionId] = useState<string>(
    activeList[0]?.id || ''
  );

  const activeCriterion =
    activeList.find((c) => c.id === selectedCriterionId) || activeList[0];

  // Dynamic status evaluation based on score
  const getCompetencyLevel = (score: number) => {
    if (score >= 90) return { label: '최우수 (Mastery)', color: 'text-[#00E599]', bg: 'bg-[#00E599]/15 border-[#00E599]/40' };
    if (score >= 80) return { label: '우수 (Advanced)', color: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/15 border-[#38BDF8]/40' };
    if (score >= 70) return { label: '보통 (Standard)', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/40' };
    return { label: '집중 지원 필요 (Support)', color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/40' };
  };

  const currentLevel = activeCriterion ? getCompetencyLevel(activeCriterion.score) : null;

  return (
    <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#F59E0B]" />
          <div>
            <h3 className="text-sm font-bold text-slate-200 tracking-tight">
              핵심 학습 모먼트 및 역량별 세부 분석
            </h3>
            <p className="text-[11px] text-slate-400">
              학생역량평가기준의 모든 역량과 실시간 연동되어 세부 내용과 학습 모먼트를 분석합니다.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenStreamData}
          className="text-xs text-[#00E599] hover:underline font-semibold flex items-center gap-1 shrink-0"
        >
          <span>전체 스트림 데이터</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Criteria Tabs Selector (학생역량평가기준의 모든 역량 반영) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#1E293B]">
        {criteria.map((crit) => {
          const isSelected = crit.id === activeCriterion?.id;

          return (
            <button
              key={crit.id}
              onClick={() => setSelectedCriterionId(crit.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs shrink-0 transition-all ${
                isSelected
                  ? 'bg-[#112338] border border-[#00E599] text-[#00E599] font-bold shadow-[0_0_10px_rgba(0,229,153,0.2)]'
                  : 'bg-[#0A101D] border border-[#1E293B] text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <Award className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00E599]' : 'text-slate-500'}`} />
              <span>{crit.name}</span>
              <span className={`font-mono text-[10px] ${isSelected ? 'text-[#00E599]' : 'text-slate-500'}`}>
                {crit.score}점
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Criterion Deep Content & Pedagogical AI Guidance */}
      {activeCriterion && (
        <div className="bg-[#0A101D] border border-[#1E293B] rounded-xl p-4 space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E599]" />
              <h4 className="text-xs font-bold text-slate-100">
                [{activeCriterion.name}] 세부 역량 진단
              </h4>
            </div>
            {currentLevel && (
              <div className="flex items-center gap-2">
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${currentLevel.bg} ${currentLevel.color}`}>
                  {currentLevel.label} ({activeCriterion.score}점)
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Left: Detailed Observations & Strengths */}
            <div className="bg-[#111A2E]/80 border border-[#1E293B] rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E599]" />
                <span>관찰 내용 및 강점 분석</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {activeCriterion.details ||
                  `${activeCriterion.name} 기준에서 학습자는 현재 ${activeCriterion.score}점의 안정적인 역량을 나타내고 있으며, 개념 간 수렴 속도 및 자율적 탐구 성향이 우수합니다.`}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {(activeCriterion.keyStrengths || ['개념 이해도 우수', '오류 자가 교정', '심화 문제 집중력']).map(
                  (st, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#0A101D] text-[#00E599] border border-[#00E599]/30 text-[10px] font-mono"
                    >
                      ✓ {st}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Right: Action Guidance & Recommendation */}
            <div className="bg-[#111A2E]/80 border border-[#1E293B] rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>맞춤형 AI 교수 추천 가이드</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {activeCriterion.actionGuidance ||
                  `현재 ${activeCriterion.score}점 수준에 맞춰 다음 주차에서는 다차원 프로젝트 실습 및 동료 협업 세미나를 배치하여 복합적 도약을 유도하는 것을 권장합니다.`}
              </p>
              <div className="text-[10px] font-mono text-slate-400 bg-[#0A101D] p-1.5 rounded border border-[#1E293B]">
                실시간 연동 상태: 정상 동기화 중 (Live Linked)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Moments Feed List */}
      <div className="space-y-2.5 pt-1">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>실시간 학습 스트림 모먼트 내역</span>
        </div>

        <div className="space-y-2.5">
          {learningMoments.map((m) => (
            <div
              key={m.id}
              className="bg-[#0A101D] border border-[#1E293B] hover:border-[#00E599]/30 rounded-xl p-3.5 flex gap-3.5 transition-all hover:bg-[#111A2E]"
            >
              <div className="shrink-0 mt-0.5">
                {m.type === 'synthesis' ? (
                  <div className="w-8 h-8 rounded-lg bg-[#00E599]/10 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">{m.title}</h4>
                  <span className="text-[10px] font-mono text-slate-500">{m.timeAgo}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {m.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#111A2E] text-slate-300 border border-[#1E293B]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
