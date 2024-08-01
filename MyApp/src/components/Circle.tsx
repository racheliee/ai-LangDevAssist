// Circle.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CircleProps {
  text: string;
  size: number;
  color: string;
  top: number;
  left: number;
}

const Circle: React.FC<CircleProps> = ({ text, size, color, top, left }) => {
  return (
    <View style={[styles.circle, { width: size, height: size, backgroundColor: color, top, left }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    borderRadius: 50, // This ensures the View is a circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Circle;
