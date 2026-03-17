// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  projectId: "studio-8681525382-3cf59",
  appId: "1:687090818085:web:50447d0d530ad8bdc1b3cc",
  apiKey: "AIzaSyDcC1MaXbpG20z7XZGD7FJMV8jd9oz2VyE",
  authDomain: "studio-8681525382-3cf59.firebaseapp.com",
  messagingSenderId: "687090818085"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  if (payload.notification) {
    const notificationTitle = payload.notification.title || 'VoidAnime';
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/next.svg',
      data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
