'use client';
import { useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { getToken, isSupported } from 'firebase/messaging';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export function PushNotificationHandler() {
    const { messaging, firebaseApp } = useFirebase();

    useEffect(() => {
        // We check isSupported first because even if messaging sdk is loaded, 
        // the browser might not support the underlying APIs.
        const requestPermissionAndToken = async () => {
            if (!firebaseApp || !VAPID_KEY) return;
            
            try {
                const supported = await isSupported();
                if (!supported) {
                    console.log('Firebase Messaging is not supported in this browser.');
                    return;
                }

                // If messaging is not yet initialized in the provider, we don't proceed yet.
                // The provider will re-render once it's initialized.
                if (!messaging) return;

                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
                    console.log('FCM Token:', token);
                } else {
                    console.log('Unable to get permission to notify.');
                }
            } catch (err) {
                // If it's the unsupported-browser error, we ignore it or log it quietly.
                if (err instanceof Error && err.message.includes('messaging/unsupported-browser')) {
                    console.log('Push notifications ignored: browser not supported.');
                } else {
                    console.error('An error occurred while retrieving token. ', err);
                }
            }
        };

        requestPermissionAndToken();

    }, [messaging, firebaseApp]);

    return null;
}
