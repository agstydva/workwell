import React, { useEffect, useRef } from 'react';
import { Play, Pause, Coffee, RefreshCw, AlertCircle } from 'lucide-react';
import { useTracker } from '../hooks/useTracker';
import { useAuth } from '../hooks/useAuth';

const formatTime = (totalSeconds) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Timer = ({ onOpenReminder }) => {
  const { userSettings } = useAuth();
  const notificationTriggeredRef = useRef(false);
  const {
    sessionDuration,
    isTimerRunning,
    isBreakActive,
    breakTimeRemaining,
    breakActivity,
    weeklySessions,
    startSession,
    pauseSession,
    resetSession,
    skipBreak,
  } = useTracker();

  const limitMinutes = userSettings?.screenLimit || 60;
  const limitSeconds = limitMinutes * 60;

  // Request browser notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
  
  // Resolve today's saved screen time from analytics and add currently running duration
  const todayStr = new Date().toLocaleDateString('sv-SE');
  const todaySessionLog = weeklySessions.find(s => s.date === todayStr) || { screenTime: 0 };
  const savedTimeSeconds = todaySessionLog.screenTime * 60;
  const totalElapsedSeconds = Math.round(savedTimeSeconds + sessionDuration);
  
  const progressPercent = Math.min((totalElapsedSeconds / limitSeconds) * 100, 100);

  // SVG parameters
  const radius = 90;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  // Break progress calculation
  const breakDurationMinutes = userSettings?.breakDuration || 5;
  const breakTotalSeconds = breakDurationMinutes * 60;
  const breakPercent = breakTimeRemaining > 0 ? (breakTimeRemaining / breakTotalSeconds) * 100 : 0;
  const breakDashoffset = circumference - (breakPercent / 100) * circumference;

  // Monitor limit and trigger reminder
  useEffect(() => {
    if (totalElapsedSeconds >= limitSeconds) {
      if (!isBreakActive && isTimerRunning) {
        onOpenReminder();
        
        // Trigger browser notification
        if (!notificationTriggeredRef.current) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('WorkWell', {
              body: 'Waktunya Istirahat! Ambil jeda rehat sejenak untuk peregangan.',
              icon: '/favicon.ico'
            });
          }
          notificationTriggeredRef.current = true;
        }
      }
    } else {
      notificationTriggeredRef.current = false;
    }
  }, [totalElapsedSeconds, limitSeconds, isBreakActive, isTimerRunning, onOpenReminder]);

  return (
    <div className="glass-card rounded-3xl p-6 hover:shadow-xl hover:shadow-brand-dark/10 transition-all duration-300 border border-brand-dark/20 flex flex-col items-center">
      <h3 className="font-bold text-white text-base leading-tight w-full text-left mb-1">
        {isBreakActive ? 'Break Time' : 'Screen Time Tracker'}
      </h3>
      <p className="text-xs text-brand-primary/90 font-semibold w-full text-left mb-6">
        {isBreakActive ? `Aktivitas break: ${breakActivity}` : `Target batas kerja hari ini: ${limitMinutes} Menit`}
      </p>

      {/* Circular Progress Ring */}
      <div className="relative flex items-center justify-center mb-6">
        <svg className="w-56 h-56 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            className="stroke-brand-dark/30"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Foreground circle */}
          <circle
            cx="112"
            cy="112"
            r={radius}
            className={`transition-all duration-500 ease-out ${
              isBreakActive
                ? 'stroke-brand-primary'
                : totalElapsedSeconds >= limitSeconds
                ? 'stroke-rose-450'
                : 'stroke-brand-primary'
            }`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={isBreakActive ? breakDashoffset : strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Time Text */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          {isBreakActive ? (
            <>
              <Coffee className="h-8 w-8 text-brand-primary mb-1 animate-bounce" />
              <span className="text-3xl font-black text-white tracking-wider">
                {formatTime(breakTimeRemaining)}
              </span>
              <span className="text-xs font-bold text-brand-primary mt-1 uppercase tracking-wider">Sedang Break</span>
            </>
          ) : (
            <>
              <span className="text-3xl font-black text-white tracking-wider">
                {formatTime(totalElapsedSeconds)}
              </span>
              <span className="text-xs font-semibold text-white/80 mt-1 uppercase tracking-wider">Bekerja</span>
              {totalElapsedSeconds >= limitSeconds && (
                <span className="flex items-center space-x-1 text-[10px] text-rose-355 font-extrabold mt-1.5 uppercase bg-rose-500/20 px-2 py-0.5 rounded-lg border border-rose-500/35">
                  <AlertCircle className="h-3 w-3" />
                  <span>Limit Tercapai</span>
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-3.5 w-full">
        {isBreakActive ? (
          <button
            onClick={skipBreak}
            className="flex-1 flex items-center justify-center space-x-1.5 py-3 px-4 bg-brand-dark/30 hover:bg-brand-dark/45 text-white font-bold rounded-2xl text-xs border border-brand-dark/25 transition-all active:scale-98 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Lewati Istirahat</span>
          </button>
        ) : (
          <>
            <button
              onClick={resetSession}
              className="p-3.5 bg-brand-dark/30 hover:bg-brand-dark/45 text-white rounded-2xl transition-all cursor-pointer border border-brand-dark/25 shadow-sm active:scale-95"
              title="Reset Waktu Layar"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            <button
              onClick={isTimerRunning ? pauseSession : startSession}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-3 px-4 rounded-2xl text-xs font-bold transition-all active:scale-98 cursor-pointer border-0 ${
                isTimerRunning
                  ? 'bg-rose-550/20 hover:bg-rose-550/30 text-rose-300 border border-rose-500/20'
                  : 'bg-brand-primary hover:bg-brand-primary/95 text-brand-dark shadow-md'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Lanjutkan</span>
                </>
              )}
            </button>

            {totalElapsedSeconds >= limitSeconds && (
              <button
                onClick={onOpenReminder}
                className="p-3.5 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark rounded-2xl transition-all cursor-pointer shadow-md"
                title="Ambil Istirahat Sekarang"
              >
                <Coffee className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Timer;
