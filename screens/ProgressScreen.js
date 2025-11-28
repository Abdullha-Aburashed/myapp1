// screens/ProgressScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { MyContext } from '../MyContext';

const ProgressScreen = () => {
  const { foodLog, weightHistory, updateWeight } = useContext(MyContext);

  // -----------------------------
  // REMOVE DAILY STREAK ✔
  // -----------------------------

  // -----------------------------
  // 1️⃣ WEIGHT LOST / GAINED
  // -----------------------------
  let weightLost = 0;
  let startWeight = null;
  let currentWeight = null;

  if (weightHistory.length > 0) {
    const sorted = [...weightHistory].sort((a, b) => a.date.localeCompare(b.date));
    startWeight = sorted[0].weight;
    currentWeight = sorted[sorted.length - 1].weight;
    weightLost = startWeight - currentWeight;
  }

  // -----------------------------
  // 2️⃣ WEEKLY INTAKE
  // -----------------------------
  const now = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 7);

  const weekly = { kcal: 0, protein: 0, carbs: 0, fats: 0 };

  foodLog.forEach(entry => {
    const d = new Date(entry.date);
    if (d >= weekAgo) {
      weekly.kcal += entry.kcal;
      weekly.protein += entry.protein;
      weekly.carbs += entry.carbs;
      weekly.fats += entry.fats;
    }
  });

  // -----------------------------
  // 3️⃣ DAILY WEIGH-IN
  // -----------------------------
  const lastRecordedWeight =
    weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : '';

  const [todayWeight, setTodayWeight] = useState(String(lastRecordedWeight));

  const saveWeight = async () => {
    if (!todayWeight.trim()) return Alert.alert("Enter a valid weight");

    await updateWeight(todayWeight);
    Alert.alert("Saved!", "Your weight has been recorded.");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          <Text style={styles.header}>Progress</Text>

          {/* WEIGHT CHANGE */}
          <View style={styles.card}>
            <Text style={styles.label}>Weight Change</Text>
            <Text style={styles.value}>
              {weightHistory.length === 0
                ? "No data yet"
                : `${weightLost.toFixed(1)} kg ${weightLost >= 0 ? "lost" : "gained"}`}
            </Text>
          </View>

          {/* DAILY WEIGH-IN */}
          <Text style={[styles.header, { marginTop: 20 }]}>Record Today's Weight</Text>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Enter weight in KG"
              keyboardType="numeric"
              value={todayWeight}
              onChangeText={setTodayWeight}
            />

            <TouchableOpacity style={styles.btn} onPress={saveWeight}>
              <Text style={styles.btnText}>Save Weight</Text>
            </TouchableOpacity>
          </View>

          {/* WEIGHT HISTORY */}
          <Text style={[styles.header, { marginTop: 20 }]}>Weight History</Text>

          <View style={styles.card}>
            {weightHistory.length === 0 ? (
              <Text style={styles.line}>No weight logs yet.</Text>
            ) : (
              weightHistory
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((item, i) => (
                  <Text key={i} style={styles.line}>
                    {item.date} — {item.weight} kg
                  </Text>
                ))
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  label: { fontSize: 14, color: "#6b7280" },
  value: { fontSize: 22, fontWeight: "700", marginTop: 6 },
  line: { fontSize: 16, marginVertical: 4 },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#22d3b6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "700" },
});

export default ProgressScreen;
