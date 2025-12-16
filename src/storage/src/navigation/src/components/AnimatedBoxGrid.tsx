import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet, Text } from 'react-native';
import { colors } from '../utils/colors';

type Box = { id: string; label: string; onPress: () => void };

export default function AnimatedBoxGrid({ boxes }: { boxes: Box[] }) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <View style={styles.grid}>
        {boxes.map(b => (
          <TouchableOpacity key={b.id} style={styles.box} onPress={b.onPress} activeOpacity={0.8}>
            <Text style={styles.label}>{b.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  box: {
    backgroundColor: colors.card,
    borderColor: colors.blue,
    borderWidth: 1,
    padding: 18,
    minWidth: 120,
    minHeight: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: { color: colors.white, fontSize: 16, fontWeight: '600' }
});
