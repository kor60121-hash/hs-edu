import React, { useState } from 'react';
import { CohortCentroid } from '../types';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Target,
  Sparkles,
  Layers,
  MapPin,
} from 'lucide-react';

interface CohortCentroidModalProps {
  isOpen: boolean;
  onClose: () => void;
  centroids: CohortCentroid[];
  onAddCentroid: (centroid: CohortCentroid) => void;
  onDeleteCentroid: (id: string) => void;
  onRenameCentroid: (id: string, newName: string) => void;
}

const PRESET_COLORS = [
  '#FFFFFF',
  '#00E599',
  '#38BDF8',
  '#A78BFA',
  '#F59E0B',
  '#F43F5E',
  '#EC4899',
];

export const CohortCentroidModal: React.FC<CohortCentroidModalProps> = ({
  isOpen,
  onClose,
  centroids,
  onAddCentroid,
  onDeleteCentroid,
  onRenameCentroid,
}) => {
  // New centroid form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[1]);
  const [newX, setNewX] = useState(20);
  const [newY, setNewY] = useState(0);
  const [newZ, setNewZ] = useState(20);
  const [newDesc, setNewDesc] = useState('');

  // Editing centroid name state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (c: CohortCentroid) => {
    setEditingId(c.id);
    setEditNameValue(c.name);
  };

  const handleSaveRename = (id: string) => {
    if (editNameValue.trim()) {
      onRenameCentroid(id, editNameValue.trim());
    }
    setEditingId(null);
  };

  const handleCreateCentroid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCentroid: CohortCentroid = {
      id: `centroid-${Date.now()}`,
      name: newName.trim(),
      x: Number(newX),
      y: Number(newY),
      z: Number(newZ),
      color: newColor,
      memberCount: Math.floor(Math.random() * 15) + 5,
      avgScore: +(Math.random() * 30 + 65).toFixed(1),
      description: newDesc.trim() || '신규 등록된 3D 공간 코호트 기준 중심점',
    };

    onAddCentroid(newCentroid);
    setNewName('');
    setNewDesc('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0A101D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">코호트 중심점 (Cohort Centroid) 관리</h2>
              <p className="text-xs text-slate-400">3D 공간 시뮬레이션 군집 중심 추가, 삭제 및 이름 변경</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Top Info & Add Centroid Button */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00E599]" />
              <span>활성 코호트 중심점 목록 ({centroids.length}개)</span>
            </span>

            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E599]/15 hover:bg-[#00E599]/25 text-[#00E599] border border-[#00E599]/40 text-xs font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>중심점 추가</span>
              </button>
            )}
          </div>

          {/* Add Centroid Inline Form */}
          {isAdding && (
            <form
              onSubmit={handleCreateCentroid}
              className="bg-[#111A2E] border-2 border-[#00E599]/40 rounded-xl p-4 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <span className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E599]" />
                  <span>새로운 코호트 중심점 생성</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">
                    중심점 이름 <span className="text-[#00E599]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 텐서 연산 특화군 중심, 신규 연구 코호트 C"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#0A101D] border border-[#1E293B] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00E599]"
                  />
                </div>

                {/* Color Selection */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">대표 색상</label>
                  <div className="flex items-center gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          newColor === c
                            ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* 3D Coordinates (X, Y, Z) */}
                <div className="grid grid-cols-3 gap-3 bg-[#0A101D] p-3 rounded-lg border border-[#1E293B]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">X 좌표 ({newX})</span>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={newX}
                      onChange={(e) => setNewX(Number(e.target.value))}
                      className="w-full accent-[#00E599]"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Y 높이 ({newY})</span>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      value={newY}
                      onChange={(e) => setNewY(Number(e.target.value))}
                      className="w-full accent-[#38BDF8]"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Z 심도 ({newZ})</span>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={newZ}
                      onChange={(e) => setNewZ(Number(e.target.value))}
                      className="w-full accent-[#A78BFA]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">설명 (선택)</label>
                  <input
                    type="text"
                    placeholder="해당 중심점의 특성 및 군집 정의"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-[#0A101D] border border-[#1E293B] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-[#00E599]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#1E293B] text-slate-300 hover:bg-[#1E293B]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#00E599] text-[#0A101D] font-bold hover:bg-[#00E599]/90 disabled:opacity-50"
                >
                  중심점 생성
                </button>
              </div>
            </form>
          )}

          {/* Centroid Cards List */}
          <div className="space-y-3">
            {centroids.map((c) => (
              <div
                key={c.id}
                className="bg-[#111A2E] border border-[#1E293B] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Centroid Color Pillar Indicator */}
                  <div
                    className="w-4 h-10 rounded-full shrink-0 shadow-sm"
                    style={{
                      backgroundColor: c.color,
                      boxShadow: `0 0 10px ${c.color}60`,
                    }}
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Name or Rename Input */}
                    {editingId === c.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editNameValue}
                          onChange={(e) => setEditNameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(c.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          autoFocus
                          className="bg-[#0A101D] border border-[#00E599] rounded px-2 py-1 text-slate-100 text-xs w-full focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveRename(c.id)}
                          className="p-1 rounded bg-[#00E599] text-[#0A101D] hover:bg-[#00E599]/90"
                          title="저장"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1 rounded bg-[#1E293B] text-slate-300 hover:bg-[#2A374F]"
                          title="취소"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-xs truncate">{c.name}</span>
                        <button
                          onClick={() => handleStartEdit(c)}
                          className="p-1 text-slate-400 hover:text-[#00E599] rounded transition-colors"
                          title="이름 바꾸기"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-mono bg-[#0A101D] px-2 py-0.5 rounded border border-[#1E293B]">
                        3D좌표: ({c.x}, {c.y}, {c.z})
                      </span>
                      {c.memberCount && (
                        <span>군집 크기: {c.memberCount}명</span>
                      )}
                      {c.avgScore && (
                        <span>평균 점수: {c.avgScore}점</span>
                      )}
                    </div>

                    {c.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1">{c.description}</p>
                    )}
                  </div>
                </div>

                {/* Delete Centroid Button */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onDeleteCentroid(c.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-colors"
                    title="중심점 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
            ))}

            {centroids.length === 0 && (
              <div className="text-center py-8 bg-[#0A101D] border border-dashed border-[#1E293B] rounded-xl text-slate-400">
                등록된 코호트 중심점이 없습니다. 상단 '중심점 추가' 버튼을 눌러 생성하세요.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1E293B] bg-[#0A101D] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1E293B] hover:bg-[#2A374F] text-slate-200 text-xs font-semibold transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
