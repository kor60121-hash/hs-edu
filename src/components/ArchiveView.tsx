import React, { useState } from 'react';
import { Archive, Download, FileText, CheckCircle, Clock, Calendar } from 'lucide-react';

interface ArchiveItem {
  id: string;
  title: string;
  date: string;
  cohort: string;
  recordsCount: number;
  deltaVarianceAvg: number;
  status: 'archived' | 'active';
}

export const ArchiveView: React.FC = () => {
  const [archiveList] = useState<ArchiveItem[]>([
    {
      id: 'ARC-2024-Q3',
      title: '2024 Q3 코호트 고차원 성장 궤적 종합 아카이브',
      date: '2024-09-30',
      cohort: 'Cohort Alpha & Beta',
      recordsCount: 284,
      deltaVarianceAvg: 1.08,
      status: 'archived',
    },
    {
      id: 'ARC-2024-Q2',
      title: '2024 Q2 양자 역학 & 신경망 적응형 시뮬레이션 데이터셋',
      date: '2024-06-30',
      cohort: 'Cohort Gamma',
      recordsCount: 142,
      deltaVarianceAvg: 0.94,
      status: 'archived',
    },
    {
      id: 'ARC-2024-Q1',
      title: '2024 Q1 기초 알고리즘 및 위상 공간 마찰 계수 베이스라인',
      date: '2024-03-31',
      cohort: 'Cohort Alpha',
      recordsCount: 160,
      deltaVarianceAvg: 1.15,
      status: 'archived',
    },
  ]);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            시뮬레이션 아카이브
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            과거 코호트 궤적 스냅샷, 데이터 스트림 로그 및 검증 보고서 보관소
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131C30] border border-[#1E293B] text-slate-300 text-xs font-mono">
          <Archive className="w-3.5 h-3.5 text-[#00E599]" />
          <span>보관된 세션: 3개</span>
        </div>
      </div>

      {/* Archive Cards */}
      <div className="space-y-4">
        {archiveList.map((item) => (
          <div
            key={item.id}
            className="bg-[#0E1526] border border-[#1E293B] hover:border-[#00E599]/40 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00E599]/15 text-[#00E599] border border-[#00E599]/30">
                  {item.id}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-100">{item.title}</h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                <span>대상: {item.cohort}</span>
                <span>•</span>
                <span>기록 학생 수: {item.recordsCount}명</span>
                <span>•</span>
                <span>평균 Delta: {item.deltaVarianceAvg}Δ</span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => handleDownload(item.id)}
                disabled={downloadingId === item.id}
                className="px-4 py-2.5 bg-[#131C30] hover:bg-[#1A2640] text-[#00E599] text-xs font-semibold rounded-xl border border-[#00E599]/30 flex items-center gap-2 transition-all shadow-sm"
              >
                {downloadingId === item.id ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 animate-bounce" />
                    <span>다운로드 완료</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>스냅샷 패키지 받기</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
