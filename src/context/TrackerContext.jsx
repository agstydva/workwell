import React, { createContext, useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { habitService } from '../api/habitService';
import { screenTimeService } from '../api/screenTimeService';
import { moodService } from '../api/moodService';
import { storageService } from '../services/storageService';

export const TrackerContext = createContext(null);

const getLocalDateString = () => new Date().toLocaleDateString('sv-SE');

export const TrackerProvider = ({ children }) => {
  const { currentUser, userSettings } = useAuth();
  
  // Daily and weekly states
  const [todayHabit, setTodayHabit] = useState(null);
  const [todayMood, setTodayMood] = useState(null);
  const [todaySessions, setTodaySessions] = useState([]);
  
  // Weekly analytics data
  const [weeklyHabits, setWeeklyHabits] = useState([]);
  const [weeklySessions, setWeeklySessions] = useState([]);
  const [weeklyMoods, setWeeklyMoods] = useState([]);

  // Active Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0); // in seconds
  const sessionStartRef = useRef(null);

  // Break state
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0); // in seconds
  const [breakActivity, setBreakActivity] = useState('');

  const [loading, setLoading] = useState(false);

  // Fetch all user tracker data
  const fetchTrackerData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const todayStr = getLocalDateString();
      
      const habit = await habitService.getHabitByDate(currentUser.id, todayStr);
      const mood = await moodService.getMoodByDate(currentUser.id, todayStr);
      
      const habitsHist = await habitService.getWeeklyHabits(currentUser.id);
      const sessionsHist = await screenTimeService.getWeeklySessions(currentUser.id);
      const moodsHist = await moodService.getWeeklyMoods(currentUser.id);

      setTodayHabit(habit);
      setTodayMood(mood);
      setWeeklyHabits(habitsHist);
      setWeeklySessions(sessionsHist);
      setWeeklyMoods(moodsHist);
    } catch (err) {
      console.error('Error fetching tracker data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reload data when user changes
  useEffect(() => {
    if (currentUser) {
      fetchTrackerData();
      setIsTimerRunning(false); // Wait for explicit start
      sessionStartRef.current = null;
    } else {
      // Clear states on logout
      setTodayHabit(null);
      setTodayMood(null);
      setWeeklyHabits([]);
      setWeeklySessions([]);
      setWeeklyMoods([]);
      setIsTimerRunning(false);
      setSessionDuration(0);
      setIsBreakActive(false);
    }
  }, [currentUser]);

  // Active Session ticking logic
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isBreakActive && currentUser) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isBreakActive, currentUser]);

  // Break Countdown ticking logic
  useEffect(() => {
    let interval = null;
    if (isBreakActive && breakTimeRemaining > 0) {
      interval = setInterval(() => {
        setBreakTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBreakActive(false);
            setIsTimerRunning(true);
            sessionStartRef.current = new Date();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreakActive, breakTimeRemaining]);

  // Helper to commit current session to DB
  const commitSession = async () => {
    if (!currentUser || sessionDuration === 0) return;
    
    const startTime = sessionStartRef.current 
      ? sessionStartRef.current.toISOString() 
      : new Date(Date.now() - sessionDuration * 1000).toISOString();
    
    const endTime = new Date().toISOString();
    
    try {
      await screenTimeService.saveSession(currentUser.id, {
        startTime,
        endTime,
        duration: sessionDuration, // in seconds
        date: getLocalDateString()
      });
      
      // Reset elapsed session timer
      setSessionDuration(0);
      sessionStartRef.current = isTimerRunning ? new Date() : null;

      // Refresh stats
      const sessionsHist = await screenTimeService.getWeeklySessions(currentUser.id);
      setWeeklySessions(sessionsHist);
    } catch (err) {
      console.error('Failed to commit screen session:', err);
    }
  };

  // Timer actions
  const startSession = () => {
    if (isTimerRunning) return;
    sessionStartRef.current = new Date();
    setIsTimerRunning(true);
  };

  const pauseSession = async () => {
    if (!isTimerRunning) return;
    setIsTimerRunning(false);
    await commitSession();
  };

  const resetSession = async () => {
    setIsTimerRunning(false);
    setSessionDuration(0);
    sessionStartRef.current = null;
    
    if (currentUser) {
      try {
        await screenTimeService.deleteSessionsByDate(currentUser.id, getLocalDateString());
        const sessionsHist = await screenTimeService.getWeeklySessions(currentUser.id);
        setWeeklySessions(sessionsHist);
      } catch (err) {
        console.error('Failed to reset screen session:', err);
      }
    }
  };

  // Habit operations
  const addWater = async () => {
    if (!currentUser || !todayHabit) return;
    try {
      const updated = await habitService.updateHabits(currentUser.id, getLocalDateString(), {
        waterIntake: (todayHabit.waterIntake || 0) + 1
      });
      setTodayHabit(updated);
      
      // Refresh chart data
      const habitsHist = await habitService.getWeeklyHabits(currentUser.id);
      setWeeklyHabits(habitsHist);
    } catch (err) {
      console.error('Failed to add water intake:', err);
    }
  };

  const addStretch = async () => {
    if (!currentUser || !todayHabit) return;
    try {
      const updated = await habitService.updateHabits(currentUser.id, getLocalDateString(), {
        stretchingCount: (todayHabit.stretchingCount || 0) + 1
      });
      setTodayHabit(updated);
      const habitsHist = await habitService.getWeeklyHabits(currentUser.id);
      setWeeklyHabits(habitsHist);
    } catch (err) {
      console.error('Failed to log stretching:', err);
    }
  };

  const addExercise = async () => {
    if (!currentUser || !todayHabit) return;
    try {
      const updated = await habitService.updateHabits(currentUser.id, getLocalDateString(), {
        exerciseCount: (todayHabit.exerciseCount || 0) + 1
      });
      setTodayHabit(updated);
      const habitsHist = await habitService.getWeeklyHabits(currentUser.id);
      setWeeklyHabits(habitsHist);
    } catch (err) {
      console.error('Failed to log exercise:', err);
    }
  };

  // Mood operations
  const logMood = async (mood) => {
    if (!currentUser) return;
    try {
      const updated = await moodService.saveMood(currentUser.id, getLocalDateString(), mood);
      setTodayMood(updated);
      const moodsHist = await moodService.getWeeklyMoods(currentUser.id);
      setWeeklyMoods(moodsHist);
    } catch (err) {
      console.error('Failed to save mood log:', err);
    }
  };

  // Break operations
  const startBreak = async (minutes, activity) => {
    // Automatically save work session before going to break
    await commitSession();
    
    setBreakActivity(activity);
    setBreakTimeRemaining(minutes * 60);
    setIsBreakActive(true);
    setIsTimerRunning(false);
  };

  const skipBreak = () => {
    setIsBreakActive(false);
    setBreakTimeRemaining(0);
    setIsTimerRunning(true);
    sessionStartRef.current = new Date();
  };

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isTimerRunning && sessionDuration > 0) {
        // Sync save to storage on exit
        const startTime = sessionStartRef.current ? sessionStartRef.current.toISOString() : new Date().toISOString();
        const endTime = new Date().toISOString();
        
        // Use synchronous storageService save to ensure write completes
        storageService.save(storageService.KEYS.SESSIONS, {
          userId: currentUser.id,
          startTime,
          endTime,
          duration: sessionDuration,
          date: getLocalDateString()
        });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isTimerRunning, sessionDuration, currentUser]);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <TrackerContext.Provider
      value={{
        todayHabit,
        todayMood,
        weeklyHabits,
        weeklySessions,
        weeklyMoods,
        isTimerRunning,
        sessionDuration,
        isBreakActive,
        breakTimeRemaining,
        breakActivity,
        loading,
        startSession,
        pauseSession,
        resetSession,
        commitSession,
        addWater,
        addStretch,
        addExercise,
        logMood,
        startBreak,
        skipBreak,
        fetchTrackerData,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};
