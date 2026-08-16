import React, { useState, useMemo } from 'react';
import {
  StudentProfile,
  EvaluationCriterion,
  EvaluationFolder,
  LessonGrowthRecord,
  TrajectorySubcategory,
} from '../types';
import { AddStudentModal } from './AddStudentModal';
import { CriteriaRatioModal } from './learner/CriteriaRatioModal';
import { DynamicRadarChart } from './learner/DynamicRadarChart';
import { WeeklyGrowthChart } from './learner/WeeklyGrowthChart';
import { WeeklyGrowthFolderCard } from './learner/WeeklyGrowthFolderCard';
import { KeyLearningMomentsSection } from './learner/KeyLearningMomentsSection';
import {
  Sparkles,
  Zap,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Activity,
  UserPlus,
  Trash2,
  Users,
  Edit3,
  Check,
  X,
  Plus,
  FolderPlus,
  Folder,
  FolderOpen,
  Eye,
  EyeOff,
  Calendar,
  Layers,
  Award,
  BookOpen,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  BookmarkCheck,
  ListTree,
  ArrowUpRight,
  RotateCcw,
  HelpCircle,
  ExternalLink,
  Percent,
} from 'lucide-react';

interface LearnerProfileViewProps {
  student: StudentProfile;
  students?: StudentProfile[];
  onSelectStudent?: (studentId: string) => void;
  onAddStudent?: (student: StudentProfile) => void;
  onUpdateStudent?: (updatedStudent: StudentProfile) => void;
  onDeleteStudent?: (studentId: string) => void;
  onOpenStreamData?: () => void;
  onSimulateIntervention?: () => void;
}

const PRESET_TRAJECTORIES = [
  '심화 양자 역학 및 텐서 연산',
  '자율 에이전트 아키텍처',
  '이산 수학 및 그래프 이론',
  '고성능 분산 시스템 설계',
  '신경망 압축 및 최적화',
  '생성형 AI 멀티모달 아키텍처',
  '비선형 동역학 및 제어 이론',
];

export const LearnerProfileView: React.FC<LearnerProfileViewProps> = ({
  student,
  students = [],
  onSelectStudent,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onOpenStreamData,
  onSimulateIntervention,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 2. 5th+ Dynamic Criteria Visibility Toggle (중요 요구사항: 5번째부터는 보이기/숨기기 버튼)
  const [isCustomCriteriaVisible, setIsCustomCriteriaVisible] = useState(true);
  const [isAddingCriterion, setIsAddingCriterion] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritScore, setNewCritScore] = useState(80);
  const [newCritDesc, setNewCritDesc] = useState('');

  // 3. Folder Creation & Grouping State (2개 이상의 평가기준을 폴더로 합치기)
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [selectedCriteriaForFolder, setSelectedCriteriaForFolder] = useState<string[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  // 4. Lesson Growth Record State (수업별 성장도 기록)
  const [activeFolderIdForLesson, setActiveFolderIdForLesson] = useState<string | null>(null);
  const [newLessonName, setNewLessonName] = useState('');
  const [newLessonScore, setNewLessonScore] = useState(85);
  const [newLessonDate, setNewLessonDate] = useState(new Date().toISOString().split('T')[0]);
  const [newLessonNotes, setNewLessonNotes] = useState('');

  // 5. Trajectory Subcategories State (기본 소분류 2개: 소분류 1, 소분류 2, 선택, 수정, 삭제, 추가)
  const [isTrajectoryModalOpen, setIsTrajectoryModalOpen] = useState(false);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState('');
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubProgress, setNewSubProgress] = useState(50);
  const [subToDeleteId, setSubToDeleteId] = useState<string | null>(null);

  // Helper to ensure customCriteria and evaluationFolders exist
  const customCriteria: EvaluationCriterion[] = student.customCriteria || [];
  const evaluationFolders: EvaluationFolder[] = student.evaluationFolders || [];

  // Default 2 Subcategories for any student if not initialized
  const defaultSubcategories: TrajectorySubcategory[] = [
    {
      id: `sub-${student.id}-1`,
      name: '소분류 1',
      description: '1차 기초 역량 탐구 모듈',
      progressPercent: 65,
      status: 'in_progress',
      keyTopics: ['기초 개념 탐색', '핵심 원리 분석'],
    },
    {
      id: `sub-${student.id}-2`,
      name: '소분류 2',
      description: '2차 심화 프로젝트 모듈',
      progressPercent: 40,
      status: 'active',
      keyTopics: ['응용 실습 프로젝트', '문제 해결 역량'],
    },
  ];

  const trajectorySubcategories: TrajectorySubcategory[] =
    student.trajectorySubcategories && student.trajectorySubcategories.length > 0
      ? student.trajectorySubcategories
      : defaultSubcategories;

  const activeSubcategoryId: string =
    student.activeSubcategoryId &&
    trajectorySubcategories.some((s) => s.id === student.activeSubcategoryId)
      ? student.activeSubcategoryId
      : (trajectorySubcategories[0]?.id || '');

  const activeSubcategory =
    trajectorySubcategories.find((s) => s.id === activeSubcategoryId) ||
    trajectorySubcategories[0];

  // State for Ratio Modal (평가 기준 비율 조절 100% 산정)
  const [isRatioModalOpen, setIsRatioModalOpen] = useState(false);

  // Criteria Ratio weights map (id -> ratioPercent)
  const [criteriaRatios, setCriteriaRatios] = useState<Record<string, number>>({});

  // 5th Weekly Growth Folder default/existing
  const weeklyGrowthFolder: EvaluationFolder = useMemo(() => {
    const existing = evaluationFolders.find((f) => f.isWeeklyGrowthFolder || f.id === 'folder-weekly-growth');
    if (existing) return existing;

    const sub1 = student.trajectorySubcategories?.[0];
    const sub2 = student.trajectorySubcategories?.[1];
    const sub1Title = sub1?.description || (sub1?.name ? sub1.name.replace(/^소분류\s*\d*:\s*/, '') : '양자 상태 벡터 및 큐비트 연산 기초');
    const sub2Title = sub2?.description || (sub2?.name ? sub2.name.replace(/^소분류\s*\d*:\s*/, '') : '얽힘 게이트 회로 설계 및 노이즈 분석');

    return {
      id: 'folder-weekly-growth',
      name: '5. 주차별 성장도 폴더',
      criteriaIds: ['crit-basic-1', 'crit-basic-2', 'crit-basic-3', 'crit-basic-4', 'crit-weekly-growth', ...customCriteria.map((c) => c.id)],
      description: '주차별 지속 성장도를 기록하고 기존 폴더 결합을 지원하는 핵심 통합 폴더 (초록색 테마)',
      color: '#00E599',
      isWeeklyGrowthFolder: true,
      lessons: evaluationFolders[0]?.lessons || [
        {
          id: `les-${student.id}-1`,
          lessonName: `1주차: ${sub1Title}`,
          date: '2026-07-04',
          score: sub1?.progressPercent ?? Math.max(50, student.initialAchievement ?? 74),
          notes: '기본 핵심 원리 및 기저 변환 연산 이해도 우수',
        },
        {
          id: `les-${student.id}-2`,
          lessonName: `2주차: ${sub2Title}`,
          date: '2026-07-18',
          score: sub2?.progressPercent ?? Math.max(55, student.finalGrowth ?? 82),
          notes: '심화 설계 및 시뮬레이션 프로젝트 수행 완료',
        },
        {
          id: `les-${student.id}-3`,
          lessonName: `3주차: ${student.trajectoryName} 종합 프로젝트 및 응용`,
          date: '2026-08-05',
          score: Math.max(60, student.finalGrowth ?? 91),
          notes: '동료 학습자 대비 빠른 수렴 속도 달성, 높은 자율성',
        },
      ],
    };
  }, [evaluationFolders, customCriteria, student]);

  // Average score of 5th Weekly Growth Folder
  const weeklyAvgScore = useMemo(() => {
    if (!weeklyGrowthFolder.lessons || weeklyGrowthFolder.lessons.length === 0) return 85;
    return Math.round(
      weeklyGrowthFolder.lessons.reduce((sum, l) => sum + l.score, 0) / weeklyGrowthFolder.lessons.length
    );
  }, [weeklyGrowthFolder.lessons]);

  // All available criteria list: 1~4 basic + 5. 주차별 성장도 + 6... custom criteria
  const allCriteriaList: {
    id: string;
    name: string;
    score: number;
    isBasic: boolean;
    isWeeklyGrowth?: boolean;
    folderId?: string | null;
    ratioPercent?: number;
    details?: string;
    keyStrengths?: string[];
    actionGuidance?: string;
  }[] = useMemo(() => {
    const baseList = [
      {
        id: 'crit-basic-1',
        name: '1. 최초성취도',
        score: student.initialAchievement ?? student.cognitiveLoad ?? 70,
        isBasic: true,
        details: '초기 학습 진단 및 기초 연산 상태 평가치',
        keyStrengths: ['기초 개념 인출', '원리 탐색 자율성'],
        actionGuidance: '기초 개념이 안정화되었으므로 다차원 응용 심화 학습으로 확장을 권장합니다.',
      },
      {
        id: 'crit-basic-2',
        name: '2. 참여도 지수',
        score: student.engagementIndex ?? 80,
        isBasic: true,
        details: '세션 접속 지속도 및 상호작용 피드백 반영 적극성',
        keyStrengths: ['지속 집중력', '실시간 질문 생성'],
        actionGuidance: '높은 참여도를 유지하고 있으며, 동료 피어 리뷰 세션을 통한 상호 피드백을 추천합니다.',
      },
      {
        id: 'crit-basic-3',
        name: '3. 최종 성장도',
        score: student.finalGrowth ?? 75,
        isBasic: true,
        details: '모듈 수료 및 다차원 성취도 도약 지표',
        keyStrengths: ['문제 해결 가속화', '오류 자가 수정'],
        actionGuidance: '최종 성장 곡선이 우상향하고 있으므로 자율적 캡스톤 프로젝트 진입을 권장합니다.',
      },
      {
        id: 'crit-basic-4',
        name: '4. 미래역량',
        score: student.futureCompetencyScore ?? student.radarScores.futureCompetency ?? 85,
        isBasic: true,
        details: '비정형 복합 상황에서의 메타인지 및 AI 협업 능력',
        keyStrengths: ['창의적 종합', '시스템 설계 유연성'],
        actionGuidance: '복합 비선형 시뮬레이션 환경에서의 심화 탐색 과제를 배치하세요.',
      },
      {
        id: 'crit-weekly-growth',
        name: '5. 주차별 성장도',
        score: weeklyAvgScore,
        isBasic: false,
        isWeeklyGrowth: true,
        details: `5번째 주차별 성장도 폴더 내 ${weeklyGrowthFolder.lessons.length}회차 누적 수업 실습 평균 측정치 (${weeklyAvgScore}점)`,
        keyStrengths: ['주차별 연속 도약', '누적 개념 수렴 우수'],
        actionGuidance: '주차별 성취도가 안정적으로 성장하고 있으며, 최신 주차 심화 과제를 지속 지원하세요.',
      },
      ...customCriteria.map((c, i) => ({
        id: c.id,
        name: `${i + 1}. ${c.name}`,
        score: c.score,
        isBasic: false,
        folderId: c.folderId,
        details: c.description || `${c.name} 추가 역량 평가 지표`,
        keyStrengths: ['특화 역량 발휘', '과제 완수 집념'],
        actionGuidance: `${c.name} 역량을 심화하기 위한 맞춤형 피드백을 제공하세요.`,
      })),
    ];

    return baseList.map((c) => ({
      ...c,
      ratioPercent: criteriaRatios[c.id] ?? Math.round(100 / baseList.length),
    }));
  }, [student, customCriteria, weeklyAvgScore, weeklyGrowthFolder, criteriaRatios]);

  // Active blue-border criteria IDs state
  const [activeCriteriaIds, setActiveCriteriaIds] = useState<string[]>(() => [
    'crit-basic-1',
    'crit-basic-2',
    'crit-basic-3',
    'crit-basic-4',
    'crit-weekly-growth',
    ...customCriteria.map((c) => c.id),
  ]);

  // Toggle Blue Border Active / Inactive State for Criteria
  const handleToggleCriterionActive = (criterionId: string) => {
    setActiveCriteriaIds((prev) =>
      prev.includes(criterionId)
        ? prev.filter((id) => id !== criterionId)
        : [...prev, criterionId]
    );
  };

  // Add/Remove Criterion from Weekly Growth Folder
  const handleAddCriterionToFolder = (folderId: string, criterionId: string) => {
    const updatedFolders = (evaluationFolders.length > 0 ? evaluationFolders : [weeklyGrowthFolder]).map((f) => {
      if (f.id === folderId || (folderId === 'folder-weekly-growth' && f.isWeeklyGrowthFolder)) {
        return {
          ...f,
          criteriaIds: Array.from(new Set([...f.criteriaIds, criterionId])),
        };
      }
      return f;
    });

    if (!updatedFolders.some((f) => f.id === folderId || (folderId === 'folder-weekly-growth' && f.isWeeklyGrowthFolder))) {
      updatedFolders.push({
        ...weeklyGrowthFolder,
        criteriaIds: Array.from(new Set([...weeklyGrowthFolder.criteriaIds, criterionId])),
      });
    }

    notifyStudentUpdate({ evaluationFolders: updatedFolders });
  };

  const handleRemoveCriterionFromFolder = (folderId: string, criterionId: string) => {
    const currentList = evaluationFolders.length > 0 ? evaluationFolders : [weeklyGrowthFolder];
    const updatedFolders = currentList.map((f) => {
      if (f.id === folderId || (folderId === 'folder-weekly-growth' && f.isWeeklyGrowthFolder)) {
        return {
          ...f,
          criteriaIds: f.criteriaIds.filter((id) => id !== criterionId),
        };
      }
      return f;
    });
    notifyStudentUpdate({ evaluationFolders: updatedFolders });
  };

  // Add Lesson Record to Weekly Growth Folder
  const handleAddWeeklyLessonRecord = (folderId: string, lesson: Omit<LessonGrowthRecord, 'id'>) => {
    const newRecord: LessonGrowthRecord = {
      id: `les-${Date.now()}`,
      ...lesson,
    };

    const currentList = evaluationFolders.length > 0 ? evaluationFolders : [weeklyGrowthFolder];
    let found = false;
    const updatedFolders = currentList.map((f) => {
      if (f.id === folderId || (folderId === 'folder-weekly-growth' && f.isWeeklyGrowthFolder)) {
        found = true;
        return {
          ...f,
          lessons: [...f.lessons, newRecord],
        };
      }
      return f;
    });

    if (!found) {
      updatedFolders.push({
        ...weeklyGrowthFolder,
        lessons: [...weeklyGrowthFolder.lessons, newRecord],
      });
    }

    notifyStudentUpdate({ evaluationFolders: updatedFolders });
  };

  // Update Lesson Record in Weekly Growth Folder (Inline Editing)
  const handleUpdateWeeklyLessonRecord = (folderId: string, updatedLesson: LessonGrowthRecord) => {
    const currentList = evaluationFolders.length > 0 ? evaluationFolders : [weeklyGrowthFolder];
    const updatedFolders = currentList.map((f) => {
      if (f.id === folderId || (folderId === 'folder-weekly-growth' && f.isWeeklyGrowthFolder)) {
        return {
          ...f,
          lessons: f.lessons.map((l) => (l.id === updatedLesson.id ? updatedLesson : l)),
        };
      }
      return f;
    });
    notifyStudentUpdate({ evaluationFolders: updatedFolders });
  };

  // Delete Lesson Record in Weekly Growth Folder
  const handleDeleteWeeklyLessonRecord = (folderId: string, lessonId: string) => {
    const currentList = evaluationFolders.length > 0 ? evaluationFolders : [weeklyGrowthFolder];
    const updatedFolders = currentList.map((f) => {
      if (f.id === folderId || (folderId === 'folder-weekly-growth' && f.isWeeklyGrowthFolder)) {
        return {
          ...f,
          lessons: f.lessons.filter((l) => l.id !== lessonId),
        };
      }
      return f;
    });
    notifyStudentUpdate({ evaluationFolders: updatedFolders });
  };

  // Save Ratio Percentages from Modal
  const handleSaveCriteriaRatios = (updatedRatios: { id: string; ratioPercent: number }[]) => {
    const ratioMap: Record<string, number> = {};
    updatedRatios.forEach((r) => {
      ratioMap[r.id] = r.ratioPercent;
    });
    setCriteriaRatios(ratioMap);
  };

  // Recalculate student stats helper
  const notifyStudentUpdate = (updatedFields: Partial<StudentProfile>) => {
    if (!onUpdateStudent) return;
    const merged = { ...student, ...updatedFields };

    // Calculate dynamic growth if lessons exist
    let totalLessonScores = 0;
    let totalLessonCount = 0;
    (merged.evaluationFolders || []).forEach((f) => {
      f.lessons.forEach((l) => {
        totalLessonScores += l.score;
        totalLessonCount++;
      });
    });

    const calculatedAvgLessonGrowth = totalLessonCount > 0
      ? Math.round(totalLessonScores / totalLessonCount)
      : merged.finalGrowth ?? 78;

    // Recalculate radarScores dynamically
    const customAvg = (merged.customCriteria && merged.customCriteria.length > 0)
      ? merged.customCriteria.reduce((sum, c) => sum + c.score, 0) / merged.customCriteria.length
      : merged.initialAchievement;

    const dynamicRadar = {
      achievement: Math.round((merged.initialAchievement * 0.7) + (customAvg * 0.3)),
      growth: Math.round((merged.finalGrowth * 0.5) + (calculatedAvgLessonGrowth * 0.5)),
      resilience: merged.radarScores.resilience,
      adaptability: merged.radarScores.adaptability,
      futureCompetency: merged.futureCompetencyScore ?? merged.radarScores.futureCompetency,
    };

    onUpdateStudent({
      ...merged,
      radarScores: dynamicRadar,
    });
  };

  // Trajectory Subcategory Handlers (선택, 수정, 삭제, 추가, 기본값 복원)
  const handleSelectSubcategory = (subId: string) => {
    notifyStudentUpdate({
      trajectorySubcategories,
      activeSubcategoryId: subId,
    });
  };

  const handleStartEditSubcategory = (sub: TrajectorySubcategory, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setEditingSubcategoryId(sub.id);
    setEditingSubcategoryName(sub.name);
  };

  const handleSaveSubcategoryName = (subId: string, e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!editingSubcategoryName.trim()) return;

    const updated = trajectorySubcategories.map((s) =>
      s.id === subId ? { ...s, name: editingSubcategoryName.trim() } : s
    );

    notifyStudentUpdate({ trajectorySubcategories: updated });
    setEditingSubcategoryId(null);
    setEditingSubcategoryName('');
  };

  const handleCancelEditSubcategory = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setEditingSubcategoryId(null);
    setEditingSubcategoryName('');
  };

  const handleDeleteSubcategory = (subId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const remaining = trajectorySubcategories.filter((s) => s.id !== subId);
    let nextActiveId = activeSubcategoryId;
    if (activeSubcategoryId === subId) {
      nextActiveId = remaining[0]?.id || null;
    }
    notifyStudentUpdate({
      trajectorySubcategories: remaining,
      activeSubcategoryId: nextActiveId,
    });
    if (subToDeleteId === subId) setSubToDeleteId(null);
  };

  const handleAddSubcategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nextIndex = trajectorySubcategories.length + 1;
    const finalName = newSubName.trim() || `소분류 ${nextIndex}`;

    const newSub: TrajectorySubcategory = {
      id: `sub-${Date.now()}`,
      name: finalName,
      description: newSubDesc.trim() || `${finalName} 학습 모듈`,
      progressPercent: newSubProgress,
      status: 'active',
      keyTopics: ['핵심 역량 탐구', '응용 실습 과제'],
    };

    const updated = [...trajectorySubcategories, newSub];
    notifyStudentUpdate({
      trajectorySubcategories: updated,
      activeSubcategoryId: newSub.id,
    });

    setNewSubName('');
    setNewSubDesc('');
    setNewSubProgress(50);
    setIsAddingSubcategory(false);
  };

  const handleResetDefaultSubcategories = () => {
    const resetSubs: TrajectorySubcategory[] = [
      {
        id: `sub-${Date.now()}-1`,
        name: '소분류 1',
        description: '1차 기초 역량 탐구 모듈',
        progressPercent: 65,
        status: 'in_progress',
        keyTopics: ['기초 개념 탐색', '핵심 원리 분석'],
      },
      {
        id: `sub-${Date.now()}-2`,
        name: '소분류 2',
        description: '2차 심화 프로젝트 모듈',
        progressPercent: 40,
        status: 'active',
        keyTopics: ['응용 실습 프로젝트', '문제 해결 역량'],
      },
    ];
    notifyStudentUpdate({
      trajectorySubcategories: resetSubs,
      activeSubcategoryId: resetSubs[0].id,
    });
  };

  const handleUpdateSubcategoryProgress = (subId: string, progress: number) => {
    const updated = trajectorySubcategories.map((s) =>
      s.id === subId ? { ...s, progressPercent: progress } : s
    );
    notifyStudentUpdate({ trajectorySubcategories: updated });
  };

  const handleUpdateSubcategoryStatus = (subId: string, status: 'completed' | 'in_progress' | 'active') => {
    const updated = trajectorySubcategories.map((s) =>
      s.id === subId ? { ...s, status } : s
    );
    notifyStudentUpdate({ trajectorySubcategories: updated });
  };

  // 4 Basic Criteria Handlers
  const handleUpdateBasicCriteria = (field: 'initialAchievement' | 'engagementIndex' | 'finalGrowth' | 'futureCompetencyScore', value: number) => {
    if (field === 'initialAchievement') {
      notifyStudentUpdate({ initialAchievement: value, cognitiveLoad: value });
    } else {
      notifyStudentUpdate({ [field]: value });
    }
  };

  // Add Dynamic Criterion (5th+)
  const handleAddCustomCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newCriterion: EvaluationCriterion = {
      id: `crit-custom-${Date.now()}`,
      name: newCritName.trim(),
      score: newCritScore,
      weight: 1.0,
      description: newCritDesc.trim() || '추가된 역량 평가 기준',
      isCustom: true,
      folderId: null,
    };

    const updatedCriteria = [...customCriteria, newCriterion];
    notifyStudentUpdate({ customCriteria: updatedCriteria });
    setNewCritName('');
    setNewCritScore(80);
    setNewCritDesc('');
    setIsAddingCriterion(false);
  };

  // Delete Criterion
  const handleDeleteCriterion = (id: string) => {
    const updatedCriteria = customCriteria.filter((c) => c.id !== id);
    // Remove from any folders
    const updatedFolders = evaluationFolders.map((f) => ({
      ...f,
      criteriaIds: f.criteriaIds.filter((cId) => cId !== id),
    }));
    notifyStudentUpdate({ customCriteria: updatedCriteria, evaluationFolders: updatedFolders });
  };

  // Update Custom Criterion Score
  const handleUpdateCustomScore = (id: string, newScore: number) => {
    const updatedCriteria = customCriteria.map((c) =>
      c.id === id ? { ...c, score: newScore } : c
    );
    notifyStudentUpdate({ customCriteria: updatedCriteria });
  };

  // Folder Grouping: Combine selected criteria into a folder
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || selectedCriteriaForFolder.length < 2) return;

    const newFolderId = `folder-${Date.now()}`;
    const newFolder: EvaluationFolder = {
      id: newFolderId,
      name: newFolderName.trim(),
      criteriaIds: selectedCriteriaForFolder,
      description: newFolderDesc.trim() || '2개 이상의 평가기준이 결합된 수업군 폴더',
      color: '#38BDF8',
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          lessonName: '1주차: 핵심 기초 및 탐색 실습',
          date: new Date().toISOString().split('T')[0],
          score: 78,
          notes: '초기 수업 진단 및 역량 연계 학습 참여',
        },
      ],
    };

    // Update criteria to point to this folderId
    const updatedCriteria = customCriteria.map((c) =>
      selectedCriteriaForFolder.includes(c.id) ? { ...c, folderId: newFolderId } : c
    );

    const updatedFolders = [...evaluationFolders, newFolder];
    notifyStudentUpdate({
      customCriteria: updatedCriteria,
      evaluationFolders: updatedFolders,
    });

    setNewFolderName('');
    setNewFolderDesc('');
    setSelectedCriteriaForFolder([]);
    setIsFolderModalOpen(false);
  };

  // Dissolve Folder
  const handleDissolveFolder = (folderId: string) => {
    const updatedCriteria = customCriteria.map((c) =>
      c.folderId === folderId ? { ...c, folderId: null } : c
    );
    const updatedFolders = evaluationFolders.filter((f) => f.id !== folderId);
    notifyStudentUpdate({
      customCriteria: updatedCriteria,
      evaluationFolders: updatedFolders,
    });
  };

  // Add Lesson Growth Record
  const handleAddLessonRecord = (folderId: string) => {
    if (!newLessonName.trim()) return;

    const newRecord: LessonGrowthRecord = {
      id: `les-${Date.now()}`,
      lessonName: newLessonName.trim(),
      date: newLessonDate,
      score: newLessonScore,
      notes: newLessonNotes.trim() || '수업 성장 기록 저장됨',
    };

    const updatedFolders = evaluationFolders.map((f) => {
      if (f.id === folderId) {
        return {
          ...f,
          lessons: [newRecord, ...f.lessons],
        };
      }
      return f;
    });

    notifyStudentUpdate({ evaluationFolders: updatedFolders });
    setNewLessonName('');
    setNewLessonScore(85);
    setNewLessonNotes('');
    setActiveFolderIdForLesson(null);
  };

  // Delete Lesson Record
  const handleDeleteLessonRecord = (folderId: string, lessonId: string) => {
    const updatedFolders = evaluationFolders.map((f) => {
      if (f.id === folderId) {
        return {
          ...f,
          lessons: f.lessons.filter((l) => l.id !== lessonId),
        };
      }
      return f;
    });
    notifyStudentUpdate({ evaluationFolders: updatedFolders });
  };

  // Radar chart calculation
  const radarAxes = [
    { label: '최초성취도', key: 'achievement', angle: -90 },
    { label: '최종성장도', key: 'growth', angle: -18 },
    { label: '회복탄력성', key: 'resilience', angle: 54 },
    { label: '적응력', key: 'adaptability', angle: 126 },
    { label: '미래역량', key: 'futureCompetency', angle: 198 },
  ];

  const radarCenter = { x: 140, y: 130 };
  const radarRadius = 85;

  const getPointOnAxis = (value: number, angleDeg: number, maxVal = 100) => {
    const rad = (angleDeg * Math.PI) / 180;
    const r = (value / maxVal) * radarRadius;
    return {
      x: radarCenter.x + r * Math.cos(rad),
      y: radarCenter.y + r * Math.sin(rad),
    };
  };

  const polygonPoints = radarAxes
    .map((axis) => {
      const val = (student.radarScores as any)[axis.key] || 70;
      const pt = getPointOnAxis(val, axis.angle);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  // 12-Month Growth Trend Path Helpers
  const chartWidth = 320;
  const chartHeight = 150;
  const paddingX = 30;
  const paddingY = 20;

  const getTrendCoords = (index: number, val: number) => {
    const x = paddingX + (index / (student.growthTrend.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (val / 100) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const createSmoothPath = (values: number[]) => {
    const points = values.map((v, i) => getTrendCoords(i, v));
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const achievementPath = createSmoothPath(student.growthTrend.map((t) => t.achievement));
  const potentialPath = createSmoothPath(student.growthTrend.map((t) => t.potential));

  const handleDeleteActiveStudent = () => {
    if (onDeleteStudent) {
      onDeleteStudent(student.id);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>학습자 프로필</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#132338] border border-[#00E599]/40 text-[#00E599] font-mono">
              다차원 성장 평가 시스템
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            4대 핵심 역량 기준선 측정, 수업별 지속 성장도 폴더 기록 및 5단계+ 동적 역량 평가
          </p>
        </div>

        {/* Action Controls: Add Student & Live Sync Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00E599] hover:bg-[#00E599]/90 text-[#0A101D] text-xs font-bold rounded-lg transition-all shadow-[0_0_12px_rgba(0,229,153,0.3)]"
          >
            <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>신규 학생 등록</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00E599]/10 border border-[#00E599]/30 text-[#00E599] text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-ping" />
            <span>LIVE SYNC</span>
          </div>
        </div>
      </div>

      {/* Student Switcher Carousel / Bar */}
      {students.length > 0 && (
        <div className="bg-[#0E1526] border border-[#1E293B] rounded-xl p-3 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0 text-xs text-slate-400 font-semibold px-1">
            <Users className="w-4 h-4 text-[#00E599]" />
            <span>학습자 목록:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {students.map((st) => {
              const isActive = st.id === student.id;
              return (
                <button
                  key={st.id}
                  onClick={() => onSelectStudent && onSelectStudent(st.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all shrink-0 border ${
                    isActive
                      ? 'bg-[#112338] border-[#00E599] text-[#00E599] font-bold shadow-[0_0_12px_rgba(0,229,153,0.2)] ring-1 ring-[#00E599]'
                      : 'bg-[#111A2E] border-[#1E293B] text-slate-300 hover:text-slate-100 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={st.avatarUrl}
                    alt={st.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{st.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({st.radarScores.achievement}점)
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="shrink-0 text-xs text-[#00E599] hover:underline font-semibold flex items-center gap-1 px-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>학생 추가</span>
          </button>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Identity, Trajectory Editing, 4 Core Criteria & Dynamic Criteria */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Identity & Trajectory Card */}
          <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-[#00E599]/50 shadow-[0_0_15px_rgba(0,229,153,0.3)]">
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00E599] rounded-full ring-2 ring-[#0E1526] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-[#0A101D] rounded-full" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-100">{student.name}</h2>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-slate-400">ID: {student.id}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00E599]/15 border border-[#00E599]/40 text-[#00E599] text-[10px] font-mono font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
                      {student.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Delete Button */}
              {showDeleteConfirm ? (
                <div className="flex items-center gap-1 bg-[#1A101C] border border-rose-500/40 p-1 rounded-lg animate-in fade-in">
                  <span className="text-[10px] text-rose-400 px-1 font-semibold">삭제?</span>
                  <button
                    onClick={handleDeleteActiveStudent}
                    className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold rounded"
                  >
                    확인
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-1 bg-[#1E293B] text-slate-300 text-[10px] rounded"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-colors"
                  title="학생 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>학생 삭제</span>
                </button>
              )}
            </div>

            {/* Learning Subcategories (소분류 전용 관리 영역 - 현재 학습궤적은 제거하고 소분류만 유지) */}
            <div className="pt-3 border-t border-[#1E293B] bg-[#0A101D] p-3.5 rounded-xl border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ListTree className="w-4 h-4 text-[#00E599]" />
                  <span className="text-xs font-bold text-slate-200">
                    학습 소분류 ({trajectorySubcategories.length}개)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setIsAddingSubcategory(true);
                      setNewSubName(`소분류 ${trajectorySubcategories.length + 1}`);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-[#00E599]/15 border border-[#00E599]/40 text-[#00E599] rounded hover:bg-[#00E599]/25 transition-colors"
                    title="새 소분류 추가"
                  >
                    <Plus className="w-3 h-3" />
                    <span>소분류 추가</span>
                  </button>
                  <button
                    onClick={() => setIsTrajectoryModalOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold bg-[#111A2E] border border-[#1E293B] text-slate-300 rounded hover:bg-[#1E293B] hover:text-white transition-colors"
                    title="소분류 상세 관리 모달 열기"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>상세 관리</span>
                  </button>
                  {trajectorySubcategories.length === 0 && (
                    <button
                      onClick={handleResetDefaultSubcategories}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-slate-700 text-slate-200 rounded hover:bg-slate-600"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>기본 2개 복원</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Subcategories List / Chips */}
                <div className="space-y-1.5">
                  {trajectorySubcategories.map((sub) => {
                    const isSelected = sub.id === activeSubcategoryId;
                    const isEditing = editingSubcategoryId === sub.id;

                    if (isEditing) {
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center gap-1.5 bg-[#112338] border border-[#00E599] p-1.5 rounded-lg animate-in fade-in"
                        >
                          <input
                            type="text"
                            value={editingSubcategoryName}
                            onChange={(e) => setEditingSubcategoryName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveSubcategoryName(sub.id);
                              if (e.key === 'Escape') handleCancelEditSubcategory();
                            }}
                            placeholder="소분류 이름..."
                            autoFocus
                            className="flex-1 bg-[#0A101D] border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 outline-none focus:border-[#00E599]"
                          />
                          <button
                            onClick={(e) => handleSaveSubcategoryName(sub.id, e)}
                            className="px-2 py-1 bg-[#00E599] text-[#0A101D] rounded text-xs font-bold hover:bg-[#00E599]/90 flex items-center gap-1"
                            title="수정 저장"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>저장</span>
                          </button>
                          <button
                            onClick={handleCancelEditSubcategory}
                            className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs hover:bg-slate-600"
                            title="취소"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={sub.id}
                        onClick={() => handleSelectSubcategory(sub.id)}
                        className={`group flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#112338] border-[#00E599] text-slate-100 shadow-[0_0_12px_rgba(0,229,153,0.15)] ring-1 ring-[#00E599]/50'
                            : 'bg-[#111A2E] border-[#1E293B] text-slate-300 hover:border-slate-600 hover:bg-[#142038]'
                        }`}
                      >
                        {/* Subcategory Label & Selection state */}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isSelected ? 'bg-[#00E599] shadow-[0_0_6px_#00E599]' : 'bg-slate-500'
                            }`}
                          />
                          <span className={`font-semibold truncate ${isSelected ? 'text-[#00E599]' : 'text-slate-200'}`}>
                            {sub.name}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00E599]/20 text-[#00E599] font-mono shrink-0">
                              선택됨
                            </span>
                          )}
                        </div>

                        {/* Progress and Actions (Edit / Delete) */}
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="text-[10px] font-mono text-slate-400 bg-[#0A101D] px-1.5 py-0.5 rounded border border-[#1E293B]">
                            {sub.progressPercent ?? 50}%
                          </span>

                          {/* Edit Name button */}
                          <button
                            onClick={(e) => handleStartEditSubcategory(sub, e)}
                            className="p-1 rounded hover:bg-[#1E293B] text-slate-400 hover:text-[#00E599] transition-colors"
                            title={`소분류 (${sub.name}) 이름 수정`}
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>

                          {/* Delete Subcategory button */}
                          {subToDeleteId === sub.id ? (
                            <div
                              className="flex items-center gap-1 bg-rose-950/80 border border-rose-500 p-0.5 rounded animate-in fade-in"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => handleDeleteSubcategory(sub.id, e)}
                                className="px-1.5 py-0.5 bg-rose-500 text-white rounded text-[10px] font-bold"
                              >
                                삭제
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSubToDeleteId(null);
                                }}
                                className="px-1 py-0.5 bg-slate-700 text-slate-200 rounded text-[10px]"
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSubToDeleteId(sub.id);
                              }}
                              className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                              title={`소분류 (${sub.name}) 삭제`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Inline Add Form */}
                {isAddingSubcategory && (
                  <form onSubmit={handleAddSubcategory} className="bg-[#112338] border border-[#38BDF8] p-2.5 rounded-lg space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs text-[#38BDF8] font-bold">
                      <span>새 소분류 등록</span>
                      <button
                        type="button"
                        onClick={() => setIsAddingSubcategory(false)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="소분류 이름 입력 (예: 소분류 3, 양자 얽힘 심화)..."
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      className="w-full bg-[#0A101D] border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-100 outline-none focus:border-[#38BDF8]"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-1 text-[11px] text-slate-400">
                        <span>진행도: {newSubProgress}%</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={newSubProgress}
                          onChange={(e) => setNewSubProgress(Number(e.target.value))}
                          className="flex-1 accent-[#38BDF8] h-1.5"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0A101D] font-bold text-xs rounded"
                      >
                        추가 완료
                      </button>
                    </div>
                  </form>
                )}

                {/* Active Subcategory Details Card (Merged Interactive Slider & Progress) */}
                {activeSubcategory && (
                  <div className="bg-[#111A2E]/90 border border-[#1E293B] rounded-xl p-3 space-y-2.5 text-xs shadow-inner">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5 truncate max-w-[280px]">
                        <BookmarkCheck className="w-4 h-4 text-[#00E599] shrink-0" />
                        <span className="truncate">선택된 소분류: <strong className="text-[#00E599]">{activeSubcategory.name}</strong></span>
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#00E599]/15 text-[#00E599] font-mono font-bold border border-[#00E599]/30 shrink-0">
                        {activeSubcategory.progressPercent ?? 50}%
                      </span>
                    </div>

                    {/* Merged Interactive Progress Slider */}
                    <div className="space-y-1 bg-[#0A101D] p-2.5 rounded-lg border border-[#1E293B]">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>진척도 조절</span>
                        <span className="font-mono text-[#00E599] font-semibold">{activeSubcategory.progressPercent ?? 50}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={activeSubcategory.progressPercent ?? 50}
                        onChange={(e) =>
                          handleUpdateSubcategoryProgress(activeSubcategory.id, Number(e.target.value))
                        }
                        className="w-full accent-[#00E599] h-2 bg-[#172033] rounded-lg cursor-pointer transition-all"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>0% (입문)</span>
                        <span>50% (기본)</span>
                        <span>100% (마스터)</span>
                      </div>
                    </div>

                    {activeSubcategory.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 px-1">
                        {activeSubcategory.description}
                      </p>
                    )}

                    <div className="flex justify-end pt-0.5">
                      <button
                        onClick={() => setIsTrajectoryModalOpen(true)}
                        className="text-[11px] text-[#00E599] hover:underline font-semibold flex items-center gap-0.5 transition-colors"
                      >
                        <span>소분류 심층 관리 진입</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* 2. 학생 평가 기준: 기본 4종 + 5번째 주차별 성장도 + 6번째 이후 동적 기준 & 토글 영역 */}
          <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00E599]" />
                <h3 className="text-sm font-bold text-slate-200">
                  학생 역량 평가 기준 (5대 기본 + 추가 역량)
                </h3>
              </div>

              {/* [평가기준 비율] 버튼 (기존 폴더 결합 위치에서 100% 산정 모달 오픈) */}
              <button
                onClick={() => setIsRatioModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E599]/15 border border-[#00E599]/40 text-[#00E599] text-xs font-bold hover:bg-[#00E599]/25 transition-all shadow-[0_0_10px_rgba(0,229,153,0.15)]"
                title="추가된 역량까지 모든 평가기준의 평가 산정비율을 조절하여 100%를 만듭니다"
              >
                <Percent className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>평가기준 비율</span>
              </button>
            </div>

            {/* 5대 기본 평가 기준 리스트 */}
            <div className="space-y-3 pt-1">
              {/* 1. 최초성취도 */}
              <div className="bg-[#0A101D] p-3 rounded-xl border border-[#1E293B] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E599]"></span>
                    <span>1. 최초성취도</span>
                  </span>
                  <span className="font-mono font-bold text-[#00E599]">
                    {student.initialAchievement ?? student.cognitiveLoad ?? 70}점
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={student.initialAchievement ?? student.cognitiveLoad ?? 70}
                  onChange={(e) => handleUpdateBasicCriteria('initialAchievement', Number(e.target.value))}
                  className="w-full accent-[#00E599] h-1.5 bg-[#1E293B] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>학습 시작 시점의 기저 지식 및 초기 이해 성취 수준</span>
                </div>
              </div>

              {/* 2. 참여도 지수 */}
              <div className="bg-[#0A101D] p-3 rounded-xl border border-[#1E293B] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
                    <span>2. 참여도 지수</span>
                  </span>
                  <span className="font-mono font-bold text-[#38BDF8]">
                    {student.engagementIndex ?? 80}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={student.engagementIndex ?? 80}
                  onChange={(e) => handleUpdateBasicCriteria('engagementIndex', Number(e.target.value))}
                  className="w-full accent-[#38BDF8] h-1.5 bg-[#1E293B] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>상호작용 빈도, 질의응답 및 능동적 학습 참여율</span>
                </div>
              </div>

              {/* 3. 최종 성장도 */}
              <div className="bg-[#0A101D] p-3 rounded-xl border border-[#1E293B] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                    <span>3. 최종 성장도</span>
                  </span>
                  <span className="font-mono font-bold text-[#F59E0B]">
                    {student.finalGrowth ?? 75}점
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={student.finalGrowth ?? 75}
                  onChange={(e) => handleUpdateBasicCriteria('finalGrowth', Number(e.target.value))}
                  className="w-full accent-[#F59E0B] h-1.5 bg-[#1E293B] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>수업별 누적 학습에 따른 총체적 성장 속도 및 도약률</span>
                </div>
              </div>

              {/* 4. 미래역량 */}
              <div className="bg-[#0A101D] p-3 rounded-xl border border-[#1E293B] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                    <span>4. 미래역량</span>
                  </span>
                  <span className="font-mono font-bold text-[#A78BFA]">
                    {student.futureCompetencyScore ?? student.radarScores.futureCompetency ?? 85}점
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={student.futureCompetencyScore ?? student.radarScores.futureCompetency ?? 85}
                  onChange={(e) => handleUpdateBasicCriteria('futureCompetencyScore', Number(e.target.value))}
                  className="w-full accent-[#A78BFA] h-1.5 bg-[#1E293B] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>복합 문제해결, 융합 확장성 및 차세대 AI 협업 잠재력</span>
                </div>
              </div>

              {/* 5. 주차별 성장도 (5번째 기본 역량 - 초록색 테마) */}
              <div className="bg-[#0A101D] p-3 rounded-xl border border-[#00E599]/40 shadow-[0_0_10px_rgba(0,229,153,0.08)] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00E599]"></span>
                    <span className="text-[#00E599] font-bold">5. 주차별 성장도</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00E599]/20 text-[#00E599] font-mono">
                      기본 5번째
                    </span>
                  </span>
                  <span className="font-mono font-bold text-[#00E599]">
                    {weeklyAvgScore}점
                  </span>
                </div>
                <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00E599] transition-all duration-300"
                    style={{ width: `${weeklyAvgScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5번째 주차별 성장도 폴더 내 수업별 성장 기록 실시간 연동 ({weeklyGrowthFolder.lessons.length}회차 평균)</span>
                </div>
              </div>
            </div>

            {/* 5번째부터: 추가 시 보이기 / 숨기기 토글 버튼 & 추가 역량 목록 */}
            <div className="pt-3 border-t border-[#1E293B]">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsCustomCriteriaVisible(!isCustomCriteriaVisible)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111A2E] hover:bg-[#16223D] border border-[#1E293B] text-xs font-semibold text-slate-200 transition-colors"
                >
                  {isCustomCriteriaVisible ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>추가 역량 숨기기 ({customCriteria.length}개)</span>
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#00E599]" />
                      <span>추가 역량 보기 ({customCriteria.length}개)</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsCustomCriteriaVisible(true);
                    setIsAddingCriterion(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#00E599]/15 hover:bg-[#00E599]/25 text-[#00E599] text-xs font-bold rounded-lg border border-[#00E599]/40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ 추가 역량 등록</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 mt-1.5 px-1">
                * 추가한 역량은 숨겨져 있더라도 삭제 버튼을 누르지 않는 한 학생 프로필 및 다차원 역량 분석에 상시 반영됩니다.
              </p>

              {/* Dynamic Added Criteria Container */}
              {isCustomCriteriaVisible && (
                <div className="space-y-3 mt-3 animate-in fade-in">
                  {/* Add Criterion Form */}
                  {isAddingCriterion && (
                    <form
                      onSubmit={handleAddCustomCriterion}
                      className="bg-[#0D1629] p-3.5 rounded-xl border border-[#00E599]/40 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-[#00E599]">
                        <span>새 추가 역량 등록</span>
                        <button
                          type="button"
                          onClick={() => setIsAddingCriterion(false)}
                          className="text-slate-400 hover:text-slate-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-slate-300 text-[11px]">역량/기준명 *</label>
                          <input
                            type="text"
                            required
                            placeholder="예: 창의적 알고리즘 탐색, 데이터 모델링"
                            value={newCritName}
                            onChange={(e) => setNewCritName(e.target.value)}
                            className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-2.5 py-1.5 text-slate-100 focus:border-[#00E599] outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-300 text-[11px]">평가 점수 (0~100): {newCritScore}점</label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={newCritScore}
                            onChange={(e) => setNewCritScore(Number(e.target.value))}
                            className="w-full accent-[#00E599] mt-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-slate-300 text-[11px]">상세 설명 / 관찰 기준</label>
                        <input
                          type="text"
                          placeholder="평가 기준에 대한 부가 설명 입력"
                          value={newCritDesc}
                          onChange={(e) => setNewCritDesc(e.target.value)}
                          className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-2.5 py-1 text-slate-100 focus:border-[#00E599] outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsAddingCriterion(false)}
                          className="px-3 py-1 rounded bg-[#1E293B] text-slate-300 text-xs"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1 rounded bg-[#00E599] text-[#0A101D] font-bold text-xs hover:bg-[#00E599]/90"
                        >
                          등록
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Custom Criteria */}
                  {customCriteria.length === 0 && !isAddingCriterion && (
                    <div className="text-center py-4 bg-[#0A101D] rounded-xl border border-dashed border-[#1E293B] text-xs text-slate-400">
                      등록된 추가 역량이 없습니다. <br />
                      상단의 <span className="text-[#00E599]">[+ 추가 역량 등록]</span> 버튼을 눌러 새 평가 기준을 자유롭게 확장하세요.
                    </div>
                  )}

                  {customCriteria.map((crit, idx) => (
                    <div
                      key={crit.id}
                      className="bg-[#0A101D] p-3 rounded-xl border border-[#1E293B] space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <span>{idx + 1}. {crit.name}</span>
                          {crit.folderId && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8]">
                              폴더 연결됨
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400">
                            {crit.score}점
                          </span>
                          <button
                            onClick={() => handleDeleteCriterion(crit.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            title="역량 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={crit.score}
                        onChange={(e) => handleUpdateCustomScore(crit.id, Number(e.target.value))}
                        className="w-full accent-emerald-400 h-1.5 bg-[#1E293B] rounded-lg cursor-pointer"
                      />
                      {crit.description && (
                        <p className="text-[10px] text-slate-400">{crit.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. AI Prediction Card */}
          <div className="bg-[#0E1526] border border-[#1E293B] rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E599]" />
              <h3 className="text-sm font-bold text-slate-200 tracking-tight">AI 궤적 예측</h3>
            </div>

            <div className="bg-[#090F1C] border border-[#00E599]/30 rounded-xl p-6 text-center shadow-[inset_0_0_20px_rgba(0,229,153,0.08)] relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#00E599] to-transparent opacity-70" />
              <div className="text-4xl font-black text-[#00E599] font-mono tracking-tight drop-shadow-[0_0_15px_rgba(0,229,153,0.45)]">
                {student.aiPrediction.probability}%
              </div>
              <div className="text-[11px] font-medium text-slate-400 mt-1">
                미래 역량 도달 확률 (4대 기준 & 추가 역량 가중 산출)
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {student.aiPrediction.insight}
            </p>

            <button
              onClick={onSimulateIntervention}
              className="w-full py-2 bg-[#132338] hover:bg-[#182C46] text-[#00E599] text-xs font-semibold rounded-lg border border-[#00E599]/30 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>적응형 비선형 스캐폴딩 시뮬레이션</span>
            </button>
          </div>
        </div>

        {/* Right Column (7 Cols): Radar, Weekly Growth Trend, Evaluation Folders & Key Learning Moments */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Row: Dynamic Radar & Weekly Growth Trend Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Dynamic Multidimensional Radar (학생역량평가기준 개수 N에 따른 동적 N각형 레이더) */}
            <DynamicRadarChart
              items={allCriteriaList}
              activeCriteriaIds={activeCriteriaIds}
              onToggleCriterionActive={handleToggleCriterionActive}
            />

            {/* 2. Weekly Growth Trend Chart (5번째 주차별 성장도 실시간 점선형 그래프) */}
            <WeeklyGrowthChart
              lessons={weeklyGrowthFolder.lessons}
              overallAverageScore={weeklyAvgScore}
            />
          </div>

          {/* 3. 5번째 주차별 성장도 폴더 및 수업별 누적 성장 기록 관리 */}
          <WeeklyGrowthFolderCard
            folder={weeklyGrowthFolder}
            weeklyFolder={weeklyGrowthFolder}
            allCriteria={allCriteriaList}
            allCriteriaList={allCriteriaList}
            activeCriteriaIds={activeCriteriaIds}
            onToggleCriterionActive={handleToggleCriterionActive}
            onAddCriterionToFolder={handleAddCriterionToFolder}
            onRemoveCriterionFromFolder={handleRemoveCriterionFromFolder}
            onAddLessonRecord={handleAddWeeklyLessonRecord}
            onUpdateLessonRecord={handleUpdateWeeklyLessonRecord}
            onDeleteLessonRecord={handleDeleteWeeklyLessonRecord}
            onOpenFolderCombineModal={() => setIsFolderModalOpen(true)}
            onOpenCombineFolderModal={() => setIsFolderModalOpen(true)}
          />

          {/* 4. 핵심 학습 모먼트 (학생역량평가기준 전 역량 연동 및 심층 진단) */}
          <KeyLearningMomentsSection
            criteria={allCriteriaList}
            allCriteriaList={allCriteriaList}
            learningMoments={student.learningMoments}
            onOpenStreamData={onOpenStreamData}
          />
        </div>
      </div>

      {/* Evaluation Criteria Ratio Adjustment Modal (100% 비율 산정 모달) */}
      <CriteriaRatioModal
        isOpen={isRatioModalOpen}
        onClose={() => setIsRatioModalOpen(false)}
        criteria={allCriteriaList}
        criteriaList={allCriteriaList}
        onSaveRatios={handleSaveCriteriaRatios}
      />

      {/* Criteria Folder Grouping Modal (2개 이상의 평가기준 결합) */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0A101D]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">평가 기준 폴더 결합</h2>
                  <p className="text-xs text-slate-400">
                    2개 이상의 역량 평가 기준을 선택하여 수업 성장 폴더로 통합합니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  폴더명 (수업군 이름) <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 양자 컴퓨팅 및 시스템 실습 수업군, 1학기 인공지능 심화 프로젝트"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-3.5 py-2 text-slate-100 focus:border-[#38BDF8] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">폴더 설명</label>
                <input
                  type="text"
                  placeholder="예: 복합 알고리즘 및 시스템 구현 역량을 연계 측정하는 종합 수업군"
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-3.5 py-2 text-slate-100 focus:border-[#38BDF8] outline-none"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-slate-300 font-semibold block">
                  결합할 평가 기준 선택 (최소 2개 이상 선택) <span className="text-[#38BDF8]">*</span>
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {allCriteriaList.map((crit) => {
                    const isChecked = selectedCriteriaForFolder.includes(crit.id);
                    return (
                      <label
                        key={crit.id}
                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#112338] border-[#38BDF8] text-[#38BDF8]'
                            : 'bg-[#0A101D] border-[#1E293B] text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCriteriaForFolder([...selectedCriteriaForFolder, crit.id]);
                              } else {
                                setSelectedCriteriaForFolder(
                                  selectedCriteriaForFolder.filter((id) => id !== crit.id)
                                );
                              }
                            }}
                            className="accent-[#38BDF8] w-4 h-4 rounded"
                          />
                          <span className="font-semibold text-xs text-slate-200">{crit.name}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {crit.score}점
                        </span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400">
                  선택됨: {selectedCriteriaForFolder.length}개 기준
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#1E293B] text-slate-300 hover:bg-[#1E293B]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim() || selectedCriteriaForFolder.length < 2}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#38BDF8] text-[#0A101D] font-bold hover:bg-[#38BDF8]/90 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                >
                  <Check className="w-4 h-4" />
                  <span>폴더 생성 및 기준 결합</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategories Deep Management Modal (소분류 심층 관리 모달) */}
      {isTrajectoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0A101D]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
                  <ListTree className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>학습 소분류 관리 시스템</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#00E599]/20 text-[#00E599] font-mono">
                      기본 2개 소분류 시작
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    소분류 선택, 명칭 수정, 삭제 및 학습 진행도 설정
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTrajectoryModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Subcategories Management (소분류 선택, 수정, 삭제) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <ListTree className="w-4 h-4 text-[#38BDF8]" />
                      <span>소분류 관리 목록 ({trajectorySubcategories.length}개)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      원하는 소분류를 클릭하여 활성화하고, 연필 아이콘으로 이름 수정 또는 휴지통으로 삭제할 수 있습니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetDefaultSubcategories}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs bg-[#1E293B] hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
                      title="소분류 1, 2 기본값 복원"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>기본 2개 복원</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingSubcategory(true);
                        setNewSubName(`소분류 ${trajectorySubcategories.length + 1}`);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0A101D] font-bold text-xs rounded-lg transition-all shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>소분류 추가</span>
                    </button>
                  </div>
                </div>

                {/* Subcategories List Cards */}
                {trajectorySubcategories.length === 0 ? (
                  <div className="text-center py-8 bg-[#0A101D] border border-dashed border-[#1E293B] rounded-xl space-y-2">
                    <p className="text-xs text-slate-400">등록된 소분류가 없습니다.</p>
                    <button
                      onClick={handleResetDefaultSubcategories}
                      className="px-3 py-1.5 bg-[#00E599] text-[#0A101D] text-xs font-bold rounded-lg"
                    >
                      기본 소분류 2개(소분류 1, 2) 생성
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {trajectorySubcategories.map((sub, idx) => {
                      const isSelected = sub.id === activeSubcategoryId;
                      const isEditing = editingSubcategoryId === sub.id;

                      return (
                        <div
                          key={sub.id}
                          className={`bg-[#0A101D] border rounded-xl p-3.5 space-y-3 transition-all ${
                            isSelected
                              ? 'border-[#00E599] bg-[#0E1A2C] shadow-[0_0_15px_rgba(0,229,153,0.15)] ring-1 ring-[#00E599]'
                              : 'border-[#1E293B] hover:border-slate-600'
                          }`}
                        >
                          {/* Card Header: Selection radio & Title with Inline Edit */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <button
                                onClick={() => handleSelectSubcategory(sub.id)}
                                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                                  isSelected
                                    ? 'border-[#00E599] bg-[#00E599] text-[#0A101D]'
                                    : 'border-slate-600 hover:border-[#00E599]'
                                }`}
                                title="이 소분류 선택"
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>

                              {isEditing ? (
                                <div className="flex items-center gap-1.5 flex-1 animate-in fade-in">
                                  <input
                                    type="text"
                                    value={editingSubcategoryName}
                                    onChange={(e) => setEditingSubcategoryName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveSubcategoryName(sub.id);
                                      if (e.key === 'Escape') handleCancelEditSubcategory();
                                    }}
                                    autoFocus
                                    className="flex-1 bg-[#111A2E] border border-[#00E599] rounded px-2 py-1 text-xs text-slate-100 outline-none"
                                  />
                                  <button
                                    onClick={(e) => handleSaveSubcategoryName(sub.id, e)}
                                    className="px-2 py-1 bg-[#00E599] text-[#0A101D] text-xs font-bold rounded"
                                  >
                                    저장
                                  </button>
                                  <button
                                    onClick={handleCancelEditSubcategory}
                                    className="px-1.5 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleSelectSubcategory(sub.id)}
                                  className="cursor-pointer flex-1 min-w-0"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <h4
                                      className={`font-bold text-sm truncate ${
                                        isSelected ? 'text-[#00E599]' : 'text-slate-200'
                                      }`}
                                    >
                                      {sub.name}
                                    </h4>
                                    {isSelected && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#00E599]/20 text-[#00E599] font-mono shrink-0">
                                        선택됨
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-500">
                                    인덱스 #{idx + 1}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons: Rename & Delete */}
                            {!isEditing && (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={(e) => handleStartEditSubcategory(sub, e)}
                                  className="p-1.5 rounded-lg bg-[#111A2E] hover:bg-[#1E293B] text-slate-400 hover:text-[#00E599] border border-[#1E293B] transition-colors"
                                  title={`소분류 (${sub.name}) 이름 수정`}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteSubcategory(sub.id, e)}
                                  className="p-1.5 rounded-lg bg-[#111A2E] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-[#1E293B] transition-colors"
                                  title={`소분류 (${sub.name}) 삭제`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Progress & Status Controls */}
                          <div className="space-y-2 bg-[#111A2E]/60 p-2.5 rounded-lg border border-[#1E293B]">
                            <div className="flex items-center justify-between text-xs text-slate-300">
                              <span className="text-[11px] text-slate-400">학습 진도율:</span>
                              <span className="font-mono font-bold text-[#38BDF8]">
                                {sub.progressPercent ?? 50}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={sub.progressPercent ?? 50}
                              onChange={(e) => handleUpdateSubcategoryProgress(sub.id, Number(e.target.value))}
                              className="w-full accent-[#38BDF8] h-1.5"
                            />

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[11px] text-slate-400">학습 상태:</span>
                              <div className="flex items-center gap-1">
                                {(['active', 'in_progress', 'completed'] as const).map((st) => {
                                  const isCur = (sub.status || 'active') === st;
                                  const label = st === 'completed' ? '완료' : st === 'in_progress' ? '진행 중' : '탐구';
                                  return (
                                    <button
                                      key={st}
                                      onClick={() => handleUpdateSubcategoryStatus(sub.id, st)}
                                      className={`px-2 py-0.5 text-[10px] rounded font-semibold transition-colors ${
                                        isCur
                                          ? 'bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/50'
                                          : 'bg-[#0A101D] text-slate-400 border border-[#1E293B] hover:text-slate-200'
                                      }`}
                                    >
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Add Subcategory Form */}
              {isAddingSubcategory && (
                <form
                  onSubmit={handleAddSubcategory}
                  className="bg-[#0A101D] border border-[#38BDF8] rounded-xl p-4 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5">
                      <Plus className="w-4 h-4" />
                      <span>신규 소분류 등록</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingSubcategory(false)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300">소분류 이름 <span className="text-[#38BDF8]">*</span></label>
                      <input
                        type="text"
                        placeholder="예: 소분류 3, 양자 얽힘 심화..."
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        required
                        className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300">소분류 설명 (선택)</label>
                      <input
                        type="text"
                        placeholder="예: 다차원 상태 공간 분석 및 시뮬레이션"
                        value={newSubDesc}
                        onChange={(e) => setNewSubDesc(e.target.value)}
                        className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>초기 진행률: {newSubProgress}%</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newSubProgress}
                        onChange={(e) => setNewSubProgress(Number(e.target.value))}
                        className="w-28 accent-[#38BDF8] h-1.5"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingSubcategory(false)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#0A101D] font-bold text-xs rounded-lg"
                      >
                        등록 완료
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* 4. Active Subcategory Summary and Pedagogical AI Guideline */}
              {activeSubcategory && (
                <div className="bg-[#112338]/60 border border-[#00E599]/30 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00E599] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>선택된 활성 소분류: <strong>{activeSubcategory.name}</strong></span>
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      학습 달성도 {activeSubcategory.progressPercent ?? 50}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    현재 학습자는 <strong className="text-[#00E599]">[{activeSubcategory.name}]</strong> 소분류에서 기준선 역량을 바탕으로 적응형 학습을 진행 중입니다. 소분류 명칭 변경 및 진행도 수정 사항은 디지털 트윈 프로필 및 다차원 평가 그래프에 즉시 반영됩니다.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E293B] bg-[#0A101D]">
              <button
                type="button"
                onClick={handleResetDefaultSubcategories}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#00E599] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>소분류 기본 2개(소분류 1, 2)로 재설정</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTrajectoryModalOpen(false)}
                className="px-5 py-2 bg-[#00E599] hover:bg-[#00E599]/90 text-[#0A101D] font-bold text-xs rounded-lg transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)]"
              >
                설정 완료 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStudent={(newSt) => {
          if (onAddStudent) onAddStudent(newSt);
        }}
      />
    </div>
  );
};
