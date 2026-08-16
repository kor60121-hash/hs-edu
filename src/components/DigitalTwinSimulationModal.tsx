import React, { useState } from 'react';
import { X, Activity, Play, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

interface DigitalTwinSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalTwinSimulationModal: React.FC<DigitalTwinSimulationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [iterations, setIterations] = useState(10000);
  const [interventionLevel, setInterventionLevel] = useState<'Standard' | 'Aggressive' | 'Minimal'>('Aggressive');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    projectedGrowth: number;
    frictionReduction: number;
    targetProbability: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimulationResult({
        projectedGrowth: interventionLevel === 'Aggressive' ? 24.8 : 16.2,
        frictionReduction: interventionLevel === 'Aggressive' ? 34 : 18,
        targetProbability: interventionLevel === 'Aggressive' ? 96.4 : 88.7,
      });
      setIsSimulating(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0E1526] border-2 border-[#00E599]/60 rounded-2xl w-full max-w-lg p-6 shadow-[0_0_40px_rgba(0,229,153,0.2)] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/40 flex items-center justify-center text-[#00E599]">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                디지털 트윈 성장 궤적 시뮬레이터
              </h3>
              <p className="text-[11px] text-slate-400">
                몬테카를로 기반 3차원 적응형 역량 궤적 예측 엔진
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

        {/* Configuration Options */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1.5">
              <span>시뮬레이션 반복 횟수 (Iterations)</span>
              <span className="font-mono text-[#00E599]">{iterations.toLocaleString()} Runs</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full accent-[#00E599] cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">
              AI 개입 전략 프로필
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Minimal', 'Standard', 'Aggressive'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setInterventionLevel(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all ${
                    interventionLevel === lvl
                      ? 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/50 font-bold'
                      : 'bg-[#131B2E] border border-[#1E293B] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Simulation Output Card */}
        {simulationResult && (
          <div className="bg-[#080D18] border border-[#00E599]/40 rounded-xl p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-1.5 text-xs text-[#00E599] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>시뮬레이션 수렴 결과 (Confidence: 99.4%)</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-[#0E1526] p-2 rounded-lg border border-[#1E293B]">
                <div className="text-[10px] text-slate-500">예상 가속도</div>
                <div className="text-sm font-bold text-[#00E599]">
                  +{simulationResult.projectedGrowth}%
                </div>
              </div>
              <div className="bg-[#0E1526] p-2 rounded-lg border border-[#1E293B]">
                <div className="text-[10px] text-slate-500">마찰 감소율</div>
                <div className="text-sm font-bold text-[#38BDF8]">
                  -{simulationResult.frictionReduction}%
                </div>
              </div>
              <div className="bg-[#0E1526] p-2 rounded-lg border border-[#1E293B]">
                <div className="text-[10px] text-slate-500">도달 확률</div>
                <div className="text-sm font-bold text-[#A78BFA]">
                  {simulationResult.targetProbability}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-3 bg-[#00E599] hover:bg-[#00E599]/90 text-[#0A101D] font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(0,229,153,0.3)] transition-all flex items-center justify-center gap-2"
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0A101D] animate-ping" />
                시뮬레이션 연산 실행 중...
              </span>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>디지털 트윈 시뮬레이션 가동</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
