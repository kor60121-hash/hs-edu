import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, CheckCircle2, Cpu, Activity, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ModuleRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteModule?: () => void;
}

export const ModuleRunnerModal: React.FC<ModuleRunnerModalProps> = ({
  isOpen,
  onClose,
  onCompleteModule,
}) => {
  const [layers, setLayers] = useState<number[]>([4, 6, 6, 2]);
  const [activation, setActivation] = useState<'ReLU' | 'GELU' | 'Sigmoid'>('GELU');
  const [learningRate, setLearningRate] = useState(0.01);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0.842);
  const [accuracy, setAccuracy] = useState(48.5);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning && epoch < 100) {
      timer = setInterval(() => {
        setEpoch((prev) => {
          const next = prev + 1;
          setLoss((l) => +(Math.max(0.012, l * 0.965)).toFixed(4));
          setAccuracy((a) => +(Math.min(99.4, a + (100 - a) * 0.055)).toFixed(1));
          if (next >= 50) {
            setIsRunning(false);
            setIsCompleted(true);
            try {
              confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch (e) {
              // fallback
            }
            onCompleteModule?.();
          }
          return next;
        });
      }, 80);
    }
    return () => clearInterval(timer);
  }, [isRunning, epoch, onCompleteModule]);

  if (!isOpen) return null;

  const handleReset = () => {
    setIsRunning(false);
    setEpoch(0);
    setLoss(0.842);
    setAccuracy(48.5);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0E1526] border-2 border-[#00E599]/60 rounded-2xl w-full max-w-3xl p-6 shadow-[0_0_40px_rgba(0,229,153,0.2)] space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/40 flex items-center justify-center text-[#00E599]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">
                  Lvl 2 (Hard)
                </span>
                <h3 className="text-lg font-bold text-slate-100">
                  다층 퍼셉트론 설계 (MLP Architecture)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                은닉층 구성, 비선형 활성화 함수 및 순전파 역학 상호작용 랩
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Neural Architecture Visualizer */}
        <div className="bg-[#080D18] border border-[#1E293B] rounded-xl p-5 relative overflow-hidden flex flex-col items-center justify-center">
          <div className="text-[11px] font-mono text-slate-500 mb-3 w-full flex justify-between">
            <span>순전파 신경망 토폴로지</span>
            <span className="text-[#00E599]">활성화 함수: {activation}</span>
          </div>

          {/* SVG Network Visualizer */}
          <div className="w-full h-44 flex items-center justify-center">
            <svg viewBox="0 0 500 160" className="w-full h-full">
              {/* Draw Synapse Links */}
              {layers.map((nodeCount, lIdx) => {
                if (lIdx === layers.length - 1) return null;
                const nextCount = layers[lIdx + 1];
                const x1 = 70 + lIdx * 120;
                const x2 = 70 + (lIdx + 1) * 120;

                return Array.from({ length: nodeCount }).map((_, n1) => {
                  const y1 = 80 + (n1 - (nodeCount - 1) / 2) * 22;
                  return Array.from({ length: nextCount }).map((_, n2) => {
                    const y2 = 80 + (n2 - (nextCount - 1) / 2) * 22;
                    return (
                      <line
                        key={`${lIdx}-${n1}-${n2}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isRunning ? '#00E599' : '#1E293B'}
                        strokeWidth={isRunning ? 1 : 0.6}
                        strokeOpacity={isRunning ? 0.35 + Math.random() * 0.3 : 0.4}
                      />
                    );
                  });
                });
              })}

              {/* Draw Nodes */}
              {layers.map((nodeCount, lIdx) => {
                const x = 70 + lIdx * 120;
                return Array.from({ length: nodeCount }).map((_, nIdx) => {
                  const y = 80 + (nIdx - (nodeCount - 1) / 2) * 22;
                  const isInput = lIdx === 0;
                  const isOutput = lIdx === layers.length - 1;

                  return (
                    <g key={`node-${lIdx}-${nIdx}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isOutput ? 7 : 6}
                        fill={
                          isInput
                            ? '#38BDF8'
                            : isOutput
                            ? '#F59E0B'
                            : '#00E599'
                        }
                        className={isRunning ? 'animate-pulse' : ''}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={isOutput ? 10 : 8}
                        fill="none"
                        stroke={isOutput ? '#F59E0B' : '#00E599'}
                        strokeWidth="1"
                        strokeOpacity="0.4"
                      />
                    </g>
                  );
                });
              })}
            </svg>
          </div>

          {/* Real-time Telemetry Bar */}
          <div className="w-full grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-[#1E293B] text-center font-mono">
            <div className="bg-[#0E1526] p-2 rounded-lg border border-[#1E293B]">
              <div className="text-[10px] text-slate-500">EPOCH</div>
              <div className="text-base font-bold text-slate-200">{epoch} / 50</div>
            </div>
            <div className="bg-[#0E1526] p-2 rounded-lg border border-[#1E293B]">
              <div className="text-[10px] text-slate-500">LOSS (MSE)</div>
              <div className="text-base font-bold text-[#F87171]">{loss}</div>
            </div>
            <div className="bg-[#0E1526] p-2 rounded-lg border border-[#1E293B]">
              <div className="text-[10px] text-slate-500">ACCURACY</div>
              <div className="text-base font-bold text-[#00E599]">{accuracy}%</div>
            </div>
          </div>
        </div>

        {/* Hyperparameter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#080D18] p-3.5 rounded-xl border border-[#1E293B] space-y-2">
            <label className="text-xs font-semibold text-slate-300">활성화 함수 (Activation)</label>
            <div className="flex gap-2">
              {(['GELU', 'ReLU', 'Sigmoid'] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => setActivation(act)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    activation === act
                      ? 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/40 font-bold'
                      : 'bg-[#0E1526] text-slate-400 border border-[#1E293B]'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#080D18] p-3.5 rounded-xl border border-[#1E293B] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">학습률 (Learning Rate)</span>
              <span className="font-mono text-[#00E599]">{learningRate}</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.05"
              step="0.005"
              value={learningRate}
              onChange={(e) => setLearningRate(Number(e.target.value))}
              className="w-full accent-[#00E599] cursor-pointer"
            />
          </div>
        </div>

        {/* Success Banner */}
        {isCompleted && (
          <div className="bg-[#00E599]/15 border border-[#00E599]/50 rounded-xl p-3.5 flex items-center justify-between text-xs text-[#00E599]">
            <div className="flex items-center gap-2 font-bold">
              <Award className="w-5 h-5" />
              <span>모듈 완수! 예상 성장 영향도 +18.0% 가속화가 적용되었습니다.</span>
            </div>
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-[#131C30] hover:bg-[#18233C] text-slate-300 text-xs font-medium rounded-xl border border-[#1E293B] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>

          {!isCompleted ? (
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-2.5 bg-[#00E599] hover:bg-[#00E599]/90 text-[#0A101D] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(0,229,153,0.3)] transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? '시뮬레이션 일시정지' : '신경망 훈련 시작'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#00E599] hover:bg-[#00E599]/90 text-[#0A101D] text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(0,229,153,0.3)] transition-all"
            >
              학습 결과 반영 및 완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
