import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signInAnonymously,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc,
  getDocFromServer,
  collection,
  setDoc,
  updateDoc,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, UserRole, SubsidiaryCode } from '../types';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleAuthProvider = new GoogleAuthProvider();
// Workspace Scopes for Gmail and Google Chat
googleAuthProvider.addScope('https://mail.google.com/');
googleAuthProvider.addScope('https://www.googleapis.com/auth/gmail.compose');
googleAuthProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleAuthProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleAuthProvider.addScope('https://www.googleapis.com/auth/chat.messages');
googleAuthProvider.addScope('https://www.googleapis.com/auth/chat.messages.create');
googleAuthProvider.addScope('https://www.googleapis.com/auth/chat.spaces');
googleAuthProvider.addScope('https://www.googleapis.com/auth/chat.spaces.readonly');

// In-memory access token storage
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const DEFAULT_DEMO_PERSONAS: Array<{
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  designation: string;
  mineAssigned: string;
  subsidiary: SubsidiaryCode;
  badgeNumber: string;
  description: string;
}> = [
  {
    id: 'inspector_sirdar',
    email: 'inspector.sirdar@minesync.gov.in',
    displayName: 'Swagata Ghosh',
    role: 'MINING_SIRDAR',
    designation: 'Statutory Mining Sirdar & Overman (DGMS Cert #8821)',
    mineAssigned: 'Jharia Opencast Project Block-II',
    subsidiary: 'BCCL',
    badgeNumber: 'DGMS-SIRDAR-BCCL-8821',
    description: 'Field inspection specialist with mobile QR equipment scanning, gas monitoring, and Sirdar logbook clearance.'
  },
  {
    id: 'mine_manager',
    email: 'colliery.manager@minesync.gov.in',
    displayName: 'Aritra De',
    role: 'MINE_MANAGER',
    designation: 'Colliery Agent & Project Officer (First Class Manager Cert)',
    mineAssigned: 'Raniganj Underground Mine No. 4',
    subsidiary: 'ECL',
    badgeNumber: 'DGMS-MGR-ECL-0419',
    description: 'Colliery commanding officer with CAPA statutory sign-off, blast lockout protocols, and PDF Form IV generation authority.'
  },
  {
    id: 'dgms_auditor',
    email: 'dgms.director@minesync.gov.in',
    displayName: 'Ankita Roy',
    role: 'DGMS_INSPECTOR',
    designation: 'Director of Mines Safety (Zonal Regulatory Authority)',
    mineAssigned: 'All Pan-India Coalfields (Zonal Oversight)',
    subsidiary: 'CIL_HQ',
    badgeNumber: 'DGMS-DIR-HQ-0012',
    description: 'Statutory regulatory authority for non-conformance notices, CMR 2017 enforcement, and digital audit ledger validation.'
  },
  {
    id: 'safety_officer',
    email: 'safety.officer@minesync.gov.in',
    displayName: 'Swadhin Saha',
    role: 'SAFETY_OFFICER',
    designation: 'Senior Mine Safety & Rescue Team Lead',
    mineAssigned: 'Kusmunda Mega Opencast Project',
    subsidiary: 'SECL',
    badgeNumber: 'DGMS-SFT-SECL-5120',
    description: 'Hazard mitigation lead with real-time IoT methane/CO sensor radar, worker muster verification, and emergency dispatch.'
  }
];

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Fetch or initialize user profile document in Firestore
 */
export async function syncUserProfile(
  user: User, 
  extraData?: Partial<UserProfile>
): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', user.uid);
  
  try {
    const snap = await getDoc(userDocRef);
    const now = new Date().toISOString();
    
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      // Update lastLogin timestamp
      await updateDoc(userDocRef, {
        lastLoginAt: now,
        ...(extraData || {})
      });
      return {
        ...data,
        lastLoginAt: now,
        ...(extraData || {})
      };
    } else {
      // Determine default role based on email or extraData
      let defaultRole: UserRole = extraData?.role || 'MINING_SIRDAR';
      if (!extraData?.role) {
        if (user.email?.includes('manager')) defaultRole = 'MINE_MANAGER';
        else if (user.email?.includes('dgms') || user.email === 'rontysodepur@gmail.com') defaultRole = 'DGMS_INSPECTOR';
        else if (user.email?.includes('safety')) defaultRole = 'SAFETY_OFFICER';
      }

      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || `${user.uid.slice(0, 8)}@minesync.gov.in`,
        displayName: user.displayName || extraData?.displayName || (user.email ? user.email.split('@')[0] : 'Mining Officer'),
        role: defaultRole,
        designation: extraData?.designation || (defaultRole === 'MINE_MANAGER' ? 'Colliery Safety Manager' : defaultRole === 'DGMS_INSPECTOR' ? 'DGMS Regulatory Inspector' : 'Mining Sirdar & Field Inspector'),
        mineAssigned: extraData?.mineAssigned || 'Jharia Opencast Project Block-II',
        subsidiary: extraData?.subsidiary || 'BCCL',
        badgeNumber: extraData?.badgeNumber || `DGMS-${Math.floor(1000 + Math.random() * 9000)}`,
        photoURL: user.photoURL || undefined,
        lastLoginAt: now,
        createdAt: now,
        ...extraData
      };

      await setDoc(userDocRef, newProfile);
      return newProfile;
    }
  } catch (error) {
    console.warn('Firestore user profile sync fallback (local state preserved):', error);
    // Provide robust fallback profile
    const now = new Date().toISOString();
    return {
      uid: user.uid,
      email: user.email || 'officer@minesync.gov.in',
      displayName: user.displayName || 'Authorized Mining Officer',
      role: extraData?.role || 'DGMS_INSPECTOR',
      designation: extraData?.designation || 'Colliery Compliance Officer',
      mineAssigned: extraData?.mineAssigned || 'Jharia Opencast Project Block-II',
      subsidiary: extraData?.subsidiary || 'BCCL',
      badgeNumber: extraData?.badgeNumber || 'DGMS-OFFICER-LIVE',
      lastLoginAt: now,
      createdAt: now,
      ...extraData
    };
  }
}

/**
 * Sign In with Email & Password
 */
export async function loginWithEmailPassword(email: string, password: string): Promise<{ user: User; profile: UserProfile }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const profile = await syncUserProfile(cred.user);
    return { user: cred.user, profile };
  } catch (err: any) {
    console.error('Email sign-in error:', err);
    throw new Error(formatAuthError(err));
  }
}

/**
 * Register / Create New Account with Email & Password and Mining Role
 */
export async function registerWithEmailPassword(
  email: string, 
  password: string, 
  displayName: string,
  role: UserRole,
  designation: string,
  mineAssigned: string,
  subsidiary: SubsidiaryCode,
  badgeNumber?: string
): Promise<{ user: User; profile: UserProfile }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    const profile = await syncUserProfile(cred.user, {
      displayName,
      role,
      designation,
      mineAssigned,
      subsidiary,
      badgeNumber: badgeNumber || `DGMS-${Math.floor(1000 + Math.random() * 9000)}`,
      isCustomAccount: true
    });

    return { user: cred.user, profile };
  } catch (err: any) {
    console.error('Registration error:', err);
    throw new Error(formatAuthError(err));
  }
}

/**
 * Sign in using Google Workspace OAuth popup
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string; profile: UserProfile } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleAuthProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      console.warn('Google Access Token not present in popup credential; using user credential');
    }
    cachedAccessToken = credential?.accessToken || null;
    const profile = await syncUserProfile(result.user, {
      role: result.user.email === 'rontysodepur@gmail.com' ? 'DGMS_INSPECTOR' : undefined
    });
    return { user: result.user, accessToken: cachedAccessToken || '', profile };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw new Error(formatAuthError(error));
  } finally {
    isSigningIn = false;
  }
};

/**
 * Quick Instant Login with Pre-Configured Mining Persona
 */
export async function loginAsMiningPersona(personaId: string): Promise<{ user: User | null; profile: UserProfile }> {
  const persona = DEFAULT_DEMO_PERSONAS.find(p => p.id === personaId) || DEFAULT_DEMO_PERSONAS[0];
  const testPassword = 'Password@1234';

  try {
    // Attempt standard email sign in
    const cred = await signInWithEmailAndPassword(auth, persona.email, testPassword);
    const profile = await syncUserProfile(cred.user, {
      displayName: persona.displayName,
      role: persona.role,
      designation: persona.designation,
      mineAssigned: persona.mineAssigned,
      subsidiary: persona.subsidiary,
      badgeNumber: persona.badgeNumber
    });
    return { user: cred.user, profile };
  } catch (signInErr: any) {
    // If account doesn't exist yet in this project, create it
    if (signInErr?.code === 'auth/user-not-found' || signInErr?.code === 'auth/invalid-credential') {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, persona.email, testPassword);
        await updateProfile(newCred.user, { displayName: persona.displayName });
        const profile = await syncUserProfile(newCred.user, {
          displayName: persona.displayName,
          role: persona.role,
          designation: persona.designation,
          mineAssigned: persona.mineAssigned,
          subsidiary: persona.subsidiary,
          badgeNumber: persona.badgeNumber
        });
        return { user: newCred.user, profile };
      } catch (createErr) {
        console.warn('Could not create persona via password, signing in anonymously as fallback:', createErr);
      }
    }

    // Anonymous sign-in fallback if email auth is disabled or restricted
    try {
      const anonCred = await signInAnonymously(auth);
      const profile = await syncUserProfile(anonCred.user, {
        displayName: persona.displayName,
        email: persona.email,
        role: persona.role,
        designation: persona.designation,
        mineAssigned: persona.mineAssigned,
        subsidiary: persona.subsidiary,
        badgeNumber: persona.badgeNumber
      });
      return { user: anonCred.user, profile };
    } catch (anonErr) {
      console.warn('Anonymous sign-in fallback, returning simulated persona:', anonErr);
      const now = new Date().toISOString();
      return {
        user: null,
        profile: {
          uid: `simulated_${persona.id}`,
          email: persona.email,
          displayName: persona.displayName,
          role: persona.role,
          designation: persona.designation,
          mineAssigned: persona.mineAssigned,
          subsidiary: persona.subsidiary,
          badgeNumber: persona.badgeNumber,
          lastLoginAt: now,
          createdAt: now
        }
      };
    }
  }
}

/**
 * Send Password Reset Email
 */
export async function sendResetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (err: any) {
    throw new Error(formatAuthError(err));
  }
}

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logOutUser = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Validate Firestore connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode or waiting for connection.');
    }
    return false;
  }
}

function formatAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred during authentication.';
  const code = error.code || '';
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email address or password. Please verify your statutory credentials.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Security Requirement: Password must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid official email address (e.g. officer@minesync.gov.in).';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completion. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by the browser. Please allow popups or use Email/Password sign-in.';
    case 'auth/network-request-failed':
      return 'Network connection error. Operating in offline statutory mode.';
    default:
      return error.message || 'Authentication failed. Please verify your network and credentials.';
  }
}
