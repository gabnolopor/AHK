import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';

export default function LandPage(): JSX.Element {
  return (
    <View style={styles.container}>
      <Header />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});