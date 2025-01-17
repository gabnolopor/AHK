import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../styles/theme';

type HeaderProps = {
  onPress?: () => void;
};

export default function Header({ onPress }: HeaderProps): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [displayedText, setDisplayedText] = useState('');
  const [currentColor, setCurrentColor] = useState(theme.colors.darkBlue);

  const words = [
    'Works',    // English
    'Obras',    // Spanish
    'Œuvres',   // French
    '作品',     // Chinese
    '작품',     // Korean
    'أعمال',    // Arabic
    'कार्य'     // Hindi
  ];

  const colors = [
    theme.colors.darkBlue,
    theme.colors.darkRed,
    theme.colors.darkWine,
    theme.colors.darkMaroon,
    theme.colors.fullWine,
    theme.colors.fullMaroon,
    theme.colors.fullOrange
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const changeWord = () => {
      const nextIndex = (index + 1) % words.length;
      const nextWord = words[nextIndex];
      let currentText = '';
      let charIndex = 0;

      setCurrentColor(colors[Math.floor(Math.random() * colors.length)]);

      const letterInterval = setInterval(() => {
        currentText += nextWord[charIndex];
        setDisplayedText(currentText);
        charIndex++;

        if (charIndex === nextWord.length) {
          clearInterval(letterInterval);
          setTimeout(() => {
            setIndex(nextIndex);
          }, 1000);
        }
      }, 100);
    };

    changeWord();
  }, [index]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('BoxSelect')}
        style={styles.titleContainer}
      >
        <Text style={[styles.title, { color: currentColor }]}>
          {displayedText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Monserrat', // Note: You'll need to set up custom fonts
    letterSpacing: 5,
    textTransform: 'uppercase',
  },
}); 