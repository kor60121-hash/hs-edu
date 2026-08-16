import React, { useState } from 'react';
import {
  TrajectoryParameters,
  MasteryItem,
  EngineStreamAlert,
  StudentProfile,
  CohortCentroid,
} from '../types';
import { SpatialMatrixCanvas } from './SpatialMatrixCanvas';
import { RecommendedLearningPathCard } from './RecommendedLearningPathCard';
import { CohortCentroidModal } from './CohortCentroidModal';
import {
  Sliders,
  BarChart2,
  Sparkles,
  Box,
  RefreshCw,
  Target,
  User,
  Trash2,
  ChevronRight,
  Compass,
  Plus,
  Edit3,
} from 'lucide-react';

interface SimulationViewProps {
  parameters: TrajectoryParameters;
  onUpdateParameters: (params: Partial<TrajectoryParameters>) => void;
  masteryData: MasteryItem[];
  alerts: EngineStreamAlert[];
  students?: StudentProfile[];
  centroids?: CohortCentroid[];
  onAddCentroid?: (centroid: CohortCentroid) => void;
  onDeleteCentroid?: (id: string) => void;
  onRenameCentroid?: (id: string, newName: string) => void;
  onDeleteStudent?: (studentId: string) => void;
  onNavigateToCurriculum?: (studentId: string) => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({
  parameters,
  onUpdateParameters,
  masteryData,
  alerts,
  students = [],
  centroids = [],
  onAddCentroid,
  onDeleteCentroid,
  onRenameCentroid,
  onDeleteStudent,
  onNavigateToCurriculum,
}) => {
  const [timeFilter, setTimeFilter] = useState<'YTD' | 'LIVE'>('LIVE');
  const [deltaVariance, setDeltaVariance] = useState(1.04);
  const [isSimulating, setIsSimulating] = useState(false);

  // Selected student for toggling recommended learning path
  const [selectedStudentForPathId, setSelectedStudentForPathId] = useState<string | null>(null);

  // Modal for Cohort Centroid management
  const [isCentroidModalOpen, setIsCentroidModalOpen] = useState(false);

  // Delete confirmation for student card
  const [studentToDeleteId, setStudentToDeleteId] = useState<string | null>(null);

  const handleSimulateStep = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setDeltaVariance((prev) => +(prev + (Math.random() * 0.08 - 0.03)).toFixed(2));
      setIsSimulating(false);
    }, 600);
  };

  // Toggle student recommended learning path when clicked
  const handleToggleStudentPath = (studentId: string) => {
    if (selectedStudentForPathId === studentId) {
      setSelectedStudentForPathId(null); // Click again to hide/dismiss
    } else {
      setSelectedStudentForPathId(studentId); // Open recommended learning path
    }
  };

  const activePathStudent = students.find((s) => s.id === selectedStudentForPathId) || null;

  const handleDeleteStudentInternal = (studentId: string) => {
    if (selectedStudentForPathId === studentId) {
      setSelectedStudentForPathId(null);
    }
    if (onDeleteStudent) {
      onDeleteStudent(studentId);
    }
    setStudentToDeleteId(null);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">시뮬레이션</h1>
          <p className="text-xs text-slate-400 mt-1">
            실시간 코호트 궤적, 3차원 공간 중심점(Centroid) 및 개별 학생 맞춤 추천경로 시뮬레이션
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Centroid Management Button */}
          <button
            onClick={() => setIsCentroidModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131E33] hover:bg-[#182642] text-[#00E599] text-xs font-semibold rounded-lg border border-[#00E599]/30 transition-all shadow-[0_0_12px_rgba(0,229,153,0.15)]"
          >
            <Target className="w-3.5 h-3.5" />
            <span>코호트 중심점 관리 ({centroids.length})</span>
          </button>

          <button
            onClick={handleSimulateStep}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#131E33] hover:bg-[#182642] text-slate-300 text-xs rounded-lg border border-[#1E293B] transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-[#00E599]' : ''}`}
            />
            <span>동기화 갱신</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00E599]/10 border border-[#00E599]/30 text-[#00E599] text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-ping" />
            <span>LIVE</span>
          </div>
        </div>
      </div>

      {/* Interactive Student Quick-Status Selector Bar (Click to toggle recommended learning path) */}
      <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00E599]" />
            <span className="text-xs font-bold text-slate-200">
              실시간 학생 현황 모니터링 (클릭 시 추천학습경로 토글)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            총 {students.length}명의 디지털 트윈 연결됨
          </span>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {students.map((st) => {
            const isSelected = selectedStudentForPathId === st.id;
            return (
              <div
                key={st.id}
                onClick={() => handleToggleStudentPath(st.id)}
                className={`relative p-3 rounded-xl border transition-all cursor-pointer select-none group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#112238] border-[#00E599] shadow-[0_0_20px_rgba(0,229,153,0.25)] ring-1 ring-[#00E599]'
                    : 'bg-[#111A2E]/90 border-[#1E293B] hover:border-slate-600 hover:bg-[#142038]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={st.avatarUrl}
                      alt={st.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#00E599]/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5">
                        <span>{st.name}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        ID: {st.id}
                      </div>
                    </div>
                  </div>

                  {/* Delete Student Button on Card */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStudentToDeleteId(st.id);
                    }}
                    className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="학생 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Score, Trajectory & Subcategory 1 */}
                <div className="mt-2.5 pt-2 border-t border-[#1E293B]/70 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-semibold truncate max-w-[120px]" title={st.trajectoryName}>
                      {st.trajectoryName}
                    </span>
                    <span className="font-mono font-bold text-[#00E599]">
                      {st.radarScores.achievement}점
                    </span>
                  </div>

                  {st.trajectorySubcategories && st.trajectorySubcategories[0] && (
                    <div className="flex items-center justify-between text-[10px] bg-[#0A101D] px-2 py-1 rounded border border-[#1E293B]">
                      <span className="text-slate-400 truncate max-w-[120px]" title={st.trajectorySubcategories[0].name}>
                        {st.trajectorySubcategories[0].name}
                      </span>
                      <span className="font-mono font-semibold text-[#00E599] shrink-0 ml-1">
                        {st.trajectorySubcategories[0].progressPercent ?? 50}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Toggle Status hint */}
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span className={isSelected ? 'text-[#00E599] font-medium' : 'text-slate-400'}>
                    {isSelected ? '● 추천경로 표시 중 (클릭시 닫힘)' : '클릭하여 추천경로 보기'}
                  </span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${isSelected ? 'rotate-90 text-[#00E599]' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Delete Confirmation Popup in Simulation View */}
        {studentToDeleteId && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-center justify-between animate-in fade-in">
            <span className="text-xs text-rose-300">
              정말 <strong>{students.find((s) => s.id === studentToDeleteId)?.name}</strong> 학생을 삭제하시겠습니까?
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDeleteStudentInternal(studentToDeleteId)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors"
              >
                삭제 확인
              </button>
              <button
                onClick={() => setStudentToDeleteId(null)}
                className="px-3 py-1 bg-[#1E293B] hover:bg-[#2A374F] text-slate-300 rounded-lg text-xs"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Recommended Learning Path Card (Shown when a student is clicked; toggled off if clicked again) */}
      {activePathStudent && (
        <RecommendedLearningPathCard
          student={activePathStudent}
          onClose={() => setSelectedStudentForPathId(null)}
          onDeleteStudent={handleDeleteStudentInternal}
          onNavigateToCurriculum={onNavigateToCurriculum}
        />
      )}

      {/* Main Grid: 3D Spatial Matrix (Left) + Parameters & Mastery (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 3D Spatial Growth Matrix with Centroids and Students */}
        <div className="lg:col-span-2 bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#00E599]/10 flex items-center justify-center text-[#00E599]">
                <Box className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-200 tracking-tight">공간 성장 매트릭스</h2>
                <p className="text-[10px] text-slate-400">
                  {centroids.length}개 코호트 중심점 & {students.length}명 3D 공간 배치
                </p>
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center bg-[#131C30] p-1 rounded-lg border border-[#1E293B] text-xs font-mono">
              <button
                onClick={() => setTimeFilter('YTD')}
                className={`px-3 py-1 rounded-md transition-all ${
                  timeFilter === 'YTD'
                    ? 'bg-[#1E293B] text-slate-200 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                YTD
              </button>
              <button
                onClick={() => setTimeFilter('LIVE')}
                className={`px-3 py-1 rounded-md transition-all ${
                  timeFilter === 'LIVE'
                    ? 'bg-[#00E599]/20 text-[#00E599] font-semibold border border-[#00E599]/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                LIVE
              </button>
            </div>
          </div>

          {/* 3D Visualizer Canvas */}
          <SpatialMatrixCanvas
            parameters={parameters}
            deltaVariance={deltaVariance}
            centroids={centroids}
            students={students}
            selectedStudentId={selectedStudentForPathId}
            onSelectStudent={handleToggleStudentPath}
            onSelectCentroid={() => setIsCentroidModalOpen(true)}
          />

          {/* Bottom Centroids Quick Badges Bar */}
          <div className="mt-3 pt-3 border-t border-[#1E293B]/70 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-medium text-[11px]">코호트 중심점:</span>
              {centroids.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setIsCentroidModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111A2E] border border-[#1E293B] hover:border-slate-600 text-[11px] text-slate-200 transition-colors"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsCentroidModalOpen(true)}
              className="text-[11px] text-[#00E599] hover:underline font-semibold flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>중심점 추가 / 수정 / 삭제</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Trajectory Parameters & Real-Time Mastery */}
        <div className="space-y-6 flex flex-col">
          {/* Top Card: Trajectory Parameters */}
          <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-6 h-6 rounded-md bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200 tracking-tight">궤적 파라미터</h3>
            </div>

            <div className="space-y-4">
              {/* Cognitive Load */}
              <div className="space-y-1.5 bg-[#0A101D] p-2.5 rounded-xl border border-[#1E293B]">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">전체 인지 부하율</span>
                  <span className="text-[#00E599] font-mono font-bold">
                    {parameters.cognitiveLoad}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={parameters.cognitiveLoad}
                  onChange={(e) =>
                    onUpdateParameters({ cognitiveLoad: Number(e.target.value) })
                  }
                  className="w-full accent-[#00E599] h-2 bg-[#172033] rounded-lg cursor-pointer transition-all"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>10% (여유)</span>
                  <span>50% (적정)</span>
                  <span>100% (과부하)</span>
                </div>
              </div>

              {/* Learning Engagement */}
              <div className="space-y-1.5 bg-[#0A101D] p-2.5 rounded-xl border border-[#1E293B]">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">학습 참여도</span>
                  <span className="text-[#A78BFA] font-mono font-bold">
                    {parameters.engagement}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={parameters.engagement}
                  onChange={(e) =>
                    onUpdateParameters({ engagement: Number(e.target.value) })
                  }
                  className="w-full accent-[#A78BFA] h-2 bg-[#172033] rounded-lg cursor-pointer transition-all"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>10% (소극적)</span>
                  <span>50% (표준)</span>
                  <span>100% (적극적)</span>
                </div>
              </div>

              {/* Environmental Friction Coefficient */}
              <div className="space-y-1.5 bg-[#0A101D] p-2.5 rounded-xl border border-[#1E293B]">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">환경적 마찰 계수</span>
                  <span className="text-[#F59E0B] font-mono font-bold">
                    {parameters.friction}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={parameters.friction}
                  onChange={(e) =>
                    onUpdateParameters({ friction: Number(e.target.value) })
                  }
                  className="w-full accent-[#F59E0B] h-2 bg-[#172033] rounded-lg cursor-pointer transition-all"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>5% (원활)</span>
                  <span>25% (보통)</span>
                  <span>50% (저항 큼)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Card: Real-Time Mastery Status */}
          <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-6 h-6 rounded-md bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8]">
                <BarChart2 className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-200 tracking-tight">
                실시간 마스터리 현황
              </h3>
            </div>

            <div className="space-y-4">
              {/* Logical Modality */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">논리적 모달리티</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    목표: {masteryData[0]?.target || 90}
                  </span>
                </div>
                <div className="h-3 bg-[#172033] rounded-md overflow-hidden flex gap-0.5 p-0.5">
                  <div
                    className="h-full bg-[#00E599] rounded-sm transition-all"
                    style={{ width: `${masteryData[0]?.completed || 65}%` }}
                  />
                  <div
                    className="h-full bg-[#A78BFA] rounded-sm transition-all"
                    style={{ width: `${masteryData[0]?.inProgress || 25}%` }}
                  />
                </div>
              </div>

              {/* Spatial Reasoning */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">공간적 추론</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    목표: {masteryData[1]?.target || 85}
                  </span>
                </div>
                <div className="h-3 bg-[#172033] rounded-md overflow-hidden flex gap-0.5 p-0.5">
                  <div
                    className="h-full bg-[#00E599] rounded-sm transition-all"
                    style={{ width: `${masteryData[1]?.completed || 70}%` }}
                  />
                  <div
                    className="h-full bg-[#F59E0B] rounded-sm transition-all"
                    style={{ width: `${masteryData[1]?.inProgress || 15}%` }}
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-400 border-t border-[#1E293B]/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#00E599]" />
                  <span>습득 완료</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#A78BFA]" />
                  <span>진행 중</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Engine Output Stream */}
      <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#00E599]" />
          <h3 className="text-sm font-bold text-slate-200 tracking-tight">엔진 출력 스트림</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-[#111A2E]/90 border-l-2 rounded-r-xl p-4 bg-gradient-to-r from-transparent to-[#131C30]/40 transition-all hover:bg-[#131E33]"
              style={{
                borderLeftColor:
                  alert.type === 'system'
                    ? '#00E599'
                    : alert.type === 'cohort'
                    ? '#818CF8'
                    : '#F59E0B',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">{alert.title}</span>
                {alert.timestamp && (
                  <span className="text-[10px] font-mono text-slate-500">
                    {alert.timestamp}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Centroid Modal */}
      <CohortCentroidModal
        isOpen={isCentroidModalOpen}
        onClose={() => setIsCentroidModalOpen(false)}
        centroids={centroids}
        onAddCentroid={(c) => {
          if (onAddCentroid) onAddCentroid(c);
        }}
        onDeleteCentroid={(id) => {
          if (onDeleteCentroid) onDeleteCentroid(id);
        }}
        onRenameCentroid={(id, newName) => {
          if (onRenameCentroid) onRenameCentroid(id, newName);
        }}
      />
    </div>
  );
};
