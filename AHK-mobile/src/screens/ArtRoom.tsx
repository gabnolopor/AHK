import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Image, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { theme } from '../styles/theme';

// Add your XAPP token here
const XAPP_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiJkZGY1MDU4NC05ZjMyLTRhMTUtODBlMy1kN2EwZGYyMTFkYjQiLCJleHAiOjE3Mzc5MjA2NDcsImlhdCI6MTczNzMxNTg0NywiYXVkIjoiZGRmNTA1ODQtOWYzMi00YTE1LTgwZTMtZDdhMGRmMjExZGI0IiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjY3OGQ1NjA3NWM0MGY5M2QzY2I0OWNlNCJ9.zUVvVjMM-JdLaoVQ-_IiZzWVdh8bOEHwZsxp38SZOBk'; // Replace with the actual token from the curl response

interface PexelsPhoto {
  src: {
    large: string;
  };
  photographer: string;
  alt: string;
}

function ArtRoom(): JSX.Element {
  const [currentPhoto, setCurrentPhoto] = useState<PexelsPhoto | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const swipeThreshold = 100;

  useEffect(() => {
    fetchRandomArtwork();
  }, []);

  const fetchRandomArtwork = async () => {
    try {
      const response = await fetch(
        'https://api.pexels.com/v1/search?query=abstract&per_page=80',
        {
          headers: {
            Authorization: 'gIi2NOmJ3NnxND476nkZiNqVpDVlafaCzcEQspKfu4VVqiB7nvibqy2q'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const photos = data.photos;
      
      if (photos.length > 0) {
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
        setCurrentPhoto(randomPhoto);
      }
    } catch (error) {
      console.error('Error fetching artwork:', error);
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX * 0.2;
      translateY.value = event.translationY * 0.2;
    },
    onEnd: (event) => {
      // Check if swipe distance exceeds threshold
      if (Math.abs(event.translationX) > swipeThreshold) {
        // If swiped far enough, fetch new artwork
        runOnJS(fetchRandomArtwork)();
      }
      
      // Return to center position with spring animation
      translateX.value = withSpring(0, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 850 },
        { rotateY: `${translateX.value / 10}deg` },
        { rotateX: `${-translateY.value / 10}deg` },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <ImageBackground 
      source={require('../../assets/images/museumphoto.jpg')} 
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ opacity: 0.8 }}
    >
      <GestureHandlerRootView style={styles.frameContainer}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.frameContainer, animatedStyle]}>
            <Animated.Image
              source={currentPhoto ? { uri: currentPhoto.src.large } : require('../../assets/images/default-book.jpg')}
              style={styles.image}
              resizeMode="cover"
            />
            <Image
              source={require('../../assets/images/frame.png')}
              style={styles.frame}
              resizeMode="stretch"
            />
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>

      <View style={styles.controlsContainer}>
        <Text style={styles.artworkName}>{currentPhoto?.alt || ''}</Text>
        <Text style={styles.artistName}>by {currentPhoto?.photographer || ''}</Text>
        <View style={styles.arrowContainer}>
          <TouchableOpacity 
            onPress={fetchRandomArtwork} 
          >
            <Image 
              source={require('../../assets/images/arrow.png')} 
              style={styles.arrow} 
              resizeMode="stretch"
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={fetchRandomArtwork} 
          >
            <Image 
              source={require('../../assets/images/arrow.png')} 
              style={styles.arrowBack} 
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameContainer: {
    width: width,
    height: height/2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    height: '80%',
    width: '80%',
    boxShadow: '25px 25px 25px rgba(0, 0, 0, 0.5)',
  },
  frame: {
    position: 'absolute',
    width: '110%',
    height: '110%',
    top: -20,
    left: -20,
  },
  controlsContainer: {
    backgroundColor: theme.colors.shadowly,
    padding: 20,
    borderRadius: 15,
    width: width * 0.9,
    height: height * 0.2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 0,
  },
  artworkName: {
    fontSize: 25,
    color: theme.colors.secondary,
    textAlign: 'center',
    fontFamily: 'Vidaloka-Regular',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 18,
    color: theme.colors.secondary,
    textAlign: 'center',
    fontFamily: 'Vidaloka-Regular',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  arrowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: -120,
    width: '105%',
  },
  
  arrow: {
    width: 150,
    height: 150,
    
  },
  arrowBack: {
    width: 150,
    height: 150,
    transform: [{ rotate: '180deg' }],
  },
});

export default ArtRoom;