// config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCGX106v2W1lOFeci20qwBHZ01QdM3cUvU",
  authDomain: "app1-f13f3.firebaseapp.com",
  projectId: "app1-f13f3",
  storageBucket: "app1-f13f3.appspot.com",
  messagingSenderId: "748866308046",
  appId: "1:748866308046:web:fb00b79b0d11bcf7d68d9f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
