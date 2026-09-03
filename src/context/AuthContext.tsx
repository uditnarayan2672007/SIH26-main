import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  loginWithEmailPassword as fbLogin, 
  registerWithEmailPassword as fbRegister, 
  googleSignIn as fbGoogleLogin,
  loginAsMiningPersona as fbPersonaLogin,
  logOutUser as fbLogout,
  syncUserProfile,
  sendResetPassword as fbResetPassword,
  DEFAULT_DEMO_PERSONAS
} from '../lib/firebase';
import { UserProfile, UserRole, SubsidiaryCode } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  loginEmail: (email: string, pass: string) => Promise<void>;
  registerEmail: (
    email: string, 
    pass: string, 
    displayName: string, 
    role: UserRole,
    designation: string,
    mineAssigned: string,
    subsidiary: SubsidiaryCode,
    badgeNumber?: string
  ) => Promise<void>;
  loginGoogle: () => Promise<void>;
  loginPersona: (personaId: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateCurrentProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          setUser(fbUser);
          const userProfile = await syncUserProfile(fbUser);
          setProfile(userProfile);
        } else {
          setUser(null);
          // Check if there was a saved simulated persona in localStorage
          const savedPersona = localStorage.getItem('minesync_saved_persona');
          if (savedPersona) {
            try {
              const parsed = JSON.parse(savedPersona);
              setProfile(parsed);
            } catch {
              setProfile(null);
            }
          } else {
            setProfile(null);
          }
        }
      } catch (err) {
        console.error('Auth state initialization error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginEmail = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const { user: loggedUser, profile: loggedProfile } = await fbLogin(email, pass);
      setUser(loggedUser);
      setProfile(loggedProfile);
      localStorage.removeItem('minesync_saved_persona');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerEmail = async (
    email: string, 
    pass: string, 
    displayName: string, 
    role: UserRole,
    designation: string,
    mineAssigned: string,
    subsidiary: SubsidiaryCode,
    badgeNumber?: string
  ) => {
    setError(null);
    setLoading(true);
    try {
      const { user: registeredUser, profile: registeredProfile } = await fbRegister(
        email, 
        pass, 
        displayName, 
        role, 
        designation, 
        mineAssigned, 
        subsidiary, 
        badgeNumber
      );
      setUser(registeredUser);
      setProfile(registeredProfile);
      localStorage.removeItem('minesync_saved_persona');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fbGoogleLogin();
      if (res) {
        setUser(res.user);
        setProfile(res.profile);
        localStorage.removeItem('minesync_saved_persona');
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.message?.includes('popup-closed-by-user')) {
        setError(null); // Ignore popup closed by user
      } else {
        setError(err.message || 'Google Sign-In failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginPersona = async (personaId: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fbPersonaLogin(personaId);
      if (res.user) {
        setUser(res.user);
      }
      setProfile(res.profile);
      localStorage.setItem('minesync_saved_persona', JSON.stringify(res.profile));
    } catch (err: any) {
      setError(err.message || 'Persona switch failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await fbLogout();
      setUser(null);
      setProfile(null);
      localStorage.removeItem('minesync_saved_persona');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await fbResetPassword(email);
    } catch (err: any) {
      setError(err.message || 'Password reset request failed');
      throw err;
    }
  };

  const updateCurrentProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    try {
      if (user) {
        const updated = await syncUserProfile(user, updates);
        setProfile(updated);
      } else {
        const updated = { ...profile, ...updates };
        setProfile(updated);
        localStorage.setItem('minesync_saved_persona', JSON.stringify(updated));
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        setError,
        loginEmail,
        registerEmail,
        loginGoogle,
        loginPersona,
        logout,
        resetPassword,
        updateCurrentProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
