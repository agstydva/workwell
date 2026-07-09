import { storageService } from '../services/storageService';

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  register: async (name, email, password) => {
    await delay(300);
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check duplicate
    const existing = storageService.find(storageService.KEYS.USERS, u => u.email === trimmedEmail);
    if (existing) {
      throw new Error('Email sudah terdaftar!');
    }

    // Save user
    const newUser = storageService.save(storageService.KEYS.USERS, {
      name,
      email: trimmedEmail,
      password, // In production, this would be hashed on server side
      createdAt: new Date().toISOString()
    });

    // Save default settings
    storageService.save(storageService.KEYS.SETTINGS, {
      userId: newUser.id,
      screenLimit: 60, // in minutes
      breakDuration: 5 // in minutes
    });

    // Remove password from returned profile
    const { password: _, ...profile } = newUser;
    return profile;
  },

  login: async (email, password) => {
    await delay(300);
    const trimmedEmail = email.trim().toLowerCase();

    const user = storageService.find(storageService.KEYS.USERS, u => u.email === trimmedEmail);
    if (!user || user.password !== password) {
      throw new Error('Email atau kata sandi tidak valid!');
    }

    const { password: _, ...profile } = user;
    return profile;
  },

  updateProfile: async (userId, name, email) => {
    await delay(200);
    const trimmedEmail = email.trim().toLowerCase();

    // Check email uniqueness if email has changed
    const user = storageService.find(storageService.KEYS.USERS, u => u.id === userId);
    if (!user) {
      throw new Error('Pengguna tidak ditemukan!');
    }

    if (trimmedEmail !== user.email) {
      const conflict = storageService.find(storageService.KEYS.USERS, u => u.email === trimmedEmail);
      if (conflict) {
        throw new Error('Email sudah digunakan oleh akun lain!');
      }
    }

    const updated = storageService.save(storageService.KEYS.USERS, {
      ...user,
      name,
      email: trimmedEmail
    });

    const { password: _, ...profile } = updated;
    return profile;
  },

  getSettings: async (userId) => {
    await delay(100);
    let settings = storageService.find(storageService.KEYS.SETTINGS, s => s.userId === userId);
    
    // Auto-create default settings if missing for any reason
    if (!settings) {
      settings = storageService.save(storageService.KEYS.SETTINGS, {
        userId,
        screenLimit: 60,
        breakDuration: 5
      });
    }
    
    return settings;
  },

  updateSettings: async (userId, settingsData) => {
    await delay(200);
    const settings = storageService.find(storageService.KEYS.SETTINGS, s => s.userId === userId);
    if (!settings) {
      throw new Error('Pengaturan tidak ditemukan!');
    }

    const updated = storageService.save(storageService.KEYS.SETTINGS, {
      ...settings,
      ...settingsData
    });

    return updated;
  }
};
