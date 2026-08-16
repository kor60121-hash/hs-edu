import React from 'react';

export interface DynamicRadarItem {
  id: string;
  name: string;
  score: number;
  color?: string;
  isBasic?: boolean;
  isWeeklyGrowth?: boolean;
}

interface DynamicRadarChartProps {
  items: DynamicRadarItem[];
  center?: { x: number; y: number };
  radius?: number;
  activeCriteriaIds?: string[];
  onToggleCriterionActive?: (criterionId: string) => void;
}

export const DynamicRadarChart: React.FC<DynamicRadarChartProps> = ({
  items = [],
  center = { x: 150, y: 130 },
  radius = 85,
  activeCriteriaIds = [],
  onToggleCriterionActive,
}) => {
  const count = Math.max(items.length, 3); // Minimum 3 vertices

  // Calculate points for each axis (angle in degrees, starting from top -90deg)
  const getPoint = (score: number, index: number, maxScore = 100) => {
    const angleDeg = -90 + (index * 360) / count;
    const rad = (angleDeg * Math.PI) / 180;
    const r = (score / maxScore) * radius;
    return {
      x: center.x + r * Math.cos(rad),
      y: center.y + r * Math.sin(rad),
      angleDeg,
    };
  };

  // Polygon points string for the student's actual scores
  const scorePoints = items
    .map((item, i) => {
      const pt = getPoint(item.score, i);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  // Grid rings (25%, 50%, 75%, 100%)
  const gridScales = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-200 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] shadow-[0_0_8px_#00E599]" />
            <span>다차원 학생 역량 레이더</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30 font-bold">
            {count}각 다각형 분석
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          학생역량평가기준에 등록된 모든 역량({items.length}개)이 자동으로 실시간 동기화되는 레이더 차트
        </p>
      </div>

      <div className="w-full flex items-center justify-center h-[230px] my-1">
        <svg width="300" height="240" className="overflow-visible select-none">
          {/* Background Grid Polygons (N-gon rings) */}
          {gridScales.map((scale, sIdx) => {
            const ringPoints = Array.from({ length: count })
              .map((_, i) => {
                const pt = getPoint(100 * scale, i);
                return `${pt.x},${pt.y}`;
              })
              .join(' ');

            return (
              <polygon
                key={sIdx}
                points={ringPoints}
                fill={scale === 1.0 ? 'rgba(14, 26, 44, 0.3)' : 'none'}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray={scale < 1.0 ? '3 3' : undefined}
              />
            );
          })}

          {/* Radial Axis Lines */}
          {items.map((_, i) => {
            const outerPt = getPoint(100, i);
            return (
              <line
                key={i}
                x1={center.x}
                y1={center.y}
                x2={outerPt.x}
                y2={outerPt.y}
                stroke="#1E293B"
                strokeWidth="1"
              />
            );
          })}

          {/* Student Score Polygon with Glow */}
          <polygon
            points={scorePoints}
            fill="rgba(0, 229, 153, 0.15)"
            stroke="#00E599"
            strokeWidth="2"
            className="transition-all duration-300"
            style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,153,0.5))' }}
          />

          {/* Vertex Dots & Value Tooltips */}
          {items.map((item, i) => {
            const pt = getPoint(item.score, i);
            const isActive = activeCriteriaIds.includes(item.id);
            return (
              <g
                key={i}
                onClick={() => onToggleCriterionActive && onToggleCriterionActive(item.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? "5" : "4"}
                  fill={isActive ? "#38BDF8" : "#00E599"}
                  stroke="#0D1527"
                  strokeWidth="2"
                  className="transition-all hover:scale-125"
                />
              </g>
            );
          })}

          {/* Axis Labels & Scores */}
          {items.map((item, i) => {
            const labelPt = getPoint(118, i);
            const isTop = labelPt.y < center.y - 40;
            const isBottom = labelPt.y > center.y + 40;
            const isLeft = labelPt.x < center.x - 20;
            const isRight = labelPt.x > center.x + 20;

            let anchor: 'middle' | 'start' | 'end' = 'middle';
            if (isLeft && !isTop && !isBottom) anchor = 'end';
            if (isRight && !isTop && !isBottom) anchor = 'start';

            // Shorten name if too long
            const displayName = item.name.length > 9 ? item.name.slice(0, 8) + '..' : item.name;
            const isActive = activeCriteriaIds.includes(item.id);

            return (
              <g
                key={`lbl-${i}`}
                onClick={() => onToggleCriterionActive && onToggleCriterionActive(item.id)}
                className="cursor-pointer group"
              >
                <text
                  x={labelPt.x}
                  y={labelPt.y - 2}
                  textAnchor={anchor}
                  fill={isActive ? "#38BDF8" : "#E2E8F0"}
                  fontSize="9.5"
                  fontWeight="600"
                  className="font-sans select-none group-hover:fill-[#00E599]"
                >
                  {displayName}
                </text>
                <text
                  x={labelPt.x}
                  y={labelPt.y + 8}
                  textAnchor={anchor}
                  fill="#00E599"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="select-none"
                >
                  {item.score}점
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/70 text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00E599]" />
          <span>{count}개 평가 기준 연동</span>
        </span>
        <span className="text-slate-500">라벨 클릭 시 파란 테두리 활성화</span>
      </div>
    </div>
  );
};
