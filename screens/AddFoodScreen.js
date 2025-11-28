// screens/AddFoodScreen.js
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { MyContext } from '../MyContext';
import PrimaryButton from '../components/PrimaryButton';

const primary = '#22d3b6';

const AddFoodScreen = () => {
  const { addFoodEntry, todayISO } = useContext(MyContext);

  // Live food data from API
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal + Inputs
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [gramsPerUnit, setGramsPerUnit] = useState('0');

  // FETCH FOODS FROM REALTIME DATABASE API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(
          'https://app1-7c511-default-rtdb.asia-southeast1.firebasedatabase.app/foods.json'
        );
        const data = await res.json();

        // Convert Firebase object → array
        const arr = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setFoods(arr);
      } catch (err) {
        console.log('Error fetching foods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // FILTER LIST
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return foods;
    return foods.filter((f) => f.name.toLowerCase().includes(q));
  }, [query, foods]);

  // Open modal
  const openModal = (food) => {
    setSelectedFood(food);
    setQuantity('1');
    setGramsPerUnit(String(food.servingGrams));
  };

  // Close modal
  const closeModal = () => setSelectedFood(null);

  // CALCULATE MACROS FOR CHOSEN QUANTITY
  const calcTotals = () => {
    if (!selectedFood) return { kcal: 0, protein: 0, carbs: 0, fats: 0, gramsTotal: 0 };

    const q = Number(quantity) || 0;
    const gPer = Number(gramsPerUnit) || 0;
    const gramsTotal = q * gPer;

    if (gramsTotal <= 0) return { kcal: 0, protein: 0, carbs: 0, fats: 0, gramsTotal: 0 };

    const ratio = gramsTotal / selectedFood.servingGrams;

    return {
      gramsTotal,
      kcal: selectedFood.kcal * ratio,
      protein: selectedFood.protein * ratio,
      carbs: selectedFood.carbs * ratio,
      fats: selectedFood.fat * ratio,
    };
  };

  const totals = calcTotals();

  

  const addToLog = () => {
    if (!selectedFood) return;

    const q = Number(quantity) || 0;
    const gPer = Number(gramsPerUnit) || 0;
    if (q <= 0 || gPer <= 0) return;

    const entry = {
      id: Date.now().toString(),
      foodId: selectedFood.id,
      name: selectedFood.name,
      quantity: q,
      gramsPerUnit: gPer,
      gramsTotal: totals.gramsTotal,
      servingGrams: selectedFood.servingGrams,

      perKcal: selectedFood.kcal,
      perProtein: selectedFood.protein,
      perCarbs: selectedFood.carbs,
      perFat: selectedFood.fat,

      kcal: totals.kcal,
      protein: totals.protein,
      carbs: totals.carbs,
      fats: totals.fats,

      date: todayISO(),
    };

    addFoodEntry(entry);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Food</Text>

      {/* Search box */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search food..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Loader */}
      {loading && (
        <ActivityIndicator size="large" color={primary} style={{ marginTop: 40 }} />
      )}

      {/* Food list */}
      {!loading && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultCard} onPress={() => openModal(item)}>
              <View>
                <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                  {item.description} – {item.kcal} kcal
                </Text>
              </View>
              <Text style={{ fontSize: 22, color: primary, fontWeight: '700' }}>+</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal */}
      <Modal visible={!!selectedFood} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.modalCard}>
              {selectedFood && (
                <>
                  <Text style={styles.modalTitle}>{selectedFood.name}</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedFood.kcal} kcal per {selectedFood.servingGrams} g
                  </Text>

                  {/* Quantity + Grams */}
                  <View style={styles.row}>
                    <View style={styles.field}>
                      <Text style={styles.label}>QUANTITY</Text>
                      <View style={styles.inputBox}>
                        <TextInput
                          keyboardType="numeric"
                          value={quantity}
                          onChangeText={setQuantity}
                          style={styles.input}
                        />
                      </View>
                    </View>
                    <View style={[styles.field, { marginLeft: 12 }]}>
                      <Text style={styles.label}>WEIGHT / PIECE (g)</Text>
                      <View style={styles.inputBox}>
                        <TextInput
                          keyboardType="numeric"
                          value={gramsPerUnit}
                          onChangeText={setGramsPerUnit}
                          style={styles.input}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Macros preview */}
                  <View style={styles.macrosRow}>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>{Math.round(totals.kcal)}</Text>
                      <Text style={styles.macroLabel}>kcal</Text>
                    </View>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>{totals.protein.toFixed(1)}</Text>
                      <Text style={styles.macroLabel}>Protein</Text>
                    </View>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>{totals.carbs.toFixed(1)}</Text>
                      <Text style={styles.macroLabel}>Carbs</Text>
                    </View>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>{totals.fats.toFixed(1)}</Text>
                      <Text style={styles.macroLabel}>Fat</Text>
                    </View>
                  </View>

                  <PrimaryButton title="Add to Log" onPress={addToLog} />

                  <TouchableOpacity onPress={closeModal} style={{ marginTop: 12 }}>
                    <Text style={{ textAlign: 'center', color: '#9ca3af' }}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  searchRow: {
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: { fontSize: 14 },
  resultCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalSubtitle: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  row: { flexDirection: 'row', marginTop: 16 },
  field: { flex: 1 },
  label: { fontSize: 12, color: '#6b7280' },
  inputBox: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 8,
  },
  input: { fontSize: 16 },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  macroBox: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f0fdfa',
    borderRadius: 16,
    padding: 10,
  },
  macroValue: { fontSize: 16, fontWeight: '700', color: primary },
  macroLabel: { fontSize: 11, color: '#6b7280' },
});

export default AddFoodScreen;
