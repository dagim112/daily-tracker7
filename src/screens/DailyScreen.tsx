import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { colors } from '../utils/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { DaySchedule, Task } from '../models';
import { loadDay, saveDay } from '../storage';
import { defaultDay, computeDayProgress, computeRemaining } from '../utils/schedule';
import TaskItem from '../components/TaskItem';
import ProgressPie from '../components/ProgressPie';
import AlarmSwitch from '../components/AlarmSwitch';
import MoneyTracker from '../components/MoneyTracker';

type Props = NativeStackScreenProps<RootStackParamList, 'Daily'>;

export default function DailyScreen({ route }: Props) {
  const { dateISO } = route.params;
  const [day, setDay] = useState<DaySchedule | null>(null);

  useEffect(() => {
    (async () => {
      const loaded = await loadDay(dateISO);
      const d = loaded || defaultDay(dateISO);
      setDay(d);
      if (!loaded) await saveDay(d);
    })();
  }, [dateISO]);

  if (!day) return null;

  const { percent, morningPercent } = computeDayProgress(day);
  const remaining = computeRemaining(day);

  const updateTask = (t: Task, updater: Partial<Task>) => {
    const tasks = day.tasks.map(x => x.id === t.id ? { ...x, ...updater } : x);
    const next = { ...day, tasks };
    setDay(next); saveDay(next);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Today — {dateISO}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alarms</Text>
        <AlarmSwitch
          label="6:00 Alarm"
          enabled={day.alarms?.sixAM ?? true}
          onChange={(v) => { const next = { ...day, alarms: { ...day.alarms, sixAM: v } }; setDay(next); saveDay(next); }}
          time={{ hour: 6, minute: 0 }}
          sound="alarm6am.wav"
        />
        <AlarmSwitch
          label="22:00 Alarm"
          enabled={day.alarms?.tenPM ?? true}
          onChange={(v) => { const next = { ...day, alarms: { ...day.alarms, tenPM: v } }; setDay(next); saveDay(next); }}
          time={{ hour: 22, minute: 0 }}
          sound="alarm10pm.wav"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Morning routine (6:00–8:00)</Text>
        <ProgressPie percent={morningPercent} title="Morning progress" />
        <View style={{ marginTop: 12, gap: 8 }}>
          {day.tasks.filter(t => t.category === 'morning').map(t => (
            <TaskItem
              key={t.id}
              task={t}
              onToggle={(checked) => updateTask(t, { checked })}
              onRename={(name) => updateTask(t, { name })}
              onTimeChange={(start, end) => updateTask(t, { start, end })}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        {day.tasks.filter(t => t.category && t.category !== 'morning').map(t => (
          <TaskItem
            key={t.id}
            task={t}
            onToggle={(checked) => updateTask(t, { checked })}
            onRename={(name) => updateTask(t, { name })}
            onTimeChange={(start, end) => updateTask(t, { start, end })}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily progress</Text>
        <ProgressPie percent={percent} title="Total" />
        <Text style={styles.meta}>Remaining activities: {remaining.remaining}/{remaining.total} ({remaining.percentRemaining}%)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          value={day.notes || ''}
          onChangeText={(v) => { const next = { ...day, notes: v }; setDay(next); saveDay(next); }}
          placeholder="Write your note..."
          placeholderTextColor={colors.gray}
          style={styles.notes}
          multiline
        />
      </View>

      <View style={styles.section}>
        <MoneyTracker
          onAdd={(e) => {
            const next = { ...day, expenses: [...(day.expenses||[]), { id: `${Date.now()}`, ...e }] };
            setDay(next); saveDay(next);
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black, paddingHorizontal: 16, paddingTop: 48 },
  title: { color: colors.white, fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  section: { backgroundColor: colors.card, borderColor: colors.blue, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16 },
  sectionTitle: { color: colors.white, fontWeight: '700', marginBottom: 8 },
  meta: { color: colors.gray, marginTop: 8 },
  notes: { color: colors.white, minHeight: 80 }
});
