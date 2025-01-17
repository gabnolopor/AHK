import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../styles/theme';

export default function BoxSelect(): JSX.Element {
  const navigation = useNavigation();
  const [lastTouchedBox, setLastTouchedBox] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<Video | null>(null);

  const boxes = [
    'Music', 'Photo', 'Art', 'Writings',
    'Credits', 'Design', 'New Section 1', 'New Section 2'
  ];

  const handlePress = (text: string) => {
    if (text.toLowerCase() === 'writings') {
      navigation.navigate('Writings' as never);
    }
  };

  const handleTouch = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLastTouchedBox(index);
    timeoutRef.current = setTimeout(() => {
      setLastTouchedBox(null);
    }, 2500);
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
            onPressIn={() => handleTouch(index)}
            activeOpacity={1}
          >
            <Text style={[
              styles.boxText,
              lastTouchedBox === index ? styles.boxTextActive : styles.boxTextHidden
            ]}>
              {text}
            </Text>
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
    fontFamily: 'Monserrat',
    fontSize: 24,
    color: 'white',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
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