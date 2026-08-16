import React, { useState, useMemo } from 'react';
import { CurriculumNode, CurriculumTierPlan, StudentProfile } from '../types';
import { CURRICULUM_TIER_PLANS, SCATTER_STUDENTS_COHORT_A } from '../data/mockData';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  Activity,
  Sliders,
  Sparkles,
  Layers,
  Award,
  Clock,
  Tag,
  Compass,
  FileText,
  Check,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Plus,
  BarChart3,
} from 'lucide-react';

interface CurriculumViewProps {
  nodes?: CurriculumNode[];
  onStartModule: (node?: CurriculumNode) => void;
  onOpenDigitalTwinSimulation: () => void;
  activeStudent?: StudentProfile;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  nodes,
  onStartModule,
  onOpenDigitalTwinSimulation,
  activeStudent,
}) => {
  // Available 4 tier plans
  const [tierPlans, setTierPlans] = useState<CurriculumTierPlan[]>(CURRICULUM_TIER_PLANS);

  // Selected Active Tier Tab (Default to Tier 2 or calculated)
  const [selectedTierId, setSelectedTierId] = useState<string>('tier2_standard');

  // Currently Enrolled/Applied Active Plan
  const [appliedPlanId, setAppliedPlanId] = useState<string>('tier2_standard');

  // Simulation parameters for student classification
  const [simScore, setSimScore] = useState<number>(activeStudent ? activeStudent.radarScores.achievement : 68);
  const [simGrowthVelocity, setSimGrowthVelocity] = useState<number>(38);
  const [selectedStudentPreset, setSelectedStudentPreset] = useState<string>(activeStudent ? activeStudent.id : 'DT-894-X');

  // Matrix Comparison View Toggle
  const [showMatrix, setShowMatrix] = useState<boolean>(false);

  // Toast / Confirmation state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Automatically diagnose the recommended tier based on Score & Growth Velocity
  const recommendedTier = useMemo(() => {
    // 4-Tier Logic:
    // Tier 1: Score < 50 OR Growth Velocity < -15 (Friction/At-risk)
    // Tier 4: Score >= 90 AND Growth Velocity >= 35 (Mastery Frontier)
    // Tier 3: Score >= 75 OR (Score >= 65 AND Growth Velocity >= 25) (Advanced Acceleration)
    // Tier 2: Standard (Score 50~75, Growth Velocity -15~+25)
    if (simScore >= 90 && simGrowthVelocity >= 35) {
      return tierPlans.find((t) => t.id === 'tier4_mastery') || tierPlans[3];
    } else if (simScore >= 75 || (simScore >= 65 && simGrowthVelocity >= 25)) {
      return tierPlans.find((t) => t.id === 'tier3_advanced') || tierPlans[2];
    } else if (simScore < 50 || simGrowthVelocity < -15) {
      return tierPlans.find((t) => t.id === 'tier1_foundational') || tierPlans[0];
    } else {
      return tierPlans.find((t) => t.id === 'tier2_standard') || tierPlans[1];
    }
  }, [simScore, simGrowthVelocity, tierPlans]);

  // Current active tier data being inspected
  const currentTier = tierPlans.find((t) => t.id === selectedTierId) || tierPlans[1];

  // Handle student preset selection
  const handleSelectStudentPreset = (studentId: string) => {
    setSelectedStudentPreset(studentId);
    if (studentId === 'DT-894-X') {
      setSimScore(76);
      setSimGrowthVelocity(38);
    } else {
      const match = SCATTER_STUDENTS_COHORT_A.find((s) => s.id === studentId);
      if (match) {
        setSimScore(match.baselineAchievement);
        setSimGrowthVelocity(match.growthVelocity);
      }
    }
  };

  // Apply track as current active learning plan
  const handleApplyLearningPlan = (tier: CurriculumTierPlan) => {
    setAppliedPlanId(tier.id);
    setToastMessage(`[${tier.title}]이(가) 학생의 공식 맞춤형 학습 계획으로 승인 및 적용되었습니다.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Switch to recommended tier
  const handleApplyRecommended = () => {
    setSelectedTierId(recommendedTier.id);
    handleApplyLearningPlan(recommendedTier);
  };

  // Add custom node to current tier
  const handleAddCustomNode = () => {
    const newNode: CurriculumNode = {
      id: `custom-node-${Date.now()}`,
      level: `Lvl ${currentTier.tierNumber} (Custom)`,
      status: 'locked',
      title: '맞춤형 심화 샌드박스 랩 과제',
      description: '학생의 취약 모달리티 분석에 기초한 AI 자동 생성 개별화 심화 실습 모듈.',
      growthImpact: '+15.0%',
      progressPercent: 0,
      estimatedHours: '4시간',
      tags: ['맞춤형 과제', '실습 샌드박스', 'AI 튜터링'],
    };

    setTierPlans((prev) =>
      prev.map((t) =>
        t.id === currentTier.id
          ? { ...t, nodes: [...t.nodes, newNode] }
          : t
      )
    );

    setToastMessage(`[${currentTier.title}]에 새로운 커스텀 학습 노드가 추가되었습니다.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-7 pb-10">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E172A] border-2 border-[#00E599] text-slate-100 px-5 py-3.5 rounded-xl shadow-[0_0_30px_rgba(0,229,153,0.35)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#00E599] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
            <span className="text-xs font-mono font-semibold text-[#00E599]">
              4단계 점수대·성장도 기반 적응형 학습경로 엔진
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
            학습경로
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            학생의 기준 성취도(점수대)와 실시간 성장 속도(성장 지수 Δ)를 진단하여 4가지 분류의 특화 학습경로 트랙으로 세분화하고, 최적화된 학습 계획을 수립합니다.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl border transition-all ${
              showMatrix
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                : 'bg-[#101B2E] hover:bg-[#152540] text-slate-300 border-[#1E293B]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>4단계 비교 매트릭스 {showMatrix ? '닫기' : '보기'}</span>
          </button>

          <button
            onClick={onOpenDigitalTwinSimulation}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#101B2E] hover:bg-[#152540] text-[#00E599] text-xs font-bold rounded-xl border border-[#00E599]/40 shadow-[0_0_15px_rgba(0,229,153,0.15)] hover:shadow-[0_0_20px_rgba(0,229,153,0.3)] transition-all group"
          >
            <Activity className="w-4 h-4 text-[#00E599] group-hover:scale-110 transition-transform" />
            <span>디지털 트윈 시뮬레이션</span>
          </button>
        </div>
      </div>

      {/* 4-Tier Interactive Pathway Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tierPlans.map((tier) => {
          const isSelected = selectedTierId === tier.id;
          const isApplied = appliedPlanId === tier.id;
          const isRecommended = recommendedTier.id === tier.id;

          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                isSelected
                  ? 'bg-[#0F192E] border-2 shadow-lg ring-1'
                  : 'bg-[#0B1220]/90 border-[#1E293B] hover:border-slate-600 hover:bg-[#0E1627]'
              }`}
              style={{
                borderColor: isSelected ? tier.accentColor : undefined,
                boxShadow: isSelected ? `0 0 20px ${tier.accentColor}25` : undefined,
              }}
            >
              {/* Card Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${tier.badgeColor}`}
                  >
                    {tier.tierNumber}단계 트랙
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isRecommended && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/50 animate-pulse flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI 추천
                      </span>
                    )}
                    {isApplied && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        적용 중
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100 leading-snug">
                  {tier.tierName}
                </h3>

                {/* Score & Growth Criteria Badge */}
                <div className="mt-3 space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-400 bg-[#080D18] px-2.5 py-1 rounded-lg border border-[#1E293B]/60">
                    <span className="text-slate-500">기준 점수대</span>
                    <span className="font-bold text-slate-200">{tier.scoreRange}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 bg-[#080D18] px-2.5 py-1 rounded-lg border border-[#1E293B]/60">
                    <span className="text-slate-500">성장 속도</span>
                    <span className="font-bold text-slate-300 truncate max-w-[110px]">{tier.growthVelocityLabel}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {tier.strategySummary}
                </p>
              </div>

              {/* Card Footer Key Stats */}
              <div className="mt-4 pt-3 border-t border-[#1E293B]/80 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{tier.estimatedWeeks}</span>
                </div>
                <div
                  className="font-mono font-bold"
                  style={{ color: tier.accentColor }}
                >
                  {tier.accelerationPrediction}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4-Tier Matrix Comparison Panel (Collapsible) */}
      {showMatrix && (
        <div className="bg-[#0B1220] border-2 border-purple-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-in fade-in duration-300 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-slate-100">
                4단계 맞춤형 커리큘럼 트랙 종합 비교 매트릭스
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              학생 역량 세분화 4분면 체계
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1E293B] text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">단계 분류</th>
                  <th className="py-2.5 px-3">대상 점수대</th>
                  <th className="py-2.5 px-3">성장 속도(Δ) 기준</th>
                  <th className="py-2.5 px-3">주요 학습 역량</th>
                  <th className="py-2.5 px-3">AI 스캐폴딩 / 개입 방식</th>
                  <th className="py-2.5 px-3">예측 가속도</th>
                  <th className="py-2.5 px-3 text-right">선택</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/60 text-slate-300">
                {tierPlans.map((tier) => (
                  <tr
                    key={tier.id}
                    className={`hover:bg-[#101A2E] transition-colors ${
                      selectedTierId === tier.id ? 'bg-[#101A2E]/80 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${tier.badgeColor}`}
                      >
                        {tier.tierNumber}단계: {tier.tierName.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-200">
                      {tier.scoreRange}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {tier.growthVelocityLabel}
                    </td>
                    <td className="py-3 px-3 max-w-[220px]">
                      <div className="flex flex-wrap gap-1">
                        {tier.keyCompetencies.slice(0, 2).map((comp, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#1E293B] px-1.5 py-0.5 rounded text-slate-300"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-[240px]">
                      {tier.aiScaffoldingMethod}
                    </td>
                    <td
                      className="py-3 px-3 font-mono font-bold"
                      style={{ color: tier.accentColor }}
                    >
                      {tier.accelerationPrediction}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          selectedTierId === tier.id
                            ? 'bg-[#00E599] text-[#0A101D] font-bold border-[#00E599]'
                            : 'bg-[#131E33] text-slate-300 border-[#1E293B] hover:border-slate-500'
                        }`}
                      >
                        {selectedTierId === tier.id ? '확인 중' : '조회하기'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adaptive Diagnosis & Learning Plan Configurator */}
      <div className="bg-[#0B1220] border border-[#1E293B] rounded-2xl p-6 shadow-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/40 flex items-center justify-center text-[#00E599]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>학생 맞춤형 트랙 실시간 진단 & 플래너</span>
                <span className="text-xs font-normal text-slate-400 font-mono">
                  (Diagnostic Engine)
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                학생의 성취도 점수와 성장 속도를 조정하여 최적의 4단계 학습 트랙을 즉시 판별하고 계획에 반영합니다.
              </p>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
              코호트 학생 선택:
            </span>
            <select
              value={selectedStudentPreset}
              onChange={(e) => handleSelectStudentPreset(e.target.value)}
              className="bg-[#080D18] border border-[#1E293B] text-slate-200 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-[#00E599]"
            >
              <option value="DT-894-X">Alex Rivera (현재 학생, 76점 / +38Δ)</option>
              {SCATTER_STUDENTS_COHORT_A.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id}, {s.baselineAchievement}점 / {s.growthVelocity > 0 ? `+${s.growthVelocity}` : s.growthVelocity}Δ)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sliders Grid & Diagnostic Result */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-5 bg-[#080D18] p-4 md:p-5 rounded-xl border border-[#1E293B]">
            {/* Baseline Score Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#00E599]" />
                  학생 성취도 점수대 (Baseline Achievement)
                </span>
                <span className="font-mono font-bold text-sm text-[#00E599]">
                  {simScore}점 / 100점
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={simScore}
                onChange={(e) => setSimScore(Number(e.target.value))}
                className="w-full accent-[#00E599] cursor-pointer h-2 bg-[#172033] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0점 (하위 기초)</span>
                <span>50점 (표준 진입)</span>
                <span>75점 (심화 도약)</span>
                <span>100점 (최상위)</span>
              </div>
            </div>

            {/* Growth Velocity Slider */}
            <div className="space-y-2 pt-2 border-t border-[#1E293B]/70">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  성장 속도 지수 (Growth Velocity Δ)
                </span>
                <span
                  className={`font-mono font-bold text-sm ${
                    simGrowthVelocity > 0 ? 'text-[#00E599]' : 'text-[#F87171]'
                  }`}
                >
                  {simGrowthVelocity > 0 ? `+${simGrowthVelocity}` : simGrowthVelocity} Δ
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={simGrowthVelocity}
                onChange={(e) => setSimGrowthVelocity(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-2 bg-[#172033] rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>-50Δ (인지 마찰/정체)</span>
                <span>0Δ (안정 선형)</span>
                <span>+25Δ (가속 성장)</span>
                <span>+50Δ (초고속 도약)</span>
              </div>
            </div>
          </div>

          {/* AI Recommended Verdict Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F192E] to-[#0A101D] border-2 border-[#00E599]/60 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-[0_0_20px_rgba(0,229,153,0.12)]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  AI 실시간 진단 결과
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  최적 매칭
                </span>
              </div>

              <div className="mt-2.5">
                <div className="text-xs text-slate-400">추천 커리큘럼 분류:</div>
                <div className="text-base font-bold text-slate-100 mt-0.5 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: recommendedTier.accentColor }}
                  />
                  <span>{recommendedTier.title}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {recommendedTier.strategySummary}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#1E293B]">
              <button
                onClick={handleApplyRecommended}
                className="flex-1 py-2.5 bg-[#00E599] hover:bg-[#00E599]/90 text-[#0A101D] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,229,153,0.3)] transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>추천 트랙으로 계획 적용</span>
              </button>

              <button
                onClick={() => setSelectedTierId(recommendedTier.id)}
                className="px-3 py-2.5 bg-[#142038] hover:bg-[#1A2A4A] text-slate-200 text-xs font-semibold rounded-xl border border-[#1E293B] transition-colors"
                title="상세 노드 로드맵 보기"
              >
                상세 로드맵
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Selected Tier Detail & Pathway Roadmap */}
      <div className="space-y-6">
        {/* Tier Header Banner */}
        <div
          className="bg-[#0B1220] border rounded-2xl p-6 relative overflow-hidden"
          style={{ borderColor: `${currentTier.accentColor}60` }}
        >
          {/* Glowing gradient backdrop accent */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ backgroundColor: currentTier.accentColor }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${currentTier.badgeColor}`}
                >
                  {currentTier.tierNumber}단계 분류
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentTier.scoreRange} | {currentTier.growthVelocityLabel}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-100">
                {currentTier.title}
              </h2>
            </div>

            {/* Plan Application Button */}
            <div className="flex items-center gap-2.5">
              {appliedPlanId === currentTier.id ? (
                <div className="px-4 py-2 bg-[#00E599]/15 border border-[#00E599]/50 text-[#00E599] text-xs font-bold rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>현재 활성 학습 계획으로 적용됨</span>
                </div>
              ) : (
                <button
                  onClick={() => handleApplyLearningPlan(currentTier)}
                  className="px-4 py-2 bg-[#132038] hover:bg-[#1A2D4F] text-slate-200 text-xs font-bold rounded-xl border border-slate-600 hover:border-[#00E599] transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>이 트랙을 활성 계획으로 지정</span>
                </button>
              )}

              <button
                onClick={handleAddCustomNode}
                className="px-3.5 py-2 bg-[#101B2E] hover:bg-[#162742] text-slate-300 text-xs font-semibold rounded-xl border border-[#1E293B] flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#00E599]" />
                <span>커스텀 노드 추가</span>
              </button>
            </div>
          </div>

          {/* Key Competencies & AI Scaffolding Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-2">
            <div className="bg-[#080D18] p-3.5 rounded-xl border border-[#1E293B]">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-[#00E599]" />
                <span>핵심 습득 역량 (Target Competencies)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentTier.keyCompetencies.map((comp, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-[#101B2E] text-slate-200 border border-[#1E293B] px-2.5 py-1 rounded-lg font-medium"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#080D18] p-3.5 rounded-xl border border-[#1E293B]">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>AI 적응형 스캐폴딩 및 개입 전략</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentTier.aiScaffoldingMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Pathway Graph Layout */}
        <div className="relative pl-6 md:pl-10 space-y-8 pt-2">
          {/* Continuous Glowing Vertical Trace Line */}
          <div
            className="absolute left-[31px] md:left-[47px] top-6 bottom-10 w-[2px] bg-gradient-to-b"
            style={{
              backgroundImage: `linear-gradient(to bottom, ${currentTier.accentColor}, ${currentTier.accentColor}40, #1E293B)`,
            }}
          />

          {currentTier.nodes.map((node, index) => {
            const isCompleted = node.status === 'completed';
            const isActive = node.status === 'active';
            const isLocked = node.status === 'locked';

            return (
              <div key={node.id} className="relative flex items-start gap-6 group">
                {/* Node Connector Circle */}
                <div className="relative z-10 shrink-0 mt-6">
                  {isCompleted ? (
                    <div
                      className="w-7 h-7 rounded-full text-[#0A101D] flex items-center justify-center"
                      style={{
                        backgroundColor: currentTier.accentColor,
                        boxShadow: `0 0 12px ${currentTier.accentColor}`,
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isActive ? (
                    <div
                      className="w-7 h-7 rounded-full bg-[#0E1526] border-2 flex items-center justify-center animate-pulse"
                      style={{
                        borderColor: currentTier.accentColor,
                        boxShadow: `0 0 15px ${currentTier.accentColor}`,
                      }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: currentTier.accentColor }}
                      />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#0E1526] border border-[#1E293B] flex items-center justify-center text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Node Card */}
                <div
                  className={`flex-1 max-w-3xl rounded-2xl p-6 transition-all duration-300 ${
                    isActive
                      ? 'bg-[#0E172A] border-2 shadow-xl ring-1'
                      : isCompleted
                      ? 'bg-[#0E1526] border border-[#1E293B] shadow-md hover:border-slate-600'
                      : 'bg-[#0A101D]/70 border border-[#1E293B]/60 opacity-70'
                  }`}
                  style={{
                    borderColor: isActive ? currentTier.accentColor : undefined,
                    boxShadow: isActive ? `0 0 25px ${currentTier.accentColor}20` : undefined,
                  }}
                >
                  {/* Header & Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold"
                          style={{ color: currentTier.accentColor }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          학습 완료
                        </span>
                      ) : isActive ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                          style={{
                            backgroundColor: `${currentTier.accentColor}15`,
                            color: currentTier.accentColor,
                            borderColor: `${currentTier.accentColor}40`,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-ping"
                            style={{ backgroundColor: currentTier.accentColor }}
                          />
                          현재 집중 학습 모듈
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <Lock className="w-3 h-3" />
                          잠금됨 (선행 노드 완료 필요)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {node.estimatedHours && (
                        <span className="text-[10px] font-mono text-slate-400 bg-[#080D18] px-2 py-0.5 rounded border border-[#1E293B] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {node.estimatedHours}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          isActive
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 font-bold'
                            : 'bg-[#1E293B] text-slate-400'
                        }`}
                      >
                        {node.level}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight">
                    {node.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {node.description}
                  </p>

                  {/* Tags */}
                  {node.tags && node.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {node.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-[#080D18] text-slate-400 border border-[#1E293B] px-2 py-0.5 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Growth Impact Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-[#1E293B]/70 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        {isCompleted ? '실현된 성장 영향도' : '예상 성장 영향도'}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          isCompleted || isActive ? 'text-slate-200' : 'text-slate-500'
                        }`}
                        style={{
                          color: isCompleted || isActive ? currentTier.accentColor : undefined,
                        }}
                      >
                        {node.growthImpact}
                      </span>
                    </div>

                    <div className="h-2 bg-[#172033] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${node.progressPercent}%`,
                          backgroundColor:
                            isCompleted || isActive ? currentTier.accentColor : '#475569',
                          boxShadow:
                            isCompleted || isActive
                              ? `0 0 10px ${currentTier.accentColor}`
                              : undefined,
                        }}
                      />
                    </div>
                  </div>

                  {/* Active Action Button */}
                  {isActive && (
                    <div className="mt-5">
                      <button
                        onClick={() => onStartModule(node)}
                        className="w-full py-2.5 text-[#0A101D] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                        style={{
                          backgroundColor: currentTier.accentColor,
                          boxShadow: `0 0 15px ${currentTier.accentColor}50`,
                        }}
                      >
                        <span>실시간 신경망 훈련 랩 시작하기</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
