import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number; // 1 to 5
  stepLabels: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, stepLabels }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      <div className="relative">
        {/* Background track line (bold solid black) */}
        <div className="absolute top-4 left-0 w-full h-1.5 bg-black -translate-y-1/2 z-0 rounded-full" />
        
        {/* Active progress track line (yellow) */}
        <div
          className="absolute top-4 left-0 h-1.5 bg-[#FFC700] -translate-y-1/2 z-0 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (stepLabels.length - 1)) * 100}%` }}
        />

        {/* Step Nodes */}
        <div className="relative z-10 flex items-center justify-between">
          {stepLabels.map((label, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={label} className="flex flex-col items-center group">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-200 border-2 border-black ${
                    isCompleted
                      ? 'bg-black text-[#FFC700] shadow-brutal-xs'
                      : isCurrent
                      ? 'bg-[#FFC700] text-black scale-110 shadow-brutal-sm'
                      : 'bg-white text-black'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-black tracking-tight uppercase text-center max-w-[65px] sm:max-w-[110px] ${
                    isCurrent
                      ? 'text-black underline decoration-2 underline-offset-2'
                      : isCompleted
                      ? 'text-black'
                      : 'text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
