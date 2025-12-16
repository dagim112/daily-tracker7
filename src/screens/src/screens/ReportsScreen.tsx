import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../utils/colors';
import { ReportScope, DaySchedule } from '../models';
import { loadWeek } from '../storage';
import { getWeek } from '../utils/date';
import ProgressPie from '../components/ProgressPie';
import { computeDayProgress, computeWeekProgress } from '../utils/schedule';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ReportsScreen() {
  const [scope, setScope] = useState<ReportScope>('weekly');
  const [days, setDays] = useState<DaySchedule[]>([]);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    (async () => {
      const week = getWeek();
      const isos = week.map(d => d.format('YYYY-MM-DD'));
      const loaded = await loadWeek(isos);
      const filtered = loaded.filter(Boolean) as DaySchedule[];
      setDays(filtered);
      setPercent(computeWeekProgress(filtered).average);
    })();
  }, []);

  async function exportPDF() {
    const perDay = days.map(d => ({ date: d.dateISO, p: computeDayProgress(d).percent }));
    const chartList = perDay.map(pd => `<li>${pd.date} — ${pd.p}%</li>`).join('');
    const html = `
      <html>
        <body style="font-family: Arial; background: #0B0B0D; color: white; padding: 16px;">
          <h1 style="text-align:center;">${scope.toUpperCase()} Report</h1>
          <h2>Average: ${percent}%</h2>
          <h3>Per day</h3>
          <ul>${chartList}</ul>
        </body>
      </html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, { dialogTitle: 'Share PDF report' });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={styles.title}>Reports</Text>
      <View style={styles.menu}>
        {(['daily','weekly','monthly'] as const).map(m => (
          <TouchableOpacity key={m} onPress={()=>setScope(m)} style={[styles.menuItem, scope===m && styles.menuActive]}>
            <Text style={{ color: colors.white, fontWeight: '700' }}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Average progress</Text>
        <ProgressPie percent={percent} />
      </View>
      <TouchableOpacity onPress={exportPDF} style={styles.btn}>
        <Text style={{ color: colors.white, fontWeight: '800' }}>Download PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black, paddingTop: 48 },
  title: { color: colors.white, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  menu: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  menuItem: { backgroundColor: colors.card, borderColor: colors.blue, borderWidth: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  menuActive: { borderColor: colors.green },
  card: { backgroundColor: colors.card, borderColor: colors.orange, borderWidth: 1, borderRadius: 12, padding: 12 },
  label: { color: colors.white, fontWeight: '700', marginBottom: 8 },
  btn: { backgroundColor: colors.blue, borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 12 }
});
