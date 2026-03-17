'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { PushNotificationHandler } from '@/components/PushNotificationHandler';

interface FirebaseWrapperProps {
  children: ReactNode;
}

export function FirebaseWrapper({ children }: FirebaseWrapperProps) {
  const firebaseServices = useMemo(() => {
    // This will only run on the client. On the server, initializeFirebase returns nulls.
    // useMemo with an empty dependency array ensures this is only called once.
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices?.firebaseApp ?? null}
      auth={firebaseServices?.auth ?? null}
      firestore={firebaseServices?.firestore ?? null}
      storage={firebaseServices?.storage ?? null}
      messaging={firebaseServices?.messaging ?? null}
    >
      <PushNotificationHandler />
      {children}
    </FirebaseProvider>
  );
}
