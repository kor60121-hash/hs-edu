import React, { useState, useMemo } from 'react';
import { StudentProfile, CurriculumTierPlan } from '../types';
import { CURRICULUM_TIER_PLANS } from '../data/mockData';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
} from 'lucide-react';

interface RecommendedLearningPathCardProps {
  student: StudentProfile;
  onClose: () => void;
  onDeleteStudent: (studentId: string) => void;
  onNavigateToCurriculum?: (studentId: string) => void;
}

export const RecommendedLearningPathCard: React.FC<RecommendedLearningPathCardProps> = ({
  student,
  onClose,
  onDeleteStudent,
  onNavigateToCurriculum,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Determine recommended tier based on student score and growth velocity
  const recommendedTier: CurriculumTierPlan = useMemo(() => {
    const score = student.radarScores.achievement;
    const growth = student.radarScores.growth;

    if (score >= 88 && growth >= 80) {
      return CURRICULUM_TIER_PLANS[3]; // Tier 4: 최상위 프론티어
    } else if (score >= 75 || growth >= 75) {
      return CURRICULUM_TIER_PLANS[2]; // Tier 3: 심화 가속
    } else if (score < 60 || student.cognitiveLoad > 75) {
      return CURRICULUM_TIER_PLANS[0]; // Tier 1: 기초 집중 보강
    } else {
      return CURRICULUM_TIER_PLANS[1]; // Tier 2: 표준 역량 강화
    }
  }, [student]);

  const handleDelete = () => {
    onDeleteStudent(student.id);
    onClose();
  };

  return (
    <div className="bg-[#0E1526] border-2 border-[#00E599]/60 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,229,153,0.15)] relative animate-in fade-in zoom-in-95 duration-200">
      {/* Top Bar with Student Info & Close/Delete Controls */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#00E599]/50"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00E599] rounded-full ring-2 ring-[#0E1526]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-100">{student.name}</span>
              <span className="text-xs font-mono text-slate-400">({student.id})</span>
              <span className="px-2 py-0.5 rounded-full bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/40 text-[10px] font-mono font-semibold">
                {student.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              현재 궤적: <span className="text-slate-200 font-medium">{student.trajectoryName}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Delete & Close */}
        <div className="flex items-center gap-2">
          {/* Delete Student Button */}
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1 bg-[#1A101C] border border-rose-500/40 p-1 rounded-lg animate-in fade-in">
              <span className="text-[11px] text-rose-400 font-medium px-1.5">삭제할까요?</span>
              <button
                onClick={handleDelete}
                className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold rounded"
              >
                예
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2 py-1 bg-[#1E293B] hover:bg-[#2A374F] text-slate-300 text-[11px] rounded"
              >
                아니오
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-colors"
              title="시뮬레이션에서 학생 삭제"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>학생 삭제</span>
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-[#1E293B] transition-colors"
            title="닫기 (다시 누르면 사라집니다)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recommended Learning Path Body */}
      <div className="mt-4 space-y-4">
        {/* Student Trajectory Subcategories Progress (소분류 1 & 소분류 2) */}
        {student.trajectorySubcategories && student.trajectorySubcategories.length > 0 && (
          <div className="bg-[#111A2E] p-3.5 rounded-xl border border-[#1E293B] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00E599]" />
                <span>학습 궤적 소분류 진행 현황</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {student.trajectoryName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {student.trajectorySubcategories.map((sub, idx) => (
                <div
                  key={sub.id || idx}
                  className="bg-[#0A101D] p-2.5 rounded-lg border border-[#1E293B] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200 truncate max-w-[200px]" title={sub.name}>
                      {sub.name}
                    </span>
                    <span className="font-mono font-bold text-[#00E599]">
                      {sub.progressPercent ?? 50}%
                    </span>
                  </div>

                  <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00E599] transition-all duration-300"
                      style={{ width: `${sub.progressPercent ?? 50}%` }}
                    />
                  </div>

                  {sub.keyTopics && sub.keyTopics.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {sub.keyTopics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-[#131E35] text-slate-400 border border-[#1E293B]"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111A2E] p-3.5 rounded-xl border border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md"
              style={{
                backgroundColor: `${recommendedTier.accentColor}20`,
                color: recommendedTier.accentColor,
                border: `1px solid ${recommendedTier.accentColor}50`,
              }}
            >
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold text-[#00E599]">
                  AI 맞춤 추천 학습 경로 (Tier {recommendedTier.tierNumber})
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  {recommendedTier.scoreRange}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                {recommendedTier.title} ({recommendedTier.tierName})
              </h3>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400">성장 속도 예측</div>
            <div className="text-xs font-mono font-bold text-[#00E599]">
              {recommendedTier.accelerationPrediction}
            </div>
          </div>
        </div>

        {/* Strategy Summary & Scaffolding */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-[#0A101D] p-3 rounded-xl border border-[#1E293B] space-y-1">
            <div className="text-slate-400 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>특화 전략 요약</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {recommendedTier.strategySummary}
            </p>
          </div>

          <div className="bg-[#0A101D] p-3 rounded-xl border border-[#1E293B] space-y-1">
            <div className="text-slate-400 font-semibold flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>AI 스캐폴딩 기법</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {recommendedTier.aiScaffoldingMethod}
            </p>
          </div>
        </div>

        {/* 3 Step Milestone Pathway Nodes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#00E599]" />
              <span>추천 핵심 학습 로드맵 모듈</span>
            </span>
            <span className="text-[11px] font-mono">예상 기간: {recommendedTier.estimatedWeeks}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {recommendedTier.nodes.slice(0, 3).map((node, idx) => {
              const sub = student.trajectorySubcategories?.[idx];
              const nodeTitle = idx === 0 && sub
                ? sub.name
                : idx === 1 && sub
                ? sub.name
                : idx === 2
                ? `${student.trajectoryName} 융합 실습 및 캡스톤 과제`
                : node.title;

              const nodeDesc = idx === 0 && sub
                ? (sub.description || '기초 개념 분석 및 기저 연산 마스터')
                : idx === 1 && sub
                ? (sub.description || '심화 모델링 설계 및 시뮬레이션 최적화')
                : idx === 2
                ? '고차원 복합 시나리오 검증 및 자율 문제 해결력 극대화'
                : node.description;

              return (
                <div
                  key={node.id}
                  className="bg-[#111A2E] p-3 rounded-xl border border-[#1E293B] space-y-1.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold text-[#00E599]">
                        단계 0{idx + 1}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{node.level}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 mt-1 line-clamp-2" title={nodeTitle}>
                      {nodeTitle}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                      {nodeDesc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#1E293B]/60 text-[10px]">
                    <span className="text-slate-400">성장 기여</span>
                    <span className="font-mono font-bold text-[#00E599]">{node.growthImpact}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA to navigate or close */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
          <span className="text-[11px] text-slate-400">
            * 학생을 다시 클릭하면 이 추천경로 창이 닫힙니다.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#1E293B] hover:bg-[#1E293B] text-slate-300 text-xs transition-colors"
            >
              닫기
            </button>
            {onNavigateToCurriculum && (
              <button
                onClick={() => onNavigateToCurriculum(student.id)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00E599] text-[#0A101D] text-xs font-bold hover:bg-[#00E599]/90 transition-all shadow-[0_0_12px_rgba(0,229,153,0.3)]"
              >
                <span>학습경로 탭에서 전체 확인</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
