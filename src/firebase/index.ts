'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore, 
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore
} from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { getMessaging, Messaging, isSupported } from 'firebase/messaging'
import { logger } from '@/lib/logger';

interface FirebaseSdks {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
  messaging: Messaging | null;
}

let cachedServices: FirebaseSdks | null = null;
let messagingInitialized = false;

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase(): FirebaseSdks | { firebaseApp: null; auth: null; firestore: null; storage: null; messaging: null } {
  if (typeof window === 'undefined') {
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
      storage: null,
      messaging: null
    };
  }

  if (cachedServices) {
    return cachedServices;
  }

  const apps = getApps();
  let firebaseApp: FirebaseApp;

  if (!apps.length) {
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      logger.error('Firebase initialization failed.', e);
      firebaseApp = getApp();
    }
  } else {
    firebaseApp = getApp();
  }

  // Firestore initialization
  let firestore: Firestore;
  try {
    // try to get existing firestore instance first
    firestore = getFirestore(firebaseApp);
  } catch (e) {
    // If it doesn't exist, initialize it with custom settings
    try {
      firestore = initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        }),
      });
    } catch (innerError) {
      // Fallback to basic getFirestore if both fail
      firestore = getFirestore(firebaseApp);
    }
  }

  // Messaging is handled asynchronously in components that need it
  // to avoid blocking or throwing errors in unsupported environments.
  let messaging: Messaging | null = null;
  if (!messagingInitialized) {
    isSupported().then(supported => {
      if (supported) {
        try {
          messaging = getMessaging(firebaseApp);
          if (cachedServices) cachedServices.messaging = messaging;
        } catch (e) {
          logger.warn('Messaging support check passed but initialization failed:', e);
        }
      }
      messagingInitialized = true;
    }).catch(() => {
      messagingInitialized = true;
    });
  }

  cachedServices = {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore,
    storage: getStorage(firebaseApp),
    messaging
  };

  return cachedServices;
}

export function getSdks(firebaseApp: FirebaseApp): FirebaseSdks {
  // This is now primarily a wrapper around initializeFirebase or returns existing services
  const services = initializeFirebase();
  if (!services.firebaseApp) {
    // Fallback for SSR/Unexpected calls
    return {
      firebaseApp,
      auth: getAuth(firebaseApp),
      firestore: getFirestore(firebaseApp),
      storage: getStorage(firebaseApp),
      messaging: null
    };
  }
  return services as FirebaseSdks;
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
