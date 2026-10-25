import React from 'react';
import { ValueType } from '../../types/game';
import { isMatrix, isNumberList } from '../../engine/answerParser';
import { MatrixGrid } from './MatrixGrid';

interface SequenceDisplayProps {
  value: ValueType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}

export const SequenceDisplay: React.FC<SequenceDisplayProps> = ({
  value,
  label,
  size = 'md',
  highlight = false,
}) => {
  if (isMatrix(value)) {
    return <MatrixGrid matrix={value} label={label} size={size} highlight={highlight} />;
  }

  const values = isNumberList(value) ? value : [value];

  const pillClasses = {
    sm: 'px-2 py-0.5 text-xs font-mono',
    md: 'px-3 py-1 text-sm md:text-base font-mono font-semibold',
    lg: 'px-4 py-2 text-base md:text-lg font-mono font-bold',
  }[size];

  return (
    <div className="inline-flex flex-col items-center">
      {label && (
        <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono mb-1">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
        {values.map((num, idx) => (
          <div
            key={idx}
            className={`${pillClasses} rounded-md border ${
              highlight
                ? 'bg-doom-emerald/20 border-doom-emerald/60 text-doom-neon shadow-emerald-glow'
                : 'bg-doom-800/90 border-neutral-700/80 text-neutral-100'
            } transition-all duration-200`}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};
