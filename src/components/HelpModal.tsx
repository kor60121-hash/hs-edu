import React from 'react';
import { X, HelpCircle, Mail, MessageSquare, BookOpen, ExternalLink } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00E599]/15 flex items-center justify-center text-[#00E599]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">고객 지원 및 기술 지원</h3>
              <p className="text-[11px] text-slate-400">TwinEngine AI Education Support</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 bg-[#131C30] border border-[#1E293B] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-[#00E599]" />
              <div>
                <div className="text-xs font-bold text-slate-200">사용자 가이드 & 매뉴얼</div>
                <div className="text-[11px] text-slate-400">3차원 궤적 분석 및 역량 지표 해석법</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="p-3.5 bg-[#131C30] border border-[#1E293B] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#38BDF8]" />
              <div>
                <div className="text-xs font-bold text-slate-200">24/7 전담 기술 지원팀</div>
                <div className="text-[11px] text-slate-400">support@twinengine.ai</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#00E599] bg-[#00E599]/10 px-2 py-0.5 rounded">
              응답 대기 &lt; 5분
            </span>
          </div>

          <div className="p-3.5 bg-[#131C30] border border-[#1E293B] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-[#A78BFA]" />
              <div>
                <div className="text-xs font-bold text-slate-200">실시간 AI 코치 어시스턴트</div>
                <div className="text-[11px] text-slate-400">시뮬레이션 파라미터 튜닝 즉시 지원</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
