import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTracker } from '../hooks/useTracker';
import { storageService } from '../services/storageService';
import { Heart, Activity, CheckCircle2, AlertCircle, Clock, Droplet, Dumbbell } from 'lucide-react';

const WellnessScore = () => {
  const { currentUser, userSettings } = useAuth();
  const { todayHabit, todayMood, sessionDuration, weeklySessions } = useTracker();

  // Targets
  const limitMinutes = userSettings?.screenLimit || 60;
  const waterTarget = 8;
  const movementTarget = 5;

  // 1. Calculate Today's Screen Time in Minutes
  const todayStr = new Date().toLocaleDateString('sv-SE');
  const todaySessionLog = weeklySessions.find(s => s.date === todayStr) || { screenTime: 0 };
  const savedTimeSeconds = todaySessionLog.screenTime * 60;
  const totalElapsedSeconds = Math.round(savedTimeSeconds + sessionDuration);
  const todayScreenTimeMinutes = totalElapsedSeconds / 60;

  // 2. Score Component: Screen Time (Weight: 25%)
  let screenScore = 25;
  if (todayScreenTimeMinutes > limitMinutes) {
    const excessRatio = (todayScreenTimeMinutes - limitMinutes) / limitMinutes;
    screenScore = Math.max(0, 25 - excessRatio * 25);
  }

  // 3. Score Component: Water Intake (Weight: 25%)
  const waterGlasses = todayHabit?.waterIntake || 0;
  const waterScore = Math.min(25, (waterGlasses / waterTarget) * 25);

  // 4. Score Component: Movement (Weight: 25%)
  const stretches = todayHabit?.stretchingCount || 0;
  const exercises = todayHabit?.exerciseCount || 0;
  const totalMovement = stretches + exercises;
  const movementScore = Math.min(25, (totalMovement / movementTarget) * 25);

  // 5. Score Component: Mood & Stress (Weight: 25%)
  const currentMood = todayMood?.mood || 'normal';
  let moodScore = 20; 
  if (currentMood === 'happy') moodScore = 25;
  if (currentMood === 'tired') moodScore = 12;
  if (currentMood === 'stress') moodScore = 6;

  // Calculate final score
  const finalScore = Math.round(screenScore + waterScore + movementScore + moodScore);

  // 6. Calculate Streak dynamically from historical records in storageService
  const calculateStreak = () => {
    if (!currentUser) return 0;

    const allSessions = storageService.query(storageService.KEYS.SESSIONS, s => s.userId === currentUser.id);
    const allHabits = storageService.query(storageService.KEYS.HABITS, h => h.userId === currentUser.id);

    const getDateStr = (offset) => {
      const d = new Date();
      d.setDate(d.getDate() - offset);
      return d.toLocaleDateString('sv-SE');
    };

    let streakCount = 0;

    const isDaySuccessful = (offset) => {
      const dateStr = getDateStr(offset);

      let screenTimeMinutes = 0;
      if (offset === 0) {
        const todaySessionLog = weeklySessions.find(s => s.date === dateStr) || { screenTime: 0 };
        const totalSecs = (todaySessionLog.screenTime * 60) + sessionDuration;
        screenTimeMinutes = totalSecs / 60;
      } else {
        const daySessions = allSessions.filter(s => s.date === dateStr);
        const totalSecs = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        screenTimeMinutes = totalSecs / 60;
      }

      const habit = allHabits.find(h => h.date === dateStr) || {
        waterIntake: 0,
        stretchingCount: 0,
        exerciseCount: 0
      };

      const water = habit.waterIntake || 0;
      const movement = (habit.stretchingCount || 0) + (habit.exerciseCount || 0);

      const meetsWater = water >= 6;
      const meetsMovement = movement >= 3;
      const meetsScreen = screenTimeMinutes <= limitMinutes && screenTimeMinutes > 0;

      return meetsWater || meetsMovement || meetsScreen;
    };

    const todayIsSuccess = isDaySuccessful(0);
    const yesterdayIsSuccess = isDaySuccessful(1);

    if (!todayIsSuccess && !yesterdayIsSuccess) {
      return 0;
    }

    let checkOffset = todayIsSuccess ? 0 : 1;

    while (checkOffset < 365) {
      if (isDaySuccessful(checkOffset)) {
        streakCount++;
        checkOffset++;
      } else {
        break;
      }
    }

    return streakCount;
  };

  const streak = calculateStreak();

  // Determine feedback message & color
  let statusMessage = '';
  let statusTitle = '';
  let statusBg = '';
  let statusText = '';
  let ringColor = 'stroke-brand-secondary';

  if (finalScore >= 80) {
    statusTitle = 'Kondisi Prima! ✨';
    statusMessage = 'Luar biasa! Tubuh dan pikiran Anda berada dalam kondisi prima hari ini. Pertahankan pola kerja sehat ini!';
    statusBg = 'bg-brand-secondary/10 border-brand-secondary/25';
    statusText = 'text-brand-dark';
    ringColor = 'stroke-brand-secondary';
  } else if (finalScore >= 60) {
    statusTitle = 'Cukup Sehat 👍';
    statusMessage = 'Kerja bagus! Anda sudah menjaga kesehatan dengan cukup baik. Sedikit minum air atau peregangan akan menyempurnakannya!';
    statusBg = 'bg-brand-primary/10 border-brand-primary/25';
    statusText = 'text-brand-dark';
    ringColor = 'stroke-brand-primary';
  } else {
    statusTitle = 'Perlu Perhatian ⚠️';
    statusMessage = 'Skor kesehatan Anda agak rendah hari ini. Yuk ambil jeda istirahat, minum segelas air, dan lakukan peregangan ringan!';
    statusBg = 'bg-rose-500/10 border-rose-500/25';
    statusText = 'text-rose-700';
    ringColor = 'stroke-rose-455';
  }

  // Indonesian mood labels
  const getMoodLabel = (m) => {
    if (m === 'happy') return 'Senang';
    if (m === 'tired') return 'Kelelahan';
    if (m === 'stress') return 'Stres';
    return 'Tenang / Normal';
  };

  // SVG parameters for score progress circle
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (finalScore / 100) * circumference;

  return (
    <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-brand-secondary/15 shadow-sm hover:shadow-md transition-all duration-300 w-full h-full flex flex-col justify-between space-y-5">
      
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3.5 border-b border-brand-secondary/10 w-full">
        <div className="text-left">
          <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">Rincian Nilai Kesehatan</h3>
          <p className="text-[10px] text-brand-secondary font-semibold mt-0.5">Analisis kontribusi aktivitas Anda hari ini</p>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-primary/10 text-brand-dark border border-brand-primary/20 rounded-full text-[10px] font-extrabold shadow-sm animate-pulse">
          <span>🔥</span>
          <span>{streak} Hari Beruntun</span>
        </div>
      </div>

      {/* Body: Circular ring + breakdown cards */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full">
        
        {/* Left Side: Circular Ring Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center py-2 md:border-r md:border-brand-secondary/10 md:pr-6">
          <div className="relative w-36 h-36 flex items-center justify-center select-none">
            {/* SVG Circle progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6FCF97" />
                  <stop offset="100%" stopColor="#2FA084" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke={finalScore >= 60 ? "url(#scoreGradient)" : "#F43F5E"}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-brand-dark leading-none">{finalScore}%</span>
              <span className="text-[9px] font-bold text-brand-secondary uppercase tracking-widest mt-1">Wellness Score</span>
            </div>
          </div>
        </div>

        {/* Right Side: Category Breakdown Progress bars */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          
          {/* Category 1: Screen Time */}
          <div className="bg-brand-bg/40 border border-brand-secondary/10 p-3 rounded-2xl space-y-1.5 text-left">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-brand-secondary flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Screen Time</span>
              </span>
              <span className="text-brand-dark">{Math.round(screenScore)} / 25 pt</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${(screenScore / 25) * 100}%` }} />
            </div>
            <div className="text-[9px] font-bold text-slate-500 text-right">
              {Math.floor(todayScreenTimeMinutes / 60)}j {Math.floor(todayScreenTimeMinutes % 60)}m / {Math.floor(limitMinutes / 60)}j
            </div>
          </div>

          {/* Category 2: Water Intake */}
          <div className="bg-brand-bg/40 border border-brand-secondary/10 p-3 rounded-2xl space-y-1.5 text-left">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-brand-secondary flex items-center space-x-1.5">
                <Droplet className="h-3.5 w-3.5 text-blue-500" />
                <span>Air Minum</span>
              </span>
              <span className="text-brand-dark">{Math.round(waterScore)} / 25 pt</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${(waterScore / 25) * 100}%` }} />
            </div>
            <div className="text-[9px] font-bold text-slate-500 text-right">
              {waterGlasses} / {waterTarget} Gelas
            </div>
          </div>

          {/* Category 3: Movement */}
          <div className="bg-brand-bg/40 border border-brand-secondary/10 p-3 rounded-2xl space-y-1.5 text-left">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-brand-secondary flex items-center space-x-1.5">
                <Dumbbell className="h-3.5 w-3.5 text-brand-dark" />
                <span>Aktivitas Fisik</span>
              </span>
              <span className="text-brand-dark">{Math.round(movementScore)} / 25 pt</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${(movementScore / 25) * 100}%` }} />
            </div>
            <div className="text-[9px] font-bold text-slate-500 text-right">
              {totalMovement} / {movementTarget} Sesi
            </div>
          </div>

          {/* Category 4: Mood */}
          <div className="bg-brand-bg/40 border border-brand-secondary/10 p-3 rounded-2xl space-y-1.5 text-left">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="text-brand-secondary flex items-center space-x-1.5">
                <Activity className="h-3.5 w-3.5" />
                <span>Kesehatan Mental</span>
              </span>
              <span className="text-brand-dark">{Math.round(moodScore)} / 25 pt</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full transition-all duration-500" style={{ width: `${(moodScore / 25) * 100}%` }} />
            </div>
            <div className="text-[9px] font-bold text-slate-500 text-right">
              Mood: {getMoodLabel(currentMood)}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Side: Feedback Block Banner */}
      <div className={`w-full p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left ${statusBg} transition-all duration-300 mt-2`}>
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-xl bg-white/80 dark:bg-slate-900 shadow-sm flex-shrink-0">
            <Heart className={`h-4.5 w-4.5 ${statusText} fill-current`} />
          </div>
          <div>
            <h4 className={`text-xs font-black uppercase tracking-wider ${statusText}`}>{statusTitle}</h4>
            <p className="text-[10.5px] text-brand-dark/95 leading-relaxed font-semibold mt-0.5">{statusMessage}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WellnessScore;
