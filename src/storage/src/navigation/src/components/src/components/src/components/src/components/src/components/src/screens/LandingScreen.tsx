import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedBoxGrid from '../components/AnimatedBoxGrid';
import { colors } from '../utils/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  const [time, setTime] = useState<string>('');
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      const d = new Date();
      const str = `${d.toLocaleTimeString()} .${d.getMilliseconds().toString().padStart(3, '0')}`;
      setTime(str);
    }, 25);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const boxes = [
    { id: 'week', label: 'Go to week', onPress: () => navigation.navigate('Week') },
    { id: 'reports', label: 'Reports', onPress: () => navigation.navigate('Reports') },
    { id: 'settings', label: 'Settings', onPress: () => navigation.navigate('Settings') }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Life Tracker</Text>
      <Text style={styles.clock}>{time}</Text>
      <View style={{ marginTop: 24 }}>
        <AnimatedBoxGrid boxes={boxes} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { color: colors.white, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  clock: { color: colors.blue, marginTop: 8, fontWeight: '700' }
});
