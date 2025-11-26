// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC7RJi8op3pChPdepsHAZZpEdXenaiRg6Y",
  authDomain: "app1-7c511.firebaseapp.com",
  projectId: "app1-7c511",
  storageBucket: "app1-7c511.firebasestorage.app",
  messagingSenderId: "631550201880",
  appId: "1:631550201880:web:fa1930593c4315da4c736d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
