import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Animated,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../styles/theme';

export default function BoxSelect(): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [lastTouchedBox, setLastTouchedBox] = useState<number | null>(null);
  const videoRef = useRef<Video | null>(null);
  const boxes = [
    'Music', 'Photo', 'Art', 'Writings',
    'Credits', 'Design', 'New Section 1', 'New Section 2'
  ];
  const fadeAnims = boxes.map(() => useRef(new Animated.Value(0)).current);
  const [visibleBoxes, setVisibleBoxes] = useState(new Set<number>());

  useEffect(() => {
    // Show boxes sequentially with a delay
    boxes.forEach((_, index) => {
      setTimeout(() => {
        setVisibleBoxes(prev => {
          const newSet = new Set(prev);
          newSet.add(index);
          return newSet;
        });
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }).start();
      }, index * 200); // 200ms delay between each box
    });
  }, []);

  const handlePress = (text: string) => {
    if (text === 'Art') {
      navigation.navigate('ArtRoom');
    } else if (text === 'Writings') {
      navigation.navigate('Writings');
    } else if (text === 'Credits') {
      navigation.navigate('Credits');
    } else if (text === 'Photo') {
      navigation.navigate('PhotoRoom');
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../../assets/videos/bgPremier-mobile.mp4')}
        style={styles.backgroundVideo}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        rate={1.0}
        useNativeControls={false}
        posterSource={require('../../assets/videos/bgPremier-mobile.mp4')}
      />
      <View style={styles.boxesGrid}>
        {boxes.map((text, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.boxSector,
              lastTouchedBox === index && styles.touchActive
            ]}
            onPress={() => handlePress(text)}
            activeOpacity={0.7}
          >
            <Animated.Text style={[
              styles.boxText,
              { opacity: fadeAnims[index] }
            ]}>
              {text}
            </Animated.Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.goldishDarkBrown,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0.8,
  },
  boxesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
    alignContent: 'space-between',
    height: height,
  },
  boxSector: {
    width: '45%',
    height: height / 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '2.5%',
  },
  touchActive: {
    transform: [{scale: 1.1}],
  },
  boxText: {
    fontFamily: 'Vidaloka-Regular',
    fontSize: 24,
    color: theme.colors.secondary,
    letterSpacing: 3,
    backgroundColor: theme.colors.shadowly,
    padding: 5,
    borderRadius: 6,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  boxTextHidden: {
    opacity: 0,
  },
  boxTextActive: {
    opacity: 1,
    letterSpacing: 4,
  },
});