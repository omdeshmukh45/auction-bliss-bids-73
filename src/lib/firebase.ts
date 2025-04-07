
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  // IMPORTANT: Replace these values with your actual Firebase config from Firebase Console
  apiKey: process.env.VITE_FIREBASE_API_KEY || "your-api-key-from-firebase-console",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project-id.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project-id.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: process.env.VITE_FIREBASE_APP_ID || "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Check if we're in development mode and use emulators
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  console.log("Using Firebase emulators for development");
  // Uncomment these lines if you're using Firebase emulators locally
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFirestoreEmulator(db, "localhost", 8080);
}

// Log Firebase initialization
console.log("Firebase initialized with project:", firebaseConfig.projectId);
console.log("Authentication domain:", firebaseConfig.authDomain);

export default app;
