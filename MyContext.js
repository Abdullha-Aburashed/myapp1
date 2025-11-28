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

  const [foodLog, setFoodLog] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);

  // ⭐ NEW → Track if user finished SignupDetails
  const [completedProfile, setCompletedProfile] = useState(false);

  // 1) Listen for Firebase Auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  // 2) Listen to Firestore user doc + food logs
  useEffect(() => {
    if (!user) {
      setFoodLog([]);
      setProfilePhoto(null);
      setCompletedProfile(false);
      return;
    }

    const uid = user.uid;
    const userDocRef = doc(db, 'users', uid);

    // Make sure user doc exists
    setDoc(
      userDocRef,
      {
        email: user.email || '',
        displayName: user.displayName || '',
      },
      { merge: true }
    );

    // Listen to user document changes
    const unsubUser = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        if (data.goals) setGoals(data.goals);
        if (data.profilePhoto) setProfilePhoto(data.profilePhoto);
        if (data.weightHistory) setWeightHistory(data.weightHistory);
        // ⭐ NEW — Load the completedProfile flag
        if (data.completedProfile !== undefined) {
          setCompletedProfile(data.completedProfile);
        }
      }
    });

    // Listen to food logs
    const foodColRef = collection(db, 'users', uid, 'foodLogs');
    const unsubFood = onSnapshot(foodColRef, (querySnap) => {
      const items = [];
      querySnap.forEach((d) => items.push({ id: d.id, ...d.data() }));
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
    const ref = collection(db, 'users', user.uid, 'foodLogs');

    const { id, ...data } = entry;
    await addDoc(ref, data);
  };

  const removeFoodEntry = async (id) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'foodLogs', id);
    await deleteDoc(ref);
  };

  // NEW — update weight daily
const updateWeight = async (newWeight) => {
  if (!user) return;

  const uid = user.uid;
  const ref = doc(db, "users", uid);
  const today = todayISO();

  // Remove previous entry for today (if exists)
  const updated = weightHistory.filter(w => w.date !== today);

  // Add new weight record
  updated.push({
    date: today,
    weight: Number(newWeight)
  });

  // Save back to Firestore
  await setDoc(ref, { weightHistory: updated }, { merge: true });
};


  const updateFoodEntry = async (updated) => {
    if (!user) return;
    const { id, ...rest } = updated;
    const ref = doc(db, 'users', user.uid, 'foodLogs', id);
    await updateDoc(ref, rest);
  };

  const updateGoals = async (newGoals) => {
    setGoals(newGoals);
    if (!user) return;

    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, { goals: newGoals }, { merge: true });
  };

  const saveProfilePhoto = async (uri) => {
    setProfilePhoto(uri);
    if (!user) return;

    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, { profilePhoto: uri }, { merge: true });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <MyContext.Provider
      value={{
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
        setProfilePhoto: saveProfilePhoto,
        weightHistory,
        updateWeight,
        // ⭐ EXPOSE completedProfile to RootNavigator
        completedProfile,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
