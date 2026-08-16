import React from 'react';
import { LessonGrowthRecord } from '../../types';
import { TrendingUp } from 'lucide-react';

interface WeeklyGrowthChartProps {
  lessons?: LessonGrowthRecord[];
  targetScore?: number;
  overallAverageScore?: number;
}

export const WeeklyGrowthChart: React.FC<WeeklyGrowthChartProps> = ({
  lessons = [],
  targetScore = 85,
  overallAverageScore,
}) => {
  // Sort lessons in chronological order or by week index if available
  const sortedLessons = [...(lessons || [])].reverse(); // Usually lessons stored newest first, so reverse to show 1주차 -> 2주차...

  // Fallback demo weeks if no lessons recorded yet
  const displayLessons: { label: string; score: number; date: string }[] =
    sortedLessons.length > 0
      ? sortedLessons.map((l, i) => ({
          label: l.lessonName.includes('주차')
            ? l.lessonName.split(':')[0].trim()
            : `${i + 1}주차`,
          score: l.score,
          date: l.date,
        }))
      : [
          { label: '1주차', score: 72, date: '1주차' },
          { label: '2주차', score: 80, date: '2주차' },
          { label: '3주차', score: 88, date: '3주차' },
        ];

  const chartWidth = 320;
  const chartHeight = 150;
  const paddingX = 35;
  const paddingY = 22;

  const count = displayLessons.length;
  const minScore = 40;
  const maxScore = 100;

  const getCoords = (index: number, score: number) => {
    const x =
      count <= 1
        ? chartWidth / 2
        : paddingX + (index / (count - 1)) * (chartWidth - paddingX * 2);
    const normalized = Math.max(0, Math.min(1, (score - minScore) / (maxScore - minScore)));
    const y = chartHeight - paddingY - normalized * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const points = displayLessons.map((l, i) => getCoords(i, l.score));

  // Generate smooth cubic bezier SVG path
  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${points[0].x - 20} ${points[0].y} L ${points[0].x + 20} ${points[0].y}`;
  } else if (points.length > 1) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
  }

  // Calculate average and latest delta
  const avgScore =
    displayLessons.length > 0
      ? Math.round(displayLessons.reduce((sum, l) => sum + l.score, 0) / displayLessons.length)
      : 0;

  const latestScore = displayLessons[displayLessons.length - 1]?.score || 0;
  const firstScore = displayLessons[0]?.score || 0;
  const growthDelta = latestScore - firstScore;

  return (
    <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00E599]" />
            <h3 className="text-sm font-bold text-slate-200 tracking-tight">
              주차별 성장 정도
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 text-[#00E599] font-bold">
              평균: {avgScore}점
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              성장: {growthDelta >= 0 ? `+${growthDelta}` : growthDelta}점
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          5번째 역량평가기준(주차별 성장도)에 기록된 주차별 성취도를 순서대로 시각화한 점선형 성장 그래프
        </p>
      </div>

      {/* SVG Chart */}
      <div className="h-[175px] w-full flex items-center justify-center my-1">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
          {/* Horizontal Grid lines */}
          {[0.2, 0.5, 0.8].map((g, i) => {
            const y = paddingY + g * (chartHeight - paddingY * 2);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="#1E293B"
                strokeDasharray="2 3"
              />
            );
          })}

          {/* Area fill under curve */}
          {points.length > 1 && (
            <path
              d={`${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`}
              fill="rgba(0, 229, 153, 0.07)"
            />
          )}

          {/* Glowing Green Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#00E599"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,153,0.5))' }}
          />

          {/* Prominent Dots & Labels for each week */}
          {displayLessons.map((l, i) => {
            const pt = points[i];
            return (
              <g key={i} className="cursor-pointer group">
                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  fill="rgba(0, 229, 153, 0.2)"
                  className="animate-pulse"
                />
                {/* Inner solid dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill="#00E599"
                  stroke="#0E1526"
                  strokeWidth="2"
                />

                {/* Score value above dot */}
                <text
                  x={pt.x}
                  y={pt.y - 8}
                  textAnchor="middle"
                  fill="#00E599"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {l.score}점
                </text>

                {/* Week Label under axis */}
                <text
                  x={pt.x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {l.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1E293B] text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00E599]" />
          <span>주차별 순차 누적 측정 ({displayLessons.length}회차)</span>
        </span>
        <span className="text-[#00E599] font-mono">최신 {latestScore}점 달성</span>
      </div>
    </div>
  );
};
