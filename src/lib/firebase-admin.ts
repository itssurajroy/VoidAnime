import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

let isInitialized = false;
let adminApp: App | null = null;

if (!getApps().length) {
  try {
    const clientEmail = process.env.NEXT_FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.NEXT_FIREBASE_PRIVATE_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (clientEmail && privateKey && projectId) {
      adminApp = initializeApp({
        credential: cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      isInitialized = true;
    } else {
      console.warn('Firebase Admin credentials not fully configured in environment variables');
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
} else {
  adminApp = getApps()[0];
  isInitialized = true;
}

export const db: Firestore | null = isInitialized ? getFirestore() : null;
export const auth: Auth | null = isInitialized ? getAuth() : null;
export const adminStorage: Storage | null = isInitialized ? getStorage() : null;

export default adminApp;
