import AsyncStorage from '@react-native-async-storage/async-storage';
import { DaySchedule } from '../models';

const KEY_PREFIX = 'dailytracker:';

export async function saveDay(day: DaySchedule) {
  await AsyncStorage.setItem(`${KEY_PREFIX}${day.dateISO}`, JSON.stringify(day));
}

export async function loadDay(dateISO: string): Promise<DaySchedule | null> {
  const raw = await AsyncStorage.getItem(`${KEY_PREFIX}${dateISO}`);
  return raw ? JSON.parse(raw) : null;
}

export async function loadWeek(dateISOs: string[]) {
  const keys = dateISOs.map(d => `${KEY_PREFIX}${d}`);
  const res = await AsyncStorage.multiGet(keys);
  return res.map(([k,v]) => v ? JSON.parse(v) : null);
}
