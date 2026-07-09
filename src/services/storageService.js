// LocalStorage Database Abstraction Layer
// Mimics clean database operations for easy migration to a real REST API backend.

const KEYS = {
  USERS: 'workwell_db_users',
  SETTINGS: 'workwell_db_settings',
  SESSIONS: 'workwell_db_sessions',
  HABITS: 'workwell_db_habits',
  MOODS: 'workwell_db_moods'
};

const getCollection = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`Error loading database collection: ${key}`, e);
    return [];
  }
};

const saveCollection = (key, collection) => {
  try {
    localStorage.setItem(key, JSON.stringify(collection));
  } catch (e) {
    console.error(`Error writing database collection: ${key}`, e);
  }
};

export const storageService = {
  // Query collections
  query: (key, predicate = () => true) => {
    const collection = getCollection(key);
    return collection.filter(predicate);
  },

  // Find single item
  find: (key, predicate) => {
    const collection = getCollection(key);
    return collection.find(predicate) || null;
  },

  // Save (Create or Update) item
  save: (key, item) => {
    const collection = getCollection(key);
    
    // Auto-generate ID if missing
    if (!item.id) {
      item.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    const existingIndex = collection.findIndex(i => i.id === item.id);
    
    if (existingIndex > -1) {
      // Update
      collection[existingIndex] = { ...collection[existingIndex], ...item };
    } else {
      // Insert
      collection.push(item);
    }
    
    saveCollection(key, collection);
    return item;
  },

  // Delete item
  remove: (key, id) => {
    const collection = getCollection(key);
    const filtered = collection.filter(i => i.id !== id);
    saveCollection(key, filtered);
    return true;
  },

  // Keys constant exposure
  KEYS
};
