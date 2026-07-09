import React from 'react';

const WorkWellLogo = ({ className = "h-8 w-8", iconOnly = false, logoColorClass = "" }) => {
  return (
    <div className={`flex ${iconOnly ? 'items-center justify-center' : 'items-center space-x-3 text-left'}`}>
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Monitor Frame */}
        <path
          d="M 45 22 H 24 A 4 4 0 0 0 20 26 V 56 A 4 4 0 0 0 24 60 H 48"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          className={logoColorClass}
        />
        {/* Monitor Stand */}
        <path
          d="M 28 60 L 26 68 H 40"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={logoColorClass}
        />

        {/* W Left Leg (Dark Blue/Teal) */}
        <path
          d="M 27 38 L 40 58 L 52 38"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={logoColorClass}
        />

        {/* Radar Waves (Green) */}
        <path
          d="M 46 32 A 8 8 0 0 1 58 32"
          stroke="#6FCF97"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 42 27 A 14 14 0 0 1 62 27"
          stroke="#6FCF97"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* W Right Leg & Stem (Green) */}
        <path
          d="M 40 58 C 48 58 55 48 58 34"
          stroke="#6FCF97"
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* Top Large Leaf */}
        <path
          d="M 58 34 C 62 25 72 20 78 18 C 76 28 72 35 58 34 Z"
          fill="#6FCF97"
        />

        {/* Side Medium Leaf */}
        <path
          d="M 56 44 C 62 40 70 38 74 38 C 72 45 66 48 56 44 Z"
          fill="#6FCF97"
        />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-baseline font-black tracking-tight text-lg">
            <span className="text-brand-dark dark:text-white">WorkWell</span>
            <span className="text-brand-secondary dark:text-brand-primary ml-1 text-[10px] uppercase font-black tracking-widest">Digital</span>
          </div>
          <span className="text-[7.5px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest mt-0.5">Stay Fit While You Sit</span>
        </div>
      )}
    </div>
  );
};

export default WorkWellLogo;
