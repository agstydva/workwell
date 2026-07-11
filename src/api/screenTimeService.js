import { storageService } from '../services/storageService';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

const getLocalDateString = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
};

const seedMockSessions = (userId) => {
  const seeds = [
    { date: getLocalDateString(6), durationMinutes: 240 },
    { date: getLocalDateString(5), durationMinutes: 310 },
    { date: getLocalDateString(4), durationMinutes: 180 },
    { date: getLocalDateString(3), durationMinutes: 420 },
    { date: getLocalDateString(2), durationMinutes: 290 },
    { date: getLocalDateString(1), durationMinutes: 350 },
  ];

  seeds.forEach(s => {
    // Generate simulated sessions (e.g., 2 sessions per day)
    const midDuration = (s.durationMinutes * 60) / 2;
    
    // First session
    const firstStart = new Date(`${s.date}T09:00:00Z`);
    const firstEnd = new Date(firstStart.getTime() + midDuration * 1000);
    storageService.save(storageService.KEYS.SESSIONS, {
      userId,
      startTime: firstStart.toISOString(),
      endTime: firstEnd.toISOString(),
      duration: midDuration,
      date: s.date
    });

    // Second session
    const secondStart = new Date(`${s.date}T13:00:00Z`);
    const secondEnd = new Date(secondStart.getTime() + midDuration * 1000);
    storageService.save(storageService.KEYS.SESSIONS, {
      userId,
      startTime: secondStart.toISOString(),
      endTime: secondEnd.toISOString(),
      duration: midDuration,
      date: s.date
    });
  });
};

export const screenTimeService = {
  saveSession: async (userId, sessionData) => {
    await delay(100);
    const newSession = storageService.save(storageService.KEYS.SESSIONS, {
      userId,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      duration: sessionData.duration, // in seconds
      date: sessionData.date // YYYY-MM-DD
    });
    return newSession;
  },

  deleteSessionsByDate: async (userId, dateStr) => {
    await delay(100);
    const all = storageService.query(storageService.KEYS.SESSIONS);
    const filtered = all.filter(s => !(s.userId === userId && s.date === dateStr));
    localStorage.setItem(storageService.KEYS.SESSIONS, JSON.stringify(filtered));
    return true;
  },

  getWeeklySessions: async (userId) => {
    await delay(200);



    const weeklyStats = [];
    const allSessions = storageService.query(storageService.KEYS.SESSIONS, s => s.userId === userId);

    for (let i = 6; i >= 0; i--) {
      const dateStr = getLocalDateString(i);
      const daySessions = allSessions.filter(s => s.date === dateStr);
      
      // Sum duration in seconds and convert to minutes
      const totalSeconds = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const totalMinutes = Math.round((totalSeconds / 60) * 10) / 10;

      const dateObj = new Date(dateStr);
      const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });

      weeklyStats.push({
        date: dateStr,
        day: dayName,
        screenTime: totalMinutes
      });
    }

    return weeklyStats;
  }
};
