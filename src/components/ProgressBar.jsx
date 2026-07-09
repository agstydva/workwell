import React from 'react';

const ProgressBar = ({ value, max = 100, color = 'bg-indigo-600', height = 'h-3' }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 text-xs font-medium">
        <span className="text-slate-500 dark:text-slate-400">Progres</span>
        <span className="text-indigo-600 dark:text-indigo-400">{percentage}% ({value}/{max})</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-350 dark:border-slate-700/50">
        <div
          className={`${height} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
