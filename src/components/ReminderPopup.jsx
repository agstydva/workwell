import React, { useState, useEffect } from 'react';
import { X, Coffee, Dumbbell, Droplet, Users, Footprints, Clock } from 'lucide-react';
import { useTracker } from '../hooks/useTracker';
import { useAuth } from '../hooks/useAuth';

const breakActivities = [
  { id: 'Stretching', label: 'Peregangan Tubuh', icon: Dumbbell, desc: 'Lakukan gerakan peregangan leher, bahu, dan punggung.' },
  { id: 'Drink Water', label: 'Minum Segelas Air', icon: Droplet, desc: 'Rehidrasi tubuh agar tetap fokus dan metabolisme lancar.' },
  { id: 'Talk with colleague/friend', label: 'Ngobrol Sejenak', icon: Users, desc: 'Istirahatkan mata dengan berbincang santai bersama rekan.' },
  { id: 'Walk for a moment', label: 'Jalan Kaki Sebentar', icon: Footprints, desc: 'Melangkah sebentar untuk melancarkan sirkulasi darah.' }
];

const ReminderPopup = ({ isOpen, onClose }) => {
  const { userSettings } = useAuth();
  const { startBreak, addWater, addStretch, addExercise } = useTracker();
  
  const [selectedActivity, setSelectedActivity] = useState('Stretching');
  const [selectedDuration, setSelectedDuration] = useState(userSettings?.breakDuration || 5);

  // Sync settings when they load
  useEffect(() => {
    if (userSettings?.breakDuration) {
      setSelectedDuration(userSettings.breakDuration);
    }
  }, [userSettings]);

  if (!isOpen) return null;

  const handleStartBreak = async () => {
    // Perform habit additions asynchronously depending on activity chosen
    if (selectedActivity === 'Drink Water') {
      await addWater();
    } else if (selectedActivity === 'Stretching') {
      await addStretch();
    } else {
      await addExercise();
    }
    
    await startBreak(selectedDuration, selectedActivity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg glass-panel bg-white dark:bg-slate-900 border border-brand-secondary/15 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-brand-secondary/10 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-secondary/10 dark:border-slate-800/80">
          <div className="flex items-center space-x-3 text-brand-secondary">
            <div className="p-2.5 bg-brand-secondary/10 rounded-2xl border border-brand-secondary/20">
              <Coffee className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-brand-dark dark:text-white leading-tight">Waktunya Istirahat!</h2>
              <p className="text-xs text-brand-secondary/80 dark:text-slate-400 mt-0.5">Time for a wellness break!</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Break Activity Selection */}
          <div>
            <p className="text-xs font-bold text-brand-secondary/80 dark:text-slate-400 mb-3 uppercase tracking-wider">1. Pilih Aktivitas Istirahat</p>
            <div className="grid grid-cols-1 gap-2.5">
              {breakActivities.map((act) => {
                const Icon = act.icon;
                const isSelected = selectedActivity === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setSelectedActivity(act.id)}
                    className={`flex items-start text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-brand-secondary bg-brand-secondary/10 shadow-md shadow-brand-secondary/5'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 hover:bg-slate-50/60 dark:bg-slate-900/30 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl mr-3.5 ${
                      isSelected ? 'bg-brand-secondary/20 text-brand-secondary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isSelected ? 'text-brand-dark dark:text-brand-primary' : 'text-slate-700 dark:text-slate-200'}`}>{act.label}</p>
                      <p className="text-xs text-brand-secondary/80 dark:text-slate-400 mt-0.5 leading-relaxed">{act.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Break Duration Selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold text-brand-secondary/80 dark:text-slate-400 uppercase tracking-wider">2. Atur Durasi Istirahat</p>
              <span className="flex items-center text-xs font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-0.5 rounded-lg border border-brand-secondary/20">
                <Clock className="h-3 w-3 mr-1" />
                <span>{selectedDuration} Menit</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSelectedDuration(dur)}
                  className={`py-3 px-1.5 rounded-xl border text-center text-sm font-bold transition-all duration-150 cursor-pointer ${
                    selectedDuration === dur
                      ? 'border-brand-secondary bg-brand-secondary/20 text-brand-dark dark:text-white font-extrabold'
                      : 'border-slate-150 dark:border-slate-800 bg-slate-50/20 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-750 dark:hover:text-slate-200'
                  }`}
                >
                  {dur} Menit
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-brand-secondary/10 dark:border-slate-800/80 bg-brand-bg/25 dark:bg-slate-950/20">
          <button
            type="button"
            onClick={handleStartBreak}
            className="w-full py-3.5 px-4 bg-brand-secondary hover:bg-brand-secondary/95 text-white font-bold rounded-2xl text-sm shadow-lg shadow-brand-secondary/25 hover:shadow-brand-secondary/35 transition-all cursor-pointer"
          >
            Mulai Istirahat
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReminderPopup;
