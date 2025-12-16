import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Task } from '../models';
import { colors } from '../utils/colors';

type Props = {
  task: Task;
  onToggle: (checked: boolean) => void;
  onRename: (name: string) => void;
  onTimeChange: (start: string, end?: string) => void;
};

export default function TaskItem({ task, onToggle, onRename, onTimeChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [start, setStart] = useState(task.start);
  const [end, setEnd] = useState(task.end || '');

  return (
    <View style={styles.row}>
      <Switch
        value={!!task.checked}
        onValueChange={onToggle}
        trackColor={{ true: colors.green, false: colors.gray }}
        thumbColor={colors.white}
      />
      <View style={{ flex: 1 }}>
        {editing ? (
          <>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Task name"
              placeholderTextColor={colors.gray}
              style={styles.input}
            />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                value={start}
                onChangeText={setStart}
                placeholder="HH:MM"
                placeholderTextColor={colors.gray}
                style={[styles.input, { width: 80 }]}
              />
              <TextInput
                value={end}
                onChangeText={setEnd}
                placeholder="HH:MM"
                placeholderTextColor={colors.gray}
                style={[styles.input, { width: 80 }]}
              />
              <TouchableOpacity onPress={() => { onRename(name); onTimeChange(start, end || undefined); setEditing(false); }}>
                <Text style={styles.action}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.name}>{task.name}</Text>
            <Text style={styles.time}>{task.start}{task.end ? ` – ${task.end}` : ''}</Text>
          </>
        )}
      </View>
      <TouchableOpacity onPress={() => setEditing(!editing)}>
        <Text style={styles.action}>{editing ? 'Cancel' : 'Edit'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderColor: colors.blue,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12
  },
  name: { color: colors.white, fontSize: 16, fontWeight: '600' },
  time: { color: colors.gray, fontSize: 12, marginTop: 4 },
  action: { color: colors.orange, fontWeight: '700' },
  input: {
    color: colors.white,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    paddingVertical: 4
  }
});
