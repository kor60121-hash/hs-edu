import React, { useState, useEffect } from 'react';
import { X, Percent, Check, RotateCcw, AlertCircle, Award } from 'lucide-react';

export interface CriterionRatioItem {
  id: string;
  name: string;
  score: number;
  ratioPercent: number; // e.g. 20 (%)
  isBasic?: boolean;
  isWeeklyGrowth?: boolean;
}

interface CriteriaRatioModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteria?: CriterionRatioItem[];
  criteriaList?: CriterionRatioItem[];
  onSaveRatios: (updatedRatios: { id: string; ratioPercent: number }[]) => void;
}

export const CriteriaRatioModal: React.FC<CriteriaRatioModalProps> = ({
  isOpen,
  onClose,
  criteria,
  criteriaList,
  onSaveRatios,
}) => {
  const activeCriteria = criteria || criteriaList || [];
  const [localRatios, setLocalRatios] = useState<{ id: string; ratioPercent: number }[]>([]);

  useEffect(() => {
    if (activeCriteria.length > 0) {
      // If sum is not 100 or ratios undefined, default to even split
      const totalRatio = activeCriteria.reduce((sum, c) => sum + (c.ratioPercent || 0), 0);
      if (totalRatio === 100) {
        setLocalRatios(activeCriteria.map((c) => ({ id: c.id, ratioPercent: c.ratioPercent || 0 })));
      } else {
        // Distribute evenly
        const count = activeCriteria.length;
        const base = Math.floor(100 / count);
        const remainder = 100 - base * count;
        setLocalRatios(
          activeCriteria.map((c, i) => ({
            id: c.id,
            ratioPercent: base + (i === 0 ? remainder : 0),
          }))
        );
      }
    }
  }, [activeCriteria, isOpen]);

  if (!isOpen) return null;

  const currentTotal = localRatios.reduce((sum, r) => sum + (r.ratioPercent || 0), 0);
  const is100Percent = currentTotal === 100;

  const handleRatioChange = (id: string, newPercent: number) => {
    const val = Math.max(0, Math.min(100, Math.round(newPercent)));
    setLocalRatios((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ratioPercent: val } : r))
    );
  };

  const handleEvenDistribution = () => {
    const count = criteria.length;
    if (count === 0) return;
    const base = Math.floor(100 / count);
    const remainder = 100 - base * count;
    setLocalRatios(
      criteria.map((c, i) => ({
        id: c.id,
        ratioPercent: base + (i === 0 ? remainder : 0),
      }))
    );
  };

  const handleSave = () => {
    if (!is100Percent) return;
    onSaveRatios(localRatios);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0A101D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>평가 기준 비율 설정</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    is100Percent
                      ? 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  합계: {currentTotal}% {is100Percent ? '(100% 일치)' : `(${100 - currentTotal > 0 ? `+${100 - currentTotal}% 부족` : `${currentTotal - 100}% 초과`})`}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                기본 4대 역량부터 5번째 주차별 성장도 및 추가 역량까지 평가 산정 비율을 조절하여 100%를 맞춥니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-[#1E293B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between bg-[#111A2E] p-3 rounded-xl border border-[#1E293B]">
            <div className="text-xs text-slate-300">
              <span>총 <strong>{criteria.length}개</strong>의 평가 기준이 등록되어 있습니다.</span>
            </div>
            <button
              onClick={handleEvenDistribution}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#283850] text-[#00E599] text-xs font-semibold border border-[#00E599]/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>100% 자동 균등 분배</span>
            </button>
          </div>

          {/* Criteria Ratio Sliders */}
          <div className="space-y-3">
            {criteria.map((c) => {
              const currentRatio = localRatios.find((r) => r.id === c.id)?.ratioPercent || 0;

              return (
                <div
                  key={c.id}
                  className="bg-[#0A101D] border border-[#1E293B] rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-[#00E599]" />
                      <span>{c.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({c.score}점)</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={currentRatio}
                        onChange={(e) => handleRatioChange(c.id, Number(e.target.value))}
                        className="w-14 bg-[#111A2E] border border-[#1E293B] rounded px-2 py-0.5 text-right font-mono font-bold text-xs text-[#00E599] focus:outline-none focus:border-[#00E599]"
                      />
                      <span className="text-xs text-slate-400 font-bold">%</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentRatio}
                    onChange={(e) => handleRatioChange(c.id, Number(e.target.value))}
                    className="w-full accent-[#00E599] h-1.5 bg-[#1E293B] rounded-lg cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          {!is100Percent && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                모든 평가 기준의 합산 비율이 정확히 <strong>100%</strong>가 되어야 저장할 수 있습니다. (현재 {currentTotal}%)
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E293B] bg-[#0A101D]">
          <div className="text-xs font-mono">
            <span className="text-slate-400">총합계: </span>
            <span className={`font-bold ${is100Percent ? 'text-[#00E599]' : 'text-amber-400'}`}>
              {currentTotal}% / 100%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#1E293B] text-slate-300 hover:bg-[#1E293B] text-xs font-semibold"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={!is100Percent}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#00E599] text-[#0A101D] font-bold hover:bg-[#00E599]/90 disabled:opacity-40 transition-all text-xs shadow-[0_0_12px_rgba(0,229,153,0.3)]"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>100% 비율 적용 저장</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
