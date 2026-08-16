import { StudentProfile, EngineStreamAlert, StudentScatterPoint, HeatmapRow, CurriculumNode, MasteryItem, CurriculumTierPlan, CohortCentroid } from '../types';

export const INITIAL_COHORT_CENTROIDS: CohortCentroid[] = [
  {
    id: 'centroid-alpha',
    name: '코호트 중심점 Alpha (기준 코호트)',
    x: 0,
    y: 0,
    z: 0,
    color: '#FFFFFF',
    memberCount: 24,
    avgScore: 78.4,
    description: '코호트 전체 앙상블 기본 기준 중심점 (Origin Centroid)',
  },
  {
    id: 'centroid-star',
    name: '고속 성장 가속군 중심 (Star Cluster)',
    x: 65,
    y: 35,
    z: -30,
    color: '#00E599',
    memberCount: 8,
    avgScore: 89.2,
    description: '양자 및 딥러닝 고난도 도약 궤적 학습자 밀집군',
  },
  {
    id: 'centroid-at-risk',
    name: '인지 마찰 집중 관리군 중심 (Support Cluster)',
    x: -50,
    y: 45,
    z: 40,
    color: '#F59E0B',
    memberCount: 6,
    avgScore: 48.5,
    description: '기초 제어 로직 보강 및 AI 마이크로 스캐폴딩 집중 필요군',
  },
];

export const INITIAL_TRAJECTORY_PARAMS = {
  cognitiveLoad: 78,
  engagement: 42,
  friction: 15,
};

export const INITIAL_MASTERY_DATA: MasteryItem[] = [
  {
    id: 'logic',
    name: '논리적 모달리티',
    target: 90,
    completed: 65,
    inProgress: 25,
  },
  {
    id: 'spatial',
    name: '공간적 추론',
    target: 85,
    completed: 70,
    inProgress: 15,
  },
];

export const ENGINE_STREAM_ALERTS: EngineStreamAlert[] = [
  {
    id: '1',
    type: 'system',
    title: '시스템 알림',
    message: 'Student A trajectory indicates a 14% deviation from baseline. Adjust friction parameters.',
    borderColor: 'border-emerald-400/80',
    timestamp: '14:22:08',
  },
  {
    id: '2',
    type: 'cohort',
    title: '코호트 트렌드',
    message: 'Aggregate cognitive load stabilized across Spatial Modality modules.',
    borderColor: 'border-indigo-400/80',
    timestamp: '14:21:45',
  },
  {
    id: '3',
    type: 'simulation',
    title: '시뮬레이션 상태',
    message: 'Epoch 4432 completed. Model confidence score at 99.2%. Awaiting manual override.',
    borderColor: 'border-amber-400/80',
    timestamp: '14:20:12',
  },
];

export const PRIMARY_STUDENT: StudentProfile = {
  id: 'DT-894-X',
  name: 'Elias V.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  status: 'LIVE SYNC',
  trajectoryName: '심화 양자 역학',
  trajectorySubcategories: [
    {
      id: 'sub-elias-1',
      name: '소분류 1: 양자 상태 벡터 및 큐비트 연산 기초',
      description: '양자 상태 벡터 및 큐비트 연산 기초',
      progressPercent: 78,
      status: 'completed',
      keyTopics: ['블로흐 구면(Bloch Sphere)', '파울리 행렬', '단일 큐비트 게이트'],
    },
    {
      id: 'sub-elias-2',
      name: '소분류 2: 얽힘 게이트 회로 설계 및 노이즈 분석',
      description: '얽힘 게이트 회로 설계 및 노이즈 분석',
      progressPercent: 62,
      status: 'in_progress',
      keyTopics: ['CNOT 및 Toffoli 게이트', '벨 상태 얽힘', '디코히어런스 노이즈'],
    },
  ],
  activeSubcategoryId: 'sub-elias-1',
  initialAchievement: 68, // 1번째 기준: 최초성취도
  cognitiveLoad: 68, // 호환성
  engagementIndex: 82, // 2번째 기준: 참여도 지수
  finalGrowth: 88, // 3번째 기준: 최종 성장도
  futureCompetencyScore: 92, // 4번째 기준: 미래역량
  customCriteria: [
    {
      id: 'crit-elias-1',
      name: '창의적 문제 해결력',
      score: 86,
      weight: 1.0,
      description: '비정형 복합 문제에서의 창의적 탐색 및 휴리스틱 도출 능력',
      isCustom: true,
      folderId: 'folder-1',
    },
    {
      id: 'crit-elias-2',
      name: '시스템 아키텍처 설계',
      score: 79,
      weight: 1.0,
      description: '대규모 분산 노드 간 통신 및 상태 최적화 구현 역량',
      isCustom: true,
      folderId: 'folder-1',
    },
  ],
  evaluationFolders: [
    {
      id: 'folder-1',
      name: '5. 주차별 성장도 폴더',
      criteriaIds: ['crit-basic-1', 'crit-basic-2', 'crit-basic-3', 'crit-basic-4', 'crit-weekly-growth', 'crit-elias-1', 'crit-elias-2'],
      description: '양자 상태 벡터 연산부터 다중 게이트 시뮬레이션까지 주차별 성장을 연계 평가하는 종합 수업 폴더',
      color: '#00E599',
      isWeeklyGrowthFolder: true,
      lessons: [
        {
          id: 'les-1',
          lessonName: '1주차: 양자 상태 벡터 및 큐비트 연산 기초',
          date: '2026-07-04',
          score: 74,
          notes: '기본 중첩 원리 이해도 우수, 기저 변환 계산 완료',
        },
        {
          id: 'les-2',
          lessonName: '2주차: 얽힘 게이트 회로 설계 및 노이즈 분석',
          date: '2026-07-18',
          score: 82,
          notes: '벨 상태 생성 회로 시뮬레이션 완벽 수행',
        },
        {
          id: 'les-3',
          lessonName: '3주차: 양자 위상 추정 및 분산 최적화 프로젝트',
          date: '2026-08-05',
          score: 91,
          notes: '동료 학습자 대비 24% 빠른 수렴 속도 달성, 높은 창의적 접근',
        },
      ],
    },
  ],
  radarScores: {
    achievement: 88, // 성취도 (top)
    growth: 82, // 성장도 (top right)
    resilience: 74, // 회복탄력성 (bottom right)
    adaptability: 69, // 적응력 (bottom left)
    futureCompetency: 92, // 미래 역량 (top left)
  },
  growthTrend: [
    { month: 'Jan', achievement: 32, potential: 18 },
    { month: 'Apr', achievement: 48, potential: 44 },
    { month: 'Jul', achievement: 74, potential: 62 },
    { month: 'Oct', achievement: 78, potential: 50 },
    { month: 'Dec', achievement: 88, potential: 95 },
  ],
  aiPrediction: {
    probability: 94.2,
    insight: 'Neural models indicate high aptitude for complex problem solving. Recommend introducing advanced nonlinear scenarios within the next 48 hours to maintain growth velocity.',
  },
  learningMoments: [
    {
      id: 'm1',
      title: '비선형 개념 종합',
      timeAgo: 'T-Minus 12h',
      description: 'Successfully merged concepts from Module A (Fluid Dynamics) and Module D (Thermodynamics) to solve a simulated zero-G failure scenario.',
      tags: ['Cognitive Leap +14%', 'Simulation Alpha'],
      type: 'synthesis',
    },
    {
      id: 'm2',
      title: '알고리즘 마찰 지점',
      timeAgo: 'T-Minus 48h',
      description: 'Encountered high cognitive load reading during recursive function mapping. AI intervened with micro-scaffolding hint #4.',
      tags: ['개입 활성화됨'],
      type: 'friction',
    },
  ],
};

export const OTHER_STUDENTS: StudentProfile[] = [
  {
    id: 'DT-442-A',
    name: 'Sarah Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    status: 'LIVE SYNC',
    trajectoryName: '자율 에이전트 아키텍처',
    trajectorySubcategories: [
      {
        id: 'sub-sarah-1',
        name: '소분류 1: 자율 에이전트 인지 루프 및 계획 수립',
        description: '자율 에이전트 인지 루프 및 계획 수립',
        progressPercent: 85,
        status: 'completed',
        keyTopics: ['ReAct 프레임워크', '메모리 버퍼링', '목표 분해'],
      },
      {
        id: 'sub-sarah-2',
        name: '소분류 2: 멀티에이전트 통신 및 컨센서스 프로토콜',
        description: '멀티에이전트 통신 및 컨센서스 프로토콜',
        progressPercent: 72,
        status: 'in_progress',
        keyTopics: ['A2A 메시지 버스', '협상 전략', '분산 태스크 큐'],
      },
    ],
    activeSubcategoryId: 'sub-sarah-1',
    initialAchievement: 55,
    cognitiveLoad: 55,
    engagementIndex: 91,
    finalGrowth: 95,
    futureCompetencyScore: 96,
    customCriteria: [
      {
        id: 'crit-sarah-1',
        name: '멀티에이전트 협업 조율력',
        score: 93,
        weight: 1.0,
        description: '복수 AI 에이전트 간 역할 분담 및 통신 프로토콜 설계 능력',
        isCustom: true,
        folderId: 'folder-sarah-1',
      },
    ],
    evaluationFolders: [
      {
        id: 'folder-sarah-1',
        name: '5. 주차별 성장도 폴더',
        criteriaIds: ['crit-basic-1', 'crit-basic-2', 'crit-basic-3', 'crit-basic-4', 'crit-weekly-growth', 'crit-sarah-1'],
        description: '자율 에이전트 아키텍처 주차별 성장도 기록 및 통합 폴더 (초록색 테마)',
        color: '#00E599',
        isWeeklyGrowthFolder: true,
        lessons: [
          {
            id: 'les-sarah-1',
            lessonName: '1주차: 자율 에이전트 인지 루프 및 계획 수립',
            date: '2026-07-04',
            score: 84,
            notes: 'ReAct 프레임워크 기반 에이전트 계획 수립 완료',
          },
          {
            id: 'les-sarah-2',
            lessonName: '2주차: 멀티에이전트 통신 및 컨센서스 프로토콜',
            date: '2026-07-18',
            score: 91,
            notes: 'A2A 통신 버스 및 다중 에이전트 협상 프로토콜 구현',
          },
          {
            id: 'les-sarah-3',
            lessonName: '3주차: 분산 에이전트 컨센서스 및 최적화',
            date: '2026-08-05',
            score: 96,
            notes: '분산 태스크 큐 및 장애 복구 메커니즘 고도화',
          },
        ],
      },
    ],
    radarScores: {
      achievement: 94,
      growth: 90,
      resilience: 85,
      adaptability: 88,
      futureCompetency: 96,
    },
    growthTrend: [
      { month: 'Jan', achievement: 40, potential: 30 },
      { month: 'Apr', achievement: 58, potential: 60 },
      { month: 'Jul', achievement: 82, potential: 75 },
      { month: 'Oct', achievement: 89, potential: 80 },
      { month: 'Dec', achievement: 95, potential: 98 },
    ],
    aiPrediction: {
      probability: 97.8,
      insight: 'Exhibits hyper-convergent algorithmic synthesis. Ideal for leading cross-cohort computational synthesis labs.',
    },
    learningMoments: [
      {
        id: 'm3',
        title: '신경망 압축 파이프라인 최적화',
        timeAgo: 'T-Minus 6h',
        description: 'Successfully simplified latent vector quantization in high-dimensional state space.',
        tags: ['Velocity +22%', 'Topology Master'],
        type: 'synthesis',
      },
    ],
  },
  {
    id: 'DT-110-K',
    name: 'Marcus Brody',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    status: 'ANALYZING',
    trajectoryName: '이산 수학 및 그래프 이론',
    trajectorySubcategories: [
      {
        id: 'sub-marcus-1',
        name: '소분류 1: 그래프 표현 및 기본 탐색 알고리즘',
        description: '그래프 표현 및 기본 탐색 알고리즘',
        progressPercent: 70,
        status: 'in_progress',
        keyTopics: ['인접 행렬 및 리스트', 'BFS/DFS 순회', '위상 정렬'],
      },
      {
        id: 'sub-marcus-2',
        name: '소분류 2: 최소 신장 트리 및 최단 경로 최적화',
        description: '최소 신장 트리 및 최단 경로 최적화',
        progressPercent: 45,
        status: 'active',
        keyTopics: ['크루스칼 알고리즘', '다익스트라 기법', '벨만-포드'],
      },
    ],
    activeSubcategoryId: 'sub-marcus-1',
    initialAchievement: 84,
    cognitiveLoad: 84,
    engagementIndex: 65,
    finalGrowth: 78,
    futureCompetencyScore: 80,
    customCriteria: [],
    evaluationFolders: [
      {
        id: 'folder-marcus-1',
        name: '5. 주차별 성장도 폴더',
        criteriaIds: ['crit-basic-1', 'crit-basic-2', 'crit-basic-3', 'crit-basic-4', 'crit-weekly-growth'],
        description: '이산 수학 및 그래프 이론 주차별 성장도 기록 및 통합 폴더 (초록색 테마)',
        color: '#00E599',
        isWeeklyGrowthFolder: true,
        lessons: [
          {
            id: 'les-marcus-1',
            lessonName: '1주차: 그래프 표현 및 기본 탐색 알고리즘',
            date: '2026-07-04',
            score: 72,
            notes: '인접 행렬 및 BFS/DFS 순회 구현, 위상 정렬 기초',
          },
          {
            id: 'les-marcus-2',
            lessonName: '2주차: 최소 신장 트리 및 최단 경로 최적화',
            date: '2026-07-18',
            score: 79,
            notes: '크루스칼 및 다익스트라 최단 경로 알고리즘 최적화',
          },
          {
            id: 'les-marcus-3',
            lessonName: '3주차: 동적 네트워크 흐름 및 최적화',
            date: '2026-08-05',
            score: 84,
            notes: '최대 유량 최소 컷 정리 및 비선형 네트워크 모델링',
          },
        ],
      },
    ],
    radarScores: {
      achievement: 72,
      growth: 78,
      resilience: 62,
      adaptability: 70,
      futureCompetency: 80,
    },
    growthTrend: [
      { month: 'Jan', achievement: 25, potential: 35 },
      { month: 'Apr', achievement: 42, potential: 50 },
      { month: 'Jul', achievement: 60, potential: 58 },
      { month: 'Oct', achievement: 70, potential: 68 },
      { month: 'Dec', achievement: 76, potential: 82 },
    ],
    aiPrediction: {
      probability: 88.5,
      insight: 'Recommended reinforcement on recursive graph traversals to reduce cognitive friction.',
    },
    learningMoments: [
      {
        id: 'm4',
        title: '위상 정렬 충돌 완화',
        timeAgo: 'T-Minus 18h',
        description: 'Encountered cyclic dependency trap in DAG simulation. Scaffold hint provided.',
        tags: ['스캐폴딩 지원'],
        type: 'friction',
      },
    ],
  },
];

export const SCATTER_STUDENTS_COHORT_A: StudentScatterPoint[] = [
  { id: 'ID-8924', name: 'Elias V.', baselineAchievement: 68, growthVelocity: 38, type: 'star', color: '#00E599', zScore: '+2.4σ' },
  { id: 'ID-1104', name: 'Sarah C.', baselineAchievement: 58, growthVelocity: 28, type: 'star', color: '#00E599', zScore: '+1.9σ' },
  { id: 'ID-4492', name: 'Marcus B.', baselineAchievement: 60, growthVelocity: -26, type: 'atRisk', color: '#F59E0B', zScore: '+1.2σ' },
  { id: 'ID-7731', name: 'Elena R.', baselineAchievement: 56, growthVelocity: -38, type: 'atRisk', color: '#F59E0B', zScore: '+0.8σ' },
  { id: 'ID-3291', name: 'Kenji T.', baselineAchievement: 42, growthVelocity: 8, type: 'expected', color: '#94A3B8', zScore: '+0.4σ' },
  { id: 'ID-5510', name: 'Olivia P.', baselineAchievement: 45, growthVelocity: -5, type: 'expected', color: '#94A3B8', zScore: '+0.1σ' },
  { id: 'ID-9921', name: 'Liam N.', baselineAchievement: 34, growthVelocity: 14, type: 'expected', color: '#94A3B8', zScore: '+0.6σ' },
  { id: 'ID-6318', name: 'Aiden K.', baselineAchievement: 24, growthVelocity: -29, type: 'atRisk', color: '#F87171', zScore: '-0.7σ' },
  { id: 'ID-2189', name: 'Maya S.', baselineAchievement: 21, growthVelocity: -43, type: 'atRisk', color: '#F87171', zScore: '-1.2σ' },
];

export const HIGH_GROWTH_STUDENTS = [
  { id: 'ID-8924', score: '+2.4σ', percent: 92, color: 'emerald' },
  { id: 'ID-1104', score: '+1.9σ', percent: 80, color: 'emerald' },
  { id: 'ID-4492', score: '+1.2σ', percent: 64, color: 'amber' },
  { id: 'ID-7731', score: '+0.8σ', percent: 48, color: 'amber' },
];

export const HEATMAP_DATA: HeatmapRow[] = [
  {
    groupName: 'Group Alpha',
    modules: {
      logicOps: 'mastery', // bright emerald
      dataStr: 'high', // medium emerald
      algorithms: 'gap', // coral/pink
      systems: 'neutral', // dark slate
      ethics: 'mastery', // bright emerald
    },
  },
  {
    groupName: 'Group Beta',
    modules: {
      logicOps: 'neutral', // dark slate
      dataStr: 'gap', // coral/pink
      algorithms: 'neutral', // dark slate
      systems: 'high', // medium emerald
      ethics: 'high', // medium emerald
    },
  },
  {
    groupName: 'Group Gamma',
    modules: {
      logicOps: 'mastery', // bright emerald
      dataStr: 'mastery', // bright emerald
      algorithms: 'mastery', // bright emerald
      systems: 'neutral', // dark slate
      ethics: 'gap', // coral/pink
    },
  },
];

export const CURRICULUM_NODES: CurriculumNode[] = [
  {
    id: 'node-1',
    level: 'Lvl 1',
    status: 'completed',
    title: '알고리즘 논리 기초',
    description: '조건부 구조화 및 기본 데이터 조작의 핵심 원리.',
    growthImpact: '+12.4%',
    progressPercent: 100,
    estimatedHours: '4시간',
    tags: ['조건문', '제어 흐름', '자료구조 기초'],
  },
  {
    id: 'node-2',
    level: 'Lvl 2 (Hard)',
    status: 'active',
    title: '다층 퍼셉트론 설계',
    description: '은닉층, 활성화 함수 및 순전파 역학 소개.',
    growthImpact: '+18.0%',
    progressPercent: 68,
    isHard: true,
    estimatedHours: '6시간',
    tags: ['신경망', '활성화 함수', '순전파'],
  },
  {
    id: 'node-3',
    level: 'Lvl 3',
    status: 'locked',
    title: '역전파 최적화',
    description: '경사 하강법 변형 및 손실 함수 최소화 기법을 통한 가중치 갱신 메커니즘.',
    growthImpact: '+22.5%',
    progressPercent: 0,
    estimatedHours: '8시간',
    tags: ['경사하강법', '손실 함수', '옵티마이저'],
  },
  {
    id: 'node-4',
    level: 'Lvl 4 (Advanced)',
    status: 'locked',
    title: '양자 그래프 신경망 (QGNN)',
    description: '비유클리드 매니폴드 위상 수학 및 양자 중첩 표현 공간의 고차원 인공신경망 훈련.',
    growthImpact: '+31.2%',
    progressPercent: 0,
    estimatedHours: '12시간',
    tags: ['양자역학', '그래프 신경망', '위상 수학'],
  },
];

export const CURRICULUM_TIER_PLANS: CurriculumTierPlan[] = [
  {
    id: 'tier1_foundational',
    tierNumber: 1,
    title: '1단계: 기초 보강 & 인지 마찰 완화 트랙',
    tierName: '기초 보강 트랙 (Foundational Recovery)',
    scoreRange: '0 ~ 50점',
    scoreMin: 0,
    scoreMax: 50,
    growthVelocityMin: -50,
    growthVelocityMax: 0,
    growthVelocityLabel: '정체 및 마찰 위험군 (Δ < 0, Z < 0σ)',
    targetAudience: '기초 개념 결손이 있거나 학습 중 인지 과부하가 빈번한 학생',
    strategySummary: '시각적 스캐폴딩과 대화형 피드백을 통해 인지 부하를 35% 줄이고 기본 제어 로직을 체득합니다.',
    accelerationPrediction: '+15.2% 습득 가속화',
    estimatedWeeks: '3 ~ 4주 완성',
    accentColor: '#38BDF8', // Sky Blue
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    keyCompetencies: ['조건부 제어 로직', '기본 배열 및 맵핑', '에러 디버깅 스캐폴딩', '인지 부하 완화'],
    aiScaffoldingMethod: '단계별 힌트 생성 및 시각적 자료구조 샌드박스 제공',
    nodes: [
      {
        id: 'tier1-node-1',
        level: 'Lvl 1',
        status: 'completed',
        title: '논리 제어문 및 흐름도 시각화',
        description: '조건부 분기, 반복 루프의 직관적 시각 모델링 및 기초 상태 변화 추적.',
        growthImpact: '+9.5%',
        progressPercent: 100,
        estimatedHours: '3시간',
        tags: ['시각화', '제어문', '상태 추적'],
      },
      {
        id: 'tier1-node-2',
        level: 'Lvl 1',
        status: 'active',
        title: '직관적 데이터 컨테이너와 배열 조작',
        description: '1차원 및 2차원 리스트의 원소 접근, 순회 탐색, 데이터 필터링 기초.',
        growthImpact: '+13.8%',
        progressPercent: 75,
        estimatedHours: '4시간',
        tags: ['배열', '필터링', '인덱싱'],
      },
      {
        id: 'tier1-node-3',
        level: 'Lvl 1 (Scaffold)',
        status: 'locked',
        title: '오류 패턴 인식 및 실시간 디버깅 랩',
        description: '구문 오류 및 논리적 오류를 식별하고 AI 도우미와 함께 단계별 수정하는 실습.',
        growthImpact: '+16.2%',
        progressPercent: 0,
        estimatedHours: '4시간',
        tags: ['디버깅', '오류 분석', 'AI 피드백'],
      },
      {
        id: 'tier1-node-4',
        level: 'Lvl 2',
        status: 'locked',
        title: '기초 함수 모듈화 및 입력/출력 맵핑',
        description: '작은 단위의 재사용 가능한 함수 설계와 매개변수/반환값의 수학적 대응 관계.',
        growthImpact: '+19.0%',
        progressPercent: 0,
        estimatedHours: '5시간',
        tags: ['함수화', '매개변수', '모듈화'],
      },
    ],
  },
  {
    id: 'tier2_standard',
    tierNumber: 2,
    title: '2단계: 표준 성장 & 개념 확장 트랙',
    tierName: '표준 성장 트랙 (Standard Progression)',
    scoreRange: '50 ~ 75점',
    scoreMin: 50,
    scoreMax: 75,
    growthVelocityMin: 0,
    growthVelocityMax: 20,
    growthVelocityLabel: '안정적 선형 성장군 (0 ≤ Δ < +20, Z: 0 ~ +1.0σ)',
    targetAudience: '기초 문법을 숙지하고 본격적인 알고리즘 및 머신러닝 기초를 학습하는 학생',
    strategySummary: '개념 이해와 응용 실습의 균형을 맞추어 인공신경망 기본 모델과 데이터 파이프라인을 구축합니다.',
    accelerationPrediction: '+24.0% 습득 가속화',
    estimatedWeeks: '4 ~ 6주 완성',
    accentColor: '#00E599', // Bright Emerald
    badgeColor: 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/30',
    keyCompetencies: ['시간/공간 복잡도 분석', '다층 퍼셉트론(MLP)', '활성화 함수 최적화', '선형 대수 결합'],
    aiScaffoldingMethod: '동적 코드 벤치마크 테스트 및 자동 채점 인터랙션',
    nodes: [
      {
        id: 'tier2-node-1',
        level: 'Lvl 1',
        status: 'completed',
        title: '알고리즘 논리 기초 및 복잡도 분석',
        description: '조건부 구조화, Big-O 표기법을 통한 효율적인 연산 설계.',
        growthImpact: '+12.4%',
        progressPercent: 100,
        estimatedHours: '4시간',
        tags: ['Big-O', '알고리즘', '효율성'],
      },
      {
        id: 'tier2-node-2',
        level: 'Lvl 2 (Hard)',
        status: 'active',
        title: '다층 퍼셉트론 (MLP) 설계',
        description: '은닉층 구성, 가중치 행렬 곱셈, 활성화 함수(ReLU) 및 순전파 역학 구현.',
        growthImpact: '+18.0%',
        progressPercent: 68,
        isHard: true,
        estimatedHours: '6시간',
        tags: ['퍼셉트론', '은닉층', '순전파'],
      },
      {
        id: 'tier2-node-3',
        level: 'Lvl 2',
        status: 'locked',
        title: '데이터 정규화 및 특징 전처리 파이프라인',
        description: 'Min-Max 스케일링, 원-핫 인코딩 및 결측치 보정 알고리즘 실습.',
        growthImpact: '+19.5%',
        progressPercent: 0,
        estimatedHours: '5시간',
        tags: ['전처리', '정규화', '데이터셋'],
      },
      {
        id: 'tier2-node-4',
        level: 'Lvl 3',
        status: 'locked',
        title: '기초 합성곱 (CNN) 및 특징 맵 추출',
        description: '2D 커널 필터링, 풀링 계층, 이미지 공간 특징 추출 메커니즘.',
        growthImpact: '+23.0%',
        progressPercent: 0,
        estimatedHours: '7시간',
        tags: ['합성곱', '특징 맵', 'CNN'],
      },
    ],
  },
  {
    id: 'tier3_advanced',
    tierNumber: 3,
    title: '3단계: 심화 도약 & 최적화 가속 트랙',
    tierName: '심화 도약 트랙 (Advanced Acceleration)',
    scoreRange: '75 ~ 90점',
    scoreMin: 75,
    scoreMax: 90,
    growthVelocityMin: 20,
    growthVelocityMax: 40,
    growthVelocityLabel: '고속 가속 성장군 (+20 ≤ Δ < +40, Z: +1.0 ~ +2.0σ)',
    targetAudience: '높은 점수대와 가파른 성장세를 보이며 심층 신경망 최적화 및 챌린지 프로젝트를 희망하는 학생',
    strategySummary: '역전파 자동 미분, 과적합 제어, 트랜스포머 아키텍처 등 고난도 최적화 문제를 해결합니다.',
    accelerationPrediction: '+32.8% 습득 가속화',
    estimatedWeeks: '6 ~ 8주 완성',
    accentColor: '#A855F7', // Purple / Violet
    badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    keyCompetencies: ['역전파 자동 미분', 'Adam/SGD 옵티마이저', 'Dropout/LayerNorm', '어텐션 메커니즘'],
    aiScaffoldingMethod: '자율 도전 과제 제안 및 고난도 알고리즘 프로파일링',
    nodes: [
      {
        id: 'tier3-node-1',
        level: 'Lvl 2',
        status: 'completed',
        title: '다변량 연쇄 법칙과 자동 미분 메커니즘',
        description: '계산 그래프(Computational Graph)를 활용한 기울기 역방향 전파 수식 증명 및 구현.',
        growthImpact: '+16.8%',
        progressPercent: 100,
        estimatedHours: '5시간',
        tags: ['연쇄 법칙', '자동 미분', '계산 그래프'],
      },
      {
        id: 'tier3-node-2',
        level: 'Lvl 3 (Hard)',
        status: 'active',
        title: '역전파 최적화 & 적응형 학습률 (Adam)',
        description: '모멘텀(Momentum), RMSprop, Adam 옵티마이저를 활용한 손실 함수 수렴 속도 극대화.',
        growthImpact: '+22.5%',
        progressPercent: 52,
        isHard: true,
        estimatedHours: '8시간',
        tags: ['역전파', 'Adam', '손실 함수'],
      },
      {
        id: 'tier3-node-3',
        level: 'Lvl 3',
        status: 'locked',
        title: '정규화(Regularization) & 과적합 억제',
        description: 'L1/L2 가중치 감쇠, Dropout, 배치 정규화(Batch Normalization) 심화 분석.',
        growthImpact: '+25.0%',
        progressPercent: 0,
        estimatedHours: '6시간',
        tags: ['정규화', 'Dropout', 'Batch Norm'],
      },
      {
        id: 'tier3-node-4',
        level: 'Lvl 4',
        status: 'locked',
        title: '어텐션 메커니즘 & 트랜스포머 인코더',
        description: 'Scaled Dot-Product Attention, Multi-Head Attention 수식 구현 및 포지셔널 인코딩.',
        growthImpact: '+30.0%',
        progressPercent: 0,
        estimatedHours: '9시간',
        tags: ['Attention', 'Transformer', 'Self-Attention'],
      },
    ],
  },
  {
    id: 'tier4_mastery',
    tierNumber: 4,
    title: '4단계: 최상위 프론티어 & 양자 융합 트랙',
    tierName: '최상위 프론티어 트랙 (Mastery Frontier)',
    scoreRange: '90 ~ 100점',
    scoreMin: 90,
    scoreMax: 100,
    growthVelocityMin: 40,
    growthVelocityMax: 50,
    growthVelocityLabel: '초고속 도약 궤적 (Δ ≥ +40, Z-Score ≥ +2.0σ)',
    targetAudience: '최상위권 역량을 보유하고 프론티어 연구, 양자 컴퓨팅, 자율 에이전트 개발을 선도하는 학생',
    strategySummary: '비유클리드 기하학, 양자 중첩 표현, 다중 에이전트 오케스트레이션 등 차세대 AI 기술을 연구합니다.',
    accelerationPrediction: '+45.0% 연구 속도 가속화',
    estimatedWeeks: '8 ~ 12주 완성',
    accentColor: '#F59E0B', // Amber / Gold
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    keyCompetencies: ['비유클리드 기하 딥러닝', '양자 신경망(QGNN)', '다중 에이전트 합의', '생성형 확산 모델'],
    aiScaffoldingMethod: '연구 샌드박스 제공, 오픈소스 프레임워크 벤치마크 연동',
    nodes: [
      {
        id: 'tier4-node-1',
        level: 'Lvl 3',
        status: 'completed',
        title: '비유클리드 공간의 기하학적 딥러닝',
        description: '그래프 스펙트럼 이론, 리만 다양체(Riemannian Manifolds) 상의 합성곱 연산.',
        growthImpact: '+22.0%',
        progressPercent: 100,
        estimatedHours: '6시간',
        tags: ['비유클리드', '리만 다양체', '스펙트럼'],
      },
      {
        id: 'tier4-node-2',
        level: 'Lvl 4 (Advanced)',
        status: 'active',
        title: '양자 그래프 신경망 (QGNN) 토폴로지',
        description: '양자 중첩 큐비트 표현 공간을 활용한 고차원 그래프 노드 임베딩 및 얽힘 회로 훈련.',
        growthImpact: '+31.2%',
        progressPercent: 35,
        isHard: true,
        estimatedHours: '10시간',
        tags: ['QGNN', '양자 회로', '큐비트 임베딩'],
      },
      {
        id: 'tier4-node-3',
        level: 'Lvl 4 (Research)',
        status: 'locked',
        title: '자율 다중 에이전트 합의 및 협업 프로토콜',
        description: '분산 환경에서의 에이전트 간 메모리 공유, 도구 사용 의사결정 및 게임 이론적 최적화.',
        growthImpact: '+36.0%',
        progressPercent: 0,
        estimatedHours: '8시간',
        tags: ['다중 에이전트', '게임 이론', '자율 협업'],
      },
      {
        id: 'tier4-node-4',
        level: 'Lvl 5 (Frontier)',
        status: 'locked',
        title: '연속 공간 확산 및 에너지 기반 생성 모델',
        description: '확률 미분 방정식(SDE) 기반의 스코어 매칭 및 고차원 연속 공간 생성 네트워크 설계.',
        growthImpact: '+42.5%',
        progressPercent: 0,
        estimatedHours: '12시간',
        tags: ['SDE', '확산 모델', '에너지 기반 모델'],
      },
    ],
  },
];

