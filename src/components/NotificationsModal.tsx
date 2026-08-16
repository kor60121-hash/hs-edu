import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { EngineStreamAlert } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: EngineStreamAlert[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  alerts,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00E599]/15 flex items-center justify-center text-[#00E599]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">실시간 알림 피드</h3>
              <p className="text-[11px] text-slate-400">코호트 및 인지 부하 모니터링 이벤트</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="p-3 bg-[#131C30] border border-[#1E293B] rounded-xl flex gap-3 text-xs"
            >
              <div className="mt-0.5">
                {a.type === 'system' ? (
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                ) : a.type === 'cohort' ? (
                  <Info className="w-4 h-4 text-[#818CF8]" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[#00E599]" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>{a.title}</span>
                  <span className="text-[10px] font-mono text-slate-500">{a.timestamp}</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-sans">{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
