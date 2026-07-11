import { storageService } from '../services/storageService';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

const getLocalDateString = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
};

const moodToStressMap = {
  happy: 'Low Stress',
  normal: 'Low Stress',
  tired: 'Medium Stress',
  stress: 'High Stress'
};

const seedMockMoods = (userId) => {
  const seeds = [
    { date: getLocalDateString(6), mood: 'normal' },
    { date: getLocalDateString(5), mood: 'tired' },
    { date: getLocalDateString(4), mood: 'happy' },
    { date: getLocalDateString(3), mood: 'stress' },
    { date: getLocalDateString(2), mood: 'happy' },
    { date: getLocalDateString(1), mood: 'normal' }
  ];

  seeds.forEach(s => {
    storageService.save(storageService.KEYS.MOODS, {
      userId,
      date: s.date,
      mood: s.mood,
      stressLevel: moodToStressMap[s.mood] || 'Low Stress'
    });
  });
};

export const moodService = {
  getMoodByDate: async (userId, date) => {
    await delay(100);



    let moodRecord = storageService.find(storageService.KEYS.MOODS, m => m.userId === userId && m.date === date);

    return moodRecord;
  },

  saveMood: async (userId, date, mood) => {
    await delay(150);
    const stressLevel = moodToStressMap[mood] || 'Low Stress';
    
    let moodRecord = storageService.find(storageService.KEYS.MOODS, m => m.userId === userId && m.date === date);
    if (!moodRecord) {
      moodRecord = {
        userId,
        date,
        mood: 'normal',
        stressLevel: 'Low Stress'
      };
    }

    const updated = storageService.save(storageService.KEYS.MOODS, {
      ...moodRecord,
      mood,
      stressLevel
    });

    return updated;
  },

  getWeeklyMoods: async (userId) => {
    await delay(200);



    const weeklyMoods = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = getLocalDateString(i);
      let moodRecord = storageService.find(storageService.KEYS.MOODS, m => m.userId === userId && m.date === dateStr);

      if (!moodRecord) {
        moodRecord = {
          userId,
          date: dateStr,
          mood: null,
          stressLevel: 'Belum diisi'
        };
      }

      const dateObj = new Date(dateStr);
      const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });

      weeklyMoods.push({
        ...moodRecord,
        day: dayName
      });
    }

    return weeklyMoods;
  }
};
