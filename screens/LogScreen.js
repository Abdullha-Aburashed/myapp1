// screens/LogScreen.js
import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db, auth } from "../config";
import { MyContext } from "../MyContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogScreen({ route }) {

  // SAFE receiving of params
  const food = route?.params?.food;

  const { logs, setLogs } = useContext(MyContext);
  const [servings, setServings] = useState(1);

  // If food is missing → show message instead of crashing
  if (!food) {
    return (
      <SafeAreaView  style={styles.container}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>No food selected</Text>
        <Text style={{ marginTop: 10 }}>
          Go to the Search tab, search for a food, and press "Log This Food".
        </Text>
      </SafeAreaView >
    );
  }

  function saveFood() {
    const totalCalories = food.calories * Number(servings);

    addDoc(collection(db, "logs"), {
      userId: auth.currentUser?.uid || "unknown",
      name: food.name,
      servings: Number(servings),
      calories: totalCalories,
      createdAt: serverTimestamp()
    });

    setLogs([...logs, { name: food.name, calories: totalCalories }]);

    Alert.alert("Saved", "Food logged successfully!");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Food</Text>

      {/* SAFE DISPLAY OF FOOD INFO */}
      <Text>Name: {food?.name}</Text>
      <Text>Calories per serving: {food?.calories}</Text>

      <TextInput
        keyboardType="numeric"
        placeholder="Servings"
        style={styles.input}
        onChangeText={(v) => setServings(Number(v))}
      />

      <Button title="Save" onPress={saveFood} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  input: { borderWidth: 1, padding: 8, marginVertical: 10 }
});
