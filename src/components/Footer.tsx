import React from 'react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenStatus?: () => void;
  onOpenDocs?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenStatus,
  onOpenDocs,
}) => {
  return (
    <footer className="h-12 bg-[#090E1A] border-t border-[#1E293B] px-8 flex items-center justify-between text-xs text-slate-500 select-none">
      <div>
        © 2024 Digital Twin Growth Engine. High-Fidelity Education Simulation.
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={onOpenPrivacy}
          className="hover:text-slate-300 transition-colors"
        >
          Privacy Protocol
        </button>
        <button
          onClick={onOpenStatus}
          className="hover:text-slate-300 transition-colors flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
          Service Status
        </button>
        <button
          onClick={onOpenDocs}
          className="hover:text-slate-300 transition-colors"
        >
          Documentation
        </button>
      </div>
    </footer>
  );
};
