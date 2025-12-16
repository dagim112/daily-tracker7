import React from 'react';
import { View, Text } from 'react-native';
import { VictoryPie } from 'victory-native';
import { colors } from '../utils/colors';

export default function ProgressPie({ percent, title }: { percent: number; title?: string }) {
  const data = [
    { x: 'Done', y: percent },
    { x: 'Remaining', y: Math.max(0, 100 - percent) }
  ];
  const colorScale = [colors.green, colors.orange];
  return (
    <View style={{ alignItems: 'center' }}>
      {title ? <Text style={{ color: colors.white, marginBottom: 6 }}>{title}</Text> : null}
      <VictoryPie
        data={data}
        colorScale={colorScale}
        innerRadius={60}
        padAngle={2}
        labels={() => ''}
        height={220}
        width={220}
        style={{ parent: { backgroundColor: 'transparent' } }}
      />
      <Text style={{ color: colors.white, fontSize: 18, fontWeight: '700' }}>{percent}%</Text>
    </View>
  );
}
