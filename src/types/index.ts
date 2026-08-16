export type TabType = 'simulation' | 'learner' | 'cohort' | 'curriculum' | 'archive';

export interface TrajectoryParameters {
  cognitiveLoad: number; // e.g. 78%
  engagement: number; // e.g. 42%
  friction: number; // e.g. 15%
}

export interface MasteryItem {
  id: string;
  name: string;
  target: number;
  completed: number;
  inProgress: number;
}

export interface EngineStreamAlert {
  id: string;
  type: 'system' | 'cohort' | 'simulation';
  title: string;
  message: string;
  borderColor: string;
  tag?: string;
  timestamp?: string;
}

export interface LessonGrowthRecord {
  id: string;
  lessonName: string; // 수업명 (예: "1주차: 선형대수 및 벡터공간", "2주차: 텐서 연산 심화")
  date: string; // 수업 일자 (예: "2026-08-10")
  score: number; // 해당 수업 성장도/성취도 (0~100)
  notes?: string; // 수업 피드백 및 특이사항
}

export interface TrajectorySubcategory {
  id: string;
  name: string; // 소분류 이름 (기본값: "소분류 1", "소분류 2" 등)
  description?: string;
  progressPercent?: number; // 진행률 (0~100)
  status?: 'completed' | 'in_progress' | 'active';
  keyTopics?: string[]; // 핵심 학습 토픽
}

export interface EvaluationCriterion {
  id: string;
  name: string; // 평가 기준 이름 (예: "최초성취도", "참여도 지수", "최종 성장도", "미래역량", "주차별 성장도", "창의적 문제 해결력" 등)
  score: number; // 평가 점수 (0~100)
  weight?: number; // 가중치
  ratioPercent?: number; // 평가 산정 비율 (%) - 전체 합산 100%
  description?: string;
  isCustom?: boolean; // 5번째 이상 커스텀 추가 기준 여부
  isWeeklyGrowth?: boolean; // 5번째 주차별 성장도 여부
  isActive?: boolean; // 파란색 테두리 활성화/비활성화 토글 상태
  folderId?: string | null; // 속한 폴더 ID
  details?: string; // 세부 관찰 내용
  keyStrengths?: string[]; // 강점 분석
  actionGuidance?: string; // 추천 가이드
}

export interface EvaluationFolder {
  id: string;
  name: string; // 폴더명 (예: "수학·컴퓨팅 융합 수업군", "주차별 성장도 폴더")
  criteriaIds: string[]; // 합쳐진 평가 기준 ID들
  description?: string;
  lessons: LessonGrowthRecord[]; // 수업별 지속 성장 기록
  color?: string;
  isWeeklyGrowthFolder?: boolean; // 5번째 주차별 성장도 전용 폴더 여부
}

export interface StudentProfile {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'LIVE SYNC' | 'OFFLINE' | 'ANALYZING';
  trajectoryName: string;
  // 학습 궤적 소분류 (기본 2개: 소분류 1, 2)
  trajectorySubcategories?: TrajectorySubcategory[];
  activeSubcategoryId?: string | null;

  // 4대 기본 평가 기준
  initialAchievement: number; // 1번째 기준: 최초성취도 (기존 인지부하 대체/연동)
  cognitiveLoad: number; // 하위 호환용 (initialAchievement와 동일)
  engagementIndex: number; // 2번째 기준: 참여도 지수
  finalGrowth: number; // 3번째 기준: 최종 성장도
  futureCompetencyScore: number; // 4번째 기준: 미래역량
  
  // 5번째 이후 동적 추가 평가 기준 및 폴더
  customCriteria: EvaluationCriterion[];
  evaluationFolders: EvaluationFolder[];

  radarScores: {
    achievement: number; // 성취도
    growth: number; // 성장도
    resilience: number; // 회복탄력성
    adaptability: number; // 적응력
    futureCompetency: number; // 미래 역량
  };
  growthTrend: {
    month: string;
    achievement: number;
    potential: number;
  }[];
  aiPrediction: {
    probability: number;
    insight: string;
  };
  learningMoments: {
    id: string;
    title: string;
    timeAgo: string;
    description: string;
    tags: string[];
    type: 'synthesis' | 'friction' | 'milestone';
  }[];
}

export interface CohortCentroid {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  memberCount?: number;
  avgScore?: number;
  description?: string;
}

export interface StudentScatterPoint {
  id: string;
  name: string;
  baselineAchievement: number; // Y-axis: 0 to 100
  growthVelocity: number; // X-axis: -50 to +50 (growth velocity delta)
  type: 'expected' | 'atRisk' | 'star';
  color: string;
  zScore: string;
}

export interface HeatmapRow {
  groupName: string;
  modules: {
    logicOps: 'mastery' | 'high' | 'gap' | 'neutral' | 'inProgress';
    dataStr: 'mastery' | 'high' | 'gap' | 'neutral' | 'inProgress';
    algorithms: 'mastery' | 'high' | 'gap' | 'neutral' | 'inProgress';
    systems: 'mastery' | 'high' | 'gap' | 'neutral' | 'inProgress';
    ethics: 'mastery' | 'high' | 'gap' | 'neutral' | 'inProgress';
  };
}

export interface CurriculumNode {
  id: string;
  level: string;
  status: 'completed' | 'active' | 'locked';
  title: string;
  description: string;
  growthImpact: string;
  progressPercent: number;
  isHard?: boolean;
  estimatedHours?: string;
  tags?: string[];
}

export type CurriculumTierLevel = 'tier1_foundational' | 'tier2_standard' | 'tier3_advanced' | 'tier4_mastery';

export interface CurriculumTierPlan {
  id: CurriculumTierLevel;
  tierNumber: 1 | 2 | 3 | 4;
  title: string;
  tierName: string;
  scoreRange: string;
  scoreMin: number;
  scoreMax: number;
  growthVelocityMin: number;
  growthVelocityMax: number;
  growthVelocityLabel: string;
  targetAudience: string;
  strategySummary: string;
  accelerationPrediction: string;
  estimatedWeeks: string;
  accentColor: string;
  badgeColor: string;
  nodes: CurriculumNode[];
  keyCompetencies: string[];
  aiScaffoldingMethod: string;
}

