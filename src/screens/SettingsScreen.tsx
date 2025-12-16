import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.text}>Rename activities and adjust times directly on Daily screen (Edit button).</Text>
      <Text style={styles.text}>Storage is local to your phone.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black, padding: 16, paddingTop: 48 },
  title: { color: colors.white, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  text: { color: colors.white, marginBottom: 8 }
});
