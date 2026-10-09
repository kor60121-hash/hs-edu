import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Award, Save, TrendingUp } from 'lucide-react';

interface AchievementComparisonCardProps {
  preScore: number;
  postScore: number;
  onSave: (scores: { preScore: number; postScore: number }) => void;
}

const clampScore = (value: number) => Math.min(100, Math.max(0, value));

const formatSignedScore = (value: number) => `${value > 0 ? '+' : ''}${value}점`;

export const AchievementComparisonCard: React.FC<AchievementComparisonCardProps> = ({
  preScore,
  postScore,
  onSave,
}) => {
  const [draftPreScore, setDraftPreScore] = useState(preScore);
  const [draftPostScore, setDraftPostScore] = useState(postScore);
  const [error, setError] = useState('');

  useEffect(() => {
    setDraftPreScore(preScore);
    setDraftPostScore(postScore);
    setError('');
  }, [preScore, postScore]);

  const result = useMemo(() => {
    const scoreGap = draftPostScore - draftPreScore;
    const relativeGrowth = draftPreScore === 0 ? null : (scoreGap / draftPreScore) * 100;

    if (scoreGap >= 15) {
      return {
        label: '큰 폭 향상',
        description: '목표 성취 수준으로의 도약이 확인되었습니다.',
        color: 'text-[#00E599]',
        panel: 'border-[#00E599]/40 bg-[#00E599]/10',
        Icon: ArrowUpRight,
      };
    }
    if (scoreGap > 0) {
      return {
        label: '향상',
        description: '학습 후 성취도가 상승했습니다.',
        color: 'text-[#38BDF8]',
        panel: 'border-[#38BDF8]/40 bg-[#38BDF8]/10',
        Icon: TrendingUp,
      };
    }
    if (scoreGap === 0) {
      return {
        label: '변화 없음',
        description: '추가 학습 지원 후 다시 측정해 보세요.',
        color: 'text-slate-300',
        panel: 'border-slate-600 bg-slate-800/40',
        Icon: ArrowRight,
      };
    }
    return {
      label: '보충 필요',
      description: '사후 점수가 낮아 원인 점검과 맞춤형 보충이 필요합니다.',
      color: 'text-amber-300',
      panel: 'border-amber-400/40 bg-amber-400/10',
      Icon: ArrowDownRight,
    };
  }, [draftPreScore, draftPostScore]);

  const handleScoreChange = (
    rawValue: string,
    setScore: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (rawValue === '') {
      setScore(0);
      return;
    }

    const value = Number(rawValue);
    if (Number.isFinite(value)) {
      setScore(clampScore(value));
      setError('');
    }
  };

  const handleSave = () => {
    if (!Number.isFinite(draftPreScore) || !Number.isFinite(draftPostScore)) {
      setError('사전·사후 성취도는 숫자로 입력해 주세요.');
      return;
    }

    onSave({
      preScore: clampScore(draftPreScore),
      postScore: clampScore(draftPostScore),
    });
  };

  const ResultIcon = result.Icon;
  const relativeGrowthLabel = result && draftPreScore === 0
    ? '사전 점수가 0점이어서 향상률은 계산하지 않습니다.'
    : `향상률 ${((draftPostScore - draftPreScore) / draftPreScore * 100).toFixed(1)}%`;

  return (
    <section
      aria-labelledby="achievement-comparison-title"
      className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 id="achievement-comparison-title" className="text-sm font-bold text-slate-100">
                사전·사후 성취도 분석
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                0~100점 기준의 진단 점수를 입력하면 향상도와 향상률을 자동 계산합니다.
              </p>
            </div>
          </div>
        </div>
        <span className="self-start text-[10px] font-mono px-2 py-1 rounded-full border border-slate-700 bg-[#0A101D] text-slate-400">
          학생별 기록
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end mt-5">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-slate-300">사전 성취도</span>
          <div className="relative">
            <input
              aria-label="사전 성취도"
              type="number"
              inputMode="numeric"
              min="0"
              max="100"
              step="1"
              value={draftPreScore}
              onChange={(event) => handleScoreChange(event.target.value, setDraftPreScore)}
              className="w-full bg-[#0A101D] border border-[#1E293B] rounded-xl px-3 py-2.5 pr-10 text-sm font-mono font-bold text-[#00E599] outline-none focus:border-[#00E599]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">점</span>
          </div>
        </label>

        <ArrowRight className="hidden sm:block w-5 h-5 text-slate-600 mb-3" aria-hidden="true" />

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold text-slate-300">사후 성취도</span>
          <div className="relative">
            <input
              aria-label="사후 성취도"
              type="number"
              inputMode="numeric"
              min="0"
              max="100"
              step="1"
              value={draftPostScore}
              onChange={(event) => handleScoreChange(event.target.value, setDraftPostScore)}
              className="w-full bg-[#0A101D] border border-[#1E293B] rounded-xl px-3 py-2.5 pr-10 text-sm font-mono font-bold text-[#F59E0B] outline-none focus:border-[#F59E0B]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">점</span>
          </div>
        </label>
      </div>

      {error && <p role="alert" className="mt-2 text-xs text-rose-400">{error}</p>}

      <div className={`mt-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 rounded-xl border p-3.5 ${result.panel}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg bg-[#0A101D]/60 flex items-center justify-center ${result.color}`}>
            <ResultIcon className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-sm font-bold ${result.color}`}>{result.label}</p>
            <p className="mt-0.5 text-xs text-slate-300">{result.description}</p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className={`text-xl font-mono font-bold ${result.color}`}>{formatSignedScore(draftPostScore - draftPreScore)}</p>
          <p className="mt-0.5 text-[11px] text-slate-300">{relativeGrowthLabel}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#00E599] hover:bg-[#00E599]/90 text-[#0A101D] text-xs font-bold transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          점수 저장 및 분석 반영
        </button>
      </div>
    </section>
  );
};
