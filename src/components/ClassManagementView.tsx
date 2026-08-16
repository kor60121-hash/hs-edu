import React, { useState } from 'react';
import {
  StudentScatterPoint,
  HeatmapRow,
} from '../types';
import { Network, TrendingUp, Grid, Users } from 'lucide-react';

interface ClassManagementViewProps {
  students: StudentScatterPoint[];
  highGrowthList: { id: string; score: string; percent: number; color: string }[];
  heatmapData: HeatmapRow[];
  onSelectStudent?: (studentId: string) => void;
  onOpenRosterModal?: () => void;
}

export const ClassManagementView: React.FC<ClassManagementViewProps> = ({
  students,
  highGrowthList,
  heatmapData,
  onSelectStudent,
  onOpenRosterModal,
}) => {
  const [selectedCohort, setSelectedCohort] = useState<'Cohort A' | 'Cohort B'>('Cohort A');
  const [hoveredStudent, setHoveredStudent] = useState<StudentScatterPoint | null>(null);

  // Scatter plot coordinate bounds
  const scatterWidth = 520;
  const scatterHeight = 280;
  const padding = 40;

  // X maps growth velocity (-50 to +50) to (padding to scatterWidth - padding)
  const getX = (velocity: number) => {
    return padding + ((velocity + 50) / 100) * (scatterWidth - padding * 2);
  };

  // Y maps baseline achievement (0 to 100) to (scatterHeight - padding to padding)
  const getY = (achievement: number) => {
    return scatterHeight - padding - (achievement / 100) * (scatterHeight - padding * 2);
  };

  const getHeatmapColor = (status: string) => {
    switch (status) {
      case 'mastery':
        return 'bg-[#00E599] text-[#0A101D] shadow-[0_0_10px_rgba(0,229,153,0.3)]';
      case 'high':
        return 'bg-[#10B981]/70 text-slate-100';
      case 'gap':
        return 'bg-[#F87171]/70 text-slate-100 shadow-[0_0_8px_rgba(248,113,113,0.3)]';
      case 'neutral':
      default:
        return 'bg-[#1E293B] text-slate-400';
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              학급관리
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00E599]/15 border border-[#00E599]/40 text-[#00E599] text-xs font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            실시간 코호트 궤적 및 역량 맵핑
          </p>
        </div>

        {/* Cohort Switcher Pill */}
        <div className="bg-[#131C30] p-1 rounded-xl border border-[#1E293B] flex items-center gap-1">
          {(['Cohort A', 'Cohort B'] as const).map((cohort) => (
            <button
              key={cohort}
              onClick={() => setSelectedCohort(cohort)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCohort === cohort
                  ? 'bg-[#1E293B] text-slate-100 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cohort}
            </button>
          ))}
        </div>
      </div>

      {/* Top Row: Scatter Plot (2/3) + High-Growth Potential (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scatter Plot Card */}
        <div className="lg:col-span-2 bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-[#00E599]" />
                <h3 className="text-sm font-bold text-slate-200 tracking-tight">
                  성취도 대비 성장 궤적
                </h3>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                N=142 STUDENTS
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] shadow-[0_0_6px_#00E599]" />
                <span>예상치</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]" />
                <span>위험군</span>
              </div>
            </div>
          </div>

          {/* 4-Quadrant Scatter SVG */}
          <div className="relative h-[290px] w-full flex items-center justify-center">
            <svg
              viewBox={`0 0 ${scatterWidth} ${scatterHeight}`}
              className="w-full h-full overflow-visible"
            >
              {/* Outer Border Box */}
              <rect
                x={padding}
                y={padding}
                width={scatterWidth - padding * 2}
                height={scatterHeight - padding * 2}
                fill="rgba(15, 23, 42, 0.4)"
                stroke="#1E293B"
                strokeWidth="1"
              />

              {/* Crosshair Dividers (Quadrants) */}
              <line
                x1={scatterWidth / 2}
                y1={padding}
                x2={scatterWidth / 2}
                y2={scatterHeight - padding}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1={padding}
                y1={scatterHeight / 2}
                x2={scatterWidth - padding}
                y2={scatterHeight / 2}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Y Axis Label */}
              <text
                x={padding - 10}
                y={scatterHeight / 2}
                transform={`rotate(-90 ${padding - 10} ${scatterHeight / 2})`}
                textAnchor="middle"
                fill="#64748B"
                fontSize="10"
                fontFamily="sans-serif"
              >
                기초 성취도
              </text>

              {/* X Axis Label */}
              <text
                x={scatterWidth / 2}
                y={scatterHeight - 12}
                textAnchor="middle"
                fill="#64748B"
                fontSize="10"
                fontFamily="sans-serif"
              >
                성장 속도 (Δ)
              </text>

              {/* Student Points */}
              {students.map((st) => {
                const cx = getX(st.growthVelocity);
                const cy = getY(st.baselineAchievement);
                const isHovered = hoveredStudent?.id === st.id;

                return (
                  <g
                    key={st.id}
                    className="cursor-pointer transition-transform duration-200"
                    onMouseEnter={() => setHoveredStudent(st)}
                    onMouseLeave={() => setHoveredStudent(null)}
                    onClick={() => onSelectStudent?.(st.id)}
                  >
                    {/* Glowing outer halo */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 12 : 8}
                      fill={st.color}
                      opacity={isHovered ? 0.4 : 0.2}
                      className="transition-all"
                    />
                    {/* Inner core dot */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4.5}
                      fill={st.color}
                      stroke="#0E1526"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredStudent && (
              <div
                className="absolute bg-[#111A2E] border border-[#00E599]/40 text-slate-100 rounded-lg p-2.5 shadow-2xl pointer-events-none text-xs z-10 font-mono"
                style={{
                  left: `${(getX(hoveredStudent.growthVelocity) / scatterWidth) * 100}%`,
                  top: `${(getY(hoveredStudent.baselineAchievement) / scatterHeight) * 100 - 20}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <div className="font-bold text-[#00E599]">
                  {hoveredStudent.id} ({hoveredStudent.name})
                </div>
                <div className="text-slate-400 text-[10px]">
                  성취도: {hoveredStudent.baselineAchievement}% | 속도: {hoveredStudent.growthVelocity}Δ
                </div>
                <div className="text-[10px] text-amber-400">
                  Z-Score: {hoveredStudent.zScore}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Card: High-Growth Potential Learners */}
        <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
              <h3 className="text-sm font-bold text-slate-200 tracking-tight">
                고성장 잠재력 학습자
              </h3>
            </div>

            <div className="space-y-4">
              {highGrowthList.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-mono text-slate-300 font-medium">
                      {item.id}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        item.color === 'emerald' ? 'text-[#00E599]' : 'text-[#F59E0B]'
                      }`}
                    >
                      {item.score}
                    </span>
                  </div>

                  <div className="h-2 bg-[#172033] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.color === 'emerald'
                          ? 'bg-[#00E599] shadow-[0_0_8px_#00E599]'
                          : 'bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]'
                      }`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenRosterModal}
            className="w-full py-2.5 bg-[#131C30] hover:bg-[#18233C] text-slate-300 hover:text-white text-xs font-medium rounded-xl border border-[#1E293B] transition-colors flex items-center justify-center gap-2"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>전체 명단 보기</span>
          </button>
        </div>
      </div>

      {/* Bottom Card: Competency Gap Heatmap */}
      <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="text-sm font-bold text-slate-200 tracking-tight">
                역량 격차 히트맵
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              모듈 완료율 대비 숙련도
            </p>
          </div>

          {/* Legend Bar */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>격차</span>
            <div className="w-24 h-2 rounded-full bg-gradient-to-r from-[#F87171] via-[#1E293B] to-[#00E599]" />
            <span className="text-[#00E599]">마스터리</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2.5">
            <thead>
              <tr className="text-[11px] font-mono text-slate-400">
                <th className="pb-2 font-normal w-36"></th>
                <th className="pb-2 text-center font-normal">Logic Ops</th>
                <th className="pb-2 text-center font-normal">Data Str.</th>
                <th className="pb-2 text-center font-normal">Algorithms</th>
                <th className="pb-2 text-center font-normal">Systems</th>
                <th className="pb-2 text-center font-normal">Ethics</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, idx) => (
                <tr key={idx}>
                  <td className="text-xs font-bold text-slate-300 py-1.5 font-sans">
                    {row.groupName}
                  </td>
                  <td className="px-1.5 py-1">
                    <div
                      className={`h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-transform hover:scale-[1.03] cursor-pointer ${getHeatmapColor(
                        row.modules.logicOps
                      )}`}
                    />
                  </td>
                  <td className="px-1.5 py-1">
                    <div
                      className={`h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-transform hover:scale-[1.03] cursor-pointer ${getHeatmapColor(
                        row.modules.dataStr
                      )}`}
                    />
                  </td>
                  <td className="px-1.5 py-1">
                    <div
                      className={`h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-transform hover:scale-[1.03] cursor-pointer ${getHeatmapColor(
                        row.modules.algorithms
                      )}`}
                    />
                  </td>
                  <td className="px-1.5 py-1">
                    <div
                      className={`h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-transform hover:scale-[1.03] cursor-pointer ${getHeatmapColor(
                        row.modules.systems
                      )}`}
                    />
                  </td>
                  <td className="px-1.5 py-1">
                    <div
                      className={`h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-transform hover:scale-[1.03] cursor-pointer ${getHeatmapColor(
                        row.modules.ethics
                      )}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
