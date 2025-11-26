// screens/AddFoodScreen.js
import React, { useContext, useMemo, useState } from 'react';
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
} from 'react-native';
import foods from '../data/foods.json';
import { MyContext } from '../MyContext';
import PrimaryButton from '../components/PrimaryButton';

const primary = '#22d3b6';

const AddFoodScreen = () => {
  const { addFoodEntry, todayISO } = useContext(MyContext);
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);

  const [quantity, setQuantity] = useState('1');
  const [gramsPerUnit, setGramsPerUnit] = useState('0');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return foods;
    return foods.filter((f) => f.name.toLowerCase().includes(q));
  }, [query]);

  const openModal = (food) => {
    setSelectedFood(food);
    setQuantity('1');
    setGramsPerUnit(String(food.servingGrams));
  };

  const closeModal = () => {
    setSelectedFood(null);
  };

  const calcTotals = () => {
    if (!selectedFood) {
      return { kcal: 0, protein: 0, carbs: 0, fats: 0, gramsTotal: 0 };
    }
    const q = Number(quantity) || 0;
    const gPer = Number(gramsPerUnit) || 0;

    const gramsTotal = q * gPer;
    if (gramsTotal <= 0 || selectedFood.servingGrams <= 0) {
      return { kcal: 0, protein: 0, carbs: 0, fats: 0, gramsTotal: 0 };
    }

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

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search food..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultCard}
            onPress={() => openModal(item)}
          >
            <View>
              <Text style={{ fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                {item.description} – {item.kcal} kcal
              </Text>
            </View>
            <Text style={{ color: primary, fontWeight: '700', fontSize: 18 }}>
              +
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* modal with KeyboardAvoidingView */}
      <Modal
        visible={!!selectedFood}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={40}
          >
            <View style={styles.modalCard}>
              {selectedFood && (
                <>
                  <Text style={styles.modalTitle}>{selectedFood.name}</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedFood.kcal} kcal per {selectedFood.servingGrams} g
                  </Text>

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

                  <View style={styles.macrosRow}>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>
                        {Math.round(totals.kcal) || 0}
                      </Text>
                      <Text style={styles.macroLabel}>kcal</Text>
                    </View>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>
                        {totals.protein.toFixed(1) || '0.0'}
                      </Text>
                      <Text style={styles.macroLabel}>Protein</Text>
                    </View>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>
                        {totals.carbs.toFixed(1) || '0.0'}
                      </Text>
                      <Text style={styles.macroLabel}>Carbs</Text>
                    </View>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroValue}>
                        {totals.fats.toFixed(1) || '0.0'}
                      </Text>
                      <Text style={styles.macroLabel}>Fat</Text>
                    </View>
                  </View>

                  <PrimaryButton title="Add to Log" onPress={addToLog} />

                  <TouchableOpacity
                    style={{ marginTop: 12, alignItems: 'center' }}
                    onPress={closeModal}
                  >
                    <Text style={{ color: '#9ca3af' }}>Cancel</Text>
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
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  searchRow: {
    backgroundColor: 'white',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
  },
  searchInput: { fontSize: 14 },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalSubtitle: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  row: {
    flexDirection: 'row',
    marginTop: 16,
  },
  field: { flex: 1 },
  label: { fontSize: 11, color: '#6b7280' },
  inputBox: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 8,
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
    borderRadius: 16,
    backgroundColor: '#f0fdfa',
    alignItems: 'center',
    paddingVertical: 10,
  },
  macroValue: { fontWeight: '700', fontSize: 16, color: primary },
  macroLabel: { fontSize: 11, color: '#6b7280' },
});

export default AddFoodScreen;
