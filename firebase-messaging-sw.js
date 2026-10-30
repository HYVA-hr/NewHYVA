importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAw8NhVWaoMbm-CiED4M_K02wOSRtV2LUc",
    authDomain: "hire-your-va-hr.firebaseapp.com",
    projectId: "hire-your-va-hr",
    storageBucket: "hire-your-va-hr.firebasestorage.app",
    messagingSenderId: "75356368308",
    appId: "1:75356368308:web:be5c4cfaa62c72efced6e1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    const notificationTitle = payload.notification.title || "Notification";
    const notificationOptions = {
        body: payload.notification.body || "New alert received.",
        icon: 'logo.png',
        badge: 'logo.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
