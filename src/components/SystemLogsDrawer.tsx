import React, { useEffect, useState } from 'react';
import { X, Terminal, Trash2, Shield, CircleDot } from 'lucide-react';

interface SystemLogsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  id: string;
  time: string;
  level: 'INFO' | 'SYNC' | 'WARN' | 'EXEC';
  source: string;
  message: string;
}

export const SystemLogsDrawer: React.FC<SystemLogsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      time: '14:22:15.802',
      level: 'INFO',
      source: 'CORE_ENGINE',
      message: 'Epoch 4432 weights distributed to 142 digital twin instances.',
    },
    {
      id: '2',
      time: '14:22:14.210',
      level: 'SYNC',
      source: 'MODALITY_STREAM',
      message: 'Spatial reasoning vector alignment stabilized. Delta Variance = 1.04.',
    },
    {
      id: '3',
      time: '14:22:10.054',
      level: 'WARN',
      source: 'FRICTION_GUARD',
      message: 'Student A (DT-894-X) friction coefficient shifted +14%. Adaptive scaffold dispatched.',
    },
    {
      id: '4',
      time: '14:22:01.320',
      level: 'EXEC',
      source: 'AI_ORCHESTRATOR',
      message: 'Neural predictor confidence score updated to 99.2% (P=0.942).',
    },
    {
      id: '5',
      time: '14:21:48.115',
      level: 'INFO',
      source: 'SECURITY_NODE',
      message: 'Zero-trust handshake verified for teacher session ID #8841-TK.',
    },
  ]);

  // Live log simulation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(
        now.getMilliseconds()
      ).padStart(3, '0')}`;

      const randomLogs: LogEntry[] = [
        {
          id: String(Date.now()),
          time: timeStr,
          level: 'SYNC',
          source: 'SPATIAL_MATRIX',
          message: `Real-time orbital projection rendered at 60.0 FPS. Node count: 40.`,
        },
        {
          id: String(Date.now() + 1),
          time: timeStr,
          level: 'INFO',
          source: 'COHORT_A',
          message: `Cognitive telemetry packet ingested for student ID-1104.`,
        },
      ];

      const newLog = randomLogs[Math.floor(Math.random() * randomLogs.length)];
      setLogs((prev) => [newLog, ...prev.slice(0, 30)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end select-none">
      <div className="bg-[#0B1120] border-l border-[#1E293B] w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#0E1526]">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-[#00E599]" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                시스템 텔레메트리 로그
                <span className="w-2 h-2 rounded-full bg-[#00E599] animate-ping" />
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Core Engine V2.4 Daemon Output
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLogs([])}
              title="로그 지우기"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Console Content */}
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2.5 bg-[#080D18]">
          {logs.length === 0 ? (
            <div className="text-slate-600 text-center py-10">로그가 비어 있습니다.</div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-[#0E1526]/80 border border-[#1E293B] p-2.5 rounded-lg space-y-1 hover:border-[#00E599]/30 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        log.level === 'WARN'
                          ? 'bg-amber-500/20 text-amber-400'
                          : log.level === 'SYNC'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : log.level === 'EXEC'
                          ? 'bg-[#00E599]/20 text-[#00E599]'
                          : 'bg-slate-700/40 text-slate-300'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-slate-400 font-semibold">{log.source}</span>
                  </div>
                  <span>{log.time}</span>
                </div>
                <div className="text-slate-300 leading-relaxed text-[11px]">
                  {log.message}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1E293B] bg-[#0E1526] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <CircleDot className="w-3.5 h-3.5 text-[#00E599]" />
            <span>SOCKET://127.0.0.1:3000/ENGINE-LIVE</span>
          </div>
          <span>AUTOSCROLL ON</span>
        </div>
      </div>
    </div>
  );
};
