import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  testFirestoreConnection, 
  saveStreakToCloud, 
  fetchStreakFromCloud,
  saveUrgeLogToCloud,
  fetchUrgeLogsFromCloud
} from '../services/firebase';
import { getStreakData, saveStreakData } from '../utils/streakStorage';
import { getStoredUrgeLogs } from '../utils/urgeStorage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isCloudSynced: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  syncDataNow: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  useEffect(() => {
    // Validate Firestore connection on boot
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Automatically reconcile local & cloud data
        await reconcileUserData(currentUser.uid);
      } else {
        setIsCloudSynced(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const reconcileUserData = async (uid: string) => {
    try {
      setIsCloudSynced(false);
      const localStreak = getStreakData();
      const cloudStreak = await fetchStreakFromCloud(uid);

      if (cloudStreak) {
        // Take the richer/longer streak or merge histories
        const mergedHistory = { ...cloudStreak.history, ...localStreak.history };
        const mergedStreak = {
          currentStreak: Math.max(localStreak.currentStreak, cloudStreak.currentStreak),
          longestStreak: Math.max(localStreak.longestStreak, cloudStreak.longestStreak),
          totalVictories: Math.max(localStreak.totalVictories, cloudStreak.totalVictories),
          startDate: localStreak.startDate || cloudStreak.startDate,
          lastLogDate: localStreak.lastLogDate || cloudStreak.lastLogDate,
          history: mergedHistory,
        };
        saveStreakData(mergedStreak);
        await saveStreakToCloud(uid, mergedStreak);
      } else {
        // First cloud sync: push existing local streak up to Firestore
        await saveStreakToCloud(uid, localStreak);
      }

      // Also sync local urge logs to cloud
      const localUrgeLogs = getStoredUrgeLogs();
      if (localUrgeLogs.length > 0) {
        for (const log of localUrgeLogs.slice(0, 20)) {
          await saveUrgeLogToCloud(uid, log);
        }
      }

      setIsCloudSynced(true);
    } catch (err) {
      console.warn('Reconciling user data encountered a non-fatal sync issue:', err);
    }
  };

  const login = async () => {
    const loggedInUser = await signInWithGoogle();
    if (loggedInUser) {
      await reconcileUserData(loggedInUser.uid);
    }
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
    setIsCloudSynced(false);
  };

  const syncDataNow = async () => {
    if (!user) return;
    await reconcileUserData(user.uid);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isCloudSynced, login, logout, syncDataNow }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
