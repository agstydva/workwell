import React, { createContext, useState, useEffect } from 'react';
import { userService } from '../api/userService';
import { authStorage } from '../services/authStorage';
import { supabase } from '../lib/supabaseClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: map a Supabase user object to our localStorage profile format
  const mapSupabaseUser = (supabaseUser) => ({
    id: `google_${supabaseUser.id}`,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Google User',
    email: supabaseUser.email,
    profilePicture: supabaseUser.user_metadata?.avatar_url || '',
    status: '',
    provider: 'google',
    createdAt: supabaseUser.created_at
  });

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

    // Listen for Supabase OAuth redirect callback (Google Sign-In)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        const supabaseUser = session.user;
        const profile = mapSupabaseUser(supabaseUser);

        // Ensure settings exist for this Google user
        const settings = await userService.getSettings(profile.id);

        // Persist into localStorage so all existing features work
        authStorage.setToken(`Bearer supabase-jwt-${supabaseUser.id}`);
        authStorage.setUser(profile);

        setCurrentUser(profile);
        setUserSettings(settings);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const logout = async () => {
    // Sign out from Supabase session if it was a Google login
    await supabase.auth.signOut();
    authStorage.clearSession();
    setCurrentUser(null);
    setUserSettings(null);
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    if (error) throw error;
  };

  const updateProfileAndSettings = async (name, email, settingsData, profilePicture, status) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const updatedProfile = await userService.updateProfile(currentUser.id, name, email, profilePicture, status);
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
        loginWithGoogle,
        updateProfileAndSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
