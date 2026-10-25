import React from 'react';

interface MatrixGridProps {
  matrix: number[][];
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}

export const MatrixGrid: React.FC<MatrixGridProps> = ({
  matrix,
  label,
  size = 'md',
  highlight = false,
}) => {
  const cellSizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm md:w-12 md:h-12 md:text-base',
    lg: 'w-12 h-12 text-base md:w-14 md:h-14 md:text-lg',
  }[size];

  return (
    <div className="inline-flex flex-col items-center">
      {label && (
        <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono mb-1">
          {label}
        </span>
      )}
      <div
        className={`relative inline-block p-1.5 md:p-2 rounded-lg border ${
          highlight
            ? 'border-doom-emerald/60 bg-doom-850/80 shadow-emerald-glow'
            : 'border-neutral-700/60 bg-doom-900/90'
        }`}
      >
        {/* Matrix brackets graphic */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 border-l-2 border-t-2 border-b-2 border-doom-emerald/50 rounded-l" />
        <div className="absolute right-0 top-0 bottom-0 w-1.5 border-r-2 border-t-2 border-b-2 border-doom-emerald/50 rounded-r" />

        <div className="flex flex-col gap-1.5 px-2">
          {matrix.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 justify-center">
              {row.map((cell, cIdx) => (
                <div
                  key={cIdx}
                  className={`${cellSizeClasses} flex items-center justify-center font-mono font-semibold rounded bg-doom-800/80 border border-neutral-700/50 text-neutral-100 shadow-inner`}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
