import React, { useState } from 'react';
import { X, Settings, Sliders, Moon, Volume2, Shield, Sparkles, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [engineFidelity, setEngineFidelity] = useState<'high' | 'ultra' | 'balanced'>('ultra');
  const [autoSync, setAutoSync] = useState(true);
  const [telemetrySound, setTelemetrySound] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00E599]/10 flex items-center justify-center text-[#00E599]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">엔진 및 시스템 환경설정</h3>
              <p className="text-[11px] text-slate-400">TwinEngine Core V2.4 Engine Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              3D 시뮬레이션 렌더링 품질
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'balanced', label: '균형 모드' },
                { id: 'high', label: '고성능' },
                { id: 'ultra', label: 'Ultra 60FPS' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setEngineFidelity(m.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    engineFidelity === m.id
                      ? 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/50 font-bold'
                      : 'bg-[#131B2E] border border-[#1E293B] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-[#1E293B]/70 text-xs">
            <label className="flex items-center justify-between text-slate-300 cursor-pointer">
              <span>실시간 코호트 궤적 자동 동기화 (Auto Live Sync)</span>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#00E599] focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between text-slate-300 cursor-pointer">
              <span>AI 개입 알림 햅틱/효과음 활성화</span>
              <input
                type="checkbox"
                checked={telemetrySound}
                onChange={(e) => setTelemetrySound(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#00E599] focus:ring-0"
              />
            </label>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-[#00E599] hover:bg-[#00E599]/90 text-[#0A101D] font-bold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)] flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>저장 완료!</span>
              </>
            ) : (
              <span>설정 저장하기</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
