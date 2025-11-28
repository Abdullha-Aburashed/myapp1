import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { MyContext } from '../MyContext';
import PrimaryButton from '../components/PrimaryButton';

const GoalsScreen = ({ navigation }) => {
  const { goals, updateGoals } = useContext(MyContext);

  const [calories, setCalories] = useState(String(goals.calories));
  const [protein, setProtein]   = useState(String(goals.protein));
  const [carbs, setCarbs]       = useState(String(goals.carbs));
  const [fats, setFats]         = useState(String(goals.fats));

  const save = () => {
    updateGoals({
      calories: Number(calories) || goals.calories,
      protein: Number(protein) || goals.protein,
      carbs: Number(carbs) || goals.carbs,
      fats: Number(fats) || goals.fats,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Daily Targets</Text>
        <Text style={{ color: '#6b7280', fontSize: 13 }}>
          Adjust your daily nutritional goals. These targets update the progress
          bars on the home screen.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Daily Calorie Goal (kcal)</Text>
        <TextInput
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Protein (g)</Text>
        <TextInput
          keyboardType="numeric"
          value={protein}
          onChangeText={setProtein}
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Carbohydrates (g)</Text>
        <TextInput
          keyboardType="numeric"
          value={carbs}
          onChangeText={setCarbs}
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>Fats (g)</Text>
        <TextInput
          keyboardType="numeric"
          value={fats}
          onChangeText={setFats}
          style={styles.input}
        />
      </View>

      <PrimaryButton title="Save Goals" onPress={save} style={{ margin: 16 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f3f4f6' },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  label: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
  },
});

export default GoalsScreen;
