import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

let app;
let db: ReturnType<typeof getFirestore>;
let auth: ReturnType<typeof getAuth>;

export const initFirebase = async () => {
  if (getApps().length > 0) {
    app = getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    return { app, db, auth };
  }

  try {
    const res = await fetch('/firebase-applet-config.json');
    const config = await res.json();
    app = initializeApp(config);
    db = getFirestore(app);
    auth = getAuth(app);
    return { app, db, auth };
  } catch (error) {
    console.error('Failed to initialize Firebase', error);
    throw error;
  }
};

export const getFirebaseDb = () => db;
export const getFirebaseAuth = () => auth;
