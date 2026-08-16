import React, { useEffect, useRef, useState } from 'react';
import { TrajectoryParameters, CohortCentroid, StudentProfile } from '../types';

interface SpatialMatrixCanvasProps {
  parameters: TrajectoryParameters;
  deltaVariance: number;
  centroids?: CohortCentroid[];
  students?: StudentProfile[];
  selectedStudentId?: string | null;
  onSelectStudent?: (studentId: string) => void;
  onSelectCentroid?: (centroid: CohortCentroid) => void;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const SpatialMatrixCanvas: React.FC<SpatialMatrixCanvasProps> = ({
  parameters,
  deltaVariance,
  centroids = [],
  students = [],
  selectedStudentId,
  onSelectStudent,
  onSelectCentroid,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [rotation, setRotation] = useState({ x: 25, y: -35 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  // Projected 2D elements for click hit-testing
  const clickTargetsRef = useRef<
    { type: 'student' | 'centroid'; id: string; x: number; y: number; radius: number; data?: any }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleY = (rotation.y * Math.PI) / 180;
    let angleX = (rotation.x * Math.PI) / 180;

    // Responsive sizing with devicePixelRatio
    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic 3D trajectory nodes
    const numNodes = 40;
    const trajectoryPoints: Point3D[] = [];
    for (let i = 0; i < numNodes; i++) {
      const t = (i / numNodes) * Math.PI * 4;
      const radius = 90 + Math.sin(t * 2) * 25 + (parameters.cognitiveLoad / 100) * 20;
      const x = Math.cos(t) * radius;
      const y = (i - numNodes / 2) * 5 + Math.sin(t * 3) * (parameters.friction + 10);
      const z = Math.sin(t) * radius;
      trajectoryPoints.push({ x, y, z });
    }

    // Animation Loop
    let time = 0;
    const render = () => {
      time += 0.015;
      if (isRotating && !isDragging) {
        angleY += 0.006;
      }

      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 600;
      const height = rect?.height || 400;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid & radial glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        width / 1.5
      );
      gradient.addColorStop(0, 'rgba(0, 229, 153, 0.06)');
      gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.2)');
      gradient.addColorStop(1, 'rgba(11, 17, 32, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 3D Projection Helper
      const project = (p: Point3D) => {
        // Rotate around Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective
        const fov = 340;
        const scale = fov / (fov + z2);
        return {
          x: centerX + x1 * scale,
          y: centerY + y2 * scale,
          scale,
          z: z2,
        };
      };

      // Draw 3D Coordinate Grid Plane
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
      ctx.lineWidth = 1;
      const gridSize = 120;
      const gridStep = 40;

      for (let g = -gridSize; g <= gridSize; g += gridStep) {
        // X-lines
        const p1 = project({ x: g, y: 80, z: -gridSize });
        const p2 = project({ x: g, y: 80, z: gridSize });
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Z-lines
        const p3 = project({ x: -gridSize, y: 80, z: g });
        const p4 = project({ x: gridSize, y: 80, z: g });
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // Draw Orbit Rings
      const ringRadii = [80, 130];
      ringRadii.forEach((rad, idx) => {
        ctx.strokeStyle = idx === 0 ? 'rgba(0, 229, 153, 0.15)' : 'rgba(167, 139, 250, 0.12)';
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const pt = project({
            x: Math.cos(a) * rad,
            y: Math.sin(a * 2 + time) * 10,
            z: Math.sin(a) * rad,
          });
          if (a === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();
        ctx.stroke();
      });

      // Draw 3D Trajectory Curve with Neon Glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00E599';
      ctx.strokeStyle = '#00E599';
      ctx.lineWidth = 2;

      ctx.beginPath();
      trajectoryPoints.forEach((p, idx) => {
        const wave = Math.sin(time * 2 + idx * 0.2) * 6;
        const proj = project({ x: p.x, y: p.y + wave, z: p.z });
        if (idx === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      });
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw nodes along the trajectory
      trajectoryPoints.forEach((p, idx) => {
        if (idx % 4 === 0) {
          const wave = Math.sin(time * 2 + idx * 0.2) * 6;
          const proj = project({ x: p.x, y: p.y + wave, z: p.z });
          ctx.fillStyle = '#00E599';
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(1.5, 3 * proj.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Clear click targets on every frame
      const currentTargets: {
        type: 'student' | 'centroid';
        id: string;
        x: number;
        y: number;
        radius: number;
        data?: any;
      }[] = [];

      // 1. Draw Cohort Centroids in 3D Space (Custom Dynamic Centroids)
      centroids.forEach((c) => {
        const floatY = Math.sin(time * 1.2 + c.x * 0.1) * 3;
        const proj = project({ x: c.x, y: c.y + floatY, z: c.z });

        // Draw vertical connector pole from grid base (y=80) to centroid
        const baseProj = project({ x: c.x, y: 80, z: c.z });
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = `${c.color}60`;
        ctx.lineWidth = 1;
        ctx.moveTo(baseProj.x, baseProj.y);
        ctx.lineTo(proj.x, proj.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Outer pulsing centroid beacon
        const radius = Math.max(7, 12 * proj.scale);
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${c.color}20`;
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = c.color;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Inner solid core
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(3, 5 * proj.scale), 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.fill();

        // Label Badge
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText(`⌖ ${c.name}`, proj.x + 12, proj.y + 3);

        currentTargets.push({
          type: 'centroid',
          id: c.id,
          x: proj.x,
          y: proj.y,
          radius: radius + 6,
          data: c,
        });
      });

      // 2. Draw Students in 3D Space
      students.forEach((s, idx) => {
        // Map student cognitive / achievement to 3D spatial position
        const angle = (idx / Math.max(1, students.length)) * Math.PI * 2;
        const baseRad = 70 + (s.radarScores.achievement / 100) * 30;
        const sX = Math.cos(angle + 0.5) * baseRad;
        const sY = (s.cognitiveLoad - 50) * 0.8;
        const sZ = Math.sin(angle + 0.5) * baseRad;

        const floatY = Math.sin(time * 1.5 + idx) * 4;
        const proj = project({ x: sX, y: sY + floatY, z: sZ });

        const isSelected = selectedStudentId === s.id;
        const radius = isSelected ? Math.max(9, 14 * proj.scale) : Math.max(5, 9 * proj.scale);

        // Highlight halo if selected
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = '#00E599';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 18;
          ctx.shadowColor = '#00E599';
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Student node circle
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected
          ? '#00E599'
          : idx === 0
          ? '#00E599'
          : idx === 1
          ? '#A78BFA'
          : '#38BDF8';
        ctx.shadowBlur = 12;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Name and score label
        ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
        ctx.fillStyle = isSelected ? '#00E599' : '#E2E8F0';
        ctx.fillText(
          `${s.name} (${s.radarScores.achievement}점)`,
          proj.x + 10,
          proj.y + 4
        );

        currentTargets.push({
          type: 'student',
          id: s.id,
          x: proj.x,
          y: proj.y,
          radius: radius + 8,
          data: s,
        });
      });

      // Center Coordinate Axis Origin
      const origin = project({ x: 0, y: 0, z: 0 });
      ctx.fillStyle = '#00E599';
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, 2, 0, Math.PI * 2);
      ctx.fill();

      clickTargetsRef.current = currentTargets;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [parameters, deltaVariance, isRotating, isDragging, rotation, centroids, students, selectedStudentId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      setHasDragged(true);
    }
    setRotation((prev) => ({
      x: Math.max(-60, Math.min(60, prev.x + dy * 0.4)),
      y: prev.y + dx * 0.4,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);

    // If mouse was clicked without dragging, perform hit test
    if (!hasDragged && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Find closest clicked target
      const hit = clickTargetsRef.current.find((t) => {
        const dist = Math.hypot(t.x - clickX, t.y - clickY);
        return dist <= t.radius;
      });

      if (hit) {
        if (hit.type === 'student' && onSelectStudent) {
          onSelectStudent(hit.id);
        } else if (hit.type === 'centroid' && onSelectCentroid) {
          onSelectCentroid(hit.data);
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
      className="relative w-full h-[380px] bg-[#0A101D] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-[#1E293B]/70"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating Delta Variance Card at Bottom Left */}
      <div className="absolute bottom-4 left-4 bg-[#0F172A]/90 backdrop-blur-md border border-[#1E293B] rounded-lg p-3 shadow-xl pointer-events-none">
        <div className="text-[10px] tracking-wider font-semibold text-slate-400 uppercase font-mono">
          DELTA VARIANCE
        </div>
        <div className="text-xl font-bold font-mono text-slate-100 flex items-center gap-1.5 mt-0.5">
          <span>{deltaVariance.toFixed(2)}</span>
          <span className="text-[#00E599] text-sm animate-pulse">▲</span>
        </div>
      </div>

      {/* 3D Canvas Instruction Hint */}
      <div className="absolute bottom-4 right-4 bg-[#0F172A]/80 backdrop-blur-sm border border-[#1E293B] rounded-lg px-2.5 py-1 text-[10px] text-slate-400 font-mono pointer-events-none">
        드래그: 3D 회전 | 학생·중심점 클릭: 추천경로/정보 토글
      </div>

      {/* Rotation / Control Overlay top-right inside canvas */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`text-[10px] px-2.5 py-1 rounded-md font-mono border transition-all ${
            isRotating
              ? 'bg-[#00E599]/15 text-[#00E599] border-[#00E599]/40 shadow-[0_0_10px_rgba(0,229,153,0.2)]'
              : 'bg-[#131B2E] text-slate-400 border-[#1E293B]'
          }`}
        >
          {isRotating ? 'Auto Orbit ON' : 'Paused'}
        </button>
      </div>
    </div>
  );
};
