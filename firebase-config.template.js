// ================================
// Firebase Configuration TEMPLATE
// ================================
//
// This is a template file - safe to commit to GitHub
//
// SETUP:
// 1. Copy this file and rename to: firebase-config.js
// 2. Replace all placeholder values with your actual Firebase config
// 3. DO NOT commit firebase-config.js (it's in .gitignore)
//
// Get your config from:
// Firebase Console → Project Settings → General → Your apps → Web app
// ================================

const firebaseConfig = {
  apiKey: "AIzaSy_REPLACE_WITH_YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Wait for Firebase SDK to load before initializing
function initializeFirebaseApp() {
  // Check if Firebase SDK is loaded
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK not loaded! Check CDN links.');
    setTimeout(initializeFirebaseApp, 100);
    return;
  }

  try {
    // Initialize Firebase
    if (firebase.apps.length === 0) {
      firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized successfully');
      console.log('📦 Project:', firebaseConfig.projectId);
    } else {
      console.log('✅ Firebase app already initialized');
    }

    // Initialize Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();

    console.log('✅ Firebase services ready');

    // Enable offline persistence for Firestore
    db.enablePersistence()
      .then(() => {
        console.log('✅ Offline persistence enabled');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('⚠️ The current browser does not support persistence.');
        }
      });

    // Export for use in other scripts
    window.firebaseApp = {
      auth,
      db,
      storage,
      config: firebaseConfig
    };

    console.log('🚀 Firebase configuration complete!');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    alert('⚠️ Firebase Configuration Error!\n\n' + error.message + '\n\nPlease check:\n1. Firebase credentials are correct\n2. Internet connection is active\n3. Browser console for details');
  }
}

// Start initialization
initializeFirebaseApp();