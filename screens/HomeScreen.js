// screens/HomeScreen.js
import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { MyContext } from '../MyContext';
import PrimaryButton from '../components/PrimaryButton';
import { Icon } from '@rneui/themed';

const primary = '#22d3b6';

const MacroBar = ({ label, value, goal, color }) => {
  const ratio = goal > 0 ? Math.min(value / goal, 1) : 0;
  return (
    <View style={{ marginBottom: 8 }}>
      <View style={styles.macroRow}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroLabel}>
          {Math.round(value)}/{goal}
        </Text>
      </View>
      <View style={styles.macroTrack}>
        <View
          style={[
            styles.macroFill,
            { width: `${ratio * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const {
    goals,
    foodLog,
    removeFoodEntry,
    updateFoodEntry,
    todayISO,
  } = useContext(MyContext);

  const [editingEntry, setEditingEntry] = useState(null);
  const [editQty, setEditQty] = useState('1');
  const [editGramsPer, setEditGramsPer] = useState('0');

  const today = todayISO();

  const todayEntries = useMemo(
    () => foodLog.filter((e) => e.date === today),
    [foodLog, today]
  );

  const totals = todayEntries.reduce(
    (acc, e) => {
      acc.kcal += e.kcal;
      acc.protein += e.protein;
      acc.carbs += e.carbs;
      acc.fat += e.fats;
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const confirmRemove = (id) => {
    Alert.alert('Remove item', 'Remove this food from today?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFoodEntry(id) },
    ]);
  };

  const openEdit = (entry) => {
    setEditingEntry(entry);
    setEditQty(String(entry.quantity || 1));
    setEditGramsPer(String(entry.gramsPerUnit || entry.servingGrams || 0));
  };

  const closeEdit = () => {
    setEditingEntry(null);
  };

  const calcEditTotals = () => {
    if (!editingEntry) {
      return { kcal: 0, protein: 0, carbs: 0, fats: 0, gramsTotal: 0 };
    }
    const q = Number(editQty) || 0;
    const gPer = Number(editGramsPer) || 0;
    const gramsTotal = q * gPer;
    if (gramsTotal <= 0 || editingEntry.servingGrams <= 0) {
      return { kcal: 0, protein: 0, carbs: 0, fats: 0, gramsTotal: 0 };
    }
    const ratio = gramsTotal / editingEntry.servingGrams;

    return {
      gramsTotal,
      kcal: editingEntry.perKcal * ratio,
      protein: editingEntry.perProtein * ratio,
      carbs: editingEntry.perCarbs * ratio,
      fats: editingEntry.perFat * ratio,
    };
  };

  const editTotals = calcEditTotals();

  const saveEdit = () => {
    if (!editingEntry) return;
    const q = Number(editQty) || 0;
    const gPer = Number(editGramsPer) || 0;
    if (q <= 0 || gPer <= 0) return;

    const updated = {
      ...editingEntry,
      quantity: q,
      gramsPerUnit: gPer,
      gramsTotal: editTotals.gramsTotal,
      kcal: editTotals.kcal,
      protein: editTotals.protein,
      carbs: editTotals.carbs,
      fats: editTotals.fats,
    };
    updateFoodEntry(updated);
    closeEdit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.appTitle}>NutriTrack</Text>

        <View style={styles.kcalCircle}>
          <Text style={styles.kcalNumber}>{Math.round(totals.kcal)}</Text>
          <Text style={styles.kcalLabel}>KCAL EATEN</Text>
        </View>
        <Text style={styles.goalText}>Goal: {goals.calories} kcal</Text>

        <MacroBar
          label="Protein"
          value={totals.protein}
          goal={goals.protein}
          color="#f97316"
        />
        <MacroBar
          label="Carbs"
          value={totals.carbs}
          goal={goals.carbs}
          color="#3b82f6"
        />
        <MacroBar
          label="Fats"
          value={totals.fat}
          goal={goals.fats}
          color="#eab308"
        />

        <PrimaryButton
          title="+ Add Food"
          style={{ marginTop: 16 }}
          onPress={() => navigation.navigate('AddFromHome')}
        />
      </View>

      <View style={{ marginTop: 24, flex: 1 }}>
        <Text style={styles.sectionTitle}>Today's Foods</Text>
        {todayEntries.length === 0 ? (
          <Text style={{ color: '#9ca3af', marginTop: 8 }}>
            No foods logged yet.
          </Text>
        ) : (
          <FlatList
            data={todayEntries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.foodCard}
                onPress={() => openEdit(item)}           // tap to edit
                onLongPress={() => confirmRemove(item.id)} // long-press delete
              >
                <View>
                  <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                  <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                    {item.quantity} × {Math.round(item.gramsPerUnit)} g  •{' '}
                    {Math.round(item.gramsTotal)} g total
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: '700', color: primary }}>
                    {Math.round(item.kcal)} kcal
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6b7280' }}>
                    P {item.protein.toFixed(1)} • C {item.carbs.toFixed(1)} • F{' '}
                    {item.fats.toFixed(1)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* edit modal */}
      <Modal
        visible={!!editingEntry}
        animationType="slide"
        transparent
        onRequestClose={closeEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {editingEntry && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View>
                    <Text style={styles.modalTitle}>{editingEntry.name}</Text>
                    <Text style={styles.modalSubtitle}>
                      {editingEntry.perKcal} kcal per {editingEntry.servingGrams} g
                    </Text>
                  </View>
                  <TouchableOpacity onPress={closeEdit}>
                    <Icon name="close" type="ionicon" />
                  </TouchableOpacity>
                </View>

                <View style={styles.editRow}>
                  <View style={styles.editField}>
                    <Text style={styles.label}>QUANTITY</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        keyboardType="numeric"
                        value={editQty}
                        onChangeText={setEditQty}
                        style={styles.input}
                      />
                    </View>
                  </View>
                  <View style={[styles.editField, { marginLeft: 12 }]}>
                    <Text style={styles.label}>WEIGHT / PIECE (g)</Text>
                    <View style={styles.inputBox}>
                      <TextInput
                        keyboardType="numeric"
                        value={editGramsPer}
                        onChangeText={setEditGramsPer}
                        style={styles.input}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.macrosRow}>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroValue}>
                      {Math.round(editTotals.kcal) || 0}
                    </Text>
                    <Text style={styles.macroLabel}>kcal</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroValue}>
                      {editTotals.protein.toFixed(1) || '0.0'}
                    </Text>
                    <Text style={styles.macroLabel}>Protein</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroValue}>
                      {editTotals.carbs.toFixed(1) || '0.0'}
                    </Text>
                    <Text style={styles.macroLabel}>Carbs</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroValue}>
                      {editTotals.fats.toFixed(1) || '0.0'}
                    </Text>
                    <Text style={styles.macroLabel}>Fat</Text>
                  </View>
                </View>

                <PrimaryButton title="Update Log" onPress={saveEdit} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: primary,
    marginBottom: 8,
  },
  kcalCircle: {
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 10,
    borderColor: '#ccfbf1',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  kcalNumber: { fontSize: 32, fontWeight: '700', color: '#111827' },
  kcalLabel: { fontSize: 12, color: '#9ca3af', letterSpacing: 1 },
  goalText: { textAlign: 'center', color: '#6b7280', marginBottom: 16 },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroLabel: { fontSize: 12, color: '#6b7280' },
  macroTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    marginTop: 4,
  },
  macroFill: { height: 6, borderRadius: 999 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  foodCard: {
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
  editRow: { flexDirection: 'row', marginTop: 16 },
  editField: { flex: 1 },
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

export default HomeScreen;
