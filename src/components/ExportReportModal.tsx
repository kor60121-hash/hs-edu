import React, { useState } from 'react';
import { X, FileText, Download, Check, ShieldCheck } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [include3DMatrix, setInclude3DMatrix] = useState(true);
  const [includeAIInsights, setIncludeAIInsights] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00E599]/10 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                시뮬레이션 리포트 내보내기
              </h3>
              <p className="text-[11px] text-slate-400">
                실시간 코호트 궤적 및 학습 분석 데이터 패키징
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

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">내보내기 포맷</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'pdf', label: 'PDF Report', ext: '.pdf' },
              { id: 'csv', label: 'CSV Dataset', ext: '.csv' },
              { id: 'json', label: 'JSON Telemetry', ext: '.json' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id as any)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-medium transition-all ${
                  format === f.id
                    ? 'bg-[#00E599]/15 border-[#00E599]/50 text-[#00E599] font-bold shadow-sm'
                    : 'bg-[#131B2E] border-[#1E293B] text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inclusions */}
        <div className="space-y-2.5 pt-2 border-t border-[#1E293B]/70">
          <label className="text-xs font-semibold text-slate-300">포함 항목</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={include3DMatrix}
                onChange={(e) => setInclude3DMatrix(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#00E599] focus:ring-0"
              />
              <span>3차원 공간 궤적 매트릭스 스냅샷 (Delta Variance 1.04)</span>
            </label>
            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAIInsights}
                onChange={(e) => setIncludeAIInsights(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#00E599] focus:ring-0"
              />
              <span>AI 미래 역량 예측 및 적응형 개입 권고안</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E599]" />
          <span>AES-256 Digital Twin Security Protocol Applied</span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleExport}
            disabled={isExporting || downloadSuccess}
            className="w-full py-3 bg-[#00E599] hover:bg-[#00E599]/90 text-[#0A101D] font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(0,229,153,0.3)] transition-all flex items-center justify-center gap-2"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>내보내기 완료!</span>
              </>
            ) : isExporting ? (
              <span>패키징 생성 중...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>리포트 다운로드</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
