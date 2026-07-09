import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const AppDataContext = createContext(null);

// Utility to get date string YYYY-MM-DD
const getLocalDateString = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
};

export const AppDataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(0); // in seconds
  const [breakActivity, setBreakActivity] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Load logs for the current user
  useEffect(() => {
    if (!currentUser) {
      setLogs([]);
      setIsTimerRunning(false);
      setIsBreakActive(false);
      return;
    }

    const storageKey = `workwell_data_${currentUser.email}`;
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      setLogs(JSON.parse(savedData));
    } else {
      // Seed nice mock data for the last 6 days to show in charts immediately
      const seededLogs = [
        { date: getLocalDateString(6), screenTime: 240, waterIntake: 5, movement: 2, mood: 'normal' },
        { date: getLocalDateString(5), screenTime: 310, waterIntake: 6, movement: 3, mood: 'tired' },
        { date: getLocalDateString(4), screenTime: 180, waterIntake: 8, movement: 5, mood: 'happy' },
        { date: getLocalDateString(3), screenTime: 420, waterIntake: 4, movement: 1, mood: 'stress' },
        { date: getLocalDateString(2), screenTime: 290, waterIntake: 7, movement: 4, mood: 'happy' },
        { date: getLocalDateString(1), screenTime: 350, waterIntake: 6, movement: 3, mood: 'normal' },
        { date: getLocalDateString(0), screenTime: 0, waterIntake: 0, movement: 0, mood: 'normal' }
      ];
      setLogs(seededLogs);
      localStorage.setItem(storageKey, JSON.stringify(seededLogs));
    }
    
    // Start tracking when user is logged in
    setIsTimerRunning(true);
  }, [currentUser]);

  // Save logs to localStorage on changes
  useEffect(() => {
    if (currentUser && logs.length > 0) {
      const storageKey = `workwell_data_${currentUser.email}`;
      localStorage.setItem(storageKey, JSON.stringify(logs));
    }
  }, [logs, currentUser]);

  // Helper to get or create today's log entry
  const getTodayLog = () => {
    const todayStr = getLocalDateString(0);
    const todayLog = logs.find(log => log.date === todayStr);
    
    if (todayLog) return todayLog;

    // If today's log doesn't exist, create it and append
    const newLog = { date: todayStr, screenTime: 0, waterIntake: 0, movement: 0, mood: 'normal' };
    
    // Maintain max 14 days of logs
    setLogs(prev => {
      const filtered = prev.filter(log => {
        const diffTime = Math.abs(new Date(todayStr) - new Date(log.date));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 14;
      });
      if (filtered.some(l => l.date === todayStr)) return filtered;
      return [...filtered, newLog];
    });

    return newLog;
  };

  const updateTodayLog = (updates) => {
    const todayStr = getLocalDateString(0);
    setLogs(prev => {
      // Check if today exists
      const exists = prev.some(log => log.date === todayStr);
      if (!exists) {
        const newLog = { date: todayStr, screenTime: 0, waterIntake: 0, movement: 0, mood: 'normal', ...updates };
        return [...prev, newLog];
      }
      return prev.map(log => {
        if (log.date === todayStr) {
          return { ...log, ...updates };
        }
        return log;
      });
    });
  };

  const addWaterGlass = () => {
    const today = getTodayLog();
    updateTodayLog({ waterIntake: (today.waterIntake || 0) + 1 });
  };

  const addMovement = () => {
    const today = getTodayLog();
    updateTodayLog({ movement: (today.movement || 0) + 1 });
  };

  const setMood = (mood) => {
    updateTodayLog({ mood });
  };

  // Increment screen time in seconds
  const incrementScreenTime = (seconds) => {
    const today = getTodayLog();
    // Save screenTime in minutes, so we add fractional minutes
    const newMinutes = (today.screenTime || 0) + (seconds / 60);
    updateTodayLog({ screenTime: Math.round(newMinutes * 10) / 10 }); // round to 1 decimal place
  };

  // Screen time ticking effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isBreakActive && currentUser) {
      interval = setInterval(() => {
        incrementScreenTime(1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isBreakActive, currentUser, logs]);

  // Break countdown timer ticking effect
  useEffect(() => {
    let interval = null;
    if (isBreakActive && breakTimeRemaining > 0) {
      interval = setInterval(() => {
        setBreakTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBreakActive(false);
            setIsTimerRunning(true); // resume working timer
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

  const startBreak = (minutes, activity) => {
    setBreakActivity(activity);
    setBreakTimeRemaining(minutes * 60);
    setIsBreakActive(true);
    setIsTimerRunning(false); // stop counting screen time during break
  };

  const skipBreak = () => {
    setIsBreakActive(false);
    setIsTimerRunning(true);
    setBreakTimeRemaining(0);
  };

  const getWeeklyData = () => {
    // Return last 7 days of logs sorted chronologically
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = getLocalDateString(i);
      const log = logs.find(l => l.date === dateStr) || {
        date: dateStr,
        screenTime: 0,
        waterIntake: 0,
        movement: 0,
        mood: 'normal'
      };
      
      // Add day name formatted like "Mon", "Tue"
      const dateObj = new Date(dateStr);
      const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
      
      last7Days.push({
        ...log,
        day: dayName
      });
    }
    return last7Days;
  };

  // Return helper objects
  const todayData = logs.find(log => log.date === getLocalDateString(0)) || {
    screenTime: 0,
    waterIntake: 0,
    movement: 0,
    mood: 'normal'
  };

  return (
    <AppDataContext.Provider
      value={{
        todayData,
        logs,
        isBreakActive,
        breakTimeRemaining,
        breakActivity,
        isTimerRunning,
        setIsTimerRunning,
        addWaterGlass,
        addMovement,
        setMood,
        startBreak,
        skipBreak,
        getWeeklyData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
