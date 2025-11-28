// screens/HomeScreen.js
import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
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

  const [actionEntry, setActionEntry] = useState(null); // NEW for showing Edit/Delete buttons

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
    Alert.alert('Remove Food', 'Remove this item?', [
      { text: 'Cancel' },
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

  const messages = [
    "You’re doing great, keep going!",
    "Small steps make big changes.",
    "Today is a great day to move closer to your goal!",
    "Stay consistent — future you will thank you!",
    "Your health is your best investment."
  ];

  const motivation = messages[Math.floor(Math.random() * messages.length)];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerCard}>
        <Text style={styles.appTitle}>NutriTrack</Text>

        <View style={styles.kcalCircle}>
          <Text style={styles.kcalNumber}>{Math.round(totals.kcal)}</Text>
          <Text style={styles.kcalLabel}>KCAL EATEN</Text>
        </View>
        <Text style={styles.goalText}>Goal: {goals.calories} kcal</Text>

        <Text style={styles.motivation}>{motivation}</Text>

        <MacroBar label="Protein" value={totals.protein} goal={goals.protein} color="#f97316" />
        <MacroBar label="Carbs" value={totals.carbs} goal={goals.carbs} color="#3b82f6" />
        <MacroBar label="Fats" value={totals.fat} goal={goals.fats} color="#eab308" />

        <PrimaryButton title="+ Add Food" style={{ marginTop: 16 }} onPress={() => navigation.navigate('AddFromHome')} />
      </View>

      {/* LIST */}
      <View style={{ marginTop: 24, flex: 1 }}>
        <Text style={styles.sectionTitle}>Today's Foods</Text>

        {todayEntries.length === 0 ? (
          <Text style={{ color: '#9ca3af', marginTop: 8 }}>No foods logged yet.</Text>
        ) : (
          <FlatList
            data={todayEntries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.foodCard}
                  onPress={() => setActionEntry(item)} // 👈 Tap shows menu
                >
                  <View>
                    <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                    <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                      {item.quantity} × {Math.round(item.gramsPerUnit)} g • {Math.round(item.gramsTotal)} g total
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: '700', color: primary }}>{Math.round(item.kcal)} kcal</Text>
                    <Text style={{ fontSize: 10, color: '#6b7280' }}>
                      P {item.protein.toFixed(1)} • C {item.carbs.toFixed(1)} • F {item.fats.toFixed(1)}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* INLINE ACTION BUTTONS */}
                {actionEntry?.id === item.id && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#22d3b6' }]}
                      onPress={() => {
                        openEdit(item);
                        setActionEntry(null);
                      }}
                    >
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#ef4444' }]}
                      onPress={() => {
                        confirmRemove(item.id);
                        setActionEntry(null);
                      }}
                    >
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        )}
      </View>

      {/* EDIT MODAL (same as yours — no changes) */}
      {editingEntry && (
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
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
                    <TextInput keyboardType="numeric" value={editQty} onChangeText={setEditQty} style={styles.input} />
                  </View>
                </View>

                <View style={[styles.editField, { marginLeft: 12 }]}>
                  <Text style={styles.label}>WEIGHT / PIECE (g)</Text>
                  <View style={styles.inputBox}>
                    <TextInput keyboardType="numeric" value={editGramsPer} onChangeText={setEditGramsPer} style={styles.input} />
                  </View>
                </View>
              </View>

              <PrimaryButton title="Update Log" onPress={saveEdit} />
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  headerCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
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
  motivation: { textAlign: 'center', fontSize: 15, color: '#374151', marginBottom: 10 },

  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroLabel: { fontSize: 12, color: '#6b7280' },
  macroTrack: { height: 6, borderRadius: 999, backgroundColor: '#e5e7eb', marginTop: 4 },
  macroFill: { height: 6, borderRadius: 999 },

  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },

  foodCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    gap: 10,
  },

  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  actionText: { color: 'white', fontWeight: '600' },

  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalSubtitle: { fontSize: 12, color: '#6b7280' },

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
});

export default HomeScreen;
