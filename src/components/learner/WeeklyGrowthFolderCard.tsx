import React, { useState } from 'react';
import {
  EvaluationFolder,
  LessonGrowthRecord,
  EvaluationCriterion,
} from '../../types';
import {
  FolderOpen,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Calendar,
  Layers,
  FolderPlus,
  Award,
} from 'lucide-react';

interface WeeklyGrowthFolderCardProps {
  folder?: EvaluationFolder;
  weeklyFolder?: EvaluationFolder;
  allCriteria?: { id: string; name: string; score: number; isBasic: boolean }[];
  allCriteriaList?: { id: string; name: string; score: number; isBasic: boolean }[];
  activeCriteriaIds?: string[]; // IDs of criteria with blue border (active toggle)
  onToggleCriterionActive?: (criterionId: string) => void;
  onAddCriterionToFolder?: (folderId: string, criterionId: string) => void;
  onRemoveCriterionFromFolder?: (folderId: string, criterionId: string) => void;
  onOpenFolderCombineModal?: () => void; // 기존폴더 결합 모달 열기 (오직 이 폴더 안에서만 호출 가능!)
  onOpenCombineFolderModal?: () => void;
  onAddLessonRecord?: (folderId: string, lesson: Omit<LessonGrowthRecord, 'id'>) => void;
  onUpdateLessonRecord?: (folderId: string, updatedLesson: LessonGrowthRecord) => void;
  onDeleteLessonRecord?: (folderId: string, lessonId: string) => void;
  onDeleteFolder?: (folderId: string) => void;
}

export const WeeklyGrowthFolderCard: React.FC<WeeklyGrowthFolderCardProps> = ({
  folder,
  weeklyFolder,
  allCriteria = [],
  allCriteriaList = [],
  activeCriteriaIds = [],
  onToggleCriterionActive,
  onAddCriterionToFolder,
  onRemoveCriterionFromFolder,
  onOpenFolderCombineModal,
  onOpenCombineFolderModal,
  onAddLessonRecord,
  onUpdateLessonRecord,
  onDeleteLessonRecord,
  onDeleteFolder,
}) => {
  // Normalize folder and criteria list
  const activeFolder: EvaluationFolder = folder || weeklyFolder || {
    id: 'folder-weekly-growth',
    name: '5. 주차별 성장도 폴더',
    criteriaIds: ['crit-basic-1', 'crit-basic-2', 'crit-basic-3', 'crit-basic-4', 'crit-weekly-growth'],
    description: '주차별 지속 성장도를 기록하고 기존 폴더 결합을 지원하는 핵심 통합 폴더 (초록색 테마)',
    color: '#00E599',
    isWeeklyGrowthFolder: true,
    lessons: [],
  };

  const activeCriteria = allCriteria.length > 0 ? allCriteria : allCriteriaList;
  const handleOpenCombine = onOpenFolderCombineModal || onOpenCombineFolderModal;

  // Lesson add form state
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [newLessonName, setNewLessonName] = useState('');
  const [newLessonDate, setNewLessonDate] = useState(new Date().toISOString().split('T')[0]);
  const [newLessonScore, setNewLessonScore] = useState(85);
  const [newLessonNotes, setNewLessonNotes] = useState('');

  // Lesson editing state (누적 수업별 성장 기록 내역에서 바로 제목, 성취기준 수정)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editLessonName, setEditLessonName] = useState('');
  const [editLessonDate, setEditLessonDate] = useState('');
  const [editLessonScore, setEditLessonScore] = useState(80);
  const [editLessonNotes, setEditLessonNotes] = useState('');

  // Adding criteria dropdown state
  const [isSelectingCriteria, setIsSelectingCriteria] = useState(false);

  // Filter criteria that belong to this folder
  const boundCriteria = activeCriteria.filter((c) => (activeFolder.criteriaIds || []).includes(c.id));
  const availableToAddCriteria = activeCriteria.filter((c) => !(activeFolder.criteriaIds || []).includes(c.id));

  // Average lesson score
  const avgScore =
    (activeFolder.lessons || []).length > 0
      ? Math.round(activeFolder.lessons.reduce((sum, l) => sum + l.score, 0) / activeFolder.lessons.length)
      : 0;

  const handleStartEditLesson = (lesson: LessonGrowthRecord) => {
    setEditingLessonId(lesson.id);
    setEditLessonName(lesson.lessonName);
    setEditLessonDate(lesson.date);
    setEditLessonScore(lesson.score);
    setEditLessonNotes(lesson.notes || '');
  };

  const handleSaveEditLesson = (lessonId: string) => {
    if (!editLessonName.trim()) return;
    if (onUpdateLessonRecord) {
      onUpdateLessonRecord(activeFolder.id, {
        id: lessonId,
        lessonName: editLessonName.trim(),
        date: editLessonDate,
        score: editLessonScore,
        notes: editLessonNotes.trim(),
      });
    }
    setEditingLessonId(null);
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonName.trim()) return;

    if (onAddLessonRecord) {
      onAddLessonRecord(activeFolder.id, {
        lessonName: newLessonName.trim(),
        date: newLessonDate,
        score: newLessonScore,
        notes: newLessonNotes.trim() || '수업 성장 기록 저장됨',
      });
    }

    setNewLessonName('');
    setNewLessonScore(85);
    setNewLessonNotes('');
    setIsAddingLesson(false);
  };

  return (
    <div className="bg-[#0A101D] border border-[#00E599]/40 rounded-xl p-5 space-y-5 shadow-[0_0_15px_rgba(0,229,153,0.06)]">
      {/* 1. Folder Header (All Green theme for 5th Weekly Growth Folder) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#00E599]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00E599]/15 border border-[#00E599]/40 flex items-center justify-center text-[#00E599] shrink-0">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#00E599]/20 text-[#00E599] font-mono font-bold border border-[#00E599]/40">
                5. 주차별 성장도 폴더
              </span>
              <h4 className="text-sm font-bold text-slate-100">{activeFolder.name}</h4>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#00E599]/10 text-[#00E599] border border-[#00E599]/30 font-mono">
                평균 성장도: {avgScore}점 ({(activeFolder.lessons || []).length}회차)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {activeFolder.description || '주차별 지속 성장도를 기록하고 기존 폴더 결합을 지원하는 핵심 통합 폴더'}
            </p>
          </div>
        </div>

        {/* Action Buttons: [기존폴더 결합] (오직 이 폴더 안에서만 위치!) & [수업 기록 추가] */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleOpenCombine && handleOpenCombine()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E599]/15 hover:bg-[#00E599]/25 text-[#00E599] border border-[#00E599]/40 text-xs font-bold transition-all shadow-[0_0_10px_rgba(0,229,153,0.15)]"
            title="이 주차별 성장도 폴더 안에서 2개 이상의 역량 기준을 결합"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>기존폴더 결합</span>
          </button>

          <button
            onClick={() => setIsAddingLesson(!isAddingLesson)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E599] hover:bg-[#00E599]/90 text-[#0A101D] text-xs font-bold transition-all shadow-[0_0_12px_rgba(0,229,153,0.25)]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>수업 기록 추가</span>
          </button>
        </div>
      </div>

      {/* 2. Included Criteria Tags & Blue-Border Active Toggle */}
      <div className="bg-[#0D1627] border border-[#1E293B] rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00E599]" />
            <span className="text-xs font-bold text-slate-200">
              포함된 평가기준 ({boundCriteria.length}개)
            </span>
            <span className="text-[10px] text-slate-400">
              * 버튼을 누르면 <strong className="text-[#38BDF8]">파란색 라인 테두리</strong>로 활성화/비활성화 토글됩니다.
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsSelectingCriteria(!isSelectingCriteria)}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-[#00E599]/15 hover:bg-[#00E599]/25 text-[#00E599] border border-[#00E599]/30 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>기준 추가</span>
            </button>

            {/* Criteria Dropdown to Add */}
            {isSelectingCriteria && (
              <div className="absolute right-0 top-8 z-30 w-64 bg-[#0D1527] border border-[#1E293B] rounded-xl shadow-2xl p-2 space-y-1 animate-in fade-in">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 border-b border-[#1E293B]">
                  추가할 역량 기준 선택:
                </div>
                {availableToAddCriteria.length === 0 ? (
                  <div className="text-[11px] text-slate-500 p-2 text-center">
                    모든 기준이 이미 포함되어 있습니다.
                  </div>
                ) : (
                  availableToAddCriteria.map((crit) => (
                    <button
                      key={crit.id}
                      onClick={() => {
                        if (onAddCriterionToFolder) {
                          onAddCriterionToFolder(activeFolder.id, crit.id);
                        }
                        setIsSelectingCriteria(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#132338] text-xs text-slate-200 text-left transition-colors"
                    >
                      <span className="font-semibold">{crit.name}</span>
                      <span className="font-mono text-emerald-400 text-[11px]">({crit.score}점)</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Criteria Pills with Active Blue Border Toggle */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {boundCriteria.map((bc) => {
            const isActive = activeCriteriaIds.includes(bc.id);

            return (
              <div
                key={bc.id}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  isActive
                    ? 'border-2 border-[#38BDF8] bg-[#38BDF8]/15 text-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.35)] ring-1 ring-[#38BDF8]/40 font-bold'
                    : 'border border-[#1E293B] bg-[#111A2E] text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
                onClick={() => onToggleCriterionActive && onToggleCriterionActive(bc.id)}
                title={isActive ? '클릭 시 비활성화 (테두리 제거)' : '클릭 시 활성화 (파란색 테두리 추가)'}
              >
                <Award className={`w-3.5 h-3.5 ${isActive ? 'text-[#38BDF8]' : 'text-slate-500'}`} />
                <span>{bc.name}</span>
                <span className={`font-mono text-[11px] ${isActive ? 'text-[#38BDF8]' : 'text-slate-400'}`}>
                  ({bc.score}점)
                </span>
                {isActive && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#38BDF8]/20 text-[#38BDF8] font-mono">
                    활성
                  </span>
                )}

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveCriterionFromFolder) {
                      onRemoveCriterionFromFolder(activeFolder.id, bc.id);
                    }
                  }}
                  className="ml-1 text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                  title="이 폴더에서 기준 제외"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Add Lesson Record Inline Form */}
      {isAddingLesson && (
        <form
          onSubmit={handleCreateLesson}
          className="bg-[#0D1629] p-4 rounded-xl border border-[#00E599]/40 space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between text-xs font-bold text-[#00E599]">
            <span>신규 주차별 수업 성장 기록 추가</span>
            <button
              type="button"
              onClick={() => setIsAddingLesson(false)}
              className="text-slate-400 hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 text-[11px] font-semibold">주차 / 수업명 *</label>
              <input
                type="text"
                required
                placeholder="예: 4주차: 양자 알고리즘 및 텐서 연산 심화"
                value={newLessonName}
                onChange={(e) => setNewLessonName(e.target.value)}
                className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-slate-100 focus:border-[#00E599] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 text-[11px] font-semibold">수업 일자</label>
              <input
                type="date"
                value={newLessonDate}
                onChange={(e) => setNewLessonDate(e.target.value)}
                className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-slate-100 focus:border-[#00E599] outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 text-[11px] font-semibold">
                성장도 점수: <strong className="text-[#00E599] font-mono">{newLessonScore}점</strong>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={newLessonScore}
                onChange={(e) => setNewLessonScore(Number(e.target.value))}
                className="w-full accent-[#00E599] mt-1"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-300 text-[11px] font-semibold">수업 관찰 피드백 & 성취 기준 내용</label>
            <input
              type="text"
              placeholder="예: 복합 문제 해석 속도 향상, 팀 프로젝트 리더십 발휘"
              value={newLessonNotes}
              onChange={(e) => setNewLessonNotes(e.target.value)}
              className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-slate-100 focus:border-[#00E599] outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingLesson(false)}
              className="px-3 py-1.5 bg-[#1E293B] text-slate-300 text-xs rounded-lg hover:bg-slate-700"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#00E599] text-[#0A101D] font-bold text-xs rounded-lg hover:bg-[#00E599]/90"
            >
              기록 저장
            </button>
          </div>
        </form>
      )}

      {/* 4. Lesson History Timeline with Inline Editing for Title, Score & Notes */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00E599]" />
            <span>누적 수업별 성장 기록 내역 ({folder.lessons.length}개)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-normal">
            * 각 주차 카드의 연필 아이콘을 누르면 제목, 성취기준 점수 및 내용을 바로 수정할 수 있습니다.
          </span>
        </div>

        {folder.lessons.length === 0 ? (
          <div className="p-6 text-center bg-[#0D1527] rounded-xl border border-dashed border-[#1E293B] text-xs text-slate-400">
            등록된 주차별 수업 기록이 없습니다. <br />
            우측 상단의 <strong className="text-[#00E599]">[수업 기록 추가]</strong> 버튼을 눌러 첫 회차를 등록하세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {folder.lessons.map((lesson) => {
              const isEditing = editingLessonId === lesson.id;

              if (isEditing) {
                return (
                  <div
                    key={lesson.id}
                    className="bg-[#112338] border border-[#00E599] rounded-xl p-3.5 space-y-3 animate-in fade-in shadow-[0_0_12px_rgba(0,229,153,0.15)]"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#00E599]">
                      <span>주차별 성장 기록 즉시 수정</span>
                      <button
                        onClick={() => setEditingLessonId(null)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-300 text-[11px]">수업명 / 제목</label>
                        <input
                          type="text"
                          value={editLessonName}
                          onChange={(e) => setEditLessonName(e.target.value)}
                          className="w-full bg-[#0A101D] border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 focus:border-[#00E599] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-300 text-[11px]">수업 일자</label>
                        <input
                          type="date"
                          value={editLessonDate}
                          onChange={(e) => setEditLessonDate(e.target.value)}
                          className="w-full bg-[#0A101D] border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 focus:border-[#00E599] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-300 text-[11px]">
                          성취기준 점수: <strong className="text-[#00E599]">{editLessonScore}점</strong>
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={editLessonScore}
                          onChange={(e) => setEditLessonScore(Number(e.target.value))}
                          className="w-full accent-[#00E599]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-slate-300 text-[11px]">성취기준 및 피드백 내용</label>
                      <input
                        type="text"
                        value={editLessonNotes}
                        onChange={(e) => setEditLessonNotes(e.target.value)}
                        className="w-full bg-[#0A101D] border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 focus:border-[#00E599] outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingLessonId(null)}
                        className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded hover:bg-slate-600"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSaveEditLesson(lesson.id)}
                        className="flex items-center gap-1 px-4 py-1 bg-[#00E599] text-[#0A101D] text-xs font-bold rounded hover:bg-[#00E599]/90"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>수정 완료</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={lesson.id}
                  className="bg-[#0D1527] border border-[#1E293B] hover:border-[#00E599]/40 rounded-xl p-3 flex items-center justify-between text-xs transition-all hover:bg-[#111A2E]"
                >
                  <div className="space-y-1 flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-bold text-slate-100 truncate">{lesson.lessonName}</h5>
                      <span className="text-[10px] font-mono text-slate-400 bg-[#0A101D] px-2 py-0.5 rounded border border-[#1E293B]">
                        {lesson.date}
                      </span>
                    </div>
                    {lesson.notes && (
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {lesson.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-[#00E599]">
                        {lesson.score}점
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">주차 성취도</div>
                    </div>

                    {/* Quick Edit Button */}
                    <button
                      onClick={() => handleStartEditLesson(lesson)}
                      className="p-1.5 rounded-lg bg-[#111A2E] hover:bg-[#1E293B] text-slate-400 hover:text-[#00E599] border border-[#1E293B] transition-colors"
                      title="주차 제목 및 성취기준 점수 수정"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Lesson Record */}
                    <button
                      onClick={() => {
                        if (onDeleteLessonRecord) {
                          onDeleteLessonRecord(activeFolder.id, lesson.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-[#111A2E] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-[#1E293B] transition-colors"
                      title="주차 기록 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
