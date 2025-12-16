import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import dayjs from 'dayjs';
import { colors } from '../utils/colors';
import { defaultDay, computeDayProgress, computeWeekProgress } from '../utils/schedule';
import { loadWeek, saveDay } from '../storage';
import { getWeek } from '../utils/date';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { DaySchedule } from '../models';

type Props = NativeStackScreenProps<RootStackParamList, 'Week'>;

export default function WeekScreen({ navigation }: Props) {
  const [days, setDays] = useState<DaySchedule[]>([]);
  const [weekPercent, setWeekPercent] = useState(0);

  useEffect(() => {
    const week = getWeek();
    const isos = week.map(d => d.format('YYYY-MM-DD'));
    (async () => {
      const loaded = await loadWeek(isos);
      const filled = await Promise.all(isos.map(async (iso, idx) => {
        const d = loaded[idx];
        if (d) return d;
        const def = defaultDay(iso);
        await saveDay(def);
        return def;
      }));
      setDays(filled);
      setWeekPercent(computeWeekProgress(filled).average);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Week overview</Text>
      <Text style={styles.week}>Weekly percentage: {weekPercent}%</Text>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {days.map(d => {
          const dd = dayjs(d.dateISO);
          const prog = computeDayProgress(d).percent;
          return (
            <TouchableOpacity
              key={d.dateISO}
              style={styles.dayCard}
              onPress={() => navigation.navigate('Daily', { dateISO: d.dateISO })}
            >
              <Text style={styles.dayText}>{dd.format('dddd')}</Text>
              <Text style={styles.dateText}>{dd.format('DD MMM YYYY')}</Text>
              <Text style={styles.percent}>{prog}%</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black, paddingTop: 48 },
  title: { color: colors.white, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  week: { color: colors.green, textAlign: 'center', marginTop: 8, fontWeight: '700' },
  dayCard: { backgroundColor: colors.card, borderColor: colors.orange, borderWidth: 1, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayText: { color: colors.white, fontWeight: '700' },
  dateText: { color: colors.gray },
  percent: { color: colors.blue, fontWeight: '800' }
});
