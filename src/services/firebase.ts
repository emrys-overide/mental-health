import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { StreakData, UrgeIntensityLog } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without specifying firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Error handling as required by Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection on boot
export async function testFirestoreConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firestore] Connection successfully verified with Cloud Firestore');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is limited.');
    }
  }
}

// Google Sign-In with popup
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      await syncUserProfile(user);
    }
    return user;
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user') {
      console.log('Google sign-in popup closed by user');
      return null;
    }
    console.error('Google sign-in error:', error);
    throw error;
  }
}

// Sign out
export async function signOutUser(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Synchronize User Profile in /users/{userId}
export async function syncUserProfile(user: User): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userRef);
    const now = new Date().toISOString();

    if (!existing.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Overcomer',
        photoURL: user.photoURL || '',
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      });
    } else {
      await setDoc(userRef, {
        displayName: user.displayName || existing.data()?.displayName || 'Overcomer',
        photoURL: user.photoURL || existing.data()?.photoURL || '',
        updatedAt: now,
        lastLoginAt: now,
      }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Synchronize Recovery Streak to Cloud
export async function saveStreakToCloud(userId: string, data: StreakData): Promise<void> {
  const path = `users/${userId}/streak/data`;
  try {
    const streakRef = doc(db, 'users', userId, 'streak', 'data');
    await setDoc(streakRef, {
      userId,
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      totalVictories: data.totalVictories,
      startDate: data.startDate,
      lastLogDate: data.lastLogDate || '',
      updatedAt: new Date().toISOString(),
      history: data.history || {},
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch Recovery Streak from Cloud
export async function fetchStreakFromCloud(userId: string): Promise<StreakData | null> {
  const path = `users/${userId}/streak/data`;
  try {
    const streakRef = doc(db, 'users', userId, 'streak', 'data');
    const snapshot = await getDoc(streakRef);
    if (!snapshot.exists()) return null;
    const d = snapshot.data();
    return {
      currentStreak: d.currentStreak ?? 0,
      longestStreak: d.longestStreak ?? 0,
      totalVictories: d.totalVictories ?? 0,
      startDate: d.startDate ?? new Date().toISOString(),
      lastLogDate: d.lastLogDate ?? undefined,
      history: d.history ?? {},
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// Log Urge to Cloud
export async function saveUrgeLogToCloud(userId: string, log: UrgeIntensityLog): Promise<void> {
  const path = `users/${userId}/urge_logs/${log.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'urge_logs', log.id);
    await setDoc(docRef, {
      id: log.id,
      userId,
      timestamp: log.timestamp,
      intensity: log.intensity,
      need: log.need || '',
      action: log.action || '',
      dateStr: log.dateStr,
      timeStr: log.timeStr,
      completed60s: Boolean(log.completed60s),
      createdAt: new Date(log.timestamp).toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch Urge Logs from Cloud
export async function fetchUrgeLogsFromCloud(userId: string): Promise<UrgeIntensityLog[]> {
  const path = `users/${userId}/urge_logs`;
  try {
    const collRef = collection(db, 'users', userId, 'urge_logs');
    const q = query(collRef, orderBy('timestamp', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    const logs: UrgeIntensityLog[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      logs.push({
        id: d.id,
        timestamp: d.timestamp,
        dateStr: d.dateStr || '',
        timeStr: d.timeStr || '',
        intensity: d.intensity ?? 5,
        need: d.need || undefined,
        action: d.action || undefined,
        completed60s: Boolean(d.completed60s),
      });
    });
    return logs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
