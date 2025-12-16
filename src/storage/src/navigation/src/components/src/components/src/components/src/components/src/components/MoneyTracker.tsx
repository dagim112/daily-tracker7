import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

type Expense = { amount: number; reason: 'food'|'travel'|'entertainment'|'other'; note?: string };

export default function MoneyTracker({ onAdd }: { onAdd: (e: Expense) => void }) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState<Expense['reason']>('food');
  const [note, setNote] = useState('');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Expense tracker</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Amount"
        placeholderTextColor={colors.gray}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {(['food','travel','entertainment','other'] as const).map(r => (
          <TouchableOpacity key={r} onPress={()=>setReason(r)} style={[styles.tag, reason===r && styles.tagActive]}>
            <Text style={{ color: colors.white }}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Note"
        placeholderTextColor={colors.gray}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => {
          const amt = parseFloat(amount);
          if (!isNaN(amt)) onAdd({ amount: amt, reason, note });
          setAmount(''); setNote('');
        }}
        style={styles.btn}
      >
        <Text style={{ color: colors.white, fontWeight: '700' }}>Add expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderColor: colors.blue, borderWidth: 1, borderRadius: 12, padding: 12, gap: 8 },
  title: { color: colors.white, fontWeight: '700', fontSize: 16 },
  input: { color: colors.white, borderBottomColor: colors.gray, borderBottomWidth: 1, paddingVertical: 6 },
  tag: { backgroundColor: colors.black, borderColor: colors.orange, borderWidth: 1, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  tagActive: { backgroundColor: colors.orange },
  btn: { backgroundColor: colors.green, borderRadius: 10, padding: 10, alignItems: 'center', marginTop: 6 }
});
