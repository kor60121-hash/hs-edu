import React, { useState } from 'react';
import {
  TabType,
  TrajectoryParameters,
  StudentProfile,
  CurriculumNode,
  CohortCentroid,
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { SimulationView } from './components/SimulationView';
import { LearnerProfileView } from './components/LearnerProfileView';
import { ClassManagementView } from './components/ClassManagementView';
import { CurriculumView } from './components/CurriculumView';
import { ArchiveView } from './components/ArchiveView';
import { ExportReportModal } from './components/ExportReportModal';
import { SystemLogsDrawer } from './components/SystemLogsDrawer';
import { ModuleRunnerModal } from './components/ModuleRunnerModal';
import { DigitalTwinSimulationModal } from './components/DigitalTwinSimulationModal';
import { RosterModal } from './components/RosterModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { HelpModal } from './components/HelpModal';
import {
  INITIAL_TRAJECTORY_PARAMS,
  INITIAL_MASTERY_DATA,
  ENGINE_STREAM_ALERTS,
  PRIMARY_STUDENT,
  OTHER_STUDENTS,
  INITIAL_COHORT_CENTROIDS,
  SCATTER_STUDENTS_COHORT_A,
  HIGH_GROWTH_STUDENTS,
  HEATMAP_DATA,
  CURRICULUM_NODES,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('simulation');
  const [searchQuery, setSearchQuery] = useState('');
  const [trajectoryParams, setTrajectoryParams] = useState<TrajectoryParameters>(
    INITIAL_TRAJECTORY_PARAMS
  );
  const [masteryData, setMasteryData] = useState(INITIAL_MASTERY_DATA);
  const [alerts, setAlerts] = useState(ENGINE_STREAM_ALERTS);
  const [curriculumNodes, setCurriculumNodes] = useState<CurriculumNode[]>(CURRICULUM_NODES);

  // Dynamic Students State
  const [allStudents, setAllStudents] = useState<StudentProfile[]>([
    PRIMARY_STUDENT,
    ...OTHER_STUDENTS,
  ]);
  const [currentStudentId, setCurrentStudentId] = useState('DT-894-X');

  // Dynamic Cohort Centroids State
  const [centroids, setCentroids] = useState<CohortCentroid[]>(INITIAL_COHORT_CENTROIDS);

  const activeStudent =
    allStudents.find((s) => s.id === currentStudentId) || allStudents[0] || PRIMARY_STUDENT;

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLogsDrawerOpen, setIsLogsDrawerOpen] = useState(false);
  const [isModuleRunnerOpen, setIsModuleRunnerOpen] = useState(false);
  const [isDigitalTwinSimOpen, setIsDigitalTwinSimOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Student Handlers
  const handleAddStudent = (newStudent: StudentProfile) => {
    setAllStudents((prev) => [newStudent, ...prev]);
    setCurrentStudentId(newStudent.id);
    setAlerts((prev) => [
      {
        id: `alert-${Date.now()}`,
        type: 'system',
        title: '신규 학생 등록',
        message: `${newStudent.name} (${newStudent.id}) 학생의 디지털 트윈 프로필이 생성되었습니다.`,
        borderColor: 'border-emerald-400/80',
        timestamp: '방금 전',
      },
      ...prev,
    ]);
  };

  const handleUpdateStudent = (updatedStudent: StudentProfile) => {
    setAllStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    const studentToDelete = allStudents.find((s) => s.id === studentId);
    setAllStudents((prev) => {
      const filtered = prev.filter((s) => s.id !== studentId);
      if (currentStudentId === studentId && filtered.length > 0) {
        setCurrentStudentId(filtered[0].id);
      }
      return filtered;
    });

    if (studentToDelete) {
      setAlerts((prev) => [
        {
          id: `alert-${Date.now()}`,
          type: 'cohort',
          title: '학생 프로필 삭제',
          message: `${studentToDelete.name} (${studentToDelete.id}) 학생이 데이터베이스에서 제외되었습니다.`,
          borderColor: 'border-rose-400/80',
          timestamp: '방금 전',
        },
        ...prev,
      ]);
    }
  };

  // Centroid Handlers
  const handleAddCentroid = (newCentroid: CohortCentroid) => {
    setCentroids((prev) => [...prev, newCentroid]);
    setAlerts((prev) => [
      {
        id: `alert-centroid-${Date.now()}`,
        type: 'simulation',
        title: '코호트 중심점 추가',
        message: `새로운 코호트 기준점 [${newCentroid.name}]이(가) 3D 공간에 배치되었습니다.`,
        borderColor: 'border-indigo-400/80',
        timestamp: '방금 전',
      },
      ...prev,
    ]);
  };

  const handleDeleteCentroid = (id: string) => {
    const target = centroids.find((c) => c.id === id);
    setCentroids((prev) => prev.filter((c) => c.id !== id));
    if (target) {
      setAlerts((prev) => [
        {
          id: `alert-centroid-${Date.now()}`,
          type: 'cohort',
          title: '코호트 중심점 삭제',
          message: `[${target.name}] 중심점이 시뮬레이션에서 제거되었습니다.`,
          borderColor: 'border-amber-400/80',
          timestamp: '방금 전',
        },
        ...prev,
      ]);
    }
  };

  const handleRenameCentroid = (id: string, newName: string) => {
    setCentroids((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  const handleUpdateParameters = (newParams: Partial<TrajectoryParameters>) => {
    setTrajectoryParams((prev) => ({ ...prev, ...newParams }));
  };

  const handleSelectStudent = (studentId: string) => {
    const found = allStudents.find((s) => s.id === studentId);
    if (found) {
      setCurrentStudentId(found.id);
    } else if (studentId === 'ID-8924' || studentId === 'DT-894-X') {
      setCurrentStudentId('DT-894-X');
    } else if (studentId === 'ID-1104' || studentId === 'DT-442-A') {
      setCurrentStudentId('DT-442-A');
    } else if (allStudents.length > 0) {
      setCurrentStudentId(allStudents[0].id);
    }
    setActiveTab('learner');
  };

  const handleNavigateToCurriculum = (studentId: string) => {
    handleSelectStudent(studentId);
    setActiveTab('curriculum');
  };

  const handleCompleteModule = () => {
    setCurriculumNodes((prev) =>
      prev.map((node) => {
        if (node.id === 'node-2') {
          return {
            ...node,
            status: 'completed',
            progressPercent: 100,
          };
        }
        if (node.id === 'node-3') {
          return {
            ...node,
            status: 'active',
            progressPercent: 35,
          };
        }
        return node;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#080D18] text-slate-100 flex flex-col font-sans selection:bg-[#00E599] selection:text-[#0A101D]">
      {/* Top Header Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) {
            const found = allStudents.find(
              (s) =>
                s.name.toLowerCase().includes(q.toLowerCase()) ||
                s.id.toLowerCase().includes(q.toLowerCase())
            );
            if (found) {
              setCurrentStudentId(found.id);
            }
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        notificationCount={alerts.length}
      />

      {/* Main Body with Left Sidebar + Scrollable Content */}
      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onExportReport={() => setIsExportModalOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenLogs={() => setIsLogsDrawerOpen(true)}
        />

        {/* Center Workspace Content */}
        <main className="flex-1 min-w-0 p-6 md:p-8 bg-[#080D18] overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'simulation' && (
              <SimulationView
                parameters={trajectoryParams}
                onUpdateParameters={handleUpdateParameters}
                masteryData={masteryData}
                alerts={alerts}
                students={allStudents}
                centroids={centroids}
                onAddCentroid={handleAddCentroid}
                onDeleteCentroid={handleDeleteCentroid}
                onRenameCentroid={handleRenameCentroid}
                onDeleteStudent={handleDeleteStudent}
                onNavigateToCurriculum={handleNavigateToCurriculum}
              />
            )}

            {activeTab === 'learner' && (
              <LearnerProfileView
                student={activeStudent}
                students={allStudents}
                onSelectStudent={(id) => setCurrentStudentId(id)}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onOpenStreamData={() => setIsLogsDrawerOpen(true)}
                onSimulateIntervention={() => setIsDigitalTwinSimOpen(true)}
              />
            )}

            {activeTab === 'cohort' && (
              <ClassManagementView
                students={SCATTER_STUDENTS_COHORT_A}
                highGrowthList={HIGH_GROWTH_STUDENTS}
                heatmapData={HEATMAP_DATA}
                onSelectStudent={handleSelectStudent}
                onOpenRosterModal={() => setIsRosterModalOpen(true)}
              />
            )}

            {activeTab === 'curriculum' && (
              <CurriculumView
                nodes={curriculumNodes}
                onStartModule={() => setIsModuleRunnerOpen(true)}
                onOpenDigitalTwinSimulation={() => setIsDigitalTwinSimOpen(true)}
                activeStudent={activeStudent}
              />
            )}

            {activeTab === 'archive' && <ArchiveView />}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setIsHelpOpen(true)}
        onOpenStatus={() => setIsLogsDrawerOpen(true)}
        onOpenDocs={() => setIsHelpOpen(true)}
      />

      {/* Modals & Drawers */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <SystemLogsDrawer
        isOpen={isLogsDrawerOpen}
        onClose={() => setIsLogsDrawerOpen(false)}
      />

      <ModuleRunnerModal
        isOpen={isModuleRunnerOpen}
        onClose={() => setIsModuleRunnerOpen(false)}
        onCompleteModule={handleCompleteModule}
      />

      <DigitalTwinSimulationModal
        isOpen={isDigitalTwinSimOpen}
        onClose={() => setIsDigitalTwinSimOpen(false)}
      />

      <RosterModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        onSelectStudent={handleSelectStudent}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={alerts}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
