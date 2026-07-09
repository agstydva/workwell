// Authentication Session Storage Manager
// Decouples AuthContext from direct localStorage dependencies.
// Allows simple replacement with secure cookies, sessionStorage, or other storage drivers later.

const TOKEN_KEY = 'workwell_token';
const USER_KEY = 'workwell_user';

export const authStorage = {
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
export default authStorage;
