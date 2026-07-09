import React from 'react';

const colorMap = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' },
  brand: { bg: 'bg-brand-secondary/10', text: 'text-brand-secondary' }
};

const HabitCard = ({ title, subtitle, icon: Icon, color = 'indigo', children }) => {
  const colorTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="glass-card-light rounded-3xl p-6 hover:shadow-md transition-all duration-300 border border-brand-secondary/12 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-3.5 mb-5">
          <div className={`p-3 rounded-2xl ${colorTheme.bg} ${colorTheme.text} border border-brand-secondary/10 shadow-inner`}>
            {Icon && <Icon className="h-6 w-6" />}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-brand-dark text-base leading-tight">{title}</h3>
            <p className="text-xs text-brand-secondary mt-0.5 font-semibold">{subtitle}</p>
          </div>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
