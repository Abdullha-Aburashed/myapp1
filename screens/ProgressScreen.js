import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MyContext } from '../MyContext';

const primary = '#22d3b6';

const getDateKey = (offsetFromToday) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetFromToday);
  return d.toISOString().slice(0, 10);
};

const ProgressScreen = () => {
  const { foodLog } = useContext(MyContext);

  const last7 = useMemo(() => {
    const days = [];
    for (let i = -6; i <= 0; i++) {
      const key = getDateKey(i);
      const kcal = foodLog
        .filter((e) => e.date === key)
        .reduce((sum, e) => sum + e.kcal, 0);
      days.push({ key, kcal });
    }
    return days;
  }, [foodLog]);

  const max = last7.reduce((m, d) => (d.kcal > m ? d.kcal : m), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      <Text style={styles.subtitle}>You're doing great! Keep it up.</Text>

      <View style={styles.card}>
        <Text style={{ fontWeight: '600', marginBottom: 8 }}>Weekly Intake</Text>
        <View style={styles.barRow}>
          {last7.map((d, index) => {
            const height = 30 + (d.kcal / max) * 80;
            const dayLabel = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index];
            return (
              <View key={d.key} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height,
                      backgroundColor:
                        index === 5 || index === 6 ? '#f97316' : primary,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{dayLabel}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* simple stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>DAY STREAK</Text>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>5</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>KG LOST</Text>
          <Text style={{ fontSize: 20, fontWeight: '700' }}>1.2</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  subtitle: { color: '#6b7280', marginBottom: 16 },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  barContainer: { alignItems: 'center', flex: 1 },
  bar: {
    width: 14,
    borderRadius: 999,
  },
  barLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 4,
  },
});

export default ProgressScreen;
