import React from 'react';
import { View, Text, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import { colors } from '../utils/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false
  })
});

async function scheduleDaily(hour: number, minute: number, sound: 'alarm6am.wav' | 'alarm10pm.wav') {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title: 'Reminder', body: 'Scheduled alarm', sound },
    trigger: { hour, minute, repeats: true }
  });
}

type Props = {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  time: { hour: number; minute: number };
  sound: 'alarm6am.wav' | 'alarm10pm.wav';
};

export default function AlarmSwitch({ label, enabled, onChange, time, sound }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Text style={{ color: colors.white, fontWeight: '600' }}>{label}</Text>
      <Switch
        value={enabled}
        onValueChange={async (v) => {
          onChange(v);
          if (v) await scheduleDaily(time.hour, time.minute, sound);
          else await Notifications.cancelAllScheduledNotificationsAsync();
        }}
        trackColor={{ true: colors.green, false: colors.gray }}
        thumbColor={colors.white}
      />
    </View>
  );
}
