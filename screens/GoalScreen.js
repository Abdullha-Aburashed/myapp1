// screens/GoalScreen.js
import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db, auth } from "../config";
import { doc, setDoc } from "firebase/firestore";
import { MyContext } from "../MyContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalScreen() {
  const [goal, setGoal] = useState("");
  const { setUserGoal } = useContext(MyContext);

  async function saveGoal() {
    const user = auth.currentUser;
    if (!user) return;

    const goalNumber = Number(goal);
    if (!goalNumber) {
      Alert.alert("Error", "Please enter a valid number");
      return;
    }

    await setDoc(doc(db, "goals", user.uid), { goal: goalNumber });
    setUserGoal(goalNumber);
    Alert.alert("Saved", "Daily goal updated");
  }

  return (
    <SafeAreaView  style={styles.container}>
      <Text style={styles.title}>Set Daily Calorie Goal</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 2000"
        onChangeText={setGoal}
      />
      <Button title="Save Goal" onPress={saveGoal} />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 15 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15 }
});
