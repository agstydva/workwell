import { storageService } from '../services/storageService';

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

const getLocalDateString = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
};

// Seed mock habits for new users so the charts are not blank
const seedMockHabits = (userId) => {
  const seeds = [
    { date: getLocalDateString(6), waterIntake: 5, stretchingCount: 2, exerciseCount: 1 },
    { date: getLocalDateString(5), waterIntake: 6, stretchingCount: 3, exerciseCount: 0 },
    { date: getLocalDateString(4), waterIntake: 8, stretchingCount: 4, exerciseCount: 1 },
    { date: getLocalDateString(3), waterIntake: 4, stretchingCount: 1, exerciseCount: 0 },
    { date: getLocalDateString(2), waterIntake: 7, stretchingCount: 5, exerciseCount: 2 },
    { date: getLocalDateString(1), waterIntake: 6, stretchingCount: 3, exerciseCount: 1 },
  ];

  seeds.forEach(s => {
    storageService.save(storageService.KEYS.HABITS, {
      userId,
      date: s.date,
      waterIntake: s.waterIntake,
      stretchingCount: s.stretchingCount,
      exerciseCount: s.exerciseCount
    });
  });
};

export const habitService = {
  getHabitByDate: async (userId, date) => {
    await delay(100);
    


    let habit = storageService.find(storageService.KEYS.HABITS, h => h.userId === userId && h.date === date);
    
    if (!habit) {
      habit = storageService.save(storageService.KEYS.HABITS, {
        userId,
        date,
        waterIntake: 0,
        stretchingCount: 0,
        exerciseCount: 0
      });
    }

    return habit;
  },

  updateHabits: async (userId, date, habitData) => {
    await delay(150);
    let habit = storageService.find(storageService.KEYS.HABITS, h => h.userId === userId && h.date === date);
    
    if (!habit) {
      habit = {
        userId,
        date,
        waterIntake: 0,
        stretchingCount: 0,
        exerciseCount: 0
      };
    }

    const updated = storageService.save(storageService.KEYS.HABITS, {
      ...habit,
      ...habitData
    });

    return updated;
  },

  getWeeklyHabits: async (userId) => {
    await delay(200);
    


    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = getLocalDateString(i);
      let habit = storageService.find(storageService.KEYS.HABITS, h => h.userId === userId && h.date === dateStr);
      
      if (!habit) {
        // Init daily habit if missing
        habit = {
          userId,
          date: dateStr,
          waterIntake: 0,
          stretchingCount: 0,
          exerciseCount: 0
        };
      }
      
      const dateObj = new Date(dateStr);
      const dayName = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
      
      weeklyData.push({
        ...habit,
        day: dayName
      });
    }

    return weeklyData;
  }
};
