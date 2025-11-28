// screens/SignupDetails.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import PrimaryButton from '../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';

const SignupDetails = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');

  const [goalCalories, setGoalCalories] = useState('');
  const [goalProtein, setGoalProtein] = useState('');
  const [goalCarbs, setGoalCarbs] = useState('');
  const [goalFats, setGoalFats] = useState('');

  const onSave = async () => {
    const user = auth.currentUser;
    if (!user) return Alert.alert("Error", "User not found");

    try {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        age: Number(age),
        gender,
        weightHistory: [
          {
            date: new Date().toISOString().slice(0, 10),
            weight: Number(weight)
          }
        ],
        goals: {
          calories: Number(goalCalories),
          protein: Number(goalProtein),
          carbs: Number(goalCarbs),
          fats: Number(goalFats)
        },
        completedProfile: true,
        createdAt: new Date().toISOString()
      }, { merge: true });

    } catch (err) {
      Alert.alert("Error saving details", err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Personal Details</Text>

      <TextInput style={styles.inp} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
      <TextInput style={styles.inp} placeholder="Gender (Male/Female)" value={gender} onChangeText={setGender} />
      <TextInput style={styles.inp} placeholder="Weight (KG)" value={weight} onChangeText={setWeight} keyboardType="numeric" />

      <Text style={styles.subtitle}>Daily Nutrition Goals</Text>

      <TextInput style={styles.inp} placeholder="Calories" value={goalCalories} onChangeText={setGoalCalories} keyboardType="numeric" />
      <TextInput style={styles.inp} placeholder="Protein (g)" value={goalProtein} onChangeText={setGoalProtein} keyboardType="numeric" />
      <TextInput style={styles.inp} placeholder="Carbs (g)" value={goalCarbs} onChangeText={setGoalCarbs} keyboardType="numeric" />
      <TextInput style={styles.inp} placeholder="Fats (g)" value={goalFats} onChangeText={setGoalFats} keyboardType="numeric" />

      <PrimaryButton title="Finish" onPress={onSave} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  inp: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
});

export default SignupDetails;
