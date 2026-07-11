import React from 'react';
import { Smile, Meh, Frown, AlertTriangle } from 'lucide-react';
import { useTracker } from '../hooks/useTracker';

const moods = [
  { id: 'happy', label: 'Senang', icon: Smile, color: 'text-white border-white/20 hover:bg-brand-dark/30' },
  { id: 'normal', label: 'Biasa', icon: Meh, color: 'text-white border-white/20 hover:bg-brand-dark/30' },
  { id: 'tired', label: 'Lelah', icon: Frown, color: 'text-white border-white/20 hover:bg-brand-dark/30' },
  { id: 'stress', label: 'Stres', icon: AlertTriangle, color: 'text-white border-white/20 hover:bg-brand-dark/30' }
];

const stressLevels = {
  happy: { name: 'Rendah (Low Stress)', text: 'text-brand-primary bg-brand-dark/20', width: 'w-1/3' },
  normal: { name: 'Rendah (Low Stress)', text: 'text-brand-primary bg-brand-dark/20', width: 'w-1/3' },
  tired: { name: 'Sedang (Medium Stress)', text: 'text-rose-200 bg-brand-dark/20', width: 'w-2/3' },
  stress: { name: 'Tinggi (High Stress)', text: 'text-rose-300 bg-brand-dark/20', width: 'w-full' }
};

const StressCard = () => {
  const { todayMood, logMood } = useTracker();
  const currentMood = todayMood?.mood;
  const stressInfo = currentMood ? (stressLevels[currentMood] || stressLevels.normal) : { name: 'Belum diisi', text: 'text-brand-primary/85 bg-brand-dark/25 border border-brand-dark/20', width: 'w-0' };

  return (
    <div className="glass-card rounded-3xl p-6 hover:shadow-xl hover:shadow-brand-dark/10 transition-all duration-300 border border-brand-dark/20 w-full h-full flex flex-col justify-between">
      <div className="flex items-center space-x-3.5 mb-5">
        <div className="p-3 rounded-2xl bg-brand-dark/25 text-white border border-brand-dark/20 shadow-inner">
          <AlertTriangle className="h-6 w-6 text-brand-primary" />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-white text-base leading-tight">Stress Monitoring</h3>
          <p className="text-xs text-white/80 mt-0.5 font-medium">Pantau tingkat stres berdasarkan mood hari ini</p>
        </div>
      </div>

      {/* Mood Selector */}
      <div className="mb-6 text-left">
        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-3">Mood Hari Ini</p>
        <div className="grid grid-cols-4 gap-2">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isActive = currentMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => logMood(mood.id)}
                className={`flex flex-col items-center justify-center py-3.5 px-1 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-brand-primary bg-brand-dark text-white scale-[1.03] font-bold shadow-md'
                    : 'bg-brand-dark/15 border-brand-dark/10 text-white/80 hover:text-white'
                } ${mood.color}`}
              >
                <Icon className={`h-6.5 w-6.5 mb-1.5 transition-transform ${isActive ? 'scale-115' : ''}`} />
                <span className="text-[10px] font-bold tracking-wide uppercase">{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stress Meter */}
      <div className="p-4 bg-brand-dark/15 border border-brand-dark/20 rounded-2xl text-left">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Tingkat Stres</span>
          <span className={`text-[10px] font-bold ${stressInfo.text} uppercase tracking-wider px-2 py-0.5 rounded-lg`}>
            {stressInfo.name}
          </span>
        </div>
        
        <div className="h-2.5 w-full bg-brand-dark/30 rounded-full overflow-hidden border border-brand-dark/30">
          <div
            className={`h-full bg-brand-primary rounded-full transition-all duration-500 ease-out ${stressInfo.width}`}
          />
        </div>

        <p className="text-[10px] text-white/85 mt-3 leading-relaxed font-semibold">
          {!currentMood && '🔍 Pilih mood Anda di atas untuk memantau tingkat stres hari ini.'}
          {currentMood === 'stress' && '⚠️ Tingkat stres Anda tinggi. Segera ambil istirahat, lakukan pernapasan dalam, atau jalan-jalan sebentar.'}
          {currentMood === 'tired' && '💤 Anda merasa lelah. Cobalah meregangkan badan dan minum segelas air untuk memulihkan energi.'}
          {currentMood === 'normal' && '✅ Tingkat stres normal. Jaga ritme kerja Anda tetap seimbang.'}
          {currentMood === 'happy' && '✨ Mood Anda luar biasa! Pertahankan energi positif ini saat bekerja.'}
        </p>
      </div>
    </div>
  );
};

export default StressCard;
