import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { X, UserPlus, Sparkles, Check, RefreshCw } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: StudentProfile) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80',
];

const PRESET_TRAJECTORIES = [
  '심화 양자 역학 및 텐서 연산',
  '자율 에이전트 아키텍처',
  '이산 수학 및 그래프 이론',
  '고성능 분산 시스템 설계',
  '신경망 압축 및 최적화',
  '기초 알고리즘 및 데이터 구조',
];

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
}) => {
  const [name, setName] = useState('');
  const [trajectoryName, setTrajectoryName] = useState(PRESET_TRAJECTORIES[0]);
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0]);
  // 4대 기본 평가 기준
  const [initialAchievement, setInitialAchievement] = useState(72); // 1. 최초성취도
  const [engagementIndex, setEngagementIndex] = useState(80); // 2. 참여도 지수
  const [finalGrowth, setFinalGrowth] = useState(78); // 3. 최종 성장도
  const [futureCompetency, setFutureCompetency] = useState(85); // 4. 미래역량

  // 보조 레이더 지표
  const [resilience, setResilience] = useState(70);
  const [adaptability, setAdaptability] = useState(74);

  if (!isOpen) return null;

  const handleRandomize = () => {
    setInitialAchievement(Math.floor(Math.random() * 45) + 50);
    setEngagementIndex(Math.floor(Math.random() * 40) + 60);
    setFinalGrowth(Math.floor(Math.random() * 40) + 55);
    setFutureCompetency(Math.floor(Math.random() * 35) + 65);
    setResilience(Math.floor(Math.random() * 40) + 60);
    setAdaptability(Math.floor(Math.random() * 35) + 65);
    const randAvatar = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
    setAvatarUrl(randAvatar);
    const randTrajectory = PRESET_TRAJECTORIES[Math.floor(Math.random() * PRESET_TRAJECTORIES.length)];
    setTrajectoryName(randTrajectory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const studentId = `DT-${Math.floor(Math.random() * 899 + 100)}-${String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )}`;

    const newStudent: StudentProfile = {
      id: studentId,
      name: name.trim(),
      avatarUrl: avatarUrl || PRESET_AVATARS[0],
      status: 'LIVE SYNC',
      trajectoryName,
      trajectorySubcategories: [
        {
          id: `sub-${Date.now()}-1`,
          name: `소분류 1: ${trajectoryName} 기초 역량 및 연산 모듈`,
          description: `${trajectoryName} 기초 역량 및 연산 모듈`,
          progressPercent: Math.max(30, initialAchievement),
          status: 'in_progress',
          keyTopics: ['기본 개념 이해', '핵심 원리 분석', '기저 변환 및 연산'],
        },
        {
          id: `sub-${Date.now()}-2`,
          name: `소분류 2: ${trajectoryName} 심화 설계 및 응용 모듈`,
          description: `${trajectoryName} 심화 설계 및 응용 모듈`,
          progressPercent: Math.max(10, Math.round(initialAchievement * 0.6)),
          status: 'active',
          keyTopics: ['문제 해결 실습', '응용 프로젝트', '상태 최적화'],
        },
      ],
      activeSubcategoryId: `sub-${Date.now()}-1`,
      initialAchievement,
      cognitiveLoad: initialAchievement,
      engagementIndex,
      finalGrowth,
      futureCompetencyScore: futureCompetency,
      customCriteria: [],
      evaluationFolders: [
        {
          id: `folder-new-${Date.now()}`,
          name: '5. 주차별 성장도 폴더',
          criteriaIds: ['crit-basic-1', 'crit-basic-2', 'crit-basic-3', 'crit-basic-4', 'crit-weekly-growth'],
          description: `${trajectoryName} 주차별 성장도 기록 및 통합 폴더 (초록색 테마)`,
          color: '#00E599',
          isWeeklyGrowthFolder: true,
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              lessonName: `1주차: ${trajectoryName} 기초 역량 및 연산 모듈`,
              date: '2026-07-04',
              score: Math.max(50, initialAchievement),
              notes: '1단계 기본 원리 분석 및 기초 연산 과제 완료',
            },
            {
              id: `les-${Date.now()}-2`,
              lessonName: `2주차: ${trajectoryName} 심화 설계 및 응용 모듈`,
              date: '2026-07-18',
              score: Math.max(55, Math.round((initialAchievement + finalGrowth) / 2)),
              notes: '2단계 심화 모델링 및 실습 프로젝트 수행',
            },
            {
              id: `les-${Date.now()}-3`,
              lessonName: `3주차: ${trajectoryName} 융합 프로젝트 및 종합 응용`,
              date: '2026-08-05',
              score: Math.max(60, finalGrowth),
              notes: '종합 응용 과제 완료 및 고난도 문제 자율 해결',
            },
          ],
        },
      ],
      radarScores: {
        achievement: initialAchievement,
        growth: finalGrowth,
        resilience,
        adaptability,
        futureCompetency,
      },
      growthTrend: [
        { month: 'Jan', achievement: Math.max(10, initialAchievement - 40), potential: Math.max(10, finalGrowth - 35) },
        { month: 'Apr', achievement: Math.max(20, initialAchievement - 25), potential: Math.max(20, finalGrowth - 20) },
        { month: 'Jul', achievement: Math.max(35, initialAchievement - 15), potential: Math.max(35, finalGrowth - 10) },
        { month: 'Oct', achievement: Math.max(50, initialAchievement - 5), potential: Math.max(45, finalGrowth - 5) },
        { month: 'Dec', achievement: initialAchievement, potential: Math.min(100, finalGrowth + 10) },
      ],
      aiPrediction: {
        probability: +(Math.min(99.5, Math.max(70, initialAchievement * 0.4 + finalGrowth * 0.3 + futureCompetency * 0.3))).toFixed(1),
        insight: `${name.trim()} 학습자는 [${trajectoryName}] 궤적에서 기준선 대비 높은 성장 잠재력을 보이며, 지속적인 수업별 스캐폴딩을 통해 가속 성장이 기대됩니다.`,
      },
      learningMoments: [
        {
          id: `moment-${Date.now()}`,
          title: '초기 프로필 모델 생성 및 4대 기준선 측정 완료',
          timeAgo: '방금 전',
          description: `최초성취도(${initialAchievement}점), 참여도(${engagementIndex}%), 최종성장도(${finalGrowth}점), 미래역량(${futureCompetency}점) 기준선이 설정되었습니다.`,
          tags: ['초기 진단 완료', '실시간 동기화'],
          type: 'milestone',
        },
      ],
    };

    onAddStudent(newStudent);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0A101D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00E599]/15 border border-[#00E599]/30 flex items-center justify-center text-[#00E599]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">신규 학생 추가</h2>
              <p className="text-xs text-slate-400">학습자 디지털 트윈 프로필 및 인지 파라미터 등록</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Avatar Selection & Basic Info */}
          <div className="space-y-3">
            <label className="text-slate-300 font-semibold block">아바타 선택</label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    avatarUrl === url
                      ? 'border-[#00E599] ring-2 ring-[#00E599]/40 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`avatar-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">
                학생 이름 <span className="text-[#00E599]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="예: 김민우, Alex Kim, Sarah C."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-[#00E599] transition-colors"
              />
            </div>

            {/* Trajectory */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">학습 궤적 / 전공 트랙</label>
              <select
                value={trajectoryName}
                onChange={(e) => setTrajectoryName(e.target.value)}
                className="w-full bg-[#111A2E] border border-[#1E293B] rounded-lg px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-[#00E599] transition-colors"
              >
                {PRESET_TRAJECTORIES.map((t, idx) => (
                  <option key={idx} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Randomize & Reset */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400 font-medium">4대 핵심 평가 기준 파라미터</span>
            <button
              type="button"
              onClick={handleRandomize}
              className="flex items-center gap-1 text-[11px] text-[#00E599] hover:underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>랜덤 자동 채우기</span>
            </button>
          </div>

          {/* 4대 핵심 평가 기준: 1.최초성취도 2.참여도 지수 3.최종 성장도 4.미래역량 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0A101D] p-4 rounded-xl border border-[#1E293B]">
            {/* 1. 최초성취도 */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00E599]"></span>
                  <span>1. 최초성취도 (0~100)</span>
                </span>
                <span className="text-[#00E599] font-mono font-bold">{initialAchievement}점</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={initialAchievement}
                onChange={(e) => setInitialAchievement(Number(e.target.value))}
                className="w-full accent-[#00E599]"
              />
            </div>

            {/* 2. 참여도 지수 */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
                  <span>2. 참여도 지수 (0~100)</span>
                </span>
                <span className="text-[#38BDF8] font-mono font-bold">{engagementIndex}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={engagementIndex}
                onChange={(e) => setEngagementIndex(Number(e.target.value))}
                className="w-full accent-[#38BDF8]"
              />
            </div>

            {/* 3. 최종 성장도 */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                  <span>3. 최종 성장도 (0~100)</span>
                </span>
                <span className="text-[#F59E0B] font-mono font-bold">{finalGrowth}점</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={finalGrowth}
                onChange={(e) => setFinalGrowth(Number(e.target.value))}
                className="w-full accent-[#F59E0B]"
              />
            </div>

            {/* 4. 미래역량 */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A78BFA]"></span>
                  <span>4. 미래역량 (0~100)</span>
                </span>
                <span className="text-[#A78BFA] font-mono font-bold">{futureCompetency}점</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={futureCompetency}
                onChange={(e) => setFutureCompetency(Number(e.target.value))}
                className="w-full accent-[#A78BFA]"
              />
            </div>
          </div>

          {/* Radar Axes: Resilience, Adaptability */}
          <div className="grid grid-cols-2 gap-3 bg-[#0A101D] p-3.5 rounded-xl border border-[#1E293B]">
            <div className="space-y-1 text-center">
              <span className="text-slate-400 block text-[11px]">회복탄력성 (Resilience)</span>
              <span className="text-slate-100 font-mono font-bold text-sm">{resilience}</span>
              <input
                type="range"
                min="20"
                max="100"
                value={resilience}
                onChange={(e) => setResilience(Number(e.target.value))}
                className="w-full accent-[#00E599]"
              />
            </div>
            <div className="space-y-1 text-center">
              <span className="text-slate-400 block text-[11px]">환경 적응력 (Adaptability)</span>
              <span className="text-slate-100 font-mono font-bold text-sm">{adaptability}</span>
              <input
                type="range"
                min="20"
                max="100"
                value={adaptability}
                onChange={(e) => setAdaptability(Number(e.target.value))}
                className="w-full accent-[#38BDF8]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#1E293B] text-slate-300 hover:bg-[#1E293B] transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00E599] text-[#0A101D] font-bold hover:bg-[#00E599]/90 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>학생 등록 완료</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
