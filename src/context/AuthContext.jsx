import React, { createContext, useState, useEffect } from 'react';
import { userService } from '../api/userService';
import { authStorage } from '../services/authStorage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authStorage.getToken();
        const savedUser = authStorage.getUser();
        
        if (token && savedUser) {
          setCurrentUser(savedUser);
          
          // Fetch settings from API
          const settings = await userService.getSettings(savedUser.id);
          setUserSettings(settings);
        }
      } catch (err) {
        console.error('Failed to initialize auth from storage', err);
        authStorage.clearSession();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const profile = await userService.login(email, password);
      const settings = await userService.getSettings(profile.id);
      
      // Store mock token and user details to prepare for JWT replacement
      authStorage.setToken(`Bearer mock-jwt-token-hash-for-${profile.id}`);
      authStorage.setUser(profile);
      
      setCurrentUser(profile);
      setUserSettings(settings);
      return profile;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const profile = await userService.register(name, email, password);
      const settings = await userService.getSettings(profile.id);
      
      // Store mock token and user details
      authStorage.setToken(`Bearer mock-jwt-token-hash-for-${profile.id}`);
      authStorage.setUser(profile);
      
      setCurrentUser(profile);
      setUserSettings(settings);
      return profile;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authStorage.clearSession();
    setCurrentUser(null);
    setUserSettings(null);
  };

  const updateProfileAndSettings = async (name, email, settingsData) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const updatedProfile = await userService.updateProfile(currentUser.id, name, email);
      const updatedSettings = await userService.updateSettings(currentUser.id, settingsData);
      
      authStorage.setUser(updatedProfile);
      setCurrentUser(updatedProfile);
      setUserSettings(updatedSettings);
      return { profile: updatedProfile, settings: updatedSettings };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userSettings,
        loading,
        login,
        register,
        logout,
        updateProfileAndSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
