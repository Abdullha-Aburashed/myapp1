// MyContext.js
import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';

import {
  collection,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';

export const MyContext = createContext();

const todayISO = () => new Date().toISOString().slice(0, 10);

export const MyContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 120,
    carbs: 250,
    fats: 65,
  });

  // each entry is stored like Firestore docs
  const [foodLog, setFoodLog] = useState([]);

  // profile photo local URI (also saved in Firestore)
  const [profilePhoto, setProfilePhoto] = useState(null);

  // 1) listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  // 2) when user changes, set up Firestore listeners for user doc & food logs
  useEffect(() => {
    if (!user) {
      setFoodLog([]);
      setProfilePhoto(null);
      return;
    }

    const uid = user.uid;

    // ensure user document exists / update basic fields
    const userDocRef = doc(db, 'users', uid);
    setDoc(
      userDocRef,
      {
        email: user.email || '',
        displayName: user.displayName || '',
      },
      { merge: true }
    );

    // listen to user document (goals + profilePhoto)
    const unsubUser = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.goals) setGoals(data.goals);
        if (data.profilePhoto) setProfilePhoto(data.profilePhoto);
      }
    });

    // listen to food logs subcollection
    const foodColRef = collection(db, 'users', uid, 'foodLogs');
    const unsubFood = onSnapshot(foodColRef, (querySnap) => {
      const items = [];
      querySnap.forEach((d) => {
        items.push({ id: d.id, ...d.data() });
      });
      setFoodLog(items);
    });

    return () => {
      unsubUser();
      unsubFood();
    };
  }, [user]);

  // Firestore helpers

  const addFoodEntry = async (entry) => {
    if (!user) return;
    const uid = user.uid;
    const foodColRef = collection(db, 'users', uid, 'foodLogs');

    // we ignore entry.id, Firestore will create it
    const { id, ...data } = entry;
    await addDoc(foodColRef, data);
  };

  const removeFoodEntry = async (id) => {
    if (!user) return;
    const uid = user.uid;
    const docRef = doc(db, 'users', uid, 'foodLogs', id);
    await deleteDoc(docRef);
  };

  const updateFoodEntry = async (updated) => {
    if (!user) return;
    const uid = user.uid;
    const { id, ...rest } = updated;
    const docRef = doc(db, 'users', uid, 'foodLogs', id);
    await updateDoc(docRef, rest);
  };

  const updateGoals = async (newGoals) => {
    setGoals(newGoals);
    if (!user) return;
    const uid = user.uid;
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      {
        goals: newGoals,
      },
      { merge: true }
    );
  };

  const saveProfilePhoto = async (uri) => {
    setProfilePhoto(uri);
    if (!user) return;
    const uid = user.uid;
    const userDocRef = doc(db, 'users', uid);
    await setDoc(
      userDocRef,
      {
        profilePhoto: uri,
      },
      { merge: true }
    );
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    setUser,
    initializing,
    goals,
    foodLog,
    addFoodEntry,
    removeFoodEntry,
    updateFoodEntry,
    updateGoals,
    logout,
    todayISO,
    profilePhoto,
    setProfilePhoto: saveProfilePhoto, // use Firestore-saving version
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
